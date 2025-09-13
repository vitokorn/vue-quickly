const appleController = require("../controllers/apple.controller.js");
const express = require("express");

module.exports = (app) => {
    const router = express.Router();

    // Environment variables
    const teamId = process.env.APPLE_TEAM_ID;
    const keyId = process.env.APPLE_KEY_ID;
    const redirectUri = process.env.APPLE_REDIRECT_URI;

    // Validate environment variables
    if (!teamId || !keyId || !redirectUri) {
        console.error('Missing required Apple Music environment variables');
    }

    // ==================== AUTHENTICATION ROUTES ====================

    /**
     * @route GET /apple/login
     * @desc Initiate Apple Music OAuth flow
     */
    router.get("/apple/login", (req, res) => {
        try {
            // Apple Music uses MusicKit JS for authentication
            // This is a simplified redirect - in production, you'd use MusicKit JS
            const authUrl = `https://music.apple.com/oauth/authorize?client_id=${teamId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=music.read&state=random_state`;
            res.redirect(authUrl);
        } catch (error) {
            console.error('Error in Apple login:', error);
            res.status(500).json({ error: 'Failed to initiate Apple login' });
        }
    });

    /**
     * @route GET /apple/callback
     * @desc Handle Apple Music OAuth callback
     */
    router.get("/apple/callback", appleController.handleCallback);

    /**
     * @route GET /apple/refresh_token/:username
     * @desc Refresh Apple Music access token
     */
    router.get("/apple/refresh_token/:username", appleController.refreshToken);

    /**
     * @route GET /apple/logout
     * @desc Logout user and clear cookies
     */
    router.get("/apple/logout", (req, res) => {
        try {
            res.clearCookie("apple_access_token")
                .clearCookie("apple_username")
                .clearCookie("apple_country")
                .clearCookie("apple_music_user_token");
            res.redirect('/');
        } catch (error) {
            console.error('Error in Apple logout:', error);
            res.status(500).json({ error: 'Failed to logout' });
        }
    });

    // ==================== USER DATA ROUTES ====================

    /**
     * @route GET /apple/user/profile
     * @desc Get current user profile
     */
    router.get("/apple/user/profile", appleController.getUserProfile);

    /**
     * @route GET /apple/user/top-tracks
     * @desc Get user's recently played tracks
     */
    router.get("/apple/user/top-tracks", appleController.getUserTopTracks);

    /**
     * @route GET /apple/user/top-artists
     * @desc Get user's recently played artists
     */
    router.get("/apple/user/top-artists", appleController.getUserTopArtists);

    /**
     * @route GET /apple/user/saved-tracks
     * @desc Get user's saved tracks
     */
    router.get("/apple/user/saved-tracks", appleController.getUserSavedTracks);

    /**
     * @route GET /apple/user/saved-albums
     * @desc Get user's saved albums
     */
    router.get("/apple/user/saved-albums", appleController.getUserSavedAlbums);

    // ==================== PLAYLIST ROUTES ====================

    /**
     * @route GET /apple/playlists
     * @desc Get user's playlists
     */
    router.get("/apple/playlists", appleController.getUserPlaylists);

    /**
     * @route GET /apple/playlist/:id
     * @desc Get specific playlist
     */
    router.get("/apple/playlist/:id", appleController.getPlaylist);

    /**
     * @route GET /apple/playlist/:id/tracks
     * @desc Get playlist tracks
     */
    router.get("/apple/playlist/:id/tracks", appleController.getPlaylistTracks);

    /**
     * @route POST /apple/playlist
     * @desc Create new playlist
     */
    router.post("/apple/playlist", appleController.createPlaylist);

    /**
     * @route POST /apple/playlist/:id/tracks
     * @desc Add tracks to playlist
     */
    router.post("/apple/playlist/:id/tracks", appleController.addTracksToPlaylist);

    // ==================== ARTIST ROUTES ====================

    /**
     * @route GET /apple/artist/:id
     * @desc Get artist information
     */
    router.get("/apple/artist/:id", appleController.getArtist);

    /**
     * @route GET /apple/artist/:id/top-tracks
     * @desc Get artist's top tracks
     */
    router.get("/apple/artist/:id/top-tracks", appleController.getArtistTopTracks);

    /**
     * @route GET /apple/artist/:id/albums
     * @desc Get artist's albums
     */
    router.get("/apple/artist/:id/albums", appleController.getArtistAlbums);

    /**
     * @route GET /apple/artist/:id/related
     * @desc Get related artists
     */
    router.get("/apple/artist/:id/related", appleController.getRelatedArtists);

    // ==================== ALBUM ROUTES ====================

    /**
     * @route GET /apple/album/:id
     * @desc Get album information
     */
    router.get("/apple/album/:id", appleController.getAlbum);

    /**
     * @route GET /apple/album/:id/tracks
     * @desc Get album tracks
     */
    router.get("/apple/album/:id/tracks", appleController.getAlbumTracks);

    // ==================== TRACK ROUTES ====================

    /**
     * @route GET /apple/track/:id
     * @desc Get track information
     */
    router.get("/apple/track/:id", appleController.getTrack);

    // ==================== SEARCH ROUTES ====================

    /**
     * @route GET /apple/search
     * @desc Search for tracks, artists, albums, playlists
     */
    router.get("/apple/search", appleController.search);

    // ==================== DISCOVERY ROUTES ====================

    /**
     * @route GET /apple/new-releases
     * @desc Get new releases
     */
    router.get("/apple/new-releases", appleController.getNewReleases);

    // ==================== FOLLOW/UNFOLLOW ROUTES ====================

    /**
     * @route PUT /apple/album/:id/follow
     * @desc Add album to library
     */
    router.put("/apple/album/:id/follow", appleController.followAlbum);

    /**
     * @route DELETE /apple/album/:id/follow
     * @desc Remove album from library
     */
    router.delete("/apple/album/:id/follow", appleController.unfollowAlbum);

    /**
     * @route PUT /apple/track/:id/follow
     * @desc Add track to library
     */
    router.put("/apple/track/:id/follow", appleController.followTrack);

    /**
     * @route DELETE /apple/track/:id/follow
     * @desc Remove track from library
     */
    router.delete("/apple/track/:id/follow", appleController.unfollowTrack);

    // Mount the router
    app.use('/', router);
};
