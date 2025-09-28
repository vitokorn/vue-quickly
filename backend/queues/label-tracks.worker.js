const {Worker} = require('bullmq');
const db = require('../models');

// Import helper functions from deezer controller
const deezerController = require('../controllers/deezer.controller.js');

// Job processor for fetching tracks by label
const labelTracksProcessor = async (job) => {
    let {labelName, limit = 100, offset = 0} = job.data;

    console.log(`Processing label tracks job for label: ${labelName} (limit: ${limit}, offset: ${offset})`);
    while (true) {
        try {
            // Search Deezer for tracks by label
            const searchQuery = `label:"${labelName}"`;
            const searchResponse = await deezerController.makeDeezerRequest(`/search?q=${encodeURIComponent(searchQuery)}&index=${offset}`);

            if (!searchResponse || !searchResponse.data || searchResponse.data.length === 0) {
                console.log(`No tracks found for label: ${labelName}`);
                return {success: true, tracksProcessed: 0, labelName};
            }

            let tracksProcessed = 0;
            const tracks = searchResponse.data;

            console.log(`Found ${tracks.length} tracks for label: ${labelName}`);

            // Get or create the label
            const label = await deezerController.getOrCreateLabel({name: labelName});
            if (!label) {
                throw new Error(`Failed to create/get label: ${labelName}`);
            }
            console.log(`Offset ${offset} tracks for label: ${labelName}`);
            if (offset === 0 && tracks.length > 1) {
                let dbLabel = await db.Label.findOne({
                    where: {label_name: labelName}
                })
                if (dbLabel) {
                    let dbTracks = await db.Track.count({
                        where: { deezer_id: dbLabel.id }
                    });
                    if (dbTracks === searchResponse.total) {
                        break;
                    }
                }
            }

            // Process each track
            for (const trackData of tracks) {
                try {
                    // Get or create track (this will also create artist and album associations)
                    const track = await deezerController.getOrCreateTrack({
                        ...trackData,
                        album: {
                            ...trackData.album,
                            label: labelName // Ensure the label information is included
                        }
                    });
                    if (track) {
                        tracksProcessed++;

                        // If we have an artist, associate them with the label
                        if (trackData.artist) {
                            const artist = await deezerController.getOrCreateArtist(trackData.artist);
                            if (artist) {
                                await deezerController.getOrCreateArtistLabel({
                                    artist_id: artist.id,
                                    label_id: label.id
                                });
                            }
                        }

                        // Try to get genres for the artist from Last.fm
                        try {
                            if (trackData.artist && trackData.artist.name) {
                                const lastfmGenres = await deezerController.getGenresFromLastfm(trackData.artist.name);

                                for (const genreName of lastfmGenres) {
                                    const genre = await deezerController.getOrCreateGenre({
                                        name: genreName
                                    });

                                    // Associate genre with label
                                    if (genre) {
                                        await deezerController.getOrCreateLabelGenre({
                                            label_id: label.id,
                                            genre_id: genre.id
                                        });
                                    }
                                }
                            }
                        } catch (genreError) {
                            console.warn(`Failed to get genres for artist ${trackData.artist?.name}:`, genreError.message);
                        }
                    }

                    // Add a small delay between track processing to respect rate limits
                    if (tracksProcessed % 10 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                } catch (trackError) {
                    console.warn(`Failed to process track ${trackData.id}:`, trackError.message);
                }
            }
            if (offset > searchResponse.total) {
                break;
            }
            if (searchResponse.next) {
                offset += 25
            }
            if (!searchResponse.next) {
                break;
            }

            console.log(`Completed processing label ${labelName}`, searchResponse.next, searchResponse.total);

        } catch (error) {
            console.error(`Job failed for label ${labelName}:`, error);
            throw error;
        }
    }
};

// Create worker instance
const labelTracksWorker = new Worker(
    'fetch-label-tracks',
    labelTracksProcessor,
    {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            db: process.env.REDIS_DB || 0,
        },
        concurrency: 1, // Process one label job at a time to avoid overwhelming
        limiter: {
            max: 5, // Maximum 5 label jobs per duration
            duration: 60000, // per 60 seconds (respect API rate limits)
        },
    }
);

// Event listeners for monitoring
labelTracksWorker.on('completed', (job) => {
    console.log(`Label tracks job ${job.id} completed successfully`);
});

labelTracksWorker.on('failed', (job, err) => {
    console.error(`Label tracks job ${job.id} failed with error:`, err.message);
});

labelTracksWorker.on('stalled', (jobId) => {
    console.warn(`Label tracks job ${jobId} stalled`);
});

module.exports = {
    labelTracksWorker,
    labelTracksProcessor
};
