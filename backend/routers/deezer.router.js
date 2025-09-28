const deezerController = require("../controllers/deezer.controller.js");
const { queues } = require("../queues");
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

    /**
     * @route GET /deezer/radio/artist/:artistId
     * @desc Create comprehensive radio based on a seed artist using Last.fm data
     * @param {string} artistId - Deezer artist ID
     * @query {number} limit - Maximum number of tracks to return (default: 27)
     * @access Public
     */
    router.get("/deezer/radio/artist/:artistId", deezerController.createArtistRadio);

    // ==================== QUEUE MANAGEMENT ROUTES ====================

    /**
     * @route POST /deezer/jobs/fetch-artist-albums
     * @desc Queue a job to fetch albums and label tracks for an artist
     * @body {number} artistId - Database artist ID
     * @body {number} limit - Maximum albums to fetch (default: 50)
     * @access Public
     */
    router.post("/deezer/jobs/fetch-artist-albums", async (req, res) => {
        try {
            const { artistId, limit = 50 } = req.body;

            if (!artistId) {
                return res.status(400).json({ error: 'Artist ID is required' });
            }

            // Add job to queue
            const job = await queues.artistAlbums.add('fetch-artist-albums', {
                artistId: parseInt(artistId),
                limit: parseInt(limit)
            });

            res.json({
                success: true,
                jobId: job.id,
                message: 'Artist albums fetch job queued successfully'
            });

        } catch (error) {
            console.error('Error queuing artist albums job:', error);
            res.status(500).json({
                error: 'Failed to queue job',
                details: error.message
            });
        }
    });

    /**
     * @route POST /deezer/jobs/fetch-all-artists-albums
     * @desc Queue jobs to fetch albums for all artists in the database
     * @body {number} limit - Maximum albums per artist (default: 50)
     * @body {number} batchSize - Number of artists to process per batch (default: 10)
     * @access Public
     */
    router.post("/deezer/jobs/fetch-all-artists-albums", async (req, res) => {
        try {
            const { limit = 50, batchSize = 10 } = req.body;
            const db = require('../models');

            // Get all artists from database
            const artists = await db.Artist.findAll({
                limit: 1000, // Limit to prevent overwhelming the queue
                order: [['updatedAt', 'ASC']] // Process oldest first
            });

            if (artists.length === 0) {
                return res.status(404).json({ error: 'No artists found in database' });
            }

            const jobIds = [];

            // Queue jobs in batches
            for (let i = 0; i < artists.length; i += batchSize) {
                const batch = artists.slice(i, i + batchSize);

                for (const artist of batch) {
                    try {
                        const job = await queues.artistAlbums.add('fetch-artist-albums', {
                            artistId: artist.id,
                            limit: parseInt(limit)
                        });
                        jobIds.push(job.id);
                    } catch (jobError) {
                        console.warn(`Failed to queue job for artist ${artist.id}:`, jobError.message);
                    }
                }

                // Small delay between batches to prevent overwhelming Redis
                if (i + batchSize < artists.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            res.json({
                success: true,
                totalArtists: artists.length,
                jobsQueued: jobIds.length,
                jobIds: jobIds.slice(0, 10), // Return first 10 job IDs
                message: `Queued ${jobIds.length} artist albums fetch jobs`
            });

        } catch (error) {
            console.error('Error queuing all artists albums jobs:', error);
            res.status(500).json({
                error: 'Failed to queue jobs',
                details: error.message
            });
        }
    });

    /**
     * @route GET /deezer/jobs/status/:jobId
     * @desc Get the status of a queued job
     * @param {string} jobId - BullMQ job ID
     * @access Public
     */
    router.get("/deezer/jobs/status/:jobId", async (req, res) => {
        try {
            const { jobId } = req.params;

            // Try to get job from artist albums queue
            let job = await queues.artistAlbums.getJob(jobId);

            // If not found, try label tracks queue
            if (!job) {
                job = await queues.labelTracks.getJob(jobId);
            }

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }

            const state = await job.getState();
            const progress = job.progress;

            res.json({
                jobId: job.id,
                state,
                progress,
                data: job.data,
                opts: job.opts,
                attemptsMade: job.attemptsMade,
                finishedOn: job.finishedOn,
                processedOn: job.processedOn,
                failedReason: job.failedReason
            });

        } catch (error) {
            console.error('Error getting job status:', error);
            res.status(500).json({
                error: 'Failed to get job status',
                details: error.message
            });
        }
    });

    /**
     * @route POST /deezer/jobs/fetch-label-tracks
     * @desc Queue a job to fetch tracks for a specific label
     * @body {string} labelName - Name of the label to search for
     * @body {number} limit - Maximum tracks to fetch (default: 100)
     * @body {number} offset - Search offset (default: 0)
     * @body {number} delay - Delay in milliseconds before job starts (default: 0)
     * @access Public
     */
    router.post("/deezer/jobs/fetch-label-tracks", async (req, res) => {
        try {
            const { labelName, limit = 100, offset = 0, delay = 0 } = req.body;

            if (!labelName || typeof labelName !== 'string') {
                return res.status(400).json({ error: 'Valid labelName is required' });
            }

            // Add job to queue with optional delay
            const job = await queues.labelTracks.add('fetch-label-tracks', {
                labelName: labelName.trim(),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }, {
                delay: parseInt(delay) // Delay in milliseconds
            });

            res.json({
                success: true,
                jobId: job.id,
                message: `Label tracks fetch job queued for "${labelName}"${delay > 0 ? ` with ${delay}ms delay` : ''}`
            });

        } catch (error) {
            console.error('Error queuing label tracks job:', error);
            res.status(500).json({
                error: 'Failed to queue job',
                details: error.message
            });
        }
    });

    /**
     * @route POST /deezer/jobs/fetch-labels-tracks-batch
     * @desc Queue jobs to fetch tracks for multiple labels
     * @body {string[]} labelNames - Array of label names to process
     * @body {number} limit - Maximum tracks per label (default: 100)
     * @body {number} delayBetweenJobs - Delay between jobs in milliseconds (default: 10000)
     * @access Public
     */
    router.post("/deezer/jobs/fetch-labels-tracks-batch", async (req, res) => {
        try {
            const { labelNames, limit = 100, delayBetweenJobs = 10000 } = req.body;

            if (!Array.isArray(labelNames) || labelNames.length === 0) {
                return res.status(400).json({ error: 'labelNames array is required and cannot be empty' });
            }

            const jobIds = [];
            let currentDelay = 0;

            for (const labelName of labelNames) {
                if (typeof labelName === 'string' && labelName.trim()) {
                    try {
                        const job = await queues.labelTracks.add('fetch-label-tracks', {
                            labelName: labelName.trim(),
                            limit: parseInt(limit),
                            offset: 0
                        }, {
                            delay: currentDelay
                        });

                        jobIds.push({
                            labelName: labelName.trim(),
                            jobId: job.id,
                            delay: currentDelay
                        });

                        currentDelay += parseInt(delayBetweenJobs);
                    } catch (jobError) {
                        console.warn(`Failed to queue job for label "${labelName}":`, jobError.message);
                    }
                }
            }

            res.json({
                success: true,
                totalLabels: labelNames.length,
                jobsQueued: jobIds.length,
                jobDetails: jobIds,
                message: `Queued ${jobIds.length} label tracks fetch jobs with ${delayBetweenJobs}ms spacing`
            });

        } catch (error) {
            console.error('Error queuing batch label tracks jobs:', error);
            res.status(500).json({
                error: 'Failed to queue jobs',
                details: error.message
            });
        }
    });

    // ==================== CACHE MANAGEMENT ROUTES ====================

    /**
     * @route GET /deezer/cache/lastfm/stats
     * @desc Get Last.fm cache statistics
     * @access Public
     */
    router.get("/deezer/cache/lastfm/stats", deezerController.getLastfmCacheStats);

    /**
     * @route POST /deezer/cache/lastfm/clear
     * @desc Clear Last.fm cache
     * @access Public
     */
    router.post("/deezer/cache/lastfm/clear", deezerController.clearLastfmCache);

    // Mount the router
    app.use('/', router);
};
