const youtubeController = require("../controllers/youtube.controller.js");
const express = require("express");

module.exports = (app) => {
    const router = express.Router();

    // No OAuth env vars needed for youtubei/Innertube

    // ==================== AUTHENTICATION ROUTES ====================

    /**
     * @route GET /youtube/login
     * @desc Lightweight init for YouTube session (sets simple cookies)
     */
    router.get("/youtube/login", youtubeController.handleCallback);

    /**
     * @route GET /youtube/logout
     * @desc Logout user and clear cookies
     */
    router.get("/youtube/logout", (req, res) => {
        try {
            res.clearCookie("access_token")
                .clearCookie("username")
                .clearCookie("country")
                .clearCookie("nickname");
            res.redirect('/');
        } catch (error) {
            console.error('Error in YouTube logout:', error);
            res.status(500).json({ error: 'Failed to logout' });
        }
    });

    // ==================== USER DATA ROUTES ====================

    /**
     * @route GET /youtube/user/profile
     * @desc Get current user profile
     */
    router.get("/youtube/user/profile", youtubeController.getUserProfile);

    // ==================== SEARCH ROUTES ====================

    /**
     * @route GET /youtube/search
     * @desc Search for tracks, artists, albums, playlists
     */
    router.get("/youtube/search", youtubeController.search);

    // ==================== TRACK ROUTES ====================

    /**
     * @route GET /youtube/track/:id
     * @desc Get track information
     */
    router.get("/youtube/track/:id", youtubeController.getTrack);

    // ==================== ARTIST ROUTES ====================

    /**
     * @route GET /youtube/artist/:id
     * @desc Get artist information
     */
    router.get("/youtube/artist/:id", youtubeController.getArtist);

    /**
     * @route GET /youtube/artist/:id/top-tracks
     * @desc Get artist's top tracks
     */
    router.get("/youtube/artist/:id/top-tracks", youtubeController.getArtistTopTracks);

    // ==================== ALBUM ROUTES ====================

    /**
     * @route GET /youtube/album/:id
     * @desc Get album information
     */
    router.get("/youtube/album/:id", youtubeController.getAlbum);

    /**
     * @route GET /youtube/album/:id/tracks
     * @desc Get album tracks
     */
    router.get("/youtube/album/:id/tracks", youtubeController.getAlbumTracks);

    // ==================== PLAYLIST ROUTES ====================

    /**
     * @route GET /youtube/playlist/:id
     * @desc Get playlist information
     */
    router.get("/youtube/playlist/:id", youtubeController.getPlaylist);

    /**
     * @route GET /youtube/playlist/:id/tracks
     * @desc Get playlist tracks
     */
    router.get("/youtube/playlist/:id/tracks", youtubeController.getPlaylistTracks);

    // ==================== DISCOVERY ROUTES ====================

    /**
     * @route GET /youtube/new-releases
     * @desc Get new releases
     */
    router.get("/youtube/new-releases", youtubeController.getNewReleases);

    /**
     * @route GET /youtube/trending
     * @desc Get trending tracks
     */
    router.get("/youtube/trending", youtubeController.getTrending);

    // Mount the router
    app.use('/', router);
};
