const axios = require('axios');
const crypto = require('crypto');

// Last.fm API configuration
const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';
const api_key = process.env.LASTFM_API_KEY;
const secret = process.env.LASTFM_SECRET;

// Helper function to generate API signature
function generateSignature(params) {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}${params[key]}`)
        .join('');
    return crypto.createHash('md5').update(sortedParams + secret).digest('hex');
}

// Helper function to make Last.fm API requests
async function makeLastfmRequest(method, params = {}) {
    const requestParams = {
        method: method,
        api_key: api_key,
        format: 'json',
        ...params
    };

    // Add signature for authenticated requests
    if (params.session_key) {
        requestParams.api_sig = generateSignature(requestParams);
    }

    try {
        const response = await axios.get(LASTFM_API_BASE, { params: requestParams });
        return response.data;
    } catch (error) {
        console.error('Last.fm API Error:', error.response?.data || error.message);
        throw error;
    }
}

// Authentication methods
exports.login = (req, res) => {
    // Last.fm uses a different auth flow - redirect to their auth page
    const authUrl = `https://www.last.fm/api/auth?api_key=${api_key}&cb=${encodeURIComponent(process.env.LASTFM_CALLBACK_URL || 'http://localhost:8000/lastfm/callback')}`;
    res.redirect(authUrl);
};

exports.callback = async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    try {
        // Get session key
        const sessionData = await makeLastfmRequest('auth.getSession', { token });
        
        if (sessionData.session) {
            // Store session in cookies
            res.cookie('lastfm_session', sessionData.session.key, { 
                expires: new Date(Date.now() + 3600000 * 24 * 365) // 1 year
            });
            res.cookie('lastfm_username', sessionData.session.name, { 
                expires: new Date(Date.now() + 3600000 * 24 * 365) 
            });
            res.redirect('/');
        } else {
            res.status(400).json({ error: 'Failed to get session' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('lastfm_session').clearCookie('lastfm_username');
    res.redirect('/');
};

// User data methods
exports.getUserInfo = async (req, res) => {
    try {
        const username = req.query.user || req.cookies.lastfm_username;
        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const data = await makeLastfmRequest('user.getInfo', { user: username });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user info' });
    }
};

exports.getUserTopTracks = async (req, res) => {
    try {
        const username = req.query.user || req.cookies.lastfm_username;
        const period = req.query.period || '7day'; // 7day, 1month, 3month, 6month, 12month, overall
        const limit = req.query.limit || 50;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const data = await makeLastfmRequest('user.getTopTracks', { 
            user: username, 
            period: period,
            limit: limit
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get top tracks' });
    }
};

exports.getUserTopArtists = async (req, res) => {
    try {
        const username = req.query.user || req.cookies.lastfm_username;
        const period = req.query.period || '7day';
        const limit = req.query.limit || 50;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const data = await makeLastfmRequest('user.getTopArtists', { 
            user: username, 
            period: period,
            limit: limit
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get top artists' });
    }
};

exports.getUserTopAlbums = async (req, res) => {
    try {
        const username = req.query.user || req.cookies.lastfm_username;
        const period = req.query.period || '7day';
        const limit = req.query.limit || 50;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const data = await makeLastfmRequest('user.getTopAlbums', { 
            user: username, 
            period: period,
            limit: limit
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get top albums' });
    }
};

exports.getUserRecentTracks = async (req, res) => {
    try {
        const username = req.query.user || req.cookies.lastfm_username;
        const limit = req.query.limit || 50;
        const from = req.query.from;
        const to = req.query.to;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const params = { user: username, limit: limit };
        if (from) params.from = from;
        if (to) params.to = to;

        const data = await makeLastfmRequest('user.getRecentTracks', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get recent tracks' });
    }
};

exports.getUserLovedTracks = async (req, res) => {
    try {
        const username = req.query.user || req.cookies.lastfm_username;
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const data = await makeLastfmRequest('user.getLovedTracks', { 
            user: username, 
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get loved tracks' });
    }
};

exports.getUserFriends = async (req, res) => {
    try {
        const username = req.query.user || req.cookies.lastfm_username;
        const limit = req.query.limit || 50;
        const recenttracks = req.query.recenttracks || 0;

        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const data = await makeLastfmRequest('user.getFriends', { 
            user: username, 
            limit: limit,
            recenttracks: recenttracks
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get friends' });
    }
};

// Artist methods
exports.getArtistInfo = async (req, res) => {
    try {
        const artist = req.query.artist;
        const mbid = req.query.mbid;
        const lang = req.query.lang || 'en';

        if (!artist && !mbid) {
            return res.status(400).json({ error: 'Artist name or MBID required' });
        }

        const params = { lang: lang };
        if (artist) params.artist = artist;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('artist.getInfo', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get artist info' });
    }
};

exports.getArtistTopTracks = async (req, res) => {
    try {
        const artist = req.query.artist;
        const mbid = req.query.mbid;
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        if (!artist && !mbid) {
            return res.status(400).json({ error: 'Artist name or MBID required' });
        }

        const params = { limit: limit, page: page };
        if (artist) params.artist = artist;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('artist.getTopTracks', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get artist top tracks' });
    }
};

exports.getArtistTopAlbums = async (req, res) => {
    try {
        const artist = req.query.artist;
        const mbid = req.query.mbid;
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        if (!artist && !mbid) {
            return res.status(400).json({ error: 'Artist name or MBID required' });
        }

        const params = { limit: limit, page: page };
        if (artist) params.artist = artist;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('artist.getTopAlbums', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get artist top albums' });
    }
};

exports.getSimilarArtists = async (req, res) => {
    try {
        const artist = req.query.artist;
        const mbid = req.query.mbid;
        const limit = req.query.limit || 50;

        if (!artist && !mbid) {
            return res.status(400).json({ error: 'Artist name or MBID required' });
        }

        const params = { limit: limit };
        if (artist) params.artist = artist;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('artist.getSimilar', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get similar artists' });
    }
};

// Album methods
exports.getAlbumInfo = async (req, res) => {
    try {
        const artist = req.query.artist;
        const album = req.query.album;
        const mbid = req.query.mbid;
        const lang = req.query.lang || 'en';

        if (!mbid && (!artist || !album)) {
            return res.status(400).json({ error: 'Artist and album name or MBID required' });
        }

        const params = { lang: lang };
        if (artist) params.artist = artist;
        if (album) params.album = album;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('album.getInfo', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get album info' });
    }
};

exports.getAlbumTopTags = async (req, res) => {
    try {
        const artist = req.query.artist;
        const album = req.query.album;
        const mbid = req.query.mbid;

        if (!mbid && (!artist || !album)) {
            return res.status(400).json({ error: 'Artist and album name or MBID required' });
        }

        const params = {};
        if (artist) params.artist = artist;
        if (album) params.album = album;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('album.getTopTags', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get album top tags' });
    }
};

// Track methods
exports.getTrackInfo = async (req, res) => {
    try {
        const artist = req.query.artist;
        const track = req.query.track;
        const mbid = req.query.mbid;
        const lang = req.query.lang || 'en';

        if (!mbid && (!artist || !track)) {
            return res.status(400).json({ error: 'Artist and track name or MBID required' });
        }

        const params = { lang: lang };
        if (artist) params.artist = artist;
        if (track) params.track = track;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('track.getInfo', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get track info' });
    }
};

exports.getSimilarTracks = async (req, res) => {
    try {
        const artist = req.query.artist;
        const track = req.query.track;
        const mbid = req.query.mbid;
        const limit = req.query.limit || 50;

        if (!mbid && (!artist || !track)) {
            return res.status(400).json({ error: 'Artist and track name or MBID required' });
        }

        const params = { limit: limit };
        if (artist) params.artist = artist;
        if (track) params.track = track;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('track.getSimilar', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get similar tracks' });
    }
};

exports.getTrackTopTags = async (req, res) => {
    try {
        const artist = req.query.artist;
        const track = req.query.track;
        const mbid = req.query.mbid;

        if (!mbid && (!artist || !track)) {
            return res.status(400).json({ error: 'Artist and track name or MBID required' });
        }

        const params = {};
        if (artist) params.artist = artist;
        if (track) params.track = track;
        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('track.getTopTags', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get track top tags' });
    }
};

// Search methods
exports.searchArtists = async (req, res) => {
    try {
        const artist = req.query.artist;
        const limit = req.query.limit || 30;
        const page = req.query.page || 1;

        if (!artist) {
            return res.status(400).json({ error: 'Artist name required' });
        }

        const data = await makeLastfmRequest('artist.search', { 
            artist: artist, 
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search artists' });
    }
};

exports.searchAlbums = async (req, res) => {
    try {
        const album = req.query.album;
        const limit = req.query.limit || 30;
        const page = req.query.page || 1;

        if (!album) {
            return res.status(400).json({ error: 'Album name required' });
        }

        const data = await makeLastfmRequest('album.search', { 
            album: album, 
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search albums' });
    }
};

exports.searchTracks = async (req, res) => {
    try {
        const track = req.query.track;
        const limit = req.query.limit || 30;
        const page = req.query.page || 1;

        if (!track) {
            return res.status(400).json({ error: 'Track name required' });
        }

        const data = await makeLastfmRequest('track.search', { 
            track: track, 
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search tracks' });
    }
};

// Scrobbling methods (require authentication)
exports.scrobbleTrack = async (req, res) => {
    try {
        const sessionKey = req.cookies.lastfm_session;
        if (!sessionKey) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { artist, track, timestamp, album, mbid, duration } = req.body;

        if (!artist || !track) {
            return res.status(400).json({ error: 'Artist and track required' });
        }

        const params = {
            session_key: sessionKey,
            artist: artist,
            track: track
        };

        if (timestamp) params.timestamp = timestamp;
        if (album) params.album = album;
        if (mbid) params.mbid = mbid;
        if (duration) params.duration = duration;

        const data = await makeLastfmRequest('track.scrobble', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrobble track' });
    }
};

exports.loveTrack = async (req, res) => {
    try {
        const sessionKey = req.cookies.lastfm_session;
        if (!sessionKey) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { artist, track, mbid } = req.body;

        if (!artist || !track) {
            return res.status(400).json({ error: 'Artist and track required' });
        }

        const params = {
            session_key: sessionKey,
            artist: artist,
            track: track
        };

        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('track.love', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to love track' });
    }
};

exports.unloveTrack = async (req, res) => {
    try {
        const sessionKey = req.cookies.lastfm_session;
        if (!sessionKey) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { artist, track, mbid } = req.body;

        if (!artist || !track) {
            return res.status(400).json({ error: 'Artist and track required' });
        }

        const params = {
            session_key: sessionKey,
            artist: artist,
            track: track
        };

        if (mbid) params.mbid = mbid;

        const data = await makeLastfmRequest('track.unlove', params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to unlove track' });
    }
};

// Chart methods
exports.getTopTracks = async (req, res) => {
    try {
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        const data = await makeLastfmRequest('chart.getTopTracks', { 
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get top tracks' });
    }
};

exports.getTopArtists = async (req, res) => {
    try {
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        const data = await makeLastfmRequest('chart.getTopArtists', { 
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get top artists' });
    }
};

exports.getTopTags = async (req, res) => {
    try {
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        const data = await makeLastfmRequest('chart.getTopTags', { 
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get top tags' });
    }
};

// Tag methods
exports.getTagInfo = async (req, res) => {
    try {
        const tag = req.query.tag;
        const lang = req.query.lang || 'en';

        if (!tag) {
            return res.status(400).json({ error: 'Tag name required' });
        }

        const data = await makeLastfmRequest('tag.getInfo', { 
            tag: tag,
            lang: lang
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tag info' });
    }
};

exports.getTagTopArtists = async (req, res) => {
    try {
        const tag = req.query.tag;
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        if (!tag) {
            return res.status(400).json({ error: 'Tag name required' });
        }

        const data = await makeLastfmRequest('tag.getTopArtists', { 
            tag: tag,
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tag top artists' });
    }
};

exports.getTagTopAlbums = async (req, res) => {
    try {
        const tag = req.query.tag;
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        if (!tag) {
            return res.status(400).json({ error: 'Tag name required' });
        }

        const data = await makeLastfmRequest('tag.getTopAlbums', { 
            tag: tag,
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tag top albums' });
    }
};

exports.getTagTopTracks = async (req, res) => {
    try {
        const tag = req.query.tag;
        const limit = req.query.limit || 50;
        const page = req.query.page || 1;

        if (!tag) {
            return res.status(400).json({ error: 'Tag name required' });
        }

        const data = await makeLastfmRequest('tag.getTopTracks', {
            tag: tag,
            limit: limit,
            page: page
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get tag top tracks' });
    }
};

// ==================== DEEZER INTEGRATION METHODS ====================

exports.getSimilarTracksForDeezer = async (req, res) => {
    try {
        const artist = req.query.artist;
        const track = req.query.track;
        const limit = req.query.limit || 10;

        if (!artist || !track) {
            return res.status(400).json({ error: 'Artist and track parameters are required' });
        }

        // Get similar tracks from Last.fm
        const data = await makeLastfmRequest('track.getSimilar', {
            artist: artist,
            track: track,
            limit: limit
        });

        if (!data.similartracks || !data.similartracks.track) {
            return res.status(404).json({
                error: 'No similar tracks found',
                originalTrack: {
                    artist,
                    track,
                    lastfmUrl: `https://www.last.fm/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(track)}`
                },
                similarTracks: [],
                deezerResults: [],
                summary: {
                    totalSimilarTracks: 0,
                    foundInDeezer: 0,
                    notFoundInDeezer: 0
                }
            });
        }

        const similarTracks = Array.isArray(data.similartracks.track)
            ? data.similartracks.track
            : [data.similartracks.track];

        res.json({
            originalTrack: {
                artist,
                track,
                lastfmUrl: `https://www.last.fm/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(track)}`
            },
            similarTracks: similarTracks.map(t => ({
                name: t.name,
                artist: t.artist.name,
                playcount: t.playcount,
                match: t.match,
                url: t.url,
                duration: t.duration,
                images: t.image
            })),
            summary: {
                totalSimilarTracks: similarTracks.length
            }
        });

    } catch (error) {
        console.error('Error getting similar tracks for Deezer:', error);
        res.status(500).json({ error: 'Failed to get similar tracks for Deezer' });
    }
};
