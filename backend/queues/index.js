const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

// Redis connection configuration
const redisConnection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
});

// Queue configuration
const queues = {
    artistAlbums: new Queue('fetch-artist-albums', {
        connection: redisConnection,
        defaultJobOptions: {
            removeOnComplete: 100,
            removeOnFail: 50,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        },
    }),
    labelTracks: new Queue('fetch-label-tracks', {
        connection: redisConnection,
        defaultJobOptions: {
            removeOnComplete: 50,
            removeOnFail: 25,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        },
    }),
};

// Import and start workers
const { artistAlbumsWorker } = require('./artist-albums.worker');
const { labelTracksWorker } = require('./label-tracks.worker');

module.exports = {
    queues,
    redisConnection,
    workers: {
        artistAlbumsWorker,
        labelTracksWorker
    }
};
