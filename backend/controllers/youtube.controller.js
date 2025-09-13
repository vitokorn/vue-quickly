const db = require("../models");
const User = db.users;
const { Innertube } = require('youtubei');

// Store Innertube instances per user
const innertubeInstances = new Map();

// Helper function to get username from cookies
const getUsername = (req) => {
    return req.cookies.username;
};

// Helper function to get Innertube instance for a user
const getInnertubeInstance = async (username) => {
    if (innertubeInstances.has(username)) {
        return innertubeInstances.get(username);
    }

    try {
        const yt = await Innertube.create({
            lang: 'en',
            location: 'US',
            retrieve_player_js: true,
        });

        innertubeInstances.set(username, yt);
        return yt;
    } catch (error) {
        console.error('Error creating Innertube instance:', error);
        throw error;
    }
};

// ==================== AUTHENTICATION METHODS ====================

/**
 * Handle YouTube OAuth callback (placeholder for future OAuth implementation)
 */
exports.handleCallback = async (req, res) => {
    try {
        // For now, we'll use Innertube which doesn't require OAuth
        // Future implementation can add proper OAuth flow
        const userId = 'youtube_user_' + Date.now();
        const display_name = 'YouTube User';

        // Save or update user in database
        const [user, created] = await User.findOrCreate({
            where: { spotyid: userId }, // Using spotyid field for consistency
            defaults: {
                access_token: 'youtube_token', // Placeholder token
                country: 'US',
                display_name
            }
        });

        if (!created) {
            await user.update({
                access_token: 'youtube_token',
                country: 'US',
                display_name
            });
        }

        // Set cookies
        res.cookie('username', userId, {
            expires: new Date(Date.now() + 3600000 * 24 * 365)
        });
        res.cookie('access_token', 'youtube_token', {
            sameSite: 'strict',
            expires: new Date(Date.now() + 3600000 * 24 * 7)
        });
        res.cookie('country', 'US', {
            expires: new Date(Date.now() + 3600000 * 24 * 365)
        });
        res.cookie('nickname', display_name, {
            expires: new Date(Date.now() + 3600000 * 24 * 365)
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error in YouTube callback:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// ==================== USER DATA METHODS ====================

/**
 * Get current user profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        // YouTube doesn't have a traditional user profile API
        // We'll return a basic profile structure
        const profile = {
            id: username,
            display_name: 'YouTube Music User',
            country: 'US',
            type: 'user'
        };

        res.json(profile);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
};

// ==================== SEARCH METHODS ====================

/**
 * Search for tracks, artists, albums, playlists
 */
exports.search = async (req, res) => {
    try {
        const { q, type = 'track,artist,album,playlist', limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        // Search using Innertube
        const search = await yt.music.search(q, {
            type: 'all'
        });

        // Transform results to match our API structure
        const results = {
            tracks: [],
            artists: [],
            albums: [],
            playlists: []
        };

        // Process tracks
        if (search.songs) {
            results.tracks = search.songs.contents.slice(0, limit).map(track => ({
                id: track.id,
                name: track.title,
                artists: [{
                    id: track.artists[0]?.id || 'unknown',
                    name: track.artists[0]?.name || 'Unknown Artist'
                }],
                album: {
                    id: track.album?.id || 'unknown',
                    name: track.album?.name || 'Unknown Album',
                    images: track.thumbnails || []
                },
                duration: track.duration?.seconds || 0,
                previewUrl: null, // YouTube doesn't provide preview URLs
                externalUrls: {
                    youtube: `https://music.youtube.com/watch?v=${track.id}`
                },
                service: 'youtube',
                popularity: 0
            }));
        }

        // Process artists
        if (search.artists) {
            results.artists = search.artists.contents.slice(0, limit).map(artist => ({
                id: artist.id,
                name: artist.name,
                images: artist.thumbnails || [],
                genres: [],
                externalUrls: {
                    youtube: `https://music.youtube.com/channel/${artist.id}`
                },
                service: 'youtube',
                popularity: 0,
                followers: 0
            }));
        }

        // Process albums
        if (search.albums) {
            results.albums = search.albums.contents.slice(0, limit).map(album => ({
                id: album.id,
                name: album.title,
                artists: [{
                    id: album.artists[0]?.id || 'unknown',
                    name: album.artists[0]?.name || 'Unknown Artist'
                }],
                images: album.thumbnails || [],
                releaseDate: album.year || null,
                totalTracks: 0,
                externalUrls: {
                    youtube: `https://music.youtube.com/browse/${album.id}`
                },
                service: 'youtube',
                albumType: 'album'
            }));
        }

        // Process playlists
        if (search.playlists) {
            results.playlists = search.playlists.contents.slice(0, limit).map(playlist => ({
                id: playlist.id,
                name: playlist.title,
                description: '',
                images: playlist.thumbnails || [],
                owner: {
                    id: playlist.author?.id || 'unknown',
                    display_name: playlist.author?.name || 'Unknown'
                },
                public: true,
                totalTracks: 0,
                externalUrls: {
                    youtube: `https://music.youtube.com/browse/${playlist.id}`
                },
                service: 'youtube'
            }));
        }

        res.json(results);
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ error: 'Failed to search' });
    }
};

// ==================== TRACK METHODS ====================

/**
 * Get track information
 */
exports.getTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        // Get track info using Innertube
        const track = await yt.music.getSong(id);

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        const trackData = {
            id: track.id,
            name: track.title,
            artists: track.artists?.map(artist => ({
                id: artist.id,
                name: artist.name
            })) || [],
            album: track.album ? {
                id: track.album.id,
                name: track.album.name,
                images: track.album.thumbnails || []
            } : null,
            duration: track.duration?.seconds || 0,
            previewUrl: null,
            externalUrls: {
                youtube: `https://music.youtube.com/watch?v=${track.id}`
            },
            service: 'youtube',
            popularity: 0,
            trackNumber: 0,
            discNumber: 1
        };

        res.json(trackData);
    } catch (error) {
        console.error('Error getting track:', error);
        res.status(500).json({ error: 'Failed to get track' });
    }
};

// ==================== ARTIST METHODS ====================

/**
 * Get artist information
 */
exports.getArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        const artist = await yt.music.getArtist(id);

        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        const artistData = {
            id: artist.id,
            name: artist.name,
            images: artist.thumbnails || [],
            genres: [],
            externalUrls: {
                youtube: `https://music.youtube.com/channel/${artist.id}`
            },
            service: 'youtube',
            popularity: 0,
            followers: 0
        };

        res.json(artistData);
    } catch (error) {
        console.error('Error getting artist:', error);
        res.status(500).json({ error: 'Failed to get artist' });
    }
};

/**
 * Get artist's top tracks
 */
exports.getArtistTopTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        const tracks = await yt.music.getArtistSongs(id);

        const trackData = tracks?.contents?.map(track => ({
            id: track.id,
            name: track.title,
            artists: [{
                id: id,
                name: track.artists?.[0]?.name || 'Unknown Artist'
            }],
            album: {
                id: track.album?.id || 'unknown',
                name: track.album?.name || 'Unknown Album'
            },
            duration: track.duration?.seconds || 0,
            previewUrl: null,
            externalUrls: {
                youtube: `https://music.youtube.com/watch?v=${track.id}`
            },
            service: 'youtube',
            popularity: 0
        })) || [];

        res.json({ tracks: trackData });
    } catch (error) {
        console.error('Error getting artist top tracks:', error);
        res.status(500).json({ error: 'Failed to get artist top tracks' });
    }
};

// ==================== ALBUM METHODS ====================

/**
 * Get album information
 */
exports.getAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        const album = await yt.music.getAlbum(id);

        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }

        const albumData = {
            id: album.id,
            name: album.title,
            artists: album.artists?.map(artist => ({
                id: artist.id,
                name: artist.name
            })) || [],
            images: album.thumbnails || [],
            releaseDate: album.year || null,
            totalTracks: album.songs?.length || 0,
            externalUrls: {
                youtube: `https://music.youtube.com/browse/${album.id}`
            },
            service: 'youtube',
            albumType: 'album'
        };

        res.json(albumData);
    } catch (error) {
        console.error('Error getting album:', error);
        res.status(500).json({ error: 'Failed to get album' });
    }
};

/**
 * Get album tracks
 */
exports.getAlbumTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        const album = await yt.music.getAlbum(id);

        if (!album || !album.songs) {
            return res.json({ items: [] });
        }

        const tracks = album.songs.map(track => ({
            id: track.id,
            name: track.title,
            artists: track.artists?.map(artist => ({
                id: artist.id,
                name: artist.name
            })) || [],
            album: {
                id: album.id,
                name: album.title
            },
            duration: track.duration?.seconds || 0,
            previewUrl: null,
            externalUrls: {
                youtube: `https://music.youtube.com/watch?v=${track.id}`
            },
            service: 'youtube',
            trackNumber: 0,
            discNumber: 1
        }));

        res.json({ items: tracks });
    } catch (error) {
        console.error('Error getting album tracks:', error);
        res.status(500).json({ error: 'Failed to get album tracks' });
    }
};

// ==================== PLAYLIST METHODS ====================

/**
 * Get playlist information
 */
exports.getPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        const playlist = await yt.music.getPlaylist(id);

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const playlistData = {
            id: playlist.id,
            name: playlist.title,
            description: playlist.description || '',
            images: playlist.thumbnails || [],
            owner: {
                id: playlist.author?.id || 'unknown',
                display_name: playlist.author?.name || 'Unknown'
            },
            public: true,
            totalTracks: playlist.songs?.length || 0,
            externalUrls: {
                youtube: `https://music.youtube.com/browse/${playlist.id}`
            },
            service: 'youtube'
        };

        res.json(playlistData);
    } catch (error) {
        console.error('Error getting playlist:', error);
        res.status(500).json({ error: 'Failed to get playlist' });
    }
};

/**
 * Get playlist tracks
 */
exports.getPlaylistTracks = async (req, res) => {
    try {
        const { id } = req.params;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        const playlist = await yt.music.getPlaylist(id);

        if (!playlist || !playlist.songs) {
            return res.json({ items: [] });
        }

        const tracks = playlist.songs.map(track => ({
            id: track.id,
            name: track.title,
            artists: track.artists?.map(artist => ({
                id: track.artists[0]?.id || 'unknown',
                name: track.artists[0]?.name || 'Unknown Artist'
            })) || [],
            album: {
                id: track.album?.id || 'unknown',
                name: track.album?.name || 'Unknown Album'
            },
            duration: track.duration?.seconds || 0,
            previewUrl: null,
            externalUrls: {
                youtube: `https://music.youtube.com/watch?v=${track.id}`
            },
            service: 'youtube',
            trackNumber: 0,
            discNumber: 1
        }));

        res.json({ items: tracks });
    } catch (error) {
        console.error('Error getting playlist tracks:', error);
        res.status(500).json({ error: 'Failed to get playlist tracks' });
    }
};

// ==================== DISCOVERY METHODS ====================

/**
 * Get new releases (trending music)
 */
exports.getNewReleases = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        // Get trending music from YouTube Music
        const trending = await yt.music.getTrending();

        const albums = trending?.contents?.slice(0, limit).map(item => ({
            id: item.id,
            name: item.title,
            artists: item.artists?.map(artist => ({
                id: artist.id,
                name: artist.name
            })) || [],
            images: item.thumbnails || [],
            releaseDate: null,
            totalTracks: 0,
            externalUrls: {
                youtube: `https://music.youtube.com/browse/${item.id}`
            },
            service: 'youtube',
            albumType: 'album'
        })) || [];

        res.json({ albums });
    } catch (error) {
        console.error('Error getting new releases:', error);
        res.status(500).json({ error: 'Failed to get new releases' });
    }
};

/**
 * Get trending tracks
 */
exports.getTrending = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const username = getUsername(req);
        const yt = await getInnertubeInstance(username);

        const trending = await yt.music.getTrending();

        const tracks = trending?.contents?.slice(0, limit).map(track => ({
            id: track.id,
            name: track.title,
            artists: track.artists?.map(artist => ({
                id: track.artists[0]?.id || 'unknown',
                name: track.artists[0]?.name || 'Unknown Artist'
            })) || [],
            album: {
                id: track.album?.id || 'unknown',
                name: track.album?.name || 'Unknown Album'
            },
            duration: track.duration?.seconds || 0,
            previewUrl: null,
            externalUrls: {
                youtube: `https://music.youtube.com/watch?v=${track.id}`
            },
            service: 'youtube',
            popularity: 0
        })) || [];

        res.json({ tracks });
    } catch (error) {
        console.error('Error getting trending tracks:', error);
        res.status(500).json({ error: 'Failed to get trending tracks' });
    }
};
