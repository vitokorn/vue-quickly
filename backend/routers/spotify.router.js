const spotifyController = require("../controllers/spotify.controller.js");
const express = require("express");

module.exports = (app) => {
    const router = express.Router();
    
    // Environment variables
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

    // Validate environment variables
    if (!client_id || !client_secret || !redirect_uri) {
        console.error('Missing required Spotify environment variables');
    }

    // ==================== AUTHENTICATION ROUTES ====================
    
    /**
     * @route GET /spotify/login
     * @desc Initiate Spotify OAuth flow
     */
    router.get("/spotify/login", (req, res) => {
        try {
            const scopes = [
                'user-library-read',
                'user-read-private',
                'playlist-read-collaborative',
                'playlist-read-private',
                'playlist-modify-public',
                'playlist-modify-private',
                'user-top-read',
                'user-follow-read',
                'user-follow-modify',
                'user-library-modify'
            ].join(' ');

            const authUrl = new URL('https://accounts.spotify.com/authorize');
            authUrl.searchParams.append('client_id', client_id);
            authUrl.searchParams.append('response_type', 'code');
            authUrl.searchParams.append('redirect_uri', redirect_uri);
            authUrl.searchParams.append('scope', scopes);
            authUrl.searchParams.append('show_dialog', 'true');

            res.redirect(authUrl.toString());
        } catch (error) {
            console.error('Error in Spotify login:', error);
            res.status(500).json({ error: 'Failed to initiate Spotify login' });
        }
    });

    /**
     * @route GET /spotify/callback
     * @desc Handle Spotify OAuth callback
     */
    router.get("/spotify/callback", spotifyController.handleCallback);

    /**
     * @route GET /spotify/refresh_token/:username
     * @desc Refresh Spotify access token
     */
    router.get("/spotify/refresh_token/:username", spotifyController.refreshToken);

    /**
     * @route GET /spotify/logout
     * @desc Logout user and clear cookies
     */
    router.get("/spotify/logout", (req, res) => {
        try {
            res.clearCookie("access_token")
                .clearCookie("username")
                .clearCookie("country")
                .clearCookie("nickname");
            res.redirect('/');
        } catch (error) {
            console.error('Error in Spotify logout:', error);
            res.status(500).json({ error: 'Failed to logout' });
        }
    });

    // ==================== USER DATA ROUTES ====================

    /**
     * @route GET /spotify/user/profile
     * @desc Get current user profile
     */
    router.get("/spotify/user/profile", spotifyController.getUserProfile);

    /**
     * @route GET /spotify/user/top-tracks
     * @desc Get user's top tracks
     */
    router.get("/spotify/user/top-tracks", spotifyController.getUserTopTracks);

    /**
     * @route GET /spotify/user/top-artists
     * @desc Get user's top artists
     */
    router.get("/spotify/user/top-artists", spotifyController.getUserTopArtists);

    /**
     * @route GET /spotify/user/saved-tracks
     * @desc Get user's saved tracks
     */
    router.get("/spotify/user/saved-tracks", spotifyController.getUserSavedTracks);

    /**
     * @route GET /spotify/user/saved-albums
     * @desc Get user's saved albums
     */
    router.get("/spotify/user/saved-albums", spotifyController.getUserSavedAlbums);

    /**
     * @route GET /spotify/user/followed-artists
     * @desc Get user's followed artists
     */
    router.get("/spotify/user/followed-artists", spotifyController.getUserFollowedArtists);

    // ==================== PLAYLIST ROUTES ====================

    /**
     * @route GET /spotify/playlists
     * @desc Get user's playlists
     */
    router.get("/spotify/playlists", spotifyController.getUserPlaylists);

    /**
     * @route GET /spotify/playlist/:id
     * @desc Get specific playlist
     */
    router.get("/spotify/playlist/:id", spotifyController.getPlaylist);

    /**
     * @route GET /spotify/playlist/:id/tracks
     * @desc Get playlist tracks
     */
    router.get("/spotify/playlist/:id/tracks", spotifyController.getPlaylistTracks);

    /**
     * @route POST /spotify/playlist
     * @desc Create new playlist
     */
    router.post("/spotify/playlist", spotifyController.createPlaylist);

    /**
     * @route POST /spotify/playlist/:id/tracks
     * @desc Add tracks to playlist
     */
    router.post("/spotify/playlist/:id/tracks", spotifyController.addTracksToPlaylist);

    // ==================== ARTIST ROUTES ====================

    /**
     * @route GET /spotify/artist/:id
     * @desc Get artist information
     */
    router.get("/spotify/artist/:id", spotifyController.getArtist);

    /**
     * @route GET /spotify/artist/:id/top-tracks
     * @desc Get artist's top tracks
     */
    router.get("/spotify/artist/:id/top-tracks", spotifyController.getArtistTopTracks);

    /**
     * @route GET /spotify/artist/:id/albums
     * @desc Get artist's albums
     */
    router.get("/spotify/artist/:id/albums", spotifyController.getArtistAlbums);

    /**
     * @route GET /spotify/artist/:id/related
     * @desc Get related artists
     */
    router.get("/spotify/artist/:id/related", spotifyController.getRelatedArtists);

    // ==================== ALBUM ROUTES ====================

    /**
     * @route GET /spotify/album/:id
     * @desc Get album information
     */
    router.get("/spotify/album/:id", spotifyController.getAlbum);

    /**
     * @route GET /spotify/album/:id/tracks
     * @desc Get album tracks
     */
    router.get("/spotify/album/:id/tracks", spotifyController.getAlbumTracks);

    // ==================== TRACK ROUTES ====================

    /**
     * @route GET /spotify/track/:id
     * @desc Get track information
     */
    router.get("/spotify/track/:id", spotifyController.getTrack);

    // ==================== SEARCH ROUTES ====================

    /**
     * @route GET /spotify/search
     * @desc Search for tracks, artists, albums, playlists
     */
    router.get("/spotify/search", spotifyController.search);

    // ==================== DISCOVERY ROUTES ====================

    /**
     * @route GET /spotify/new-releases
     * @desc Get new releases
     */
    router.get("/spotify/new-releases", spotifyController.getNewReleases);

    /**
     * @route GET /spotify/recommendations
     * @desc Get track recommendations
     */
    router.get("/spotify/recommendations", spotifyController.getRecommendations);

    /**
     * @route GET /spotify/featured-playlists
     * @desc Get featured playlists
     */
    router.get("/spotify/featured-playlists", spotifyController.getFeaturedPlaylists);

    // ==================== FOLLOW/UNFOLLOW ROUTES ====================

    /**
     * @route PUT /spotify/artist/:id/follow
     * @desc Follow an artist
     */
    router.put("/spotify/artist/:id/follow", spotifyController.followArtist);

    /**
     * @route DELETE /spotify/artist/:id/follow
     * @desc Unfollow an artist
     */
    router.delete("/spotify/artist/:id/follow", spotifyController.unfollowArtist);

    /**
     * @route PUT /spotify/playlist/:id/follow
     * @desc Follow a playlist
     */
    router.put("/spotify/playlist/:id/follow", spotifyController.followPlaylist);

    /**
     * @route DELETE /spotify/playlist/:id/follow
     * @desc Unfollow a playlist
     */
    router.delete("/spotify/playlist/:id/follow", spotifyController.unfollowPlaylist);

    // ==================== LEGACY ROUTES (for backward compatibility) ====================

    /**
     * @route GET /spotify/global_viral
     * @desc Get global viral playlists (legacy)
     */
    router.get("/spotify/global_viral", spotifyController.getGlobalViralPlaylists);

    // Mount the router
    app.use('/', router);
};
