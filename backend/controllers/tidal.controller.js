const axios = require('axios');

// Environment variables
const client_id = process.env.TIDAL_CLIENT_ID;
const client_secret = process.env.TIDAL_CLIENT_SECRET;
const redirect_uri = process.env.TIDAL_REDIRECT_URI;

// Tidal API configuration
const TIDAL_API_BASE = 'https://api.tidal.com/v1';
const TIDAL_AUTH_BASE = 'https://auth.tidal.com/v1';

// Helper function to get access token from cookies
const getAccessToken = (req) => {
    return req.cookies.tidal_access_token;
};

// Helper function to get refresh token from cookies
const getRefreshToken = (req) => {
    return req.cookies.tidal_refresh_token;
};

// Helper function to get user ID from cookies
const getUserId = (req) => {
    return req.cookies.tidal_user_id;
};

// Helper function to make authenticated Tidal API requests
const makeTidalRequest = async (req, endpoint, options = {}) => {
    const token = getAccessToken(req);
    if (!token) {
        throw new Error('No access token found');
    }

    const config = {
        url: `${TIDAL_API_BASE}${endpoint}`,
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
            const userId = getUserId(req);
            if (userId) {
                await refreshToken(userId);
                // Retry the request with new token
                config.headers['Authorization'] = `Bearer ${getAccessToken(req)}`;
                return axios(config).then(res => res.data);
            }
        }
        throw error;
    }
};

// Helper function to refresh access token
const refreshToken = async (userId) => {
    try {
        const db = require("../models");
        const User = db.users;

        const user = await User.findOne({ where: { id: userId } });
        if (!user || !user.tidal_refresh_token) {
            throw new Error('User not found or no refresh token');
        }

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', user.tidal_refresh_token);
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);

        const response = await axios.post(`${TIDAL_AUTH_BASE}/oauth2/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = response.data;

        // Update user with new tokens
        await user.update({
            tidal_access_token: access_token,
            tidal_refresh_token: refresh_token || user.tidal_refresh_token
        });

        return access_token;
    } catch (error) {
        console.error('Error refreshing Tidal token:', error);
        throw error;
    }
};

// ==================== AUTHENTICATION METHODS ====================

/**
 * Handle Tidal OAuth callback
 */
exports.handleCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code not provided' });
        }

        // Exchange code for tokens
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirect_uri);
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);

        const tokenResponse = await axios.post(`${TIDAL_AUTH_BASE}/oauth2/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = tokenResponse.data;

        // Get user info
        const userResponse = await axios.get(`${TIDAL_API_BASE}/users/me`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        const userData = userResponse.data;

        // Save user to database
        const db = require("../models");
        const User = db.users;

        const [user, created] = await User.findOrCreate({
            where: { tidal_id: userData.id.toString() },
            defaults: {
                tidal_id: userData.id.toString(),
                tidal_access_token: access_token,
                tidal_refresh_token: refresh_token,
                display_name: userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.username || 'Unknown User',
                email: userData.email || null,
                country: userData.country || null
            }
        });

        // Update tokens if user already exists
        if (!created) {
            await user.update({
                tidal_access_token: access_token,
                tidal_refresh_token: refresh_token
            });
        }

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };

        res.cookie('tidal_access_token', access_token, cookieOptions)
            .cookie('tidal_refresh_token', refresh_token, cookieOptions)
            .cookie('tidal_user_id', user.id, cookieOptions)
            .cookie('tidal_country', userData.country || '', cookieOptions)
            .cookie('tidal_display_name', user.display_name, cookieOptions);

        // Redirect to frontend
        res.redirect('http://localhost:5173');

    } catch (error) {
        console.error('Error in Tidal callback:', error);
        res.status(500).json({ error: 'Failed to authenticate with Tidal' });
    }
};

/**
 * Refresh Tidal access token
 */
exports.refreshToken = async (req, res) => {
    try {
        const userId = req.body.userId || getUserId(req);

        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }

        const accessToken = await refreshToken(userId);

        // Update cookies
        res.cookie('tidal_access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ access_token: accessToken });

    } catch (error) {
        console.error('Error refreshing Tidal token:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
};

/**
 * Logout user and clear Tidal cookies
 */
exports.logout = async (req, res) => {
    try {
        res.clearCookie("tidal_access_token")
            .clearCookie("tidal_refresh_token")
            .clearCookie("tidal_user_id")
            .clearCookie("tidal_country")
            .clearCookie("tidal_display_name");

        res.json({ success: true });

    } catch (error) {
        console.error('Error in Tidal logout:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
};

// ==================== USER DATA METHODS ====================

/**
 * Get current user profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const data = await makeTidalRequest(req, '/users/me');
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal user profile:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
};

/**
 * Get user's top tracks (favorites)
 */
exports.getUserTopTracks = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const data = await makeTidalRequest(req, `/users/me/favorites/tracks?limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal top tracks:', error);
        res.status(500).json({ error: 'Failed to get top tracks' });
    }
};

/**
 * Get user's top artists (favorites)
 */
exports.getUserTopArtists = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const data = await makeTidalRequest(req, `/users/me/favorites/artists?limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal top artists:', error);
        res.status(500).json({ error: 'Failed to get top artists' });
    }
};

/**
 * Get user's saved tracks
 */
exports.getUserSavedTracks = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const data = await makeTidalRequest(req, `/users/me/favorites/tracks?limit=${limit}&offset=${offset}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal saved tracks:', error);
        res.status(500).json({ error: 'Failed to get saved tracks' });
    }
};

/**
 * Get user's saved albums
 */
exports.getUserSavedAlbums = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const data = await makeTidalRequest(req, `/users/me/favorites/albums?limit=${limit}&offset=${offset}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal saved albums:', error);
        res.status(500).json({ error: 'Failed to get saved albums' });
    }
};

/**
 * Get user's followed artists
 */
exports.getUserFollowedArtists = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const data = await makeTidalRequest(req, `/users/me/favorites/artists?limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal followed artists:', error);
        res.status(500).json({ error: 'Failed to get followed artists' });
    }
};

// ==================== PLAYLIST METHODS ====================

/**
 * Get user's playlists
 */
exports.getUserPlaylists = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const data = await makeTidalRequest(req, `/users/me/playlists?limit=${limit}&offset=${offset}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal playlists:', error);
        res.status(500).json({ error: 'Failed to get playlists' });
    }
};

/**
 * Get specific playlist
 */
exports.getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await makeTidalRequest(req, `/playlists/${id}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal playlist:', error);
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
        const data = await makeTidalRequest(req, `/playlists/${id}/tracks?limit=${limit}&offset=${offset}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal playlist tracks:', error);
        res.status(500).json({ error: 'Failed to get playlist tracks' });
    }
};

/**
 * Create new playlist
 */
exports.createPlaylist = async (req, res) => {
    try {
        const { name, description = '' } = req.body;
        const payload = {
            title: name,
            description: description
        };

        const data = await makeTidalRequest(req, '/playlists', {
            method: 'POST',
            data: payload
        });

        res.json(data);
    } catch (error) {
        console.error('Error creating Tidal playlist:', error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
};

/**
 * Add tracks to playlist
 */
exports.addTracksToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackIds } = req.body;

        const payload = {
            trackIds: trackIds.map(id => id.toString())
        };

        await makeTidalRequest(req, `/playlists/${id}/tracks`, {
            method: 'POST',
            data: payload
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding tracks to Tidal playlist:', error);
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
        const data = await makeTidalRequest(req, `/artists/${id}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal artist:', error);
        res.status(500).json({ error: 'Failed to get artist' });
    }
};

/**
 * Get artist's top tracks
 */
exports.getArtistTopTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 10 } = req.query;
        const data = await makeTidalRequest(req, `/artists/${id}/toptracks?limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal artist top tracks:', error);
        res.status(500).json({ error: 'Failed to get artist top tracks' });
    }
};

/**
 * Get artist's albums
 */
exports.getArtistAlbums = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 10 } = req.query;
        const data = await makeTidalRequest(req, `/artists/${id}/albums?limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal artist albums:', error);
        res.status(500).json({ error: 'Failed to get artist albums' });
    }
};

/**
 * Get related artists
 */
exports.getRelatedArtists = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 10 } = req.query;
        const data = await makeTidalRequest(req, `/artists/${id}/similar?limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal related artists:', error);
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
        const data = await makeTidalRequest(req, `/albums/${id}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal album:', error);
        res.status(500).json({ error: 'Failed to get album' });
    }
};

/**
 * Get album tracks
 */
exports.getAlbumTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await makeTidalRequest(req, `/albums/${id}/tracks`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal album tracks:', error);
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
        const data = await makeTidalRequest(req, `/tracks/${id}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal track:', error);
        res.status(500).json({ error: 'Failed to get track' });
    }
};

// ==================== SEARCH METHODS ====================

/**
 * Search for tracks, artists, albums, playlists
 */
exports.search = async (req, res) => {
    try {
        const { q: query, type = 'track,artist,album,playlist', limit = 5 } = req.query;
        const data = await makeTidalRequest(req, `/search?query=${encodeURIComponent(query)}&types=${type}&limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error searching Tidal:', error);
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
        const data = await makeTidalRequest(req, `/albums/new?limit=${limit}&offset=${offset}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal new releases:', error);
        res.status(500).json({ error: 'Failed to get new releases' });
    }
};

/**
 * Get recommendations
 */
exports.getRecommendations = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const data = await makeTidalRequest(req, `/tracks/popular?limit=${limit}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
};

// ==================== FOLLOW/UNFOLLOW METHODS ====================

/**
 * Follow an artist
 */
exports.followArtist = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/favorites/artists/${id}`, {
            method: 'POST'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following Tidal artist:', error);
        res.status(500).json({ error: 'Failed to follow artist' });
    }
};

/**
 * Unfollow an artist
 */
exports.unfollowArtist = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/favorites/artists/${id}`, {
            method: 'DELETE'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing Tidal artist:', error);
        res.status(500).json({ error: 'Failed to unfollow artist' });
    }
};

/**
 * Follow an album
 */
exports.followAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/favorites/albums/${id}`, {
            method: 'POST'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following Tidal album:', error);
        res.status(500).json({ error: 'Failed to follow album' });
    }
};

/**
 * Unfollow an album
 */
exports.unfollowAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/favorites/albums/${id}`, {
            method: 'DELETE'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing Tidal album:', error);
        res.status(500).json({ error: 'Failed to unfollow album' });
    }
};

/**
 * Follow a track
 */
exports.followTrack = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/favorites/tracks/${id}`, {
            method: 'POST'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following Tidal track:', error);
        res.status(500).json({ error: 'Failed to follow track' });
    }
};

/**
 * Unfollow a track
 */
exports.unfollowTrack = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/favorites/tracks/${id}`, {
            method: 'DELETE'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing Tidal track:', error);
        res.status(500).json({ error: 'Failed to unfollow track' });
    }
};

/**
 * Follow a playlist
 */
exports.followPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/follows/playlists/${id}`, {
            method: 'POST'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error following Tidal playlist:', error);
        res.status(500).json({ error: 'Failed to follow playlist' });
    }
};

/**
 * Unfollow a playlist
 */
exports.unfollowPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        await makeTidalRequest(req, `/users/me/follows/playlists/${id}`, {
            method: 'DELETE'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error unfollowing Tidal playlist:', error);
        res.status(500).json({ error: 'Failed to unfollow playlist' });
    }
};

// ==================== CHECK FOLLOWING STATUS ====================

/**
 * Check if user follows an artist
 */
exports.checkFollowingArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await makeTidalRequest(req, `/users/me/favorites/artists/contains?ids=${id}`);
        res.json(Array.isArray(response) ? response[0] : false);
    } catch (error) {
        console.error('Error checking Tidal artist following status:', error);
        res.json(false);
    }
};

/**
 * Check if user follows an album
 */
exports.checkFollowingAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await makeTidalRequest(req, `/users/me/favorites/albums/contains?ids=${id}`);
        res.json(Array.isArray(response) ? response[0] : false);
    } catch (error) {
        console.error('Error checking Tidal album following status:', error);
        res.json(false);
    }
};

/**
 * Check if user follows a track
 */
exports.checkFollowingTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await makeTidalRequest(req, `/users/me/favorites/tracks/contains?ids=${id}`);
        res.json(Array.isArray(response) ? response[0] : false);
    } catch (error) {
        console.error('Error checking Tidal track following status:', error);
        res.json(false);
    }
};

/**
 * Check if user follows a playlist
 */
exports.checkFollowingPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await makeTidalRequest(req, `/users/me/follows/playlists/contains?ids=${id}`);
        res.json(Array.isArray(response) ? response[0] : false);
    } catch (error) {
        console.error('Error checking Tidal playlist following status:', error);
        res.json(false);
    }
};

// ==================== CATEGORIES METHODS ====================

/**
 * Get music genres/categories
 */
exports.getCategories = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const data = await makeTidalRequest(req, `/genres?limit=${limit}&offset=${offset}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal categories:', error);
        res.status(500).json({ error: 'Failed to get categories' });
    }
};

/**
 * Get playlists by category
 */
exports.getCategoryPlaylists = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        const data = await makeTidalRequest(req, `/genres/${id}/playlists?limit=${limit}&offset=${offset}`);
        res.json(data);
    } catch (error) {
        console.error('Error getting Tidal category playlists:', error);
        res.status(500).json({ error: 'Failed to get category playlists' });
    }
};
