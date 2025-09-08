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

        // List of global viral playlist IDs (simplified version)
        const viralPlaylistIds = [
            '37i9dQZEVXbLiRSasKsNU9', // Global Viral 50
            '37i9dQZEVXbMDoHDwVN2tF', // Global Top 50
            '37i9dQZEVXbKuaTI1Z1Afx', // USA Viral 50
            '37i9dQZEVXbLnolsZ8PSNw'  // UK Viral 50
        ];

        const playlists = [];
        
        for (const playlistId of viralPlaylistIds) {
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
