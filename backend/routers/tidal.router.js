const tidalController = require("../controllers/tidal.controller.js");
const express = require("express");

module.exports = (app) => {
    const router = express.Router();

    // Environment variables
    const client_id = process.env.TIDAL_CLIENT_ID;
    const client_secret = process.env.TIDAL_CLIENT_SECRET;
    const redirect_uri = process.env.TIDAL_REDIRECT_URI;

    // Validate environment variables
    if (!client_id || !client_secret || !redirect_uri) {
        console.error('Missing required Tidal environment variables');
    }

    // ==================== AUTHENTICATION ROUTES ====================

    /**
     * @route GET /tidal/auth
     * @desc Initiate Tidal OAuth flow
     */
    router.get("/tidal/auth", (req, res) => {
        try {
            const scopes = [
                'user.read',
                'playlists.read',
                'playlists.write',
                'favorites.read',
                'favorites.write'
            ].join(' ');

            const authUrl = new URL('https://auth.tidal.com/v1/oauth2/authorize');
            authUrl.searchParams.append('client_id', client_id);
            authUrl.searchParams.append('response_type', 'code');
            authUrl.searchParams.append('redirect_uri', redirect_uri);
            authUrl.searchParams.append('scope', scopes);
            authUrl.searchParams.append('state', 'tidal_auth');

            res.redirect(authUrl.toString());
        } catch (error) {
            console.error('Error in Tidal auth:', error);
            res.status(500).json({ error: 'Failed to initiate Tidal authentication' });
        }
    });

    /**
     * @route GET /tidal/callback
     * @desc Handle Tidal OAuth callback
     */
    router.get("/tidal/callback", tidalController.handleCallback);

    /**
     * @route POST /tidal/refresh
     * @desc Refresh Tidal access token
     */
    router.post("/tidal/refresh", tidalController.refreshToken);

    /**
     * @route POST /tidal/logout
     * @desc Logout user and clear cookies
     */
    router.post("/tidal/logout", tidalController.logout);

    // ==================== USER DATA ROUTES ====================

    /**
     * @route GET /tidal/user/profile
     * @desc Get current user profile
     */
    router.get("/tidal/user/profile", tidalController.getUserProfile);

    /**
     * @route GET /tidal/user/top-tracks
     * @desc Get user's top tracks
     */
    router.get("/tidal/user/top-tracks", tidalController.getUserTopTracks);

    /**
     * @route GET /tidal/user/top-artists
     * @desc Get user's top artists
     */
    router.get("/tidal/user/top-artists", tidalController.getUserTopArtists);

    /**
     * @route GET /tidal/user/saved-tracks
     * @desc Get user's saved tracks
     */
    router.get("/tidal/user/saved-tracks", tidalController.getUserSavedTracks);

    /**
     * @route GET /tidal/user/saved-albums
     * @desc Get user's saved albums
     */
    router.get("/tidal/user/saved-albums", tidalController.getUserSavedAlbums);

    /**
     * @route GET /tidal/user/followed-artists
     * @desc Get user's followed artists
     */
    router.get("/tidal/user/followed-artists", tidalController.getUserFollowedArtists);

    // ==================== PLAYLIST ROUTES ====================

    /**
     * @route GET /tidal/playlists
     * @desc Get user's playlists
     */
    router.get("/tidal/playlists", tidalController.getUserPlaylists);

    /**
     * @route GET /tidal/playlist/:id
     * @desc Get specific playlist
     */
    router.get("/tidal/playlist/:id", tidalController.getPlaylist);

    /**
     * @route GET /tidal/playlist/:id/tracks
     * @desc Get playlist tracks
     */
    router.get("/tidal/playlist/:id/tracks", tidalController.getPlaylistTracks);

    /**
     * @route POST /tidal/playlist
     * @desc Create new playlist
     */
    router.post("/tidal/playlist", tidalController.createPlaylist);

    /**
     * @route POST /tidal/playlist/:id/tracks
     * @desc Add tracks to playlist
     */
    router.post("/tidal/playlist/:id/tracks", tidalController.addTracksToPlaylist);

    // ==================== ARTIST ROUTES ====================

    /**
     * @route GET /tidal/artist/:id
     * @desc Get artist information
     */
    router.get("/tidal/artist/:id", tidalController.getArtist);

    /**
     * @route GET /tidal/artist/:id/top-tracks
     * @desc Get artist's top tracks
     */
    router.get("/tidal/artist/:id/top-tracks", tidalController.getArtistTopTracks);

    /**
     * @route GET /tidal/artist/:id/albums
     * @desc Get artist's albums
     */
    router.get("/tidal/artist/:id/albums", tidalController.getArtistAlbums);

    /**
     * @route GET /tidal/artist/:id/related
     * @desc Get related artists
     */
    router.get("/tidal/artist/:id/related", tidalController.getRelatedArtists);

    // ==================== ALBUM ROUTES ====================

    /**
     * @route GET /tidal/album/:id
     * @desc Get album information
     */
    router.get("/tidal/album/:id", tidalController.getAlbum);

    /**
     * @route GET /tidal/album/:id/tracks
     * @desc Get album tracks
     */
    router.get("/tidal/album/:id/tracks", tidalController.getAlbumTracks);

    // ==================== TRACK ROUTES ====================

    /**
     * @route GET /tidal/track/:id
     * @desc Get track information
     */
    router.get("/tidal/track/:id", tidalController.getTrack);

    // ==================== SEARCH ROUTES ====================

    /**
     * @route GET /tidal/search
     * @desc Search for tracks, artists, albums, playlists
     */
    router.get("/tidal/search", tidalController.search);

    // ==================== DISCOVERY ROUTES ====================

    /**
     * @route GET /tidal/new-releases
     * @desc Get new releases
     */
    router.get("/tidal/new-releases", tidalController.getNewReleases);

    /**
     * @route GET /tidal/recommendations
     * @desc Get track recommendations
     */
    router.get("/tidal/recommendations", tidalController.getRecommendations);

    // ==================== CATEGORIES ROUTES ====================

    /**
     * @route GET /tidal/categories
     * @desc Get music categories/genres
     */
    router.get("/tidal/categories", tidalController.getCategories);

    /**
     * @route GET /tidal/categories/:id/playlists
     * @desc Get playlists by category
     */
    router.get("/tidal/categories/:id/playlists", tidalController.getCategoryPlaylists);

    // ==================== FOLLOW/UNFOLLOW ROUTES ====================

    /**
     * @route PUT /tidal/artist/:id/follow
     * @desc Follow an artist
     */
    router.put("/tidal/artist/:id/follow", tidalController.followArtist);

    /**
     * @route DELETE /tidal/artist/:id/follow
     * @desc Unfollow an artist
     */
    router.delete("/tidal/artist/:id/follow", tidalController.unfollowArtist);

    /**
     * @route PUT /tidal/album/:id/follow
     * @desc Follow an album
     */
    router.put("/tidal/album/:id/follow", tidalController.followAlbum);

    /**
     * @route DELETE /tidal/album/:id/follow
     * @desc Unfollow an album
     */
    router.delete("/tidal/album/:id/follow", tidalController.unfollowAlbum);

    /**
     * @route PUT /tidal/track/:id/follow
     * @desc Follow a track
     */
    router.put("/tidal/track/:id/follow", tidalController.followTrack);

    /**
     * @route DELETE /tidal/track/:id/follow
     * @desc Unfollow a track
     */
    router.delete("/tidal/track/:id/follow", tidalController.unfollowTrack);

    /**
     * @route PUT /tidal/playlist/:id/follow
     * @desc Follow a playlist
     */
    router.put("/tidal/playlist/:id/follow", tidalController.followPlaylist);

    /**
     * @route DELETE /tidal/playlist/:id/follow
     * @desc Unfollow a playlist
     */
    router.delete("/tidal/playlist/:id/follow", tidalController.unfollowPlaylist);

    // ==================== CHECK FOLLOWING STATUS ROUTES ====================

    /**
     * @route GET /tidal/artist/:id/following
     * @desc Check if user follows an artist
     */
    router.get("/tidal/artist/:id/following", tidalController.checkFollowingArtist);

    /**
     * @route GET /tidal/album/:id/following
     * @desc Check if user follows an album
     */
    router.get("/tidal/album/:id/following", tidalController.checkFollowingAlbum);

    /**
     * @route GET /tidal/track/:id/following
     * @desc Check if user follows a track
     */
    router.get("/tidal/track/:id/following", tidalController.checkFollowingTrack);

    /**
     * @route GET /tidal/playlist/:id/following
     * @desc Check if user follows a playlist
     */
    router.get("/tidal/playlist/:id/following", tidalController.checkFollowingPlaylist);

    // Mount the router
    app.use('/', router);
};
