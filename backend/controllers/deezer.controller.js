const axios = require('axios');
const db = require('../models');

// Deezer API configuration
const DEEZER_BASE_URL = 'https://api.deezer.com';
const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org/ws/2';
const GENRES_LIST = ["electronic", "dance", "house", "techno", "trance", "drum & bass", "dnb", "d&b", "dubstep", "hardcore", "breakbeat", "downtempo", "moombahton", "complextro", "glitch hop", "electroclash", "rock", "metal", "pop", "hip-hop", "hip hop", "rap", "r&b", "soul", "funk", "jazz", "classical", "folk", "country", "reggae", "chillhop", "synthwave", "vaporwave", "edm", "opera", "minimalism", "modernism"]
const BEATPORT_GENRE_MAPPING = {
    "140 / Deep Dubstep / Grime": "dubstep",
    "Afro House": "house",
    "Amapiano": "house",
    "Ambient / Experimental": "electronic",
    "Bass / Club": "electronic",
    "Bass House": "house",
    "Brazilian Funk": "funk",
    "Breaks / Breakbeat / UK Bass": "breakbeat",
    "Dance / Pop": "pop",
    "Deep House": "house",
    "Downtempo": "downtempo",
    "Drum & Bass": "drum & bass",
    "Dubstep": "dubstep",
    "Electro (Classic / Detroit / Modern)": "electronic",
    "Electronica": "electronic",
    "Funky House": "house",
    "Hard Dance / Hardcore / Neo Rave": "hardcore",
    "Hard Techno": "techno",
    "House": "house",
    "Indie Dance": "dance",
    "Jackin House": "house",
    "Mainstage": "edm",
    "Melodic House & Techno": "house",
    "Minimal / Deep Tech": "minimalism",
    "Nu Disco / Disco": "funk",
    "Organic House": "house",
    "Progressive House": "house",
    "Psy-Trance": "trance",
    "Tech House": "house",
    "Techno (Peak Time / Driving)": "techno",
    "Techno (Raw / Deep / Hypnotic)": "techno",
    "Trance (Main Floor)": "trance",
    "Trance (Raw / Deep / Hypnotic)": "trance",
    "Trap / Future Bass": "trap",
    "UK Garage / Bassline": "garage",
    "African": "folk",
    "Caribbean": "reggae",
    "Hip-Hop": "hip-hop",
    "Latin": "latin",
    "Pop": "pop",
    "R&B": "r&b"
};

// Helper function to make Deezer API requests
const makeDeezerRequest = async (endpoint) => {
    try {
        const response = await axios.get(`${DEEZER_BASE_URL}${endpoint}`);
        return response.data;
    } catch (error) {
        console.error('Deezer API Error:', error.response?.data || error.message);
        throw error;
    }
};

// Helper function to make MusicBrainz API requests (now uses optimized version)
const makeMusicBrainzRequest = async (endpoint, params = {}) => {
    return makeOptimizedMusicBrainzRequest(endpoint, params);
};

// ==================== CACHE SYSTEM ====================

/**
 * Enhanced in-memory cache for Last.fm API requests with size limits and better error handling
 */
class LastfmCache {
    constructor(options = {}) {
        this.cache = new Map();
        this.defaultTTL = options.defaultTTL || 30 * 60 * 1000; // 30 minutes default
        this.maxSize = options.maxSize || 1000; // Maximum cache entries
        this.cleanupInterval = options.cleanupInterval || 10 * 60 * 1000; // 10 minutes
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0
        };

        // Start periodic cleanup
        this.startCleanup();
    }

    /**
     * Generate cache key from method and parameters
     * @param {string} method - API method name
     * @param {object} params - Request parameters
     * @returns {string} Cache key
     */
    generateKey(method, params) {
        if (typeof method !== 'string' || !params || typeof params !== 'object') {
            throw new TypeError('Invalid method or params');
        }

        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        return `${method}:${sortedParams}`;
    }

    /**
     * Get cached data if not expired
     * @param {string} method - API method name
     * @param {object} params - Request parameters
     * @returns {object|null} Cached data or null
     */
    get(method, params) {
        try {
            const key = this.generateKey(method, params);
            const cached = this.cache.get(key);

            if (!cached) {
                this.stats.misses++;
                console.log(`📭 Cache MISS for Last.fm ${method}`);
                return null;
            }

            if (Date.now() >= cached.expires) {
                this.cache.delete(key);
                this.stats.evictions++;
                console.log(`⏰ Cache EXPIRED for Last.fm ${method}`);
                return null;
            }

            this.stats.hits++;
            console.log(`📦 Cache HIT for Last.fm ${method}`);
            return cached.data;
        } catch (error) {
            console.error(`Cache get error for ${method}:`, error.message);
            return null;
        }
    }

    /**
     * Store data in cache with TTL
     * @param {string} method - API method name
     * @param {object} params - Request parameters
     * @param {object} data - Data to cache
     * @param {number|null} ttl - Custom TTL in milliseconds
     */
    set(method, params, data, ttl = null) {
        try {
            // Evict oldest entry if cache is full
            if (this.cache.size >= this.maxSize) {
                const oldestKey = this.cache.keys().next().value;
                this.cache.delete(oldestKey);
                this.stats.evictions++;
                console.log(`🗑️ Cache evicted oldest entry due to size limit`);
            }

            const key = this.generateKey(method, params);
            const expires = Date.now() + (ttl || this.defaultTTL);

            this.cache.set(key, {
                data: structuredClone(data), // Deep copy to prevent external mutations
                expires,
                created: Date.now()
            });

            console.log(`💾 Cache STORED for Last.fm ${method} (expires in ${Math.round((ttl || this.defaultTTL) / 60000)} minutes)`);
        } catch (error) {
            console.error(`Cache set error for ${method}:`, error.message);
        }
    }

    /**
     * Clear expired entries from cache
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, value] of this.cache.entries()) {
            if (now >= value.expires) {
                this.cache.delete(key);
                cleaned++;
                this.stats.evictions++;
            }
        }

        if (cleaned > 0) {
            console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
        }
    }

    /**
     * Start periodic cleanup
     */
    startCleanup() {
        this.cleanupIntervalId = setInterval(() => this.cleanup(), this.cleanupInterval);
    }

    /**
     * Stop periodic cleanup
     */
    stopCleanup() {
        if (this.cleanupIntervalId) {
            clearInterval(this.cleanupIntervalId);
            this.cleanupIntervalId = null;
        }
    }

    /**
     * Get cache statistics
     * @returns {object} Cache statistics
     */
    getStats() {
        const now = Date.now();
        let active = 0;

        for (const value of this.cache.values()) {
            if (now < value.expires) {
                active++;
            }
        }

        return {
            total: this.cache.size,
            active,
            expired: this.cache.size - active,
            ...this.stats,
            hitRatio: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
        };
    }

    /**
     * Clear all cache entries
     */
    clear() {
        const size = this.cache.size;
        this.cache.clear();
        this.stats = {hits: 0, misses: 0, evictions: 0};
        console.log(`🗑️ Cache cleared: removed ${size} entries`);
    }
}

// Create global cache instance with configuration
const lastfmCache = new LastfmCache({
    defaultTTL: 30 * 60 * 1000,
    maxSize: 1000,
    cleanupInterval: 10 * 60 * 1000
});

/**
 * Make cached Last.fm API request
 * @param {string} method - API method name
 * @param {object} params - Request parameters
 * @param {number|null} ttl - Custom TTL in milliseconds
 * @returns {Promise<object|null>} API response or null
 */
async function makeCachedLastfmRequest(method, params = {}, ttl = null) {
    try {
        // Validate inputs
        if (typeof method !== 'string' || !params || typeof params !== 'object') {
            throw new TypeError('Invalid method or params');
        }

        // Check cache first
        const cached = lastfmCache.get(method, params);
        if (cached) {
            return cached;
        }

        // Validate API key
        const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
        if (!LASTFM_API_KEY) {
            throw new Error('Last.fm API key not configured');
        }

        // Make API request
        const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
            params: {
                method,
                api_key: LASTFM_API_KEY,
                format: 'json',
                ...params
            },
            timeout: 10000 // 10 second timeout
        });

        // Cache successful responses
        if (response.data && !response.data.error) {
            lastfmCache.set(method, params, response.data, ttl);
            return response.data;
        }

        throw new Error(response.data?.message || 'Invalid API response');
    } catch (error) {
        console.error(`Last.fm API request failed for ${method}:`, error.message);
        return null;
    }
}

// Helper function to extract featured artists from track names
const extractFeaturedArtists = (trackName) => {
    if (!trackName) return [];

    const featuredArtists = [];

    // Regex patterns to match ft., feat., featuring, with
    const patterns = [
        // Match ft./feat./featuring/with followed by artist name (until comma, parenthesis, or end)
        /\b(?:ft\.?|feat\.?|featuring|with)\s+([^,()]+?)(?=,|\(|$)/gi,
        // Match in parentheses
        /\(ft\.?\s+([^)]+)\)/gi,
        /\(feat\.?\s+([^)]+)\)/gi,
        /\(featuring\s+([^)]+)\)/gi,
        /\(with\s+([^)]+)\)/gi
    ];

    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(trackName)) !== null) {
            const artistName = match[1].trim();
            // Filter out common false positives
            if (artistName &&
                !['here', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with'].includes(artistName.toLowerCase()) &&
                !featuredArtists.includes(artistName)) {
                featuredArtists.push(artistName);
            }
        }
    });

    return featuredArtists;
};

// Helper function to extract remix information from track names
const extractRemixInfo = (trackName) => {
    if (!trackName) return {isRemix: false, remixArtist: null, originalTitle: trackName};

    const remixInfo = {
        isRemix: false,
        remixArtist: null,
        originalTitle: trackName
    };

    // Common remix patterns (ordered by specificity)
    const remixPatterns = [
        // Pattern: "Original Title (Artist Remix)" - most common
        /^(.+?)\s*\(([^)]+?)\s+(?:remix|mix|edit|version|rework|bootleg)\)$/i,
        // Pattern: "Original Title - Artist Remix"
        /^(.+?)\s*-\s*([^)]+?)\s+(?:remix|mix|edit|version|rework|bootleg)$/i,
        // Pattern: "Original Title [Artist Remix]"
        /^(.+?)\s*\[([^)]+?)\s+(?:remix|mix|edit|version|rework|bootleg)\]$/i,
        // Pattern: "Artist Remix of Original Title"
        /^([^)]+?)\s+(?:remix|mix|edit|version|rework|bootleg)\s+of\s+(.+)$/i,
        // Pattern: "Original Title (Remix by Artist)"
        /^(.+?)\s*\(remix\s+by\s+([^)]+?)\)$/i,
        // Pattern: "Original Title (Artist's Remix)"
        /^(.+?)\s*\(([^)]+?)'s\s+(?:remix|mix|edit|version|rework|bootleg)\)$/i,
        // Pattern: "Original Title - Artist's Remix"
        /^(.+?)\s*-\s*([^)]+?)'s\s+(?:remix|mix|edit|version|rework|bootleg)$/i,
        // Pattern: "Original Title (Artist Style Remix)" - handles complex remix names
        /^(.+?)\s*\(([^)]+?)\s+(?:style|vibe|flavor|take|interpretation)\s+(?:remix|mix|edit|version|rework|bootleg)\)$/i,
        // Pattern: "Original Title (Artist Presents Remix)"
        /^(.+?)\s*\(([^)]+?)\s+presents?\s+(?:remix|mix|edit|version|rework|bootleg)\)$/i
    ];

    for (const pattern of remixPatterns) {
        const match = trackName.match(pattern);
        if (match) {
            remixInfo.isRemix = true;

            // Determine which group is the artist and which is the original title
            if (pattern.source.includes('of\\s+')) {
                // Pattern: "Artist Remix of Original Title"
                remixInfo.remixArtist = match[1].trim();
                remixInfo.originalTitle = match[2].trim();
            } else {
                // Most patterns: "Original Title (Artist Remix)"
                remixInfo.originalTitle = match[1].trim();
                remixInfo.remixArtist = match[2].trim();
            }

            // Clean up the remix artist name (remove common suffixes and extra words)
            remixInfo.remixArtist = remixInfo.remixArtist
                .replace(/\s+(?:remix|mix|edit|version|rework|bootleg)$/i, '')
                .replace(/\s+(?:style|vibe|flavor|take|interpretation|presents?)$/i, '')
                .replace(/\s+(?:night|day|drive|session|experience|journey)$/i, '') // Remove common descriptive words
                .trim();

            break;
        }
    }

    return remixInfo;
};

// Helper function to get track popularity score
const getTrackPopularity = (track) => {
    if (track.rank && typeof track.rank === 'number') {
        return Math.min(100, Math.max(0, Math.round(track.rank / 10000)));
    }
    if (track.popularity && typeof track.popularity === 'number') {
        return Math.min(100, Math.max(0, track.popularity));
    }
    if (track.duration && track.duration > 0) {
        return Math.min(100, Math.max(10, track.duration / 300));
    }
    return 50;
};

// Helper function to filter tracks by popularity range
const filterByPopularityRange = (tracks, targetPopularity, tolerance = 20) => {
    const minPopularity = Math.max(0, targetPopularity - tolerance);
    const maxPopularity = Math.min(100, targetPopularity + tolerance);

    return tracks.filter(track => {
        const popularity = getTrackPopularity(track);
        return popularity >= minPopularity && popularity <= maxPopularity;
    });
};

// Helper function to shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// ==================== DATABASE CACHE HELPERS ====================

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Get or create artist from database with caching
 */
async function getOrCreateArtist(deezerArtistData) {
  try {
    if (!deezerArtistData || !deezerArtistData.id) return null;

    // Check if artist exists in DB and is recent
    let artist = await db.Artist.findOne({
      where: { deezer_id: deezerArtistData.id }
    });

    if (artist && (Date.now() - new Date(artist.updatedAt).getTime()) < ONE_MONTH_MS) {
      console.log(`Using cached artist: ${artist.name}`);
      return artist;
    }

    // Fetch fresh data from Deezer
    const freshArtistData = await makeDeezerRequest(`/artist/${deezerArtistData.id}`);
    if (!freshArtistData) return artist; // Return old data if fetch fails

    // Update or create artist
    const artistData = {
      name: freshArtistData.name,
      deezer_id: freshArtistData.id
    };

    if (artist) {
      await artist.update(artistData);
      console.log(`Updated cached artist: ${artist.name}`);
    } else {
      artist = await db.Artist.create(artistData);
      console.log(`Created new artist: ${artist.name}`);
    }

    return artist;
  } catch (error) {
    console.warn('Error in getOrCreateArtist:', error.message);
    return null;
  }
}

/**
 * Get or create album from database with caching
 */
async function getOrCreateAlbum(deezerAlbumData) {
  try {
    if (!deezerAlbumData || !deezerAlbumData.id) return null;

    let album = await db.Album.findOne({
      where: { deezer_id: deezerAlbumData.id }
    });

    if (album && (Date.now() - new Date(album.updatedAt).getTime()) < ONE_MONTH_MS) {
      console.log(`Using cached album: ${album.title}`);
      return album;
    }

    // Fetch fresh data
    const freshAlbumData = await makeDeezerRequest(`/album/${deezerAlbumData.id}`);
    if (!freshAlbumData) return album;

    // Get or create label if exists
    let labelId = null;
    if (freshAlbumData.label) {
      const label = await getOrCreateLabel({ name: freshAlbumData.label });
      labelId = label ? label.id : null;
    }

    const albumData = {
      title: freshAlbumData.title,
      release_date: freshAlbumData.release_date ? new Date(freshAlbumData.release_date) : null,
      type: freshAlbumData.type,
      duration: freshAlbumData.duration,
      cover: freshAlbumData.cover,
      label_id: labelId,
      deezer_id: freshAlbumData.id
    };

    if (album) {
      await album.update(albumData);
      console.log(`Updated cached album: ${album.title}`);
    } else {
      album = await db.Album.create(albumData);
      console.log(`Created new album: ${album.title}`);
    }

    return album;
  } catch (error) {
    console.warn('Error in getOrCreateAlbum:', error.message);
    return null;
  }
}

/**
 * Get or create track from database with caching
 */
async function getOrCreateTrack(deezerTrackData) {
  try {
    if (!deezerTrackData || !deezerTrackData.id) return deezerTrackData; // Return raw data if no ID

    // Check if we need to fetch full track data from Deezer API
    const needsFullData = !deezerTrackData.isrc || !deezerTrackData.release_date || !deezerTrackData.bpm || !deezerTrackData.gain;
    if (needsFullData) {
      console.log(`Fetching full track data for ${deezerTrackData.id} (missing fields: ${[
        !deezerTrackData.isrc && 'isrc',
        !deezerTrackData.release_date && 'release_date',
        !deezerTrackData.gain && 'gain'
      ].filter(Boolean).join(', ')})`);

      try {
        const fullTrackData = await makeDeezerRequest(`/track/${deezerTrackData.id}`);
        if (fullTrackData) {
          // Merge the full data with existing data
          deezerTrackData = { ...deezerTrackData, ...fullTrackData };
        }
      } catch (fetchError) {
        console.warn(`Failed to fetch full track data for ${deezerTrackData.id}:`, fetchError.message);
        // Continue with partial data
      }
    }

    let track = await db.Track.findOne({
      where: { deezer_id: deezerTrackData.id }
    });

    if (track && (Date.now() - new Date(track.updatedAt).getTime()) < ONE_MONTH_MS) {
      console.log(`Using cached track: ${track.title}`);
      // Return enriched track data
      return {
        ...deezerTrackData,
        db_track: track
      };
    }

    // Get or create album
    let album = null;
    if (deezerTrackData.album) {
      album = await getOrCreateAlbum(deezerTrackData.album);
    }

    // Get or create artist
    let artist = null;
    if (deezerTrackData.artist) {
      artist = await getOrCreateArtist(deezerTrackData.artist);

    }

    const trackData = {
      title: deezerTrackData.title,
      title_short: deezerTrackData.title_short,
      isrc: deezerTrackData.isrc,
      duration: deezerTrackData.duration,
      rank: deezerTrackData.rank,
      release_date: deezerTrackData.release_date ? new Date(deezerTrackData.release_date) : null,
      bpm: deezerTrackData.bpm,
      gain: deezerTrackData.gain,
      album_id: album ? album.id : null,
      deezer_id: deezerTrackData.id
    };

    if (track) {
      await track.update(trackData);
      console.log(`Updated cached track: ${track.title}`);
    } else {
      track = await db.Track.create(trackData);
      console.log(`Created new track: ${track.title}`);
    }

    // Associate with artist
    if (artist && track) {
      await db.TrackArtists.findOrCreate({
        where: {
          track_id: track.id,
          artist_id: artist.id
        }
      });
    }

    return {
      ...deezerTrackData,
      db_track: track
    };
  } catch (error) {
    console.warn('Error in getOrCreateTrack:', error.message);
    return deezerTrackData;
  }
}

/**
 * Get or create label from database
 */
async function getOrCreateLabel(labelData) {
  try {
    if (!labelData || !labelData.name) return null;

    let label = await db.Label.findOne({
      where: { label_name: labelData.name }
    });

    if (label && (Date.now() - new Date(label.updatedAt).getTime()) < ONE_MONTH_MS) {
      return label;
    }

    const newLabelData = {
      label_name: labelData.name,
      musicbrainz_id: labelData.musicbrainz_id || null,
      beatport_id: labelData.beatport_id || null
    };

    if (label) {
      await label.update(newLabelData);
    } else {
      label = await db.Label.create(newLabelData);
    }

    return label;
  } catch (error) {
    console.warn('Error in getOrCreateLabel:', error.message);
    return null;
  }
}

/**
 * Get or create genre from database
 */
async function getOrCreateGenre(genreData) {
  try {
    if (!genreData || !genreData.name) return null;

    let genre = await db.Genre.findOne({
      where: { name: genreData.name }
    });

    if (genre && (Date.now() - new Date(genre.updatedAt).getTime()) < ONE_MONTH_MS) {
      return genre;
    }

    const newGenreData = {
      name: genreData.name,
      musicbrainz_id: genreData.musicbrainz_id || null,
      beatport_id: genreData.beatport_id || null
    };

    if (genre) {
      await genre.update(newGenreData);
    } else {
      genre = await db.Genre.create(newGenreData);
    }

    return genre;
  } catch (error) {
    console.warn('Error in getOrCreateGenre:', error.message);
    return null;
  }
}

/**
 * Get or create artist-label association from database
 */
async function getOrCreateArtistLabel(artistLabelData) {
  try {
    if (!artistLabelData || !artistLabelData.artist_id || !artistLabelData.label_id) return null;

    let artistLabel = await db.ArtistsLabels.findOne({
      where: {
        artist_id: artistLabelData.artist_id,
        label_id: artistLabelData.label_id
      }
    });

    if (artistLabel) {
      return artistLabel;
    }

    // Create new association
    artistLabel = await db.ArtistsLabels.create({
      artist_id: artistLabelData.artist_id,
      label_id: artistLabelData.label_id
    });

    return artistLabel;
  } catch (error) {
    console.warn('Error in getOrCreateArtistLabel:', error.message);
    return null;
  }
}

/**
 * Get or create label-genre association from database
 */
async function getOrCreateLabelGenre(labelGenreData) {
  try {
    if (!labelGenreData || !labelGenreData.label_id || !labelGenreData.genre_id) return null;

    let labelGenre = await db.LabelGenres.findOne({
      where: {
        label_id: labelGenreData.label_id,
        genre_id: labelGenreData.genre_id
      }
    });

    if (labelGenre) {
      return labelGenre;
    }

    // Create new association
    labelGenre = await db.LabelGenres.create({
      label_id: labelGenreData.label_id,
      genre_id: labelGenreData.genre_id
    });

    return labelGenre;
  } catch (error) {
    console.warn('Error in getOrCreateLabelGenre:', error.message);
    return null;
  }
}

/**
 * Process tracks array with database caching
 */
async function processTracksWithCache(tracks) {
  if (!Array.isArray(tracks)) return tracks;

  const processedTracks = [];
  for (const track of tracks) {
    const cachedTrack = await getOrCreateTrack(track);
    processedTracks.push(cachedTrack);
  }
  return processedTracks;
}

// ==================== RADIO BY TRACK METHODS ====================

/**
 * Create comprehensive radio based on a seed track|2.0
 */
exports.createRadioByTrack = async (req, res) => {
    try {
        const {trackId} = req.params;
        const {limit = 20} = req.query;

        if (!trackId) {
            return res.status(400).json({error: 'Track ID is required'});
        }

        // Try to get seed track from database first
        let seedTrack = null;
        const dbTrack = await db.Track.findOne({
            where: { deezer_id: parseInt(trackId) },
            include: [
                { model: db.Artist, through: db.TrackArtists },
                { model: db.Album }
            ]
        });

        if (dbTrack && (Date.now() - new Date(dbTrack.updatedAt).getTime()) < ONE_MONTH_MS) {
            console.log(`Using cached seed track: ${dbTrack.title}`);
            // Reconstruct seedTrack object from DB data
            seedTrack = {
                id: dbTrack.deezer_id,
                title: dbTrack.title,
                title_short: dbTrack.title_short,
                isrc: dbTrack.isrc,
                duration: dbTrack.duration,
                rank: dbTrack.rank,
                release_date: dbTrack.release_date,
                bpm: dbTrack.bpm,
                gain: dbTrack.gain,
                artist: dbTrack.Artists && dbTrack.Artists.length > 0 ? {
                    id: dbTrack.Artists[0].deezer_id,
                    name: dbTrack.Artists[0].name
                } : null,
                album: dbTrack.Album ? {
                    id: dbTrack.Album.deezer_id,
                    title: dbTrack.Album.title,
                    cover: dbTrack.Album.cover,
                    release_date: dbTrack.Album.release_date
                } : null,
                contributors: dbTrack.Artists.map(artist => ({
                    id: artist.deezer_id,
                    name: artist.name
                }))
            };
        } else {
            // Get the seed track information from API
            seedTrack = await makeDeezerRequest(`/track/${trackId}`);
            if (!seedTrack || !seedTrack.artist) {
                return res.status(404).json({error: 'Track not found'});
            }
            await getOrCreateTrack(seedTrack);
        }

        const seedArtist = seedTrack.artist;
        const seedAlbum = seedTrack.album;
        let seedGenres = [];
        const seedPopularity = getTrackPopularity(seedTrack);
        const seedYear = seedAlbum?.release_date ? new Date(seedAlbum.release_date).getFullYear() : null;
        const seedContributors = seedTrack.contributors
        const contributors = seedTrack.contributors.map(item => {
            return item.name
        })

        console.log(`Creating radio for: ${seedTrack.title} by ${seedArtist.name} (${seedYear})`);
        console.log(`Seed track info:`, {
            title: seedTrack.title,
            artist: seedArtist.name,
            album: seedAlbum?.title,
            popularity: seedPopularity,
            rank: seedTrack.rank,
            year: seedYear,
        });

        const radioTracks = [];

        // Step 1: Get artist label and genre
        let [externalLabels, releases, beatPortLinks] = await getArtistLabelsReleasesAndGenres(seedArtist.name);
        radioTracks.push(...shuffleArray(releases).slice(0, 8));
        console.log('external labels:', externalLabels.join(', '), 'releases:', releases.length);
        let externalGenres = []
        if (beatPortLinks) {
            for (const label of externalLabels) {
                let labelDB = await getOrCreateLabel({ name: label })
                let artist = await db.Artist.findOne({
                    where: { name: dbTrack.Artists[0].name }
                });
                if (artist) {
                    await getOrCreateArtistLabel({artist_id: artist.id, label_id: labelDB.id})
                }
                const labelTracks = []
                const deezerLabelTracks = await makeDeezerRequest(`/search?q=label:"${label}"`);
                for (const track of deezerLabelTracks.data) {
                    labelTracks.push(track);
                }
                radioTracks.push(...shuffleArray(labelTracks).slice(0, 8).map(track => ({
                    ...track,
                    source: 'same_label',
                    source_info: {
                        label_name: label,
                        source_method: 'musicbrainz_label_deezer_search'
                    }
                })));
            }
            if (beatPortLinks.length > 0) {
                for (const link of beatPortLinks) {
                    externalGenres = await getGenresFromBeatportRelease(link)
                }
            }
            let newGenres = []
            if (externalGenres.length > 0) {
                for (let beatportGenre of externalGenres) {
                    newGenres.push(BEATPORT_GENRE_MAPPING[beatportGenre])
                }
                externalGenres = newGenres;
            }
            externalGenres = [...new Set(externalGenres)];
            console.log('External genres: ', externalGenres);
            seedGenres = externalGenres;
        }
        if (!externalGenres.length) {
            console.log('No external genres found.');
            [externalGenres, externalLabels] = await getGenreAndLabelFromBeatport(seedTrack.title, contributors);
            console.log('external genres: ', externalGenres, 'external labels:', externalLabels);
            let newGenres = []
            if (externalGenres.length > 0) {
                for (let beatportGenre of externalGenres) {
                    newGenres.push(BEATPORT_GENRE_MAPPING[beatportGenre])
                    await getOrCreateGenre({name: BEATPORT_GENRE_MAPPING[beatportGenre]});
                }
                externalGenres = newGenres;
            }
            console.log('External genres: ', externalGenres);
            console.log('newGenres: ', newGenres);
            if (externalLabels.length === 1) {
                console.log('No external labels found.');
                const labelTracks = []
                const deezerLabelTracks = await makeDeezerRequest(`/search?q=label:"${externalLabels[0]}"`);

                for (const track of deezerLabelTracks.data) {
                    labelTracks.push(track);
                }
                console.log('Label releases count:', labelTracks.length);
                radioTracks.push(...shuffleArray(labelTracks).slice(0, 8).map(track => ({
                    ...track,
                    source: 'same_label',
                    source_info: {
                        label_name: externalLabels[0],
                        source_method: 'beatport_label_deezer_search'
                    }
                })));
            }
        }
        // Step 2: Get artist genre from last.fm
        if (!externalGenres) {
            externalGenres = await getGenresFromLastfm(seedArtist.name);
        }
        if (externalLabels.length > 0) {
            for (let externalLabel of externalLabels) {
                let label = await getOrCreateLabel({name: externalLabel});
                for (const externalGenre of externalGenres) {
                    let genre = await getOrCreateGenre({name: externalGenre});
                    await getOrCreateLabelGenre({label_id: label.id, genre_id: genre.id})
                }
            }
        }
        // Step 3: Get releases by years ±2 and same genre using MusicBrainz
        try {
            const relatedReleases = await getRelatedReleasesByYear(
                seedArtist.name,
                seedYear,
            );

            console.log(`Found ${relatedReleases.length} related releases from MusicBrainz`);

            if (relatedReleases.length > 0) {
                const relatedTracks = await getTracksFromReleases(relatedReleases.slice(0, 8));
                console.log(`Found ${relatedTracks.length} tracks from releases before filtering`);
                radioTracks.push(...shuffleArray(relatedTracks).slice(0, 8));
                console.log(`[${radioTracks.length}] Added ${Math.min(4, relatedTracks.length)} tracks from related releases`);
            } else {
                console.log(`[${radioTracks.length}] Added 0 tracks from related releases`);
                //     Add fallback and get artist album tracks with same +- rank
            }
        } catch (error) {
            console.warn('Failed to get related releases:', error.message);
            console.log(`[${radioTracks.length}] Added 0 tracks from related releases`);
        }

        // Step 4: Get collaboration tracks
        const collaborations = []
        try {
            const collabTracks = await getCollaborationTracks(seedArtist.name, seedArtist.id, seedTrack.title, seedPopularity);
            radioTracks.push(...collabTracks.slice(0, 8));
            console.log(`[${radioTracks.length}] Added ${Math.min(4, collabTracks.length)} collaboration tracks`);
            for (const track of collabTracks) {
                collaborations.push(track.artist.name)

                // Extract featured artists from track title
                const featuredArtists = extractFeaturedArtists(track.title);
                featuredArtists.forEach(artist => {
                    if (!collaborations.includes(artist)) {
                        collaborations.push(artist);
                    }
                });

                // Extract remix information from track title
                const remixInfo = extractRemixInfo(track.title);
                if (remixInfo.isRemix && remixInfo.remixArtist) {
                    if (!collaborations.includes(remixInfo.remixArtist)) {
                        collaborations.push(remixInfo.remixArtist);
                    }
                    console.log(`Found remix: "${track.title}" - Original: "${remixInfo.originalTitle}", Remix Artist: "${remixInfo.remixArtist}"`);
                }
            }
        } catch (error) {
            console.warn('Failed to get collaboration tracks:', error.message);
            console.log(`[${radioTracks.length}] Added 0 collaboration tracks`);
        }

        // Step 5: Check collaboration artists top tracks
        if (collaborations.length > 1) {
            for (const contributor of seedContributors) {
                // Try to get top tracks first
                const artistTopTracks = await makeDeezerRequest(`/artist/${contributor.id}/top?limit=3`);
                console.log(`artists top track`, artistTopTracks.data);

                if (artistTopTracks.data && artistTopTracks.data.length > 0) {
                    const filteredTracks = artistTopTracks.data
                    console.log(`filteredTracks`, filteredTracks);
                    // Process and add tracks if we found any
                    if (filteredTracks.length > 0) {
                        const selectedTracks = filteredTracks.slice(0, 4).map(track => ({
                            ...track,
                            source: 'related_artists_simple',
                            source_info: {
                                related_artist: contributor.name,
                                original_artist: seedArtist.name
                            }
                        }));
                        console.log(`selectedTracks`, selectedTracks);
                        radioTracks.push(...selectedTracks);
                    }
                }
            }
            if (radioTracks.length < parseInt(limit)) {
                const relatedTracks = await getRelatedArtistsTracks(seedArtist.id, seedPopularity, 4);
                radioTracks.push(...relatedTracks);
                console.log(`Added ${relatedTracks.length} related artist tracks to fill gap`);
            }
            // Step 6: Get random tracks in same genre with similar popularity
            try {
                const randomTracks = await getRandomGenreTracks(externalGenres, seedYear, seedPopularity);
                radioTracks.push(...randomTracks.slice(0, 4));
                console.log('Genres:', externalGenres);
                console.log(`[${radioTracks.length}] Added ${Math.min(4, randomTracks.length)} random genre tracks`);
            } catch (error) {
                console.warn('Failed to get random genre tracks:', error.message);
                console.log(`[${radioTracks.length}] Added 0 random genre tracks`);
            }

            // Step 7: Fallback to simple methods if we have too few tracks
            if (radioTracks.length < parseInt(limit) / 2) {
                console.log(`Only found ${radioTracks.length} tracks, adding simple fallbacks...`);

                // Try artist's top tracks first
                try {
                    const topTracks = await makeDeezerRequest(`/artist/${seedArtist.id}/top?limit=10`);
                    if (topTracks.data) {
                        const existingIds = new Set(radioTracks.map(t => t.id));
                        const newTopTracks = topTracks.data
                            .filter(track => !existingIds.has(track.id))
                            .slice(0, 5)
                            .map(track => ({
                                ...track,
                                source: 'artist_top',
                                source_info: {artist_name: seedArtist.name}
                            }));

                        // Filter out duplicate titles within newTopTracks, keeping only the first occurrence
                        const seenTitles = new Set();
                        const uniqueTopTracks = newTopTracks.filter(track => {
                            if (seenTitles.has(track.title_short)) {
                                return false; // Skip duplicate title
                            }
                            seenTitles.add(track.title_short);
                            return true; // Keep first occurrence
                        });

                        radioTracks.push(...uniqueTopTracks);
                        console.log(`[${radioTracks.length}] Added ${uniqueTopTracks.length} artist top tracks as fallback`);
                    }

                } catch (error) {
                    console.warn('Failed to get artist top tracks:', error.message);
                }
            }

                // Try related artists if we still need more
                if (radioTracks.length < parseInt(limit) / 2) {
                    try {
                        const relatedArtists = await makeDeezerRequest(`/artist/${seedArtist.id}/related?limit=5`);
                        if (relatedArtists.data && relatedArtists.data.length > 0) {
                            const existingIds = new Set(radioTracks.map(t => t.id));

                            for (const artist of relatedArtists.data.slice(0, 3)) {
                                try {
                                    const artistTopTracks = await makeDeezerRequest(`/artist/${artist.id}/top?limit=3`);
                                    if (artistTopTracks.data) {
                                        const newRelatedTracks = artistTopTracks.data
                                            .filter(track => !existingIds.has(track.id))
                                            .slice(0, 2)
                                            .map(track => ({
                                                ...track,
                                                source: 'related_artists_simple',
                                                source_info: {
                                                    related_artist: artist.name,
                                                    original_artist: seedArtist.name
                                                }
                                            }));

                                        // Filter out duplicate titles within newRelatedTracks
                                        const seenTitles = new Set();
                                        const uniqueRelatedTracks = newRelatedTracks.filter(track => {
                                            if (seenTitles.has(track.title_short)) {
                                                return false; // Skip duplicate title
                                            }
                                            seenTitles.add(track.title_short);
                                            return true; // Keep first occurrence
                                        });

                                        radioTracks.push(...uniqueRelatedTracks);
                                        uniqueRelatedTracks.forEach(track => existingIds.add(track.id));

                                        if (radioTracks.length >= parseInt(limit)) break;
                                    }
                                } catch (trackError) {
                                    console.warn(`Failed to get tracks for related artist ${artist.name}:`, trackError.message);
                                }
                            }

                            console.log(`[${radioTracks.length}] Added related artist tracks as simple fallback`);
                        } else {
                            console.log('seedArtist:', seedArtist);
                            const baseUrl = process.env.BACKEND_URL || 'http://localhost:8000'
                            const similarArtistsResponse = await fetch(`${baseUrl}/lastfm/artist/similar?artist=${encodeURIComponent(seedArtist.name)}&limit=10`)
                            const similarArtistsData = await similarArtistsResponse.json()
                            console.log('similarArtistsData', similarArtistsData)

                            for (const artist of similarArtistsData.similarartists.artist) {
                                const artistsResponses = await fetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artist.name)}&limit=5`)
                                const artistsResponsesData = await artistsResponses.json()
                                console.log('artistsResponsesData', artistsResponsesData)
                                for (const artistResponse of artistsResponsesData.data) {
                                    if (artistResponse.name === artist.name) {
                                        const artistTopTracks = await makeDeezerRequest(`/artist/${artistResponse.id}/top?limit=3`);
                                        if (artistTopTracks.data) {
                                            const newRelatedTracks = artistTopTracks.data
                                                .slice(0, 2)
                                                .map(track => ({
                                                    ...track,
                                                    source: 'related_artists_simple',
                                                    source_info: {
                                                        related_artist: artist.name,
                                                        original_artist: seedArtist.name
                                                    }
                                                }));

                                            // Filter out duplicate titles within newRelatedTracks
                                            const seenTitles = new Set();
                                            const uniqueRelatedTracks = newRelatedTracks.filter(track => {
                                                if (seenTitles.has(track.title_short)) {
                                                    return false; // Skip duplicate title
                                                }
                                                seenTitles.add(track.title_short);
                                                return true; // Keep first occurrence
                                            });

                                            radioTracks.push(...uniqueRelatedTracks);

                                            if (radioTracks.length >= parseInt(limit)) break;
                                        }
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.warn('Failed to get related artists:', error.message);
                    }
                }
            }

            // Remove duplicates and limit results
            const uniqueTracks = removeDuplicateTracks(radioTracks);
            const finalTracks = shuffleArray(uniqueTracks).slice(0, parseInt(limit));

            res.json({
                seedTrack: {
                    id: seedTrack.id,
                    title: seedTrack.title,
                    artist: seedArtist.name,
                    album: seedAlbum?.title,
                    year: seedYear,
                    genre: seedGenres[0]?.name || 'unknown',
                    popularity: seedPopularity
                },
                tracks: finalTracks,
                summary: {
                    totalFound: uniqueTracks.length,
                    returned: finalTracks.length,
                    sources: {
                        relatedReleases: radioTracks.filter(t => t.source === 'related_releases').length,
                        collaborations: radioTracks.filter(t => t.source === 'collaborations').length,
                        relatedArtists: radioTracks.filter(t => t.source === 'related_artists_simple').length,
                        deezerRelatedArtists: radioTracks.filter(t => t.source === 'related_artists').length,
                        sameLabel: radioTracks.filter(t => t.source === 'same_label').length,
                        randomGenre: radioTracks.filter(t => t.source === 'random_genre').length,
                        artistTop: radioTracks.filter(t => t.source === 'artist_top').length,
                    }
                }
            });

        }
    catch
        (error)
        {
            console.error('Error creating radio by track:', error);
            res.status(500).json({
                error: 'Failed to create radio by track',
                details: error.message
            });
        }
    }
    ;

// ==================== MUSICBRAINZ OPTIMIZATION ====================

// MusicBrainz request cache
    const musicbrainzCache = new Map();
    const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Request deduplication
    const activeRequests = new Map();

// Rate limiting
    let lastRequestTime = 0;
    const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

    /**
     * Optimized MusicBrainz request with caching and rate limiting
     */
    async function makeOptimizedMusicBrainzRequest(endpoint, params = {}) {
        const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;

        // Check cache first
        if (musicbrainzCache.has(cacheKey)) {
            const cached = musicbrainzCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                console.log(`🎯 MusicBrainz cache hit: ${cacheKey}`);
                return cached.data;
            } else {
                musicbrainzCache.delete(cacheKey);
            }
        }

        // Check for active request (deduplication)
        if (activeRequests.has(cacheKey)) {
            console.log(`🔄 MusicBrainz request deduplicated: ${cacheKey}`);
            return activeRequests.get(cacheKey);
        }

        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            console.log(`⏱️ MusicBrainz rate limiting: waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // Create promise for deduplication
        const requestPromise = (async () => {
            try {
                lastRequestTime = Date.now();
                console.log(`🌐 MusicBrainz request: ${endpoint} with params:`, params);

                const queryString = Object.entries(params)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');

                const url = `${MUSICBRAINZ_BASE_URL}${endpoint}?${queryString}&fmt=json`;

                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Vue-Quickly/1.0.0 ( contact@example.com )'
                    }
                });

                const data = response.data;

                // Cache the result
                musicbrainzCache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });

                return data;
            } catch (error) {
                console.error('MusicBrainz request failed:', error.response?.data || error.message);
                throw error;
            } finally {
                // Clean up active request
                activeRequests.delete(cacheKey);
            }
        })();

        // Store active request for deduplication
        activeRequests.set(cacheKey, requestPromise);

        return requestPromise;
    }

    /**
     * Batch multiple MusicBrainz requests efficiently
     */
    async function batchMusicBrainzRequests(requests) {
        const results = [];
        const batchSize = 3; // Process in smaller batches to respect rate limits

        for (let i = 0; i < requests.length; i += batchSize) {
            const batch = requests.slice(i, i + batchSize);
            const batchPromises = batch.map(({endpoint, params}) =>
                makeOptimizedMusicBrainzRequest(endpoint, params)
            );

            const batchResults = await Promise.allSettled(batchPromises);
            results.push(...batchResults);

            // Small delay between batches
            if (i + batchSize < requests.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        return results.map(result =>
            result.status === 'fulfilled' ? result.value : null
        );
    }

    /**
     * Get multiple recordings in parallel with optimization
     */


    /**
     * Get multiple releases in parallel with optimization
     */
    async function getMultipleReleaseDetails(releaseIds) {
        if (!releaseIds || releaseIds.length === 0) return [];

        console.log(`📦 Getting details for ${releaseIds.length} releases in parallel`);

        const requests = releaseIds.map(id => ({
            endpoint: `/release/${id}`,
            params: {inc: 'labels'}
        }));

        const results = await batchMusicBrainzRequests(requests);
        return results.filter(result => result !== null);
    }

    /**
     * Clean up expired cache entries periodically
     */
    function cleanupMusicBrainzCache() {
        const now = Date.now();
        let cleanedCount = 0;

        for (const [key, value] of musicbrainzCache.entries()) {
            if (now - value.timestamp > CACHE_TTL) {
                musicbrainzCache.delete(key);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned up ${cleanedCount} expired MusicBrainz cache entries`);
        }
    }

    /**
     * Get cache statistics
     */
    function getMusicBrainzCacheStats() {
        return {
            cacheSize: musicbrainzCache.size,
            activeRequests: activeRequests.size,
            cacheHitRate: 'N/A' // Could be implemented with additional tracking
        };
    }

// Clean up cache every 10 minutes
    setInterval(cleanupMusicBrainzCache, 10 * 60 * 1000);

// ==================== HELPER METHODS ====================
    /**
     * Get genre from Beatport
     */
    async function getGenreAndLabelFromBeatport(trackTitle, artistsName) {
        try {
            for (const artistName of artistsName) {
                // Search for the track on Beatport
                const searchQuery = `${artistsName} ${trackTitle}`;
                const searchUrl = `https://www.beatport.com/search?q=${encodeURIComponent(searchQuery)}`;

                console.log(`Searching Beatport: ${searchUrl}`);

                const {data} = await axios.get(searchUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 10000
                });
                const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
                if (match) {
                    const json = JSON.parse(match[1]);
                    console.log('json', json.props.pageProps.dehydratedState);
                    for (const track of json.props.pageProps.dehydratedState.queries[0].state.data.tracks.data) {
                        console.log('track', track);
                        let artistFound
                        for (const artist of track.artists) {
                            if (artist.artist_name === artistName) {
                                artistFound = true
                            }
                        }
                        if (track.track_name.includes(trackTitle) && artistFound) {
                            console.log('found track:', track);
                            return [[track.genre[0].genre_name], [track.label.label_name]];
                        }
                    }
                }
            }

            return [null, null];
        } catch (error) {
            console.warn('Beatport search failed g:', error.message);
            return [null, null];
        }
    }

    async function getGenresFromBeatportRelease(link) {
        try {
            const genres = []
            console.log(`Searching Beatport: ${link}`);

            const {data} = await axios.get(link, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000
            });
            const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
            if (match) {
                const json = JSON.parse(match[1]);
                console.log('json init', json.props.pageProps.release);
                console.log('json', json.props.pageProps.dehydratedState.queries[1].state.data.results);
                for (const track of json.props.pageProps.dehydratedState.queries[1].state.data.results) {
                    if (track.genre.name !== 'electronica') {
                        genres.push(track.genre.name);
                    }
                }
            }

            return genres;
        } catch (error) {
            console.warn('Beatport search failed:', error.message);
            return null;
        }
    }

    /**
     * Get genres from Last.fm artist.getInfo (up to 2 tags)
     */
    async function getGenresFromLastfm(artistName) {
        try {
            console.log(`Getting genres from Last.fm for artist: "${artistName}"`);

            // Use cached request with 1 hour TTL for artist info
            const response = await makeCachedLastfmRequest('artist.getInfo', {
                artist: artistName
            }, 60 * 60 * 1000); // 1 hour cache

            if (response && response.artist && response.artist.tags && response.artist.tags.tag) {
                const tags = Array.isArray(response.artist.tags.tag)
                    ? response.artist.tags.tag
                    : [response.artist.tags.tag];

                if (tags.length > 0) {
                    // Get up to 2 genres, filter out common generic tags
                    const genreTags = tags
                        .map(tag => tag.name)
                        .filter(tag => !['seen live', 'favorites', 'all', 'music', 'electronic'].includes(tag.toLowerCase()))
                        .slice(0, 2);

                    console.log(`Found Last.fm genres: [${genreTags.join(', ')}] for artist "${artistName}"`);
                    // stabilization for genres
                    let stabilizedGenres = [];
                    for (const genreTag of genreTags) {
                        if (GENRES_LIST.includes(genreTag.toLowerCase())) {
                            console.log(`found genres from Genres ${genreTag}`);
                            stabilizedGenres.push(genreTag.toLowerCase());
                            await getOrCreateGenre({name: genreTag.toLowerCase()});
                        }
                    }
                    console.log(`Stabilized genres: ${stabilizedGenres.join(',')}`);
                    return stabilizedGenres;
                }
            }

            console.log(`No tags found for artist "${artistName}" on Last.fm`);
            return [];
        } catch (error) {
            console.warn('Last.fm genre lookup failed:', error.message);
            return [];
        }
    }

    /**
     * Get related releases by label via Deezer and MusicBrainz
     */
    async function getArtistLabelsReleasesAndGenres(artistName) {
        console.log('Get artist labels, releases and genres for artist "' + artistName + '"');
        let externalLabels = []
        let beatPortLinks = []
        const radioTracks = []
        const artistSearchResponse = await makeMusicBrainzRequest('/artist', {
            query: `${artistName}`,
            limit: 5
        });
        if (artistSearchResponse.artists && artistSearchResponse.artists.length > 0) {
            const artistResponse = await makeMusicBrainzRequest(`/artist/${artistSearchResponse.artists[0].id}`, {
                inc: 'releases'
            })
            if (artistResponse.releases && artistResponse.releases.length > 0) {
                for (const track of artistResponse.releases) {
                    const artistRelease = await makeMusicBrainzRequest(`/release/${track.id}`, {
                        inc: 'labels+url-rels'
                    })
                    if (artistRelease && artistRelease.relations.length > 0) {
                        for (const relation of artistRelease.relations) {
                            if (relation.url.resource.startsWith('https://www.beatport.com')) {
                                beatPortLinks.push(relation.url.resource);
                            }
                        }
                    }
                    if (artistRelease && artistRelease['label-info'].length > 0) {
                        console.log('artistRelease', artistRelease);
                        const labelInfo = artistRelease['label-info'];
                        console.log('labelInfo', labelInfo);
                        let externalLabel = artistRelease['label-info'][0].label
                            ? artistRelease['label-info'][0].label.name
                            : null;
                        if (externalLabel) {
                            externalLabels.push(externalLabel)
                        }
                    }
                }
            }
        }
        externalLabels = [...new Set(externalLabels)];
        return [externalLabels, radioTracks, beatPortLinks];
    }

    /**
     * Get related releases by year and genre using MusicBrainz
     */
    async function getRelatedReleasesByYear(artistName, seedYear) {
        if (!seedYear) {
            console.log('No seed year provided, skipping MusicBrainz search');
            return [];
        }

        const yearRange = 2;
        const minYear = seedYear - yearRange;
        const maxYear = seedYear + yearRange;

        try {
            console.log(`Searching MusicBrainz for ${artistName} releases between ${minYear}-${maxYear}`);

            // Search for releases in the year range
            const searchParams = {
                query: `artist:"${artistName}" AND date:[${minYear} TO ${maxYear}]`,
                limit: 10,
                offset: 0
            };

            const data = await makeMusicBrainzRequest('/release', searchParams);

            console.log(`MusicBrainz returned:`, data.releases ? data.releases.length : 'no releases');

            if (!data.releases || data.releases.length === 0) {
                console.log('No releases found in MusicBrainz, trying simple Deezer search fallback');
                // Fallback to simple Deezer album search
                try {
                    const deezerSearch = await makeDeezerRequest(`/search/album?q=${encodeURIComponent(artistName)}&limit=10`);
                    if (deezerSearch.data) {
                        return deezerSearch.data
                            .filter(album => {
                                if (!album.release_date) return false;
                                const albumYear = new Date(album.release_date).getFullYear();
                                return albumYear >= minYear && albumYear <= maxYear;
                            })
                            .map(album => ({
                                id: album.id,
                                title: album.title,
                                artist: album.artist.name,
                                date: album.release_date,
                                score: album.fans || 0
                            }))
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5);
                    }
                } catch (deezerError) {
                    console.error('Deezer fallback search failed:', deezerError);
                }
                return [];
            }

            // Filter and transform releases
            const releases = data.releases
                .filter(release => release['artist-credit'] && release['artist-credit'].length > 0)
                .map(release => ({
                    id: release.id,
                    title: release.title,
                    artist: release['artist-credit'][0].artist.name,
                    date: release.date,
                    score: release.score || 0
                }))
                .sort((a, b) => b.score - a.score);

            console.log(`Processed ${releases.length} releases from MusicBrainz`);
            return releases;

        } catch (error) {
            console.error('MusicBrainz search error:', error.message);
            console.log('MusicBrainz failed, trying Deezer album search as fallback');

            // Fallback to Deezer search
            try {
                const deezerSearch = await makeDeezerRequest(`/search/album?q=${encodeURIComponent(artistName)}&limit=10`);
                if (deezerSearch.data) {
                    return deezerSearch.data
                        .filter(album => {
                            if (!album.release_date) return false;
                            const albumYear = new Date(album.release_date).getFullYear();
                            return albumYear >= minYear && albumYear <= maxYear;
                        })
                        .map(album => ({
                            id: album.id,
                            title: album.title,
                            artist: album.artist.name,
                            date: album.release_date,
                            score: album.fans || 0,
                            isDeezerFallback: true
                        }))
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5);
                }
            } catch (deezerError) {
                console.error('Deezer fallback search also failed:', deezerError);
            }

            return [];
        }
    }

    /**
     * Get tracks from MusicBrainz releases and search them in Deezer
     */
    async function getTracksFromReleases(releases) {
        const tracks = [];

        for (const release of releases) {
            try {
                if (release.isDeezerFallback) {
                    // This is already a Deezer album, get tracks directly
                    console.log(`Getting tracks from Deezer album: ${release.title} (ID: ${release.id})`);
                    const albumTracks = await makeDeezerRequest(`/album/${release.id}/tracks?limit=5`);

                    if (albumTracks.data) {
                        for (const track of albumTracks.data) {
                            await getOrCreateTrack(track);
                        }
                        const transformedTracks = albumTracks.data.map(track => ({
                            ...track,
                            source: 'related_releases',
                            source_info: {
                                release_title: release.title,
                                release_year: release.date ? new Date(release.date).getFullYear() : null,
                                source_method: 'deezer_direct'
                            }
                        }));

                        tracks.push(...transformedTracks);
                        console.log(`Added ${transformedTracks.length} tracks from Deezer album ${release.title}`);
                    }
                } else {
                    // This is a MusicBrainz release, search for it in Deezer
                    console.log(`Searching Deezer for MusicBrainz release: ${release.title} by ${release.artist}`);

                    // Try different search strategies
                    const searchQueries = [
                        `artist:"${release.artist}" album:"${release.title}"`,
                        `${release.artist} ${release.title}`,
                        `"${release.title}" ${release.artist}`
                    ];

                    let found = false;
                    for (const searchQuery of searchQueries) {
                        try {
                            const deezerResponse = await makeDeezerRequest(`/search/album?q=${encodeURIComponent(searchQuery)}&limit=3`);

                            if (deezerResponse.data && deezerResponse.data.length > 0) {
                                // Try to find the best match
                                const bestMatch = deezerResponse.data.find(album =>
                                    album.artist.name.toLowerCase().includes(release.artist.toLowerCase()) ||
                                    album.title.toLowerCase().includes(release.title.toLowerCase())
                                ) || deezerResponse.data[0];

                                const albumTracks = await makeDeezerRequest(`/album/${bestMatch.id}/tracks?limit=5`);

                                if (albumTracks.data) {
                                    const transformedTracks = albumTracks.data.map(track => ({
                                        ...track,
                                        source: 'related_releases',
                                        source_info: {
                                            release_title: release.title,
                                            release_year: release.date ? new Date(release.date).getFullYear() : null,
                                            source_method: 'musicbrainz_search',
                                            search_query: searchQuery
                                        }
                                    }));

                                    tracks.push(...transformedTracks);
                                    console.log(`Added ${transformedTracks.length} tracks from MusicBrainz->Deezer search: ${bestMatch.title}`);
                                    found = true;
                                    break;
                                }
                            }
                        } catch (searchError) {
                            console.warn(`Search query "${searchQuery}" failed:`, searchError.message);
                            continue;
                        }
                    }

                    if (!found) {
                        console.log(`No Deezer match found for MusicBrainz release: ${release.title}`);
                    }
                }
            } catch (error) {
                console.warn(`Failed to get tracks for release "${release.title}":`, error.message);
            }
        }

        console.log(`Total tracks found from ${releases.length} releases: ${tracks.length}`);
        return tracks;
    }

    /**
     * Get collaboration tracks for an artist
     */
    async function getCollaborationTracks(artistName, artistId, trackTitle, targetPopularity) {
        try {
            console.log(`Looking for collaboration tracks for artist ${artistId}`);

            // Get artist's albums and look for collaborations
            const artistAlbums = await makeDeezerRequest(`/artist/${artistId}/albums?limit=10`);
            const collabTracks = [];

            if (artistAlbums.data) {
                console.log(`Found ${artistAlbums.data.length} albums for artist`);

                for (const album of artistAlbums.data) { // Limit to 10 albums for performance
                    try {
                        // Get album tracks
                        const albumTracks = await makeDeezerRequest(`/album/${album.id}/tracks?limit=10`);

                        if (albumTracks.data) {
                            console.log(`Album "${album.title}": ${albumTracks.data.length} tracks`);
                            const tracks = []
                            for (const track of albumTracks.data) {
                                if (track.title_short.toLowerCase() !== trackTitle.toLowerCase()) {
                                    const albumTrack = await makeDeezerRequest(`/track/${track.id}`);
                                    await getOrCreateTrack(albumTrack);
                                    console.log('Album track', albumTrack);
                                    if (albumTrack.contributors.length > 1) {
                                        for (const collab of albumTrack.contributors) {
                                            if (collab.name.toLowerCase() !== artistName.toLowerCase()) {
                                                tracks.push(albumTrack);
                                            }
                                        }
                                    }
                                }
                            }
                            console.log(`Found ${tracks.length} collaboration tracks in album "${album.title}"`);

                            collabTracks.push(...tracks.map(track => ({
                                ...track,
                                source: 'collaborations',
                                source_info: {
                                    album_title: album.title,
                                    collaboration_type: track.contributors ? 'multi_contributor' : 'featuring'
                                }
                            })));
                        }
                    } catch (error) {
                        console.warn(`Failed to get tracks for album ${album.title}:`, error.message);
                    }
                }
            } else {
                console.log('No albums found for artist');
            }

            console.log(`Total collaboration tracks found: ${collabTracks.length}`);
            return shuffleArray(collabTracks);
        } catch (error) {
            console.error('Error getting collaboration tracks:', error);
            return [];
        }
    }

    /**
     * Get tracks from related artists with similar popularity
     */
    async function getRelatedArtistsTracks(artistId, targetPopularity, limit = 4) {
        try {
            console.log(`Looking for related artist tracks for artist ${artistId}`);

            // Get related artists
            const relatedArtists = await makeDeezerRequest(`/artist/${artistId}/related?limit=10`);
            const tracks = [];

            if (relatedArtists.data) {
                console.log(`Found ${relatedArtists.data.length} related artists`);

                for (const artist of relatedArtists.data.slice(0, 5)) {
                    try {
                        console.log(`Getting top tracks for related artist: ${artist.name} (ID: ${artist.id})`);

                        // Get top tracks from related artist
                        const topTracks = await makeDeezerRequest(`/artist/${artist.id}/top?limit=5`);

                        if (topTracks.data) {
                            console.log(`Found ${topTracks.data.length} top tracks for ${artist.name}`);

                            const filteredTracks = filterByPopularityRange(topTracks.data, targetPopularity);

                            const selectedTracks = filteredTracks.slice(0, 2).map(track => ({
                                ...track,
                                source: 'related_artists',
                                source_info: {
                                    related_artist: artist.name,
                                    original_artist_id: artistId
                                }
                            }));

                            tracks.push(...selectedTracks);
                            console.log(`Added ${selectedTracks.length} tracks from ${artist.name}`);
                        } else {
                            console.log(`No top tracks found for ${artist.name}`);
                        }
                    } catch (error) {
                        console.warn(`Failed to get tracks for related artist ${artist.name}:`, error.message);
                    }
                }
            } else {
                console.log('No related artists found');
            }

            console.log(`Total related artist tracks found: ${tracks.length}`);
            return shuffleArray(tracks).slice(0, limit);
        } catch (error) {
            console.error('Error getting related artists tracks:', error);
            return [];
        }
    }

    /**
     * Get tracks from same label with same genre
     */
    /**
     * Get releases from MusicBrainz by label
     */
    async function getReleasesByLabelFromMusicBrainz(seedArtist, labelName, genreName, seedYear, limit = 15) {
        try {
            console.log(`Searching MusicBrainz for releases by label: "${labelName}" with genre: "${genreName}"`);
            const yearRange = 2;
            const minYear = seedYear - yearRange;
            const maxYear = seedYear + yearRange;
            // Search for releases by label, optionally filtered by genre
            const searchParams = {
                query: `label:"${labelName}" AND date:[${minYear} TO ${maxYear}]`,
                limit: limit,
                offset: 0
            };

            // // If we have a genre, add it to the search
            // if (genreName && genreName !== 'pop') {
            //     searchParams.query += ` AND tag:"${genreName}"`;
            // }

            const data = await makeMusicBrainzRequest('/release', searchParams);

            console.log(`MusicBrainz returned ${data.releases ? data.releases.length : 0} releases for label "${labelName}"`);

            if (!data.releases || data.releases.length === 0) {
                return [];
            }

            // Filter and transform releases
            const releases = data.releases
                .filter(release => release['artist-credit'] && release['artist-credit'].length > 0)
                .map(release => ({
                    id: release.id,
                    title: release.title,
                    artist: release['artist-credit'][0].artist.name,
                    artistId: release['artist-credit'][0].artist.id,
                    date: release.date,
                    score: release.score || 0,
                    label: labelName,
                    genre: genreName
                }))
                .sort((a, b) => b.score - a.score);

            console.log('releases', releases);

            console.log(`Processed ${releases.length} releases from MusicBrainz for label "${labelName}"`);
            return releases;

        } catch (error) {
            console.error('Error searching MusicBrainz for label releases:', error);
            return [];
        }
    }

    /**
     * Get tracks from MusicBrainz releases and search them in Deezer
     */
    async function getTracksFromLabelReleases(releases, targetPopularity, limit = 8) {
        const tracks = [];
        const processedArtists = new Set(); // Avoid processing the same artist multiple times

        for (const release of releases.slice(0, 10)) { // Process up to 10 releases
            try {
                // Skip if we've already processed this artist
                if (processedArtists.has(release.artistId)) {
                    continue;
                }
                if (release.artist === 'Various Artists') {
                    continue
                }
                processedArtists.add(release.artistId);

                console.log(`Searching Deezer for tracks by "${release.artist}" (from label release: "${release.title}")`);

                // Search Deezer for tracks by this artist
                const artistSearchResponse = await makeDeezerRequest(`/search/track?q=${encodeURIComponent(release.artist)} ${release.title}&limit=15`);

                if (artistSearchResponse.data && artistSearchResponse.data.length > 0) {
                    if (artistSearchResponse.data.find(item => item.artist.name.toLowerCase() === release.artist.toLowerCase())) {
                        // select only target artist

                        let selectedReleases = artistSearchResponse.data.filter(item => item.artist.name.toLowerCase() === release.artist.toLowerCase())
                        for (const artistRel of selectedReleases) {
                            await getOrCreateTrack(artistRel);
                        }
                        const processedTracks = selectedReleases.slice(0, 2).map(track => ({
                            ...track,
                            source: 'same_label',
                            source_info: {
                                label_name: release.label,
                                musicbrainz_release: release.title,
                                musicbrainz_artist: release.artist,
                                musicbrainz_score: release.score,
                                artist_name: track.artist?.name
                            }
                        }));

                        tracks.push(...processedTracks);
                        console.log(`Added ${processedTracks.length} tracks from ${release.artist}`);
                    }
                    // Stop if we have enough tracks
                    if (tracks.length >= limit) {
                        break;
                    }

                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                console.warn(`Failed to get tracks for release "${release.title}":`, error.message);
                continue;
            }
        }

        return shuffleArray(tracks);
    }

    async function getLabelTracks(seedArtist, labelName, genreName, seedYear, targetPopularity) {
        try {
            console.log(`Getting tracks from label "${labelName}" with genre "${genreName}"`);

            // First, try to get releases from MusicBrainz by label
            const labelReleases = await getReleasesByLabelFromMusicBrainz(seedArtist, labelName, genreName, seedYear, 12);

            if (labelReleases.length > 0) {
                console.log(`Found ${labelReleases.length} releases from MusicBrainz for label "${labelName}"`);
                return await getTracksFromLabelReleases(labelReleases, targetPopularity, 8);
            }
            return null
        } catch (error) {
            console.error('Error getting label tracks:', error);
            return [];
        }
    }

    /**
     * Get artists from MusicBrainz by genre tag
     */
    async function getArtistsByGenreFromMusicBrainz(genreName, limit = 20) {
        try {
            console.log(`Searching MusicBrainz for artists in genre: "${genreName}"`);

            // MusicBrainz uses tags for genre classification
            // Common genre tags in MusicBrainz - simplified to avoid rate limits
            const genreTags = {
                'rock': ['rock'],
                'pop': ['pop'],
                'hip hop': ['hip hop', 'rap'],
                'electronic': ['electronic', 'house'],
                'jazz': ['jazz'],
                'classical': ['classical'],
                'country': ['country'],
                'blues': ['blues'],
                'reggae': ['reggae'],
                'folk': ['folk'],
                'metal': ['metal'],
                'punk': ['punk'],
                'soul': ['soul'],
                'disco': ['disco']
            };

            // Get relevant tags for the genre
            const searchTags = genreTags[genreName.toLowerCase()] || [genreName.toLowerCase()];

            let allArtists = [];

            // Search for artists with each relevant tag (limit to avoid rate limiting)
            for (const tag of searchTags.slice(0, 2)) { // Limit to 2 tags max
                try {
                    console.log(`Searching for artists with tag: "${tag}"`);

                    // Try multiple search strategies for diversity
                    const searchStrategies = [
                        {query: `tag:"${tag}"`, limit: Math.ceil(limit / 4), offset: 0}, // Top results
                        {query: `tag:"${tag}"`, limit: Math.ceil(limit / 4), offset: Math.ceil(limit / 4)}, // Skip some top results
                        {query: `tag:"${tag}" AND country:*`, limit: Math.ceil(limit / 4), offset: 0}, // Include country info for diversity
                    ];

                    for (const strategy of searchStrategies) {
                        try {
                            const data = await makeMusicBrainzRequest('/artist', strategy);

                            if (data.artists && data.artists.length > 0) {
                                const artists = data.artists.map(artist => ({
                                    id: artist.id,
                                    name: artist.name,
                                    score: artist.score || 0,
                                    genre_tag: tag
                                }));

                                allArtists.push(...artists);
                            }

                            // Small delay between strategies
                            await new Promise(resolve => setTimeout(resolve, 200));
                        } catch (strategyError) {
                            // Continue with next strategy
                            continue;
                        }
                    }

                    console.log(`Found ${allArtists.length} artists so far with tag "${tag}"`);

                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));

                } catch (tagError) {
                    console.warn(`Failed to search for tag "${tag}":`, tagError.message);
                    continue;
                }
            }

            // Remove duplicates and provide diverse selection
            const uniqueArtists = allArtists
                .filter((artist, index, self) =>
                    index === self.findIndex(a => a.id === artist.id)
                )
                .sort((a, b) => b.score - a.score);

            // Return a mix of top artists and some variety for better diversity
            const topArtists = uniqueArtists.slice(0, Math.floor(limit * 0.6)); // 60% top artists
            const diverseArtists = uniqueArtists.slice(Math.floor(limit * 0.6), limit); // 40% more diverse

            const finalArtists = [...topArtists, ...diverseArtists].slice(0, limit);

            console.log(`Found ${finalArtists.length} unique artists from MusicBrainz for genre "${genreName}" (including diverse selection)`);
            return finalArtists;

        } catch (error) {
            console.error('Error searching MusicBrainz for artists by genre:', error);
            return [];
        }
    }

    /**
     * Get releases from MusicBrainz by genre tag
     */
    async function getReleasesByGenreFromMusicBrainz(genreName, seedYear, limit = 20) {
        try {
            console.log(`Searching MusicBrainz for releases in genre: "${genreName}"`);
            const yearRange = 2;
            const minYear = seedYear - yearRange;
            const maxYear = seedYear + yearRange;
            // Use the same genre tag mapping as above - simplified
            const genreTags = {
                'rock': ['rock'],
                'pop': ['pop'],
                'hip hop': ['hip hop', 'rap'],
                'electronic': ['electronic', 'house'],
                'jazz': ['jazz'],
                'classical': ['classical'],
                'country': ['country'],
                'blues': ['blues'],
                'reggae': ['reggae'],
                'folk': ['folk'],
                'metal': ['metal'],
                'punk': ['punk'],
                'soul': ['soul'],
                'disco': ['disco']
            };

            const searchTags = genreTags[genreName.toLowerCase()] || [genreName.toLowerCase()];

            let allReleases = [];

            // Search for releases with each relevant tag (limit to avoid rate limiting)
            for (const tag of searchTags.slice(0, 2)) { // Limit to 2 tags max
                try {
                    console.log(`Searching for releases with tag: "${tag}"`);

                    const searchParams = {
                        query: `tag:"${tag}" AND date:[${minYear} TO ${maxYear}]`,
                        limit: Math.ceil(limit / 2),
                        offset: 0
                    };

                    const data = await makeMusicBrainzRequest('/release', searchParams);

                    if (data.releases && data.releases.length > 0) {
                        const releases = data.releases
                            .filter(release => release['artist-credit'] && release['artist-credit'].length > 0)
                            .map(release => ({
                                id: release.id,
                                title: release.title,
                                artist: release['artist-credit'][0].artist.name,
                                date: release.date,
                                score: release.score || 0,
                                genre_tag: tag
                            }));

                        allReleases.push(...releases);
                        console.log(`Found ${releases.length} releases with tag "${tag}"`);
                    }

                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));

                } catch (tagError) {
                    console.warn(`Failed to search for tag "${tag}":`, tagError.message);
                }
            }

            // Remove duplicates and sort by score
            const uniqueReleases = allReleases
                .filter((release, index, self) =>
                    index === self.findIndex(r => r.id === release.id)
                )
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            console.log(`Found ${uniqueReleases.length} unique releases from MusicBrainz for genre "${genreName}"`);
            return uniqueReleases;

        } catch (error) {
            console.error('Error searching MusicBrainz for releases by genre:', error);
            return [];
        }
    }

    /**
     * Get random tracks from the same genre with similar popularity
     */
    async function getRandomGenreTracks(genresName, seedYear, targetPopularity) {
        try {
            console.log(`Looking for random tracks in genres: "${genresName.join(', ')}" using MusicBrainz`);

            let allTracks = [];

            // Use a higher tolerance for genre searches to allow more diverse popularity ranges
            const genreTolerance = 35; // Higher tolerance for genre-based searches

            // If we didn't find enough tracks from artists, try releases
            if (allTracks.length < 8) {
                console.log('Not enough tracks from artists, trying releases from MusicBrainz');
                for (const genreName of genresName) {
                    console.log('Current genre: ', genreName);
                    const genreReleases = await getReleasesByGenreFromMusicBrainz(genreName, seedYear, 20);
                    const artistSet = new Set();
                    const releaseSet = new Set();
                    if (genreReleases.length > 0) {
                        // Get tracks from these releases
                        for (const release of genreReleases) {
                            try {
                                console.log(`Searching Deezer for tracks from release: "${release.title}" by "${release.artist}"`);
                                if (!artistSet.has(release.artist) && !releaseSet.has(`${release.artist}:${release.title}`)) {
                                    artistSet.add(release.artist);
                                    releaseSet.add(`${release.artist}:${release.title}`);
                                    const releaseSearchResponse = await makeDeezerRequest(`/search/track?q=album:"${encodeURIComponent(release.title)}" artist:"${encodeURIComponent(release.artist)}"&limit=10`);

                                    if (releaseSearchResponse.data && releaseSearchResponse.data.length > 0) {
                                        console.log(`Found ${releaseSearchResponse.data.length} tracks from Deezer for release "${release.title}"`);

                                        // Debug: Log popularity values for first few tracks
                                        if (releaseSearchResponse.data.length > 0) {
                                            console.log(`Target popularity: ${targetPopularity}, tolerance: ${genreTolerance}, range: ${Math.max(0, targetPopularity - genreTolerance)} - ${Math.min(100, targetPopularity + genreTolerance)}`);
                                        }
                                        for (const searchRelease of releaseSearchResponse.data) {
                                            console.log(`${release.artist}:${searchRelease.title_short}`);
                                            if (searchRelease.artist.name === release.artist) {
                                                // Filter by popularity with higher tolerance for genre searches
                                                await getOrCreateTrack(searchRelease);
                                                const filteredTracks = filterByPopularityRange([searchRelease], targetPopularity, genreTolerance);
                                                if (filteredTracks.length === 0) {
                                                    continue;
                                                }
                                                const processedTracks = filteredTracks.map(track => ({
                                                    ...track,
                                                    source: 'random_genre',
                                                    source_info: {
                                                        genre_name: genreName,
                                                        musicbrainz_release: release.title,
                                                        musicbrainz_artist: release.artist,
                                                        musicbrainz_score: release.score,
                                                        musicbrainz_genre_tag: release.genre_tag,
                                                        artist_name: track.artist?.name
                                                    }
                                                }));

                                                allTracks.push(...processedTracks);
                                                console.log(`Added ${processedTracks.length} tracks from release "${release.title}" (score: ${release.score}) - ${filteredTracks.length} passed filter out of ${releaseSearchResponse.data.length}`);

                                                // If we have enough tracks, stop
                                                if (allTracks.length >= 20) {
                                                    break;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            } catch (releaseError) {
                                console.warn(`Failed to get tracks for release "${release.title}":`, releaseError.message);
                            }
                        }
                    }
                }
            }

            // Remove duplicates and shuffle
            const uniqueTracks = removeDuplicateTracks(allTracks);
            const finalTracks = shuffleArray(uniqueTracks).slice(0, 4);

            console.log(`Total random genre tracks found: ${finalTracks.length}`);
            return finalTracks;
        } catch (error) {
            console.error('Error getting random genre tracks:', error);
            return [];
        }
    }

    /**
     * Remove duplicate tracks based on track ID and artist+title combination
     */
    function removeDuplicateTracks(tracks) {
        const seen = new Set();
        const seenTitles = new Set();

        return tracks.filter(track => {
            // Check for exact ID duplicates
            if (seen.has(track.id)) {
                return false;
            }
            seen.add(track.id);

            // Check for similar title+artist combinations
            const titleKey = `${track.title?.toLowerCase() || ''}_${track.artist?.name?.toLowerCase() || ''}`;
            if (seenTitles.has(titleKey)) {
                return false;
            }
            seenTitles.add(titleKey);

            return true;
        });
    }

// ==================== RELATED RADIO METHODS ====================

    /**
     * Get similar artists from Last.fm for a given artist
     */
    async function getSimilarArtistsFromLastfm(artistName, limit = 10) {
        try {
            console.log(`Getting similar artists from Last.fm for: "${artistName}"`);

            const baseUrl = process.env.BACKEND_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/lastfm/artist/similar?artist=${encodeURIComponent(artistName)}&limit=${limit}`);

            if (!response.ok) {
                console.warn(`Last.fm similar artists API error: ${response.status}`);
                return [];
            }

            const data = await response.json();

            if (data.similarartists && data.similarartists.artist) {
                const similarArtists = Array.isArray(data.similarartists.artist)
                    ? data.similarartists.artist
                    : [data.similarartists.artist];

                console.log(`Found ${similarArtists.length} similar artists from Last.fm for "${artistName}"`);
                return similarArtists.slice(0, limit);
            }

            console.log(`No similar artists found for "${artistName}" on Last.fm`);
            return [];
        } catch (error) {
            console.warn('Last.fm similar artists lookup failed:', error.message);
            return [];
        }
    }

    /**
     * Get top tracks for an artist from Last.fm
     */
    async function getArtistTopTracksFromLastfm(artistName, limit = 5) {
        try {
            console.log(`Getting top tracks from Last.fm for: "${artistName}"`);

            // Use cached request with 30 minute TTL for top tracks (changes more frequently)
            const response = await makeCachedLastfmRequest('artist.getTopTracks', {
                artist: artistName,
                limit: limit
            }, 30 * 60 * 1000); // 30 minute cache

            if (response && response.toptracks && response.toptracks.track) {
                const tracks = Array.isArray(response.toptracks.track)
                    ? response.toptracks.track
                    : [response.toptracks.track];

                console.log(`Found ${tracks.length} top tracks from Last.fm for "${artistName}"`);
                return tracks.slice(0, limit);
            }

            console.log(`No top tracks found for "${artistName}" on Last.fm`);
            return [];
        } catch (error) {
            console.warn('Last.fm top tracks lookup failed:', error.message);
            return [];
        }
    }

    /**
     * Get artist info from Last.fm including genres and similar artists
     */
    async function getArtistInfoFromLastfm(artistName) {
        try {
            // Use cached request with 1 hour TTL for artist info (changes less frequently)
            const response = await makeCachedLastfmRequest('artist.getInfo', {
                artist: artistName
            }, 60 * 60 * 1000); // 1 hour cache

            if (response && response.artist) {
                const artist = response.artist;

                // Extract genres from tags
                const genres = [];
                if (artist.tags && artist.tags.tag) {
                    const tags = Array.isArray(artist.tags.tag) ? artist.tags.tag : [artist.tags.tag];
                    genres.push(...tags.slice(0, 2).map(tag => tag.name));
                }

                return {
                    name: artist.name,
                    mbid: artist.mbid,
                    genres: genres,
                    bio: artist.bio?.summary || '',
                    playcount: artist.stats?.playcount || 0,
                    listeners: artist.stats?.listeners || 0
                };
            }

            return null;
        } catch (error) {
            console.warn(`Last.fm artist info lookup failed for "${artistName}":`, error.message);
            return null;
        }
    }

    /**
     * Get similar artists from Last.fm
     */
    async function getSimilarArtistsFromLastfm(artistName, limit = 10) {
        try {
            // Use cached request with 2 hour TTL for similar artists (changes less frequently)
            const response = await makeCachedLastfmRequest('artist.getSimilar', {
                artist: artistName,
                limit: limit
            }, 2 * 60 * 60 * 1000); // 2 hour cache

            if (response && response.similarartists && response.similarartists.artist) {
                const artists = Array.isArray(response.similarartists.artist)
                    ? response.similarartists.artist
                    : [response.similarartists.artist];

                return artists.map(artist => ({
                    name: artist.name,
                    mbid: artist.mbid,
                    match: artist.match,
                    url: artist.url,
                    images: artist.image
                }));
            }

            return [];
        } catch (error) {
            console.warn(`Last.fm similar artists lookup failed for "${artistName}":`, error.message);
            return [];
        }
    }

    /**
     * Get a random track from an artist's top tracks
     */
    async function getRandomTrackFromArtist(artistName) {
        try {
            // console.log(`🎯 Getting random track for artist: "${artistName}"`); // Uncomment for debugging

            // First try Last.fm for top tracks
            const lastfmTracks = await getArtistTopTracksFromLastfm(artistName, 10);

            if (lastfmTracks.length > 0) {
                // Pick a random track from the Last.fm top tracks
                const randomTrack = lastfmTracks[Math.floor(Math.random() * lastfmTracks.length)];

                // Now find this track in Deezer for full track data
                const searchQuery = `"${randomTrack.name}" ${artistName}`;
                const deezerResponse = await makeDeezerRequest(`/search/track?q=${encodeURIComponent(searchQuery)}&limit=5`);

                if (deezerResponse.data && deezerResponse.data.length > 0) {
                    // Find the best match
                    const bestMatch = deezerResponse.data.find(track =>
                        track.artist.name.toLowerCase() === artistName.toLowerCase() &&
                        (track.title.toLowerCase().includes(randomTrack.name.toLowerCase()) ||
                            randomTrack.name.toLowerCase().includes(track.title_short.toLowerCase()))
                    ) || deezerResponse.data[0];
                    for (const track of bestMatch) {
                        await getOrCreateTrack(track);
                    }

                    // console.log(`✅ Found Deezer track from Last.fm: "${bestMatch.title_short}" by "${bestMatch.artist.name}"`);
                    return bestMatch;
                }
            }

            // Fallback: Use Deezer's artist top tracks
            // console.log(`🔄 Falling back to Deezer top tracks for "${artistName}"`);
            const deezerArtist = await findDeezerArtist(artistName);

            if (deezerArtist) {
                const deezerTopTracks = await makeDeezerRequest(`/artist/${deezerArtist.id}/top?limit=5`);

                if (deezerTopTracks.data && deezerTopTracks.data.length > 0) {
                    // Pick a random track from Deezer's top tracks
                    const randomTrack = deezerTopTracks.data[Math.floor(Math.random() * deezerTopTracks.data.length)];
                    // console.log(`✅ Found Deezer track from fallback: "${randomTrack.title_short}" by "${randomTrack.artist.name}"`);
                    return randomTrack;
                }
            }

            // console.log(`❌ No tracks found for artist "${artistName}" from any source`);
            return null;
        } catch (error) {
            console.warn(`Failed to get random track for artist ${artistName}:`, error.message);
            return null;
        }
    }

    /**
     * Find Deezer artist by name
     */
    async function findDeezerArtist(artistName) {
        try {
            const searchResponse = await makeDeezerRequest(`/search/artist?q=${encodeURIComponent(artistName)}&limit=5`);

            if (searchResponse.data && searchResponse.data.length > 0) {
                // Find exact match first
                const exactMatch = searchResponse.data.find(artist =>
                    artist.name.toLowerCase() === artistName.toLowerCase()
                );

                if (exactMatch) {
                    return exactMatch;
                }

                // Return first result if no exact match
                return searchResponse.data[0];
            }

            return null;
        } catch (error) {
            console.warn(`Failed to find Deezer artist "${artistName}":`, error.message);
            return null;
        }
    }

    /**
     * Recursively discover artists and collect tracks
     */
    async function discoverArtistsRecursively(seedArtistName, targetPopularity, visitedArtists = new Set(), level = 0, maxLevel = 2) {
        const discoveredTracks = [];
        const discoveredArtists = [];

        // Stop recursion at max level
        if (level > maxLevel) {
            return {tracks: discoveredTracks, artists: discoveredArtists};
        }

        console.log(`🎯 Level ${level}: Discovering artists related to "${seedArtistName}"`);

        // Get similar artists from Last.fm (increased to 5 for more variety)
        const similarArtists = await getSimilarArtistsFromLastfm(seedArtistName, 5);

        if (similarArtists.length === 0) {
            console.log(`No similar artists found for "${seedArtistName}"`);
            return {tracks: discoveredTracks, artists: discoveredArtists};
        }

        // Shuffle the similar artists for more variety
        const shuffledArtists = [...similarArtists].sort(() => Math.random() - 0.5);

        // Process each similar artist (shuffled order)
        for (const similarArtist of shuffledArtists) {
            const artistName = similarArtist.name;

            // Skip if already visited
            if (visitedArtists.has(artistName.toLowerCase())) {
                continue;
            }

            visitedArtists.add(artistName.toLowerCase());
            discoveredArtists.push(artistName);

            // Get a random track from this artist using Last.fm + Deezer
            const randomTrack = await getRandomTrackFromArtist(artistName);

            if (randomTrack) {
                // Check if the track's popularity matches our target
                const trackPopularity = getTrackPopularity(randomTrack);
                const popularityDiff = Math.abs(trackPopularity - targetPopularity);

                // Allow tracks within a reasonable popularity range (very lenient for mixed sources)
                if (popularityDiff <= 45) { // Increased tolerance for more results
                    const enrichedTrack = {
                        ...randomTrack,
                        source: 'related_radio',
                        source_info: {
                            level: level,
                            seed_artist: seedArtistName,
                            discovered_artist: artistName,
                            lastfm_source: true,
                            popularity_match: trackPopularity
                        }
                    };

                    discoveredTracks.push(enrichedTrack);
                    console.log(`✅ Added random track "${randomTrack.title_short}" by "${artistName}" (popularity: ${trackPopularity}, diff: ${popularityDiff})`);
                } else {
                    console.log(`Track "${randomTrack.title_short}" by "${artistName}" popularity ${trackPopularity} too far from target ${targetPopularity} (diff: ${popularityDiff})`);
                }
            } else {
                console.log(`No suitable track found for "${artistName}"`);
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));

            // Recurse to next level (but limit total tracks to prevent explosion)
            if (level < maxLevel && discoveredTracks.length < 27) {
                const {tracks: childTracks, artists: childArtists} = await discoverArtistsRecursively(
                    artistName,
                    targetPopularity,
                    visitedArtists,
                    level + 1,
                    maxLevel
                );

                discoveredTracks.push(...childTracks);
                discoveredArtists.push(...childArtists);
            }

            // Stop if we have enough tracks
            if (discoveredTracks.length >= 27) {
                break;
            }
        }

        console.log(`📊 Level ${level} complete: ${discoveredTracks.length} tracks, ${discoveredArtists.length} artists discovered`);
        return {tracks: discoveredTracks, artists: discoveredArtists};
    }

    /**
     * Create comprehensive radio based on artist relationships and Last.fm data
     */
    exports.createRelatedRadio = async (req, res) => {
        try {
            const {trackId} = req.params;
            const {limit = 27} = req.query;

            if (!trackId) {
                return res.status(400).json({error: 'Track ID is required'});
            }

            console.log(`🎵 Creating related radio for track ID: ${trackId}`);

            // Get the seed track information
            const seedTrack = await makeDeezerRequest(`/track/${trackId}`);
            if (!seedTrack || !seedTrack.artist) {
                return res.status(404).json({error: 'Track not found'});
            }

            const seedArtist = seedTrack.artist;
            const seedAlbum = seedTrack.album;
            const seedPopularity = getTrackPopularity(seedTrack);

            console.log(`🎼 Seed track: "${seedTrack.title}" by "${seedArtist.name}" (Popularity: ${seedPopularity})`);

            // Get artist genres/tags from Last.fm
            const artistGenres = await getGenresFromLastfm(seedArtist.name);
            console.log(`🏷️ Found genres for "${seedArtist.name}": [${artistGenres.join(', ')}]`);

            // Start with seed artist track
            const radioTracks = [];

            // Add the seed track first
            const seedTrackEnriched = {
                ...seedTrack,
                source: 'seed_track',
                source_info: {
                    level: 0,
                    is_seed: true
                }
            };
            radioTracks.push(seedTrackEnriched);

            // Discover related artists recursively
            const visitedArtists = new Set([seedArtist.name.toLowerCase()]);
            const {tracks: discoveredTracks, artists: discoveredArtists} = await discoverArtistsRecursively(
                seedArtist.name,
                seedPopularity,
                visitedArtists,
                1, // Start at level 1
                3  // Go 3 levels deep for more tracks
            );

            radioTracks.push(...discoveredTracks);

            // If we still need more tracks, try the second genre
            if (radioTracks.length < limit && artistGenres.length > 1) {
                console.log(`🔄 Not enough tracks (${radioTracks.length}), trying second genre: "${artistGenres[1]}"`);

                // Find artists from the second genre (increased to 10)
                const genreArtists = await getArtistsByGenreFromMusicBrainz(artistGenres[1], 10);

                for (const genreArtist of genreArtists) {
                    if (visitedArtists.has(genreArtist.name.toLowerCase())) {
                        continue;
                    }

                    visitedArtists.add(genreArtist.name.toLowerCase());

                    // Get a random track from this genre artist using Last.fm + Deezer
                    const randomTrack = await getRandomTrackFromArtist(genreArtist.name);

                    if (randomTrack) {
                        // Check popularity match
                        const trackPopularity = getTrackPopularity(randomTrack);
                        const popularityDiff = Math.abs(trackPopularity - seedPopularity);

                        if (popularityDiff <= 60) {
                            const selectedTrack = {
                                ...randomTrack,
                                source: 'related_radio_genre',
                                source_info: {
                                    genre: artistGenres[1],
                                    discovered_artist: genreArtist.name,
                                    lastfm_source: true,
                                    popularity_match: trackPopularity
                                }
                            };

                            radioTracks.push(selectedTrack);
                            console.log(`➕ Added genre track: "${selectedTrack.title_short}" by "${genreArtist.name}" (popularity: ${trackPopularity})`);

                            if (radioTracks.length >= limit) break;
                        }
                    }
                }
            }

            // Remove duplicates and limit results
            const uniqueTracks = removeDuplicateTracks(radioTracks);
            const finalTracks = uniqueTracks.slice(0, parseInt(limit));

            console.log(`🎉 Related radio complete: ${finalTracks.length} tracks from ${discoveredArtists.length + 1} artists`);

            res.json({
                seedTrack: {
                    id: seedTrack.id,
                    title: seedTrack.title,
                    artist: seedArtist.name,
                    album: seedAlbum?.title,
                    year: seedAlbum?.release_date ? new Date(seedAlbum.release_date).getFullYear() : null,
                    genres: artistGenres,
                    popularity: seedPopularity
                },
                tracks: finalTracks,
                summary: {
                    totalFound: uniqueTracks.length,
                    returned: finalTracks.length,
                    discoveredArtists: discoveredArtists.length,
                    genresUsed: artistGenres,
                    sources: {
                        seedTrack: 1,
                        relatedArtists: discoveredTracks.length,
                        genreFallback: radioTracks.filter(t => t.source === 'related_radio_genre').length,
                        lastfmPowered: radioTracks.filter(t => t.source_info?.lastfm_source).length
                    }
                }
            });

        } catch (error) {
            console.error('❌ Error creating related radio:', error);
            res.status(500).json({
                error: 'Failed to create related radio',
                details: error.message
            });
        }
    };

    /**
     * Create comprehensive radio based on artist relationships and Last.fm data
     */
    exports.createArtistRadio = async (req, res) => {
        try {
            const {artistId} = req.params;
            const {limit = 27} = req.query;

            if (!artistId) {
                return res.status(400).json({error: 'Artist ID is required'});
            }

            console.log(`🎤 Creating artist radio for artist ID: ${artistId}`);

            // Get the seed artist information from Deezer
            const seedArtist = await makeDeezerRequest(`/artist/${artistId}`);
            if (!seedArtist) {
                return res.status(404).json({error: 'Artist not found'});
            }

            console.log(`🎼 Seed artist: "${seedArtist.name}"`);

            // Get artist info from Last.fm including genres
            const lastfmArtistInfo = await getArtistInfoFromLastfm(seedArtist.name);
            const artistGenres = lastfmArtistInfo?.genres || [];
            console.log(`🏷️ Found genres for "${seedArtist.name}": [${artistGenres.join(', ')}]`);

            // Get similar artists from Last.fm
            const similarArtists = await getSimilarArtistsFromLastfm(seedArtist.name, 15);
            console.log(`👥 Found ${similarArtists.length} similar artists from Last.fm`);

            // Start building the radio tracks
            const radioTracks = [];
            const visitedArtists = new Set([seedArtist.name.toLowerCase()]);

            // Add a random track from the seed artist first
            const seedTrack = await getRandomTrackFromArtist(seedArtist.name);
            if (seedTrack) {
                const seedTrackEnriched = {
                    ...seedTrack,
                    source: 'seed_artist',
                    source_info: {
                        level: 0,
                        is_seed: true,
                        artist: seedArtist.name
                    }
                };
                radioTracks.push(seedTrackEnriched);
                console.log(`🎵 Added seed track: "${seedTrack.title_short}" by "${seedArtist.name}"`);
            }

            // Add tracks from similar artists
            for (const similarArtist of similarArtists) {
                if (visitedArtists.has(similarArtist.name.toLowerCase())) {
                    continue;
                }

                visitedArtists.add(similarArtist.name.toLowerCase());

                // Get a random track from this similar artist
                const randomTrack = await getRandomTrackFromArtist(similarArtist.name);

                if (randomTrack) {
                    const selectedTrack = {
                        ...randomTrack,
                        source: 'similar_artist',
                        source_info: {
                            similar_artist: similarArtist.name,
                            match_score: similarArtist.match,
                            lastfm_source: true,
                            level: 1
                        }
                    };

                    radioTracks.push(selectedTrack);
                    console.log(`➕ Added similar artist track: "${selectedTrack.title_short}" by "${similarArtist.name}" (match: ${similarArtist.match})`);

                    if (radioTracks.length >= limit) break;
                }
            }

            // If we still need more tracks, try the first genre
            if (radioTracks.length < limit && artistGenres.length > 0) {
                console.log(`🔄 Not enough tracks (${radioTracks.length}), trying first genre: "${artistGenres[0]}"`);

                // Find artists from the first genre
                const genreArtists = await getArtistsByGenreFromMusicBrainz(artistGenres[0], 10);

                for (const genreArtist of genreArtists) {
                    if (visitedArtists.has(genreArtist.name.toLowerCase())) {
                        continue;
                    }

                    visitedArtists.add(genreArtist.name.toLowerCase());

                    // Get a random track from this genre artist
                    const randomTrack = await getRandomTrackFromArtist(genreArtist.name);

                    if (randomTrack) {
                        const selectedTrack = {
                            ...randomTrack,
                            source: 'artist_radio_genre',
                            source_info: {
                                genre: artistGenres[0],
                                discovered_artist: genreArtist.name,
                                lastfm_source: true,
                                level: 2
                            }
                        };

                        radioTracks.push(selectedTrack);
                        console.log(`➕ Added genre track: "${selectedTrack.title_short}" by "${genreArtist.name}"`);

                        if (radioTracks.length >= limit) break;
                    }
                }
            }

            // If we still need more tracks, try the second genre
            if (radioTracks.length < limit && artistGenres.length > 1) {
                console.log(`🔄 Still need more tracks (${radioTracks.length}), trying second genre: "${artistGenres[1]}"`);

                // Find artists from the second genre
                const genreArtists = await getArtistsByGenreFromMusicBrainz(artistGenres[1], 10);

                for (const genreArtist of genreArtists) {
                    if (visitedArtists.has(genreArtist.name.toLowerCase())) {
                        continue;
                    }

                    visitedArtists.add(genreArtist.name.toLowerCase());

                    // Get a random track from this genre artist
                    const randomTrack = await getRandomTrackFromArtist(genreArtist.name);

                    if (randomTrack) {
                        const selectedTrack = {
                            ...randomTrack,
                            source: 'artist_radio_genre',
                            source_info: {
                                genre: artistGenres[1],
                                discovered_artist: genreArtist.name,
                                lastfm_source: true,
                                level: 2
                            }
                        };

                        radioTracks.push(selectedTrack);
                        console.log(`➕ Added second genre track: "${selectedTrack.title_short}" by "${genreArtist.name}"`);

                        if (radioTracks.length >= limit) break;
                    }
                }
            }

            // Remove duplicates and limit results
            const uniqueTracks = removeDuplicateTracks(radioTracks);
            const finalTracks = uniqueTracks.slice(0, parseInt(limit));

            console.log(`🎉 Artist radio complete: ${finalTracks.length} tracks from ${visitedArtists.size} artists`);

            res.json({
                seedArtist: {
                    id: seedArtist.id,
                    name: seedArtist.name,
                    picture: seedArtist.picture,
                    genres: artistGenres,
                    lastfmInfo: lastfmArtistInfo
                },
                tracks: finalTracks,
                summary: {
                    totalFound: uniqueTracks.length,
                    returned: finalTracks.length,
                    discoveredArtists: visitedArtists.size - 1, // -1 for seed artist
                    genresUsed: artistGenres,
                    similarArtistsFound: similarArtists.length,
                    sources: {
                        seedArtist: radioTracks.filter(t => t.source === 'seed_artist').length,
                        similarArtists: radioTracks.filter(t => t.source === 'similar_artist').length,
                        genreFallback: radioTracks.filter(t => t.source === 'artist_radio_genre').length,
                        lastfmPowered: radioTracks.filter(t => t.source_info?.lastfm_source).length
                    }
                }
            });

        } catch (error) {
            console.error('❌ Error creating artist radio:', error);
            res.status(500).json({
                error: 'Failed to create artist radio',
                details: error.message
            });
        }
    };

    /**
     * Get Last.fm cache statistics and management
     */
    exports.getLastfmCacheStats = async (req, res) => {
        try {
            const stats = lastfmCache.getStats();

            res.json({
                cache: {
                    ...stats,
                    defaultTTL: lastfmCache.defaultTTL,
                    defaultTTLMinutes: Math.round(lastfmCache.defaultTTL / 60000)
                },
                endpoints: {
                    clear: 'POST /deezer/cache/lastfm/clear',
                    stats: 'GET /deezer/cache/lastfm/stats'
                }
            });
        } catch (error) {
            console.error('❌ Error getting cache stats:', error);
            res.status(500).json({
                error: 'Failed to get cache stats',
                details: error.message
            });
        }
    };

    /**
     * Clear Last.fm cache
     */
    exports.clearLastfmCache = async (req, res) => {
        try {
            const stats = lastfmCache.getStats();
            lastfmCache.clear();

            res.json({
                message: 'Last.fm cache cleared successfully',
                cleared: {
                    total: stats.total,
                    active: stats.active,
                    expired: stats.expired
                }
            });
        } catch (error) {
            console.error('❌ Error clearing cache:', error);
            res.status(500).json({
                error: 'Failed to clear cache',
                details: error.message
            });
        }
    };

// ==================== FALLBACK RADIO METHODS ====================

    /**
     * Create simple radio based on Last.fm similar tracks (fallback)
     */
    exports.createSimpleRadio = async (req, res) => {
        try {
            const {trackId} = req.params;
            const {limit = 20} = req.query;

            // Get the seed track information
            const seedTrack = await makeDeezerRequest(`/track/${trackId}`);
            if (!seedTrack || !seedTrack.artist) {
                return res.status(404).json({error: 'Track not found'});
            }

            // Use artist radio as fallback
            const artistRadio = await makeDeezerRequest(`/artist/${seedTrack.artist.id}/radio`);

            if (!artistRadio.data) {
                return res.status(404).json({error: 'No radio tracks found'});
            }

            const tracks = artistRadio.data.slice(0, parseInt(limit)).map(track => ({
                ...track,
                source: 'artist_radio',
                source_info: {
                    seed_artist: seedTrack.artist.name,
                    seed_track: seedTrack.title
                }
            }));

            res.json({
                seedTrack: {
                    id: seedTrack.id,
                    title: seedTrack.title,
                    artist: seedTrack.artist.name,
                    album: seedTrack.album?.title
                },
                tracks: tracks,
                fallback: true,
                summary: {
                    totalFound: tracks.length,
                    returned: tracks.length,
                    method: 'artist_radio'
                }
            });

        } catch (error) {
            console.error('Error creating simple radio:', error);
            res.status(500).json({
                error: 'Failed to create simple radio',
                details: error.message
            });
        }
    };
