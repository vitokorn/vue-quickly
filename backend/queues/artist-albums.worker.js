const {Worker} = require('bullmq');
const db = require('../models');

// Import helper functions from deezer controller
const deezerController = require('../controllers/deezer.controller.js');
const {getOrCreateArtist} = require("../controllers/deezer.controller");

// Job processor for fetching artist albums and labeling tracks
const artistAlbumsProcessor = async (job) => {
    const {artistId, limit = 50} = job.data;

    let offset = 0;
    // Get artist from database
    const artist = getOrCreateArtist({id: artistId});
    console.log(`Processing artist albums job for artist ID: ${artistId}`);
    while (true) {
        try {

            console.log(`Fetching albums for artist: ${artist.name}`);

            // Fetch artist albums from Deezer
            const albumsResponse = await deezerController.makeDeezerRequest(`/artist/${artist.deezer_id}/albums?offset=${offset}`);

            if (!albumsResponse || !albumsResponse.data) {
                console.log(`No albums found for artist: ${artist.name}`);
                return {success: true, albumsProcessed: 0, tracksProcessed: 0};
            }

            let albumsProcessed = 0;
            let tracksProcessed = 0;

            // Process each album
            for (const albumData of albumsResponse.data) {
                try {
                    // Get or create album (this will also create associations)
                    const album = await deezerController.getOrCreateAlbum(albumData);
                    if (album) {
                        albumsProcessed++;

                        // Fetch tracks for this album
                        const tracksResponse = await deezerController.makeDeezerRequest(`/album/${album.deezer_id}/tracks`);

                        if (tracksResponse && tracksResponse.data) {
                            // Process each track
                            for (const trackData of tracksResponse.data) {
                                try {
                                    // Get or create track (this will associate with artist and album)
                                    const track = await deezerController.getOrCreateTrack(trackData);
                                    if (track) {
                                        tracksProcessed++;

                                        // Try to get additional metadata for labeling
                                        if (trackData.album && trackData.album.label) {
                                            const label = await deezerController.getOrCreateLabel({
                                                name: trackData.album.label
                                            });

                                            // Associate label with artist if not already
                                            if (label && artist) {
                                                await deezerController.getOrCreateArtistLabel({
                                                    artist_id: artist.id,
                                                    label_id: label.id
                                                });
                                            }
                                        }
                                    }
                                } catch (trackError) {
                                    console.warn(`Failed to process track ${trackData.id}:`, trackError.message);
                                }
                            }
                        }
                    }
                } catch (albumError) {
                    console.warn(`Failed to process album ${albumData.id}:`, albumError.message);
                }
            }

            console.log(`Completed processing artist ${artist.name}: ${albumsProcessed} albums, ${tracksProcessed} tracks`);
            if (albumsResponse.next) {
                offset += 25
            }
            if (!albumsResponse.next) {
                break;
            }

        } catch (error) {
            console.error(`Job failed for artist ${artistId}:`, error);
            throw error;
        }

    }
};

// Create worker instance
const artistAlbumsWorker = new Worker(
    'fetch-artist-albums',
    artistAlbumsProcessor,
    {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            db: process.env.REDIS_DB || 0,
        },
        concurrency: 2, // Process 2 jobs concurrently
        limiter: {
            max: 10, // Maximum 10 jobs per duration
            duration: 60000, // per 60 seconds (respect API rate limits)
        },
    }
);

// Event listeners for monitoring
artistAlbumsWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

artistAlbumsWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err.message);
});

artistAlbumsWorker.on('stalled', (jobId) => {
    console.warn(`Job ${jobId} stalled`);
});

module.exports = {
    artistAlbumsWorker,
    artistAlbumsProcessor
};
