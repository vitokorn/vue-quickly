const db = require("../models");
const User = db.users;
const axios = require('axios');

// Environment variables
const teamId = process.env.APPLE_TEAM_ID;
const keyId = process.env.APPLE_KEY_ID;
const privateKey = process.env.APPLE_PRIVATE_KEY;
const redirectUri = process.env.APPLE_REDIRECT_URI;

// Apple Music API base URL
const APPLE_MUSIC_BASE = 'https://api.music.apple.com/v1';

// Helper function to get access token from cookies
const getAccessToken = (req) => {
    return req.cookies.apple_access_token;
};

// Helper function to get music user token from cookies
const getMusicUserToken = (req) => {
    return req.cookies.apple_music_user_token;
};

// Helper function to get username from cookies
const getUsername = (req) => {
    return req.cookies.apple_username;
};

// Helper function to make authenticated Apple Music API requests
const makeAppleRequest = async (req, endpoint, options = {}) => {
    const token = getAccessToken(req);
    const musicUserToken = getMusicUserToken(req);

    if (!token) {
        throw new Error('No developer token found');
    }

    const config = {
        url: `${APPLE_MUSIC_BASE}${endpoint}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add Music-User-Token for user-specific requests
    if (musicUserToken && (endpoint.includes('/me/') || options.requiresUserToken)) {
        config.headers['Music-User-Token'] = musicUserToken;
    }

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
                if (musicUserToken) {
                    config.headers['Music-User-Token'] = getMusicUserToken(req);
                }
                return axios(config).then(res => res.data);
            }
        }
        throw error;
    }
};

// Helper function to generate Apple Music developer token
const generateDeveloperToken = () => {
    // This is a simplified version. In production, you'd use proper JWT signing
    // with the private key to generate a valid developer token
    // For now, we'll assume it's provided as an environment variable
    return process.env.APPLE_DEVELOPER_TOKEN;
};

// Helper function to refresh tokens
const refreshToken = async (username) => {
    try {
        const user = await User.findOne({ where: { apple_id: username } });
        if (!user) {
            throw new Error('User not found');
        }

        // For Apple Music, we need to refresh the music user token
        // This would typically involve re-authorizing with MusicKit JS
        // For now, we'll just regenerate the developer token
        const newDeveloperToken = generateDeveloperToken();

        // Update user with new token
        await user.update({ apple_developer_token: newDeveloperToken });

        return newDeveloperToken;
    } catch (error) {
        console.error('Error refreshing Apple token:', error);
        throw error;
    }
};

// ==================== AUTHENTICATION METHODS ====================

/**
 * Handle Apple Music OAuth callback
 */
exports.handleCallback = async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code not provided' });
        }

        // Exchange code for tokens using MusicKit JS (simplified)
        // In a real implementation, this would be handled by MusicKit JS on the frontend
        const developerToken = generateDeveloperToken();

        // For demonstration, we'll create a mock user
        // In production, you'd decode the authorization code and get user info
        const appleId = `apple_${Date.now()}`; // Mock ID
        const storefront = 'us'; // Default storefront

        // Save or update user in database
        const [user, created] = await User.findOrCreate({
            where: { apple_id: appleId },
            defaults: {
                apple_developer_token: developerToken,
                apple_storefront: storefront,
                display_name: 'Apple Music User'
            }
        });

        if (!created) {
            // Update existing user
            await user.update({
                apple_developer_token: developerToken,
                apple_storefront: storefront
            });
        }

        // Set cookies
        res.cookie('apple_username', appleId, {
            expires: new Date(Date.now() + 3600000 * 24 * 365) // 1 year
        });
        res.cookie('apple_access_token', developerToken, {
            sameSite: 'strict',
            expires: new Date(Date.now() + 3600000 * 24 * 7) // 1 week
        });
        res.cookie('apple_country', storefront, {
            expires: new Date(Date.now() + 3600000 * 24 * 365)
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error in Apple callback:', error);
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

        res.cookie('apple_access_token', newToken, {
            sameSite: 'strict',
            expires: new Date(Date.now() + 3600000 * 24 * 7)
        });

        res.json({ status: 'success', access_token: newToken });
    } catch (error) {
        console.error('Error refreshing Apple token:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

// ==================== USER DATA METHODS ====================

/**
 * Get current user profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.apple_id,
            display_name: user.display_name,
            country: user.apple_storefront || 'us'
        });
    } catch (error) {
        console.error('Error getting Apple user profile:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
};

/**
 * Get user's recently played tracks (Apple Music equivalent of top tracks)
 */
exports.getUserTopTracks = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeAppleRequest(req, `/me/recent/played/tracks?limit=${limit}&offset=${offset}`, { requiresUserToken: true });
        res.json(userData);
    } catch (error) {
        console.error('Error getting Apple user top tracks:', error);
        res.status(500).json({ error: 'Failed to get user top tracks' });
    }
};

/**
 * Get user's recently played artists
 */
exports.getUserTopArtists = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeAppleRequest(req, `/me/recent/played?limit=${limit}&offset=${offset}`, { requiresUserToken: true });
        // Filter for artists only
        const artists = userData.data.filter(item => item.type === 'artists');
        res.json({ items: artists });
    } catch (error) {
        console.error('Error getting Apple user top artists:', error);
        res.status(500).json({ error: 'Failed to get user top artists' });
    }
};

/**
 * Get user's saved tracks
 */
exports.getUserSavedTracks = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeAppleRequest(req, `/me/library/songs?limit=${limit}&offset=${offset}`, { requiresUserToken: true });
        res.json(userData);
    } catch (error) {
        console.error('Error getting Apple user saved tracks:', error);
        res.status(500).json({ error: 'Failed to get user saved tracks' });
    }
};

/**
 * Get user's saved albums
 */
exports.getUserSavedAlbums = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeAppleRequest(req, `/me/library/albums?limit=${limit}&offset=${offset}`, { requiresUserToken: true });
        res.json(userData);
    } catch (error) {
        console.error('Error getting Apple user saved albums:', error);
        res.status(500).json({ error: 'Failed to get user saved albums' });
    }
};

// ==================== PLAYLIST METHODS ====================

/**
 * Get user's playlists
 */
exports.getUserPlaylists = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userData = await makeAppleRequest(req, `/me/library/playlists?limit=${limit}&offset=${offset}`, { requiresUserToken: true });
        res.json(userData);
    } catch (error) {
        console.error('Error getting Apple user playlists:', error);
        res.status(500).json({ error: 'Failed to get user playlists' });
    }
};

/**
 * Get specific playlist
 */
exports.getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const playlistData = await makeAppleRequest(req, `/me/library/playlists/${id}`, { requiresUserToken: true });
        res.json(playlistData);
    } catch (error) {
        console.error('Error getting Apple playlist:', error);
        res.status(500).json({ error: 'Failed to get playlist' });
    }
};

/**
 * Get playlist tracks
 */
exports.getPlaylistTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 100, offset = 0 } = req.query;
        const tracksData = await makeAppleRequest(req, `/me/library/playlists/${id}/tracks?limit=${limit}&offset=${offset}`, { requiresUserToken: true });
        res.json(tracksData);
    } catch (error) {
        console.error('Error getting Apple playlist tracks:', error);
        res.status(500).json({ error: 'Failed to get playlist tracks' });
    }
};

/**
 * Create new playlist
 */
exports.createPlaylist = async (req, res) => {
    try {
        const { name, description = '' } = req.body;

        const playlistData = await makeAppleRequest(req, '/me/library/playlists', {
            method: 'POST',
            data: {
                attributes: {
                    name,
                    description: {
                        standard: description
                    }
                }
            },
            requiresUserToken: true
        });

        res.json(playlistData);
    } catch (error) {
        console.error('Error creating Apple playlist:', error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
};

/**
 * Add tracks to playlist
 */
exports.addTracksToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { uris } = req.body;

        if (!uris || !Array.isArray(uris)) {
            return res.status(400).json({ error: 'Track URIs array is required' });
        }

        const tracks = uris.map(uri => ({ id: uri.replace('apple:track:', ''), type: 'songs' }));

        const result = await makeAppleRequest(req, `/me/library/playlists/${id}/tracks`, {
            method: 'POST',
            data: { data: tracks },
            requiresUserToken: true
        });

        res.json(result);
    } catch (error) {
        console.error('Error adding tracks to Apple playlist:', error);
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
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const artistData = await makeAppleRequest(req, `/catalog/${storefront}/artists/${id}`);
        res.json(artistData);
    } catch (error) {
        console.error('Error getting Apple artist:', error);
        res.status(500).json({ error: 'Failed to get artist' });
    }
};

/**
 * Get artist's top tracks
 */
exports.getArtistTopTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const tracksData = await makeAppleRequest(req, `/catalog/${storefront}/artists/${id}/view/top-songs`);
        res.json(tracksData);
    } catch (error) {
        console.error('Error getting Apple artist top tracks:', error);
        res.status(500).json({ error: 'Failed to get artist top tracks' });
    }
};

/**
 * Get artist's albums
 */
exports.getArtistAlbums = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 20, offset = 0 } = req.query;
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const albumsData = await makeAppleRequest(req, `/catalog/${storefront}/artists/${id}/albums?limit=${limit}&offset=${offset}`);
        res.json(albumsData);
    } catch (error) {
        console.error('Error getting Apple artist albums:', error);
        res.status(500).json({ error: 'Failed to get artist albums' });
    }
};

/**
 * Get related artists
 */
exports.getRelatedArtists = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const artistsData = await makeAppleRequest(req, `/catalog/${storefront}/artists/${id}/similar-artists`);
        res.json(artistsData);
    } catch (error) {
        console.error('Error getting Apple related artists:', error);
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
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const albumData = await makeAppleRequest(req, `/catalog/${storefront}/albums/${id}`);
        res.json(albumData);
    } catch (error) {
        console.error('Error getting Apple album:', error);
        res.status(500).json({ error: 'Failed to get album' });
    }
};

/**
 * Get album tracks
 */
exports.getAlbumTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const tracksData = await makeAppleRequest(req, `/catalog/${storefront}/albums/${id}/tracks`);
        res.json(tracksData);
    } catch (error) {
        console.error('Error getting Apple album tracks:', error);
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
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const trackData = await makeAppleRequest(req, `/catalog/${storefront}/songs/${id}`);
        res.json(trackData);
    } catch (error) {
        console.error('Error getting Apple track:', error);
        res.status(500).json({ error: 'Failed to get track' });
    }
};

// ==================== SEARCH METHODS ====================

/**
 * Search for tracks, artists, albums, playlists
 */
exports.search = async (req, res) => {
    try {
        const { q, type = 'songs,artists,albums,playlists', limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';

        const searchData = await makeAppleRequest(req, `/catalog/${storefront}/search?term=${encodeURIComponent(q)}&types=${type}&limit=${limit}`);
        res.json(searchData);
    } catch (error) {
        console.error('Error Apple searching:', error);
        res.status(500).json({ error: 'Failed to search' });
    }
};

// ==================== DISCOVERY METHODS ====================

/**
 * Get new releases
 */
exports.getNewReleases = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const username = getUsername(req);
        const user = await User.findOne({ where: { apple_id: username } });
        const storefront = user?.apple_storefront || 'us';
        const currentYear = new Date().getFullYear();

        const newReleasesData = await makeAppleRequest(req, `/catalog/${storefront}/albums?filter[release-date]=${currentYear}-01-01T00:00:00Z&limit=${limit}&offset=${offset}`);
        res.json(newReleasesData);
    } catch (error) {
        console.error('Error getting Apple new releases:', error);
        res.status(500).json({ error: 'Failed to get new releases' });
    }
};

// ==================== FOLLOW/UNFOLLOW METHODS ====================

/**
 * Add album to library
 */
exports.followAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        await makeAppleRequest(req, '/me/library', {
            method: 'POST',
            data: { data: [{ id, type: 'albums' }] },
            requiresUserToken: true
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following Apple album:', error);
        res.status(500).json({ error: 'Failed to follow album' });
    }
};

/**
 * Remove album from library
 */
exports.unfollowAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        await makeAppleRequest(req, `/me/library/albums/${id}`, {
            method: 'DELETE',
            requiresUserToken: true
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing Apple album:', error);
        res.status(500).json({ error: 'Failed to unfollow album' });
    }
};

/**
 * Add track to library
 */
exports.followTrack = async (req, res) => {
    try {
        const { id } = req.params;
        await makeAppleRequest(req, '/me/library', {
            method: 'POST',
            data: { data: [{ id, type: 'songs' }] },
            requiresUserToken: true
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following Apple track:', error);
        res.status(500).json({ error: 'Failed to follow track' });
    }
};

/**
 * Remove track from library
 */
exports.unfollowTrack = async (req, res) => {
    try {
        const { id } = req.params;
        await makeAppleRequest(req, `/me/library/songs/${id}`, {
            method: 'DELETE',
            requiresUserToken: true
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing Apple track:', error);
        res.status(500).json({ error: 'Failed to unfollow track' });
    }
};
