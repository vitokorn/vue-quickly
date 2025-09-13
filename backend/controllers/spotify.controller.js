const db = require("../models");
const User = db.users;
const Playlist = db.playlists;
const axios = require('axios');

// Environment variables
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Spotify API base URL
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com/api/token';

// Helper function to get access token from cookies
const getAccessToken = (req) => {
    return req.cookies.access_token;
};

// Helper function to get username from cookies
const getUsername = (req) => {
    return req.cookies.username;
};

// Helper function to make authenticated Spotify API requests
const makeSpotifyRequest = async (req, endpoint, options = {}) => {
    const token = getAccessToken(req);
    if (!token) {
        throw new Error('No access token found');
    }

    const config = {
        url: `${SPOTIFY_API_BASE}${endpoint}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // Token expired, try to refresh
            const username = getUsername(req);
            if (username) {
                await refreshToken(username);
                // Retry the request with new token
                config.headers['Authorization'] = `Bearer ${getAccessToken(req)}`;
                return axios(config).then(res => res.data);
            }
        }
        throw error;
    }
};

// Helper function to refresh access token
const refreshToken = async (username) => {
    try {
        const user = await User.findOne({ where: { spotyid: username } });
        if (!user || !user.refresh_token) {
            throw new Error('User not found or no refresh token');
        }

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', user.refresh_token);
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);

        const response = await axios.post(SPOTIFY_ACCOUNTS_BASE, params);
        const { access_token } = response.data;

        // Update user with new access token
        await user.update({ access_token });

        return access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// ==================== AUTHENTICATION METHODS ====================

/**
 * Handle Spotify OAuth callback
 */
exports.handleCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code not provided' });
        }

        // Exchange code for tokens
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'authorization_code');
        tokenParams.append('code', code);
        tokenParams.append('redirect_uri', redirect_uri);
        tokenParams.append('client_id', client_id);
        tokenParams.append('client_secret', client_secret);

        const tokenResponse = await axios.post(SPOTIFY_ACCOUNTS_BASE, tokenParams);
        const { access_token, refresh_token } = tokenResponse.data;

        // Get user profile
        const userResponse = await axios.get(`${SPOTIFY_API_BASE}/me`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        const userData = userResponse.data;
        const { id: spotifyId, display_name, country } = userData;

        // Save or update user in database
        const [user, created] = await User.findOrCreate({
            where: { spotyid: spotifyId },
            defaults: {
                access_token,
                refresh_token,
                country,
                display_name
            }
        });

        if (!created) {
            // Update existing user
            await user.update({
                access_token,
                refresh_token,
                country,
                display_name
            });
        }

        // Set cookies
        res.cookie('username', spotifyId, {
            expires: new Date(Date.now() + 3600000 * 24 * 365) // 1 year
        });
        res.cookie('access_token', access_token, {
            sameSite: 'strict',
            expires: new Date(Date.now() + 3600000 * 24 * 7) // 1 week
        });
        res.cookie('country', country, {
            expires: new Date(Date.now() + 3600000 * 24 * 365)
        });
        res.cookie('nickname', display_name, {
            expires: new Date(Date.now() + 3600000 * 24 * 365)
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error in Spotify callback:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

/**
 * Refresh access token
 */
exports.refreshToken = async (req, res) => {
    try {
        const username = req.params.username;
        const newToken = await refreshToken(username);

        res.cookie('access_token', newToken, {
            sameSite: 'strict',
            expires: new Date(Date.now() + 3600000 * 24 * 7)
        });

        res.json({ status: 'success', access_token: newToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

// ==================== USER DATA METHODS ====================

/**
 * Get current user profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const userData = await makeSpotifyRequest(req, '/me');
        res.json(userData);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
};

/**
 * Get user's top tracks
 */
exports.getUserTopTracks = async (req, res) => {
    try {
        const { time_range = 'medium_term', limit = 20, offset = 0 } = req.query;
        const userData = await makeSpotifyRequest(req, `/me/top/tracks?time_range=${time_range}&limit=${limit}&offset=${offset}`);
        res.json(userData);
    } catch (error) {
        console.error('Error getting user top tracks:', error);
        res.status(500).json({ error: 'Failed to get user top tracks' });
    }
};

/**
 * Get user's top artists
 */
exports.getUserTopArtists = async (req, res) => {
    try {
        const { time_range = 'medium_term', limit = 20, offset = 0 } = req.query;
        const userData = await makeSpotifyRequest(req, `/me/top/artists?time_range=${time_range}&limit=${limit}&offset=${offset}`);
        res.json(userData);
    } catch (error) {
        console.error('Error getting user top artists:', error);
        res.status(500).json({ error: 'Failed to get user top artists' });
    }
};

/**
 * Get user's saved tracks
 */
exports.getUserSavedTracks = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeSpotifyRequest(req, `/me/tracks?limit=${limit}&offset=${offset}`);
        res.json(userData);
    } catch (error) {
        console.error('Error getting user saved tracks:', error);
        res.status(500).json({ error: 'Failed to get user saved tracks' });
    }
};

/**
 * Get user's saved albums
 */
exports.getUserSavedAlbums = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeSpotifyRequest(req, `/me/albums?limit=${limit}&offset=${offset}`);
        res.json(userData);
    } catch (error) {
        console.error('Error getting user saved albums:', error);
        res.status(500).json({ error: 'Failed to get user saved albums' });
    }
};

/**
 * Get user's followed artists
 */
exports.getUserFollowedArtists = async (req, res) => {
    try {
        const { type = 'artist', limit = 20, after } = req.query;
        let endpoint = `/me/following?type=${type}&limit=${limit}`;
        if (after) endpoint += `&after=${after}`;

        const userData = await makeSpotifyRequest(req, endpoint);
        res.json(userData);
    } catch (error) {
        console.error('Error getting user followed artists:', error);
        res.status(500).json({ error: 'Failed to get user followed artists' });
    }
};

// ==================== PLAYLIST METHODS ====================

/**
 * Get user's playlists
 */
exports.getUserPlaylists = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeSpotifyRequest(req, `/me/playlists?limit=${limit}&offset=${offset}`);
        res.json(userData);
    } catch (error) {
        console.error('Error getting user playlists:', error);
        res.status(500).json({ error: 'Failed to get user playlists' });
    }
};

/**
 * Get specific playlist
 */
exports.getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { fields } = req.query;
        let endpoint = `/playlists/${id}`;
        if (fields) endpoint += `?fields=${fields}`;

        const playlistData = await makeSpotifyRequest(req, endpoint);
        res.json(playlistData);
    } catch (error) {
        console.error('Error getting playlist:', error);
        res.status(500).json({ error: 'Failed to get playlist' });
    }
};

/**
 * Get playlist tracks
 */
exports.getPlaylistTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 100, offset = 0, fields } = req.query;
        let endpoint = `/playlists/${id}/tracks?limit=${limit}&offset=${offset}`;
        if (fields) endpoint += `&fields=${fields}`;

        const tracksData = await makeSpotifyRequest(req, endpoint);
        res.json(tracksData);
    } catch (error) {
        console.error('Error getting playlist tracks:', error);
        res.status(500).json({ error: 'Failed to get playlist tracks' });
    }
};

/**
 * Create new playlist
 */
exports.createPlaylist = async (req, res) => {
    try {
        const { name, description = '', public = true } = req.body;
        const userData = await makeSpotifyRequest(req, '/me');
        const userId = userData.id;

        const playlistData = await makeSpotifyRequest(req, `/users/${userId}/playlists`, {
            method: 'POST',
            data: {
                name,
                description,
                public
            }
        });

        res.json(playlistData);
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
};

/**
 * Add tracks to playlist
 */
exports.addTracksToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { uris, position } = req.body;

        if (!uris || !Array.isArray(uris)) {
            return res.status(400).json({ error: 'Track URIs array is required' });
        }

        const data = { uris };
        if (position !== undefined) data.position = position;

        const result = await makeSpotifyRequest(req, `/playlists/${id}/tracks`, {
            method: 'POST',
            data
        });

        res.json(result);
    } catch (error) {
        console.error('Error adding tracks to playlist:', error);
        res.status(500).json({ error: 'Failed to add tracks to playlist' });
    }
};

// ==================== ARTIST METHODS ====================

/**
 * Get artist information
 */
exports.getArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const artistData = await makeSpotifyRequest(req, `/artists/${id}`);
        res.json(artistData);
    } catch (error) {
        console.error('Error getting artist:', error);
        res.status(500).json({ error: 'Failed to get artist' });
    }
};

/**
 * Get artist's top tracks
 */
exports.getArtistTopTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const { market = 'US' } = req.query;
        const tracksData = await makeSpotifyRequest(req, `/artists/${id}/top-tracks?market=${market}`);
        res.json(tracksData);
    } catch (error) {
        console.error('Error getting artist top tracks:', error);
        res.status(500).json({ error: 'Failed to get artist top tracks' });
    }
};

/**
 * Get artist's albums
 */
exports.getArtistAlbums = async (req, res) => {
    try {
        const { id } = req.params;
        const { include_groups = 'album', limit = 20, offset = 0, market } = req.query;
        let endpoint = `/artists/${id}/albums?include_groups=${include_groups}&limit=${limit}&offset=${offset}`;
        if (market) endpoint += `&market=${market}`;

        const albumsData = await makeSpotifyRequest(req, endpoint);
        res.json(albumsData);
    } catch (error) {
        console.error('Error getting artist albums:', error);
        res.status(500).json({ error: 'Failed to get artist albums' });
    }
};

/**
 * Get related artists
 */
exports.getRelatedArtists = async (req, res) => {
    try {
        const { id } = req.params;
        const artistsData = await makeSpotifyRequest(req, `/artists/${id}/related-artists`);
        res.json(artistsData);
    } catch (error) {
        console.error('Error getting related artists:', error);
        res.status(500).json({ error: 'Failed to get related artists' });
    }
};

// ==================== ALBUM METHODS ====================

/**
 * Get album information
 */
exports.getAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { market } = req.query;
        let endpoint = `/albums/${id}`;
        if (market) endpoint += `?market=${market}`;

        const albumData = await makeSpotifyRequest(req, endpoint);
        res.json(albumData);
    } catch (error) {
        console.error('Error getting album:', error);
        res.status(500).json({ error: 'Failed to get album' });
    }
};

/**
 * Get album tracks
 */
exports.getAlbumTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 50, offset = 0, market } = req.query;
        let endpoint = `/albums/${id}/tracks?limit=${limit}&offset=${offset}`;
        if (market) endpoint += `&market=${market}`;

        const tracksData = await makeSpotifyRequest(req, endpoint);
        res.json(tracksData);
    } catch (error) {
        console.error('Error getting album tracks:', error);
        res.status(500).json({ error: 'Failed to get album tracks' });
    }
};

// ==================== TRACK METHODS ====================

/**
 * Get track information
 */
exports.getTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const { market } = req.query;
        let endpoint = `/tracks/${id}`;
        if (market) endpoint += `?market=${market}`;

        const trackData = await makeSpotifyRequest(req, endpoint);
        res.json(trackData);
    } catch (error) {
        console.error('Error getting track:', error);
        res.status(500).json({ error: 'Failed to get track' });
    }
};

// ==================== SEARCH METHODS ====================

/**
 * Search for tracks, artists, albums, playlists
 */
exports.search = async (req, res) => {
    try {
        const { q, type = 'track,artist,album,playlist', limit = 20, offset = 0, market } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        let endpoint = `/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}&offset=${offset}`;
        if (market) endpoint += `&market=${market}`;

        const searchData = await makeSpotifyRequest(req, endpoint);
        res.json(searchData);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Failed to search' });
    }
};

// ==================== DISCOVERY METHODS ====================

/**
 * Get new releases
 */
exports.getNewReleases = async (req, res) => {
    try {
        const { limit = 20, offset = 0, country } = req.query;
        let endpoint = `/browse/new-releases?limit=${limit}&offset=${offset}`;
        if (country) endpoint += `&country=${country}`;

        const newReleasesData = await makeSpotifyRequest(req, endpoint);
        res.json(newReleasesData);
    } catch (error) {
        console.error('Error getting new releases:', error);
        res.status(500).json({ error: 'Failed to get new releases' });
    }
};

/**
 * Get track recommendations
 */
exports.getRecommendations = async (req, res) => {
    try {
        const {
            seed_artists,
            seed_genres,
            seed_tracks,
            limit = 20,
            market,
            ...audioFeatures
        } = req.query;

        let endpoint = '/recommendations?';
        const params = [];

        if (seed_artists) params.push(`seed_artists=${seed_artists}`);
        if (seed_genres) params.push(`seed_genres=${seed_genres}`);
        if (seed_tracks) params.push(`seed_tracks=${seed_tracks}`);
        if (limit) params.push(`limit=${limit}`);
        if (market) params.push(`market=${market}`);

        // Add audio features
        Object.entries(audioFeatures).forEach(([key, value]) => {
            if (value !== undefined) params.push(`${key}=${value}`);
        });

        endpoint += params.join('&');

        const recommendationsData = await makeSpotifyRequest(req, endpoint);
        res.json(recommendationsData);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
};

/**
 * Get featured playlists
 */
exports.getFeaturedPlaylists = async (req, res) => {
    try {
        const { limit = 20, offset = 0, country, locale, timestamp } = req.query;
        let endpoint = `/browse/featured-playlists?limit=${limit}&offset=${offset}`;
        if (country) endpoint += `&country=${country}`;
        if (locale) endpoint += `&locale=${locale}`;
        if (timestamp) endpoint += `&timestamp=${timestamp}`;

        const featuredData = await makeSpotifyRequest(req, endpoint);
        res.json(featuredData);
    } catch (error) {
        console.error('Error getting featured playlists:', error);
        res.status(500).json({ error: 'Failed to get featured playlists' });
    }
};

// ==================== FOLLOW/UNFOLLOW METHODS ====================

/**
 * Follow an artist
 */
exports.followArtist = async (req, res) => {
    try {
        const { id } = req.params;
        await makeSpotifyRequest(req, `/me/following?type=artist&ids=${id}`, {
            method: 'PUT'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following artist:', error);
        res.status(500).json({ error: 'Failed to follow artist' });
    }
};

/**
 * Unfollow an artist
 */
exports.unfollowArtist = async (req, res) => {
    try {
        const { id } = req.params;
        await makeSpotifyRequest(req, `/me/following?type=artist&ids=${id}`, {
            method: 'DELETE'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing artist:', error);
        res.status(500).json({ error: 'Failed to unfollow artist' });
    }
};

/**
 * Follow a playlist
 */
exports.followPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { public = true } = req.body;

        await makeSpotifyRequest(req, `/playlists/${id}/followers`, {
            method: 'PUT',
            data: { public }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following playlist:', error);
        res.status(500).json({ error: 'Failed to follow playlist' });
    }
};

/**
 * Unfollow a playlist
 */
exports.unfollowPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        await makeSpotifyRequest(req, `/playlists/${id}/followers`, {
            method: 'DELETE'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing playlist:', error);
        res.status(500).json({ error: 'Failed to unfollow playlist' });
    }
};

// ==================== LEGACY METHODS ====================

/**
 * Get global viral playlists (legacy method)
 */
exports.getGlobalViralPlaylists = async (req, res) => {
    try {
        // This is the original globalviral method, kept for backward compatibility
        const cookies = req.headers.cookie;
        if (!cookies) {
            return res.status(401).json({ error: 'No authentication found' });
        }

        // Extract access token from cookies
        const accessToken = cookies.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token found' });
        }

        let viralAustralia = '37i9dQZEVXbO5MSE9RdfN2'
        let viralArgentina = '37i9dQZEVXbJajpaXyaKll'
        let viralAustria = '2XsImO7JKucXwlYYMIrprM'
        let viralBelgium = '37i9dQZEVXbJx9hUtTN0Sj'
        let viralBolivia = '37i9dQZEVXbMTKZuy8ORFV'
        let viralBrazil = '37i9dQZEVXbMOkSwG072hV'
        let viralBulgaria = '37i9dQZEVXbJcpVBLdFV7m'
        let viralCanada = '37i9dQZEVXbKfIuOAZrk7G'
        let viralColombia = '37i9dQZEVXbKrooeK9WSFF'
        let viralChile = '37i9dQZEVXbJs8e2vk15a8'
        let viralCzechRepublic = '37i9dQZEVXbMBUm3g7j4Kb'
        let viralCostaRica = '37i9dQZEVXbKOefHPXPMyf'
        let viralDenmark = '37i9dQZEVXbMA8BIYDeMkD'
        let viralEcuador = '37i9dQZEVXbJpRQ294oZ9N'
        let viralDominican = '37i9dQZEVXbJWZV7aRNQck'
        let viralElSalvador = '7iXdvqCdHev0ONm2oQYwpf'
        let viralFrance = '37i9dQZEVXbJmRv5TqJW16'
        let viralFinland = '37i9dQZEVXbMBNcyQCfU4w'
        let viralEstonia = '37i9dQZEVXbK4KA2JSuft7'
        let viralEgypt = '37i9dQZEVXbJSvmuZN9Jja'
        let viralGreece = '37i9dQZEVXbLOov4J0GutU'
        let viralGlobal = '37i9dQZEVXbLiRSasKsNU9'
        let viralGermany = '37i9dQZEVXbNv6cjoMVCyg'
        let viralHongKong = '2HQhQNAa4qTF20jWscOINc'
        let viralHonduras = '53M3EPSkZEk05ZO1xkfaD7'
        let viralGuatemala = '0otOpY9wJjnKLhzkYtYsgL'
        let viralIndonesia = '37i9dQZEVXbKpV6RVDTWcZ'
        let viralIceland = '37i9dQZEVXbMHnoaLVkVuk'
        let viralHungary = '37i9dQZEVXbLuey1EKVv9I'
        let viralItaly = '37i9dQZEVXbKbvcwe5owJ1'
        let viralIsrael = '37i9dQZEVXbNGlbFNNXxgC'
        let viralIreland = '5JU1CyH7Ue8kkOwUWXariJ'
        let viralLuxembourg = '1eBfbQXPKDg3w362Ya8eoI'
        let viralLithuania = '5NDesWYuDXDqEva7q28jNm'
        let viralLatvia = '37i9dQZEVXbIUY6VUoboP4'
        let viralJapan = '37i9dQZEVXbINTEnbFeb8d'
        let viralNetherlands = '37i9dQZEVXbMQaPQjt027d'
        let viralMorocco = '0lelgT5b43opUKIqlugB0T'
        let viralMexico = '37i9dQZEVXbLuUZrygauiA'
        let viralMalaysia = '37i9dQZEVXbLRmg3qDbY1H'
        let viralParaguay = '37i9dQZEVXbNxY4E5g33Gy'
        let viralPanama = '72oufharq0EKvIZAIPv3Qc'
        let viralNorway = '37i9dQZEVXbOcsE2WCaJa2'
        let viralNicaragua = '5wKlm01ePoSZqxrOEFppOg'
        let viralNewZealand = '37i9dQZEVXbJ7gPAehey5W'
        let viralRomania = '37i9dQZEVXbNwDVyEEfWV3'
        let viralPortugal = '37i9dQZEVXbKHoaIcElSSA'
        let viralPoland = '37i9dQZEVXbNGGDnE9UFTF'
        let viralPhilippines = '37i9dQZEVXbJv2Mvelmc3I'
        let viralPeru = '37i9dQZEVXbN7gfhgaomhA'
        let viralSlovakia = '37i9dQZEVXbK3Iy2zvpfp4'
        let viralSingapore = '37i9dQZEVXbJVi45MafAu0'
        let viralSaudiArabia = '5vTptlHUeFynGYqJonU19B'
        let viralRussia = '37i9dQZEVXbMNKGj6aCCDm'
        let viralSouthAfrica = '37i9dQZEVXbNaCk6h5bujZ'
        let viralTaiwan = '3QbwXf6j6DSk3SGt8wE7la'
        let viralSwitzerland = '37i9dQZEVXbNjqq6Tw4Fb0'
        let viralSweden = '37i9dQZEVXbIPOivNiyjjS'
        let viralSpain = '37i9dQZEVXbMfVLvbaC3bj'
        let viralSouthKorea = '37i9dQZEVXbM1H8L6Tttw9'
        let viralUkraine = '4pVqQcRbWKsJWVliWYvEuD'
        let viralTurkey = '37i9dQZEVXbMIJZxwqzod6'
        let viralThailand = '37i9dQZEVXbMnf7ONzeQWM'
        let viralUAE = '37i9dQZEVXbN6kflPvZZn0'
        let viralVietnam = '37i9dQZEVXbL1G1MbPav3j'
        let viralUSA = '37i9dQZEVXbKuaTI1Z1Afx'
        let viralUruguay = '6DIOFLdtezQ1OeoI18XVFU'
        let viralUnitedKingdom = '37i9dQZEVXbL3DLHfQeDmV'

        let globalAustralia = '37i9dQZEVXbJPcfkRz0wJ0'
        let globalArgentina = '37i9dQZEVXbMMy2roB9myp'
        let globalAustria = '37i9dQZEVXbKNHh6NIXu36'
        let globalBelgium = '37i9dQZEVXbJNSeeHswcKB'
        let globalBolivia = '37i9dQZEVXbJqfMFK4d691'
        let globalBrazil = '37i9dQZEVXbMXbN3EUUhlg'
        let globalBulgaria = '37i9dQZEVXbNfM2w2mq1B8'
        let globalCanada = '37i9dQZEVXbKj23U1GF4IR'
        let globalColombia = '37i9dQZEVXbOa2lmxNORXQ'
        let globalChile = '37i9dQZEVXbL0GavIqMTeb'
        let globalCzechRepublic = '37i9dQZEVXbIP3c3fqVrJY'
        let globalCostaRica = '37i9dQZEVXbMZAjGMynsQX'
        let globalDenmark = '37i9dQZEVXbL3J0k32lWnN'
        let globalEcuador = '37i9dQZEVXbJlM6nvL1nD1'
        let globalDominican = '37i9dQZEVXbKAbrMR8uuf7'
        let globalElSalvador = '37i9dQZEVXbLxoIml4MYkT'
        let globalEstonia = '37i9dQZEVXbJqdarpmTJDL'
        let globalEgypt = '37i9dQZEVXbLn7RQmT5Xv2'
        let globalFrance = '37i9dQZEVXbIPWwFssbupI'
        let globalFinland = '37i9dQZEVXbMxcczTSoGwZ'
        let globalGreece = '37i9dQZEVXbJqdarpmTJDL'
        let globalGlobal = '37i9dQZEVXbMDoHDwVN2tF'
        let globalGermany = '37i9dQZEVXbJiZcmkrIHGU'
        let globalHongKong = '37i9dQZEVXbLwpL8TjsxOG'
        let globalHonduras = '37i9dQZEVXbJp9wcIM9Eo5'
        let globalGuatemala = '37i9dQZEVXbLy5tBFyQvd4'
        let globalIndonesia = '37i9dQZEVXbObFQZ3JLcXt'
        let globalIceland = '37i9dQZEVXbKMzVsSGQ49S'
        let globalHungary = '37i9dQZEVXbNHwMxAkvmF8'
        let globalItaly = '37i9dQZEVXbIQnj7RRhdSX'
        let globalIsrael = '37i9dQZEVXbJ6IpvItkve3'
        let globalIreland = '37i9dQZEVXbKM896FDX8L1'
        let globalLuxembourg = '37i9dQZEVXbKGcyg6TFGx6'
        let globalLithuania = '37i9dQZEVXbMx56Rdq5lwc'
        let globalLatvia = '37i9dQZEVXbJWuzDrTxbKS'
        let globalJapan = '37i9dQZEVXbKXQ4mDTEBXq'
        let globalNetherlands = '37i9dQZEVXbKCF6dqVpDkS'
        let globalMorocco = '37i9dQZEVXbJU9eQpX8gPT'
        let globalMexico = '37i9dQZEVXbO3qyFxbkOE1'
        let globalMalaysia = '37i9dQZEVXbJlfUljuZExa'
        let globalParaguay = '37i9dQZEVXbNOUPGj7tW6T'
        let globalPanama = '37i9dQZEVXbKypXHVwk1f0'
        let globalNorway = '37i9dQZEVXbJvfa0Yxg7E7'
        let globalNicaragua = '37i9dQZEVXbISk8kxnzfCq'
        let globalNewZealand = '37i9dQZEVXbM8SIrkERIYl'
        let globalRomania = '37i9dQZEVXbNZbJ6TZelCq'
        let globalPortugal = '37i9dQZEVXbKyJS56d1pgi'
        let globalPoland = '37i9dQZEVXbN6itCcaL3Tt'
        let globalPhilippines = '37i9dQZEVXbNBz9cRCSFkY'
        let globalPeru = '37i9dQZEVXbJfdy5b0KP7W'
        let globalSlovakia = '37i9dQZEVXbKIVTPX9a2Sb'
        let globalSingapore = '37i9dQZEVXbK4gjvS1FjPY'
        let globalSaudiArabia = '37i9dQZEVXbLrQBcXqUtaC'
        let globalRussia = '37i9dQZEVXbL8l7ra5vVdB'
        let globalSouthAfrica = '37i9dQZEVXbMH2jvi6jvjk'
        let globalTaiwan = '37i9dQZEVXbMnZEatlMSiu'
        let globalSwitzerland = '37i9dQZEVXbJiyhoAPEfMK'
        let globalSweden = '37i9dQZEVXbLoATJ81JYXz'
        let globalSpain = '37i9dQZEVXbNFJfN1Vw8d9'
        let globalSouthKorea = '37i9dQZEVXbNxXF4SkHj9F'
        let globalUkraine = '37i9dQZEVXbKkidEfWYRuD'
        let globalTurkey = '37i9dQZEVXbIVYVBNw9D5K'
        let globalThailand = '37i9dQZEVXbMnz8KIWsvf9'
        let globalUAE = '37i9dQZEVXbM4UZuIrvHvA'
        let globalVietnam = '37i9dQZEVXbLdGSmz6xilI'
        let globalUSA = '37i9dQZEVXbLRQDuF5jeBp'
        let globalUruguay = '37i9dQZEVXbMJJi3wgRbAy'
        let globalUnitedKingdom = '37i9dQZEVXbLnolsZ8PSNw'
        let globalViral = [viralAustralia,viralArgentina,viralAustria,viralBelgium,viralBolivia,viralBrazil,viralBulgaria,
            viralCanada,viralColombia,viralChile,viralCzechRepublic,viralCostaRica,viralDenmark,viralEcuador,viralDominican,
            viralElSalvador,viralFrance,viralFinland, viralEstonia,viralEgypt,viralGreece,viralGlobal,viralGermany,
            viralHongKong,viralHonduras,viralGuatemala,viralIndonesia, viralIceland,viralHungary,viralItaly,viralIsrael,
            viralIreland,viralLuxembourg,viralLithuania,viralLatvia,viralJapan,viralNetherlands, viralMorocco,viralMexico,
            viralMalaysia,viralParaguay,viralPanama,viralNorway,viralNicaragua,viralNewZealand,viralRomania,viralPortugal,
            viralPoland,viralPhilippines,viralPeru,viralSlovakia,viralSingapore,viralSaudiArabia,viralRussia,viralSouthAfrica,
            viralTaiwan,viralSwitzerland,viralSweden,viralSpain,viralSouthKorea,viralUkraine,viralTurkey,viralThailand,viralUAE,
            viralVietnam,viralUSA,viralUruguay,viralUnitedKingdom,globalAustralia,globalArgentina,globalAustria,globalBelgium,
            globalBolivia,globalBrazil,globalBulgaria, globalCanada,globalColombia,globalChile,globalCzechRepublic,
            globalCostaRica,globalDenmark,globalEcuador, globalDominican,globalElSalvador,globalFrance,globalFinland,
            globalEstonia,globalEgypt,globalGreece,globalGlobal, globalGermany,globalHongKong,globalHonduras,globalGuatemala,
            globalIndonesia, globalIceland,globalHungary, globalItaly,globalIsrael,globalIreland,globalLuxembourg,
            globalLithuania,globalLatvia,globalJapan,globalNetherlands, globalMorocco,globalMexico,globalMalaysia,
            globalParaguay,globalPanama,globalNorway,globalNicaragua, globalNewZealand,globalRomania,globalPortugal,
            globalPoland,globalPhilippines,globalPeru,globalSlovakia, globalSingapore,globalSaudiArabia,globalRussia,
            globalSouthAfrica, globalTaiwan,globalSwitzerland,globalSweden, globalSpain,globalSouthKorea,globalUkraine,
            globalTurkey,globalThailand,globalUAE, globalVietnam,globalUSA, globalUruguay,globalUnitedKingdom]

        const playlists = [];

        for (const playlistId of globalViral) {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                // Save to database
                await Playlist.findOrCreate({
                    where: { sid: playlistId },
                    defaults: { body: response.data }
                });

                playlists.push(response.data);
            } catch (error) {
                console.error(`Error fetching playlist ${playlistId}:`, error);
            }
        }

        res.json({ playlists });
    } catch (error) {
        console.error('Error getting global viral playlists:', error);
        res.status(500).json({ error: 'Failed to get global viral playlists' });
    }
};
