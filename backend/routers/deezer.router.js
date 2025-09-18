const deezerController = require("../controllers/deezer.controller.js");
const express = require("express");

module.exports = (app) => {
    const router = express.Router();

    // ==================== RADIO ROUTES ====================

    /**
     * @route GET /deezer/radio/track/:trackId
     * @desc Create comprehensive radio based on a seed track
     * @param {string} trackId - Deezer track ID
     * @query {number} limit - Maximum number of tracks to return (default: 20)
     * @access Public
     */
    router.get("/deezer/radio/track/:trackId", deezerController.createRadioByTrack);

    /**
     * @route GET /deezer/radio/track/:trackId/simple
     * @desc Create simple radio based on artist radio (fallback)
     * @param {string} trackId - Deezer track ID
     * @query {number} limit - Maximum number of tracks to return (default: 20)
     * @access Public
     */
    router.get("/deezer/radio/track/:trackId/simple", deezerController.createSimpleRadio);

    /**
     * @route GET /deezer/radio/track/:trackId/related
     * @desc Create related radio based on Last.fm artist relationships (recursive discovery)
     * @param {string} trackId - Deezer track ID
     * @query {number} limit - Maximum number of tracks to return (default: 27)
     * @access Public
     */
    router.get("/deezer/radio/track/:trackId/related", deezerController.createRelatedRadio);

    // Mount the router
    app.use('/', router);
};
