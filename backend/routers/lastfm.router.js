const lastfm = require("../controllers/lastfm.controller.js");

module.exports = app => {
    const router = require("express").Router();
    
    // Last.fm API key from environment variables
    const api_key = process.env.LASTFM_API_KEY;
    const secret = process.env.LASTFM_SECRET;

    // Authentication routes
    router.get("/lastfm/login", lastfm.login);
    router.get("/lastfm/callback", lastfm.callback);
    router.get("/lastfm/logout", lastfm.logout);

    // User data routes
    router.get("/lastfm/user/info", lastfm.getUserInfo);
    router.get("/lastfm/user/top-tracks", lastfm.getUserTopTracks);
    router.get("/lastfm/user/top-artists", lastfm.getUserTopArtists);
    router.get("/lastfm/user/top-albums", lastfm.getUserTopAlbums);
    router.get("/lastfm/user/recent-tracks", lastfm.getUserRecentTracks);
    router.get("/lastfm/user/loved-tracks", lastfm.getUserLovedTracks);
    router.get("/lastfm/user/friends", lastfm.getUserFriends);

    // Artist routes
    router.get("/lastfm/artist/info", lastfm.getArtistInfo);
    router.get("/lastfm/artist/top-tracks", lastfm.getArtistTopTracks);
    router.get("/lastfm/artist/top-albums", lastfm.getArtistTopAlbums);
    router.get("/lastfm/artist/similar", lastfm.getSimilarArtists);

    // Album routes
    router.get("/lastfm/album/info", lastfm.getAlbumInfo);
    router.get("/lastfm/album/top-tags", lastfm.getAlbumTopTags);

    // Track routes
    router.get("/lastfm/track/info", lastfm.getTrackInfo);
    router.get("/lastfm/track/similar", lastfm.getSimilarTracks);
    router.get("/lastfm/track/top-tags", lastfm.getTrackTopTags);

    // Search routes
    router.get("/lastfm/search/artist", lastfm.searchArtists);
    router.get("/lastfm/search/album", lastfm.searchAlbums);
    router.get("/lastfm/search/track", lastfm.searchTracks);

    // Scrobbling routes (requires authentication)
    router.post("/lastfm/track/scrobble", lastfm.scrobbleTrack);
    router.post("/lastfm/track/love", lastfm.loveTrack);
    router.post("/lastfm/track/unlove", lastfm.unloveTrack);

    // Chart routes
    router.get("/lastfm/chart/top-tracks", lastfm.getTopTracks);
    router.get("/lastfm/chart/top-artists", lastfm.getTopArtists);
    router.get("/lastfm/chart/top-tags", lastfm.getTopTags);

    // Tag routes
    router.get("/lastfm/tag/info", lastfm.getTagInfo);
    router.get("/lastfm/tag/top-artists", lastfm.getTagTopArtists);
    router.get("/lastfm/tag/top-albums", lastfm.getTagTopAlbums);
    router.get("/lastfm/tag/top-tracks", lastfm.getTagTopTracks);

    // ==================== DEEZER INTEGRATION ROUTES ====================
    
    /**
     * @route GET /lastfm/similar-tracks-for-deezer
     * @desc Get similar tracks from Last.fm and search them in Deezer
     * @query {string} artist - Artist name
     * @query {string} track - Track name
     * @query {number} limit - Number of similar tracks to fetch (default: 10)
     */
    router.get("/lastfm/similar-tracks-for-deezer", lastfm.getSimilarTracksForDeezer);

    app.use('/', router);
};
