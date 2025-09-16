const axios = require('axios');

// Deezer API configuration
const DEEZER_BASE_URL = 'https://api.deezer.com';
const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org/ws/2';

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

// Helper function to make MusicBrainz API requests
const makeMusicBrainzRequest = async (endpoint, params = {}) => {
    try {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        const url = `${MUSICBRAINZ_BASE_URL}${endpoint}?${queryString}&fmt=json`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'DeezerRadioApp/1.0.0 ( contact@example.com )'
            }
        });
        return response.data;
    } catch (error) {
        console.error('MusicBrainz API Error:', error.response?.data || error.message);
        throw error;
    }
};

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
    if (!trackName) return { isRemix: false, remixArtist: null, originalTitle: trackName };

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

// ==================== RADIO BY TRACK METHODS ====================

/**
 * Create comprehensive radio based on a seed track
 */
exports.createRadioByTrack = async (req, res) => {
    try {
        const { trackId } = req.params;
        const { limit = 20 } = req.query;

        if (!trackId) {
            return res.status(400).json({ error: 'Track ID is required' });
        }

        // Get the seed track information
        const seedTrack = await makeDeezerRequest(`/track/${trackId}`);
        if (!seedTrack || !seedTrack.artist) {
            return res.status(404).json({ error: 'Track not found' });
        }

        const seedArtist = seedTrack.artist;
        const seedAlbum = seedTrack.album;
        const seedGenres = seedAlbum?.genres?.data || [];
        const seedPopularity = getTrackPopularity(seedTrack);
        const seedYear = seedAlbum?.release_date ? new Date(seedAlbum.release_date).getFullYear() : null;

        console.log(`Creating radio for: ${seedTrack.title} by ${seedArtist.name} (${seedYear})`);
        console.log(`Seed track info:`, {
            title: seedTrack.title,
            artist: seedArtist.name,
            album: seedAlbum?.title,
            popularity: seedPopularity,
            rank: seedTrack.rank,
            year: seedYear,
            genres: seedGenres.map(g => g.name || g).join(', ') || 'none'
        });

        const radioTracks = [];

        // Step 1: Get releases by years ±2 and same genre using MusicBrainz
        try {
            const relatedReleases = await getRelatedReleasesByYearAndGenre(
                seedArtist.name,
                seedYear,
                seedGenres[0]?.name || 'pop'
            );

            console.log(`Found ${relatedReleases.length} related releases from MusicBrainz`);

            if (relatedReleases.length > 0) {
                const relatedTracks = await getTracksFromReleases(relatedReleases.slice(0, 4));
                console.log(`Found ${relatedTracks.length} tracks from releases before filtering`);
                const filteredTracks = filterByPopularityRange(relatedTracks, seedPopularity);
                console.log(`Found ${filteredTracks.length} tracks after popularity filtering`);
                radioTracks.push(...shuffleArray(filteredTracks).slice(0, 4));
                console.log(`[${radioTracks.length}] Added ${Math.min(4, filteredTracks.length)} tracks from related releases`);
            } else {
                console.log(`[${radioTracks.length}] Added 0 tracks from related releases`);
            }
        } catch (error) {
            console.warn('Failed to get related releases:', error.message);
            console.log(`[${radioTracks.length}] Added 0 tracks from related releases`);
        }

        // Step 2: Get collaboration tracks
        const collaborations = []
        try {
            const collabTracks = await getCollaborationTracks(seedArtist.id, seedPopularity);
            radioTracks.push(...collabTracks.slice(0, 4));
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

        // // Step 3: Fill gap with related artists if needed
        const collabGap = Math.max(0, 4 - (radioTracks.length - Math.max(0, radioTracks.length - 4)));
        if (collabGap > 0) {
            console.log('collabGap', collabGap);
            try {
                for (let artistName of collaborations) {
                    console.log('artistName', artistName);
                    const artistsResponses = await makeDeezerRequest(`/search/artist?q=${encodeURIComponent(artistName)}&limit=5`)

                    for (const artist of artistsResponses.data) {
                        console.log(`artist 200`, artist);
                        if (artistName === artist.name && artistName !== seedArtist.name) {
                            let tracks = [];

                            // Try to get top tracks first
                            const artistTopTracks = await makeDeezerRequest(`/artist/${artist.id}/top?limit=3`);
                            console.log(`artists top track`, artistTopTracks.data);

                            if (artistTopTracks.data && artistTopTracks.data.length > 0) {
                                // Use top tracks with popularity filtering
                                const filteredTracks = filterByPopularityRange(artistTopTracks.data, seedPopularity);
                                console.log(`filteredTracks`, filteredTracks);
                                tracks = filteredTracks;
                            } else {
                                // Fallback to search if no top tracks
                                const searchTracks = await makeDeezerRequest(`/search/track?q=${encodeURIComponent(artistName)}&limit=5`);
                                console.log(`search tracks`, searchTracks.data);

                                for (const track of searchTracks.data) {
                                    if (track.artist.name === artistName) {
                                        tracks.push(track);
                                    }
                                }
                                console.log('filtered search tracks', tracks);
                            }

                            // Process and add tracks if we found any
                            if (tracks.length > 0) {
                                const selectedTracks = tracks.slice(0, 2).map(track => ({
                                    ...track,
                                    source: 'related_artist_simple',
                                    source_info: {
                                        related_artist: artist.name,
                                        original_artist: seedArtist.name
                                    }
                                }));
                                console.log(`selectedTracks`, selectedTracks);
                                radioTracks.push(...selectedTracks);
                            }

                            break;
                        }
                    }
                }

                // Only call getRelatedArtistsTracks if we still need more tracks
                if (radioTracks.length < parseInt(limit)) {
                    const relatedTracks = await getRelatedArtistsTracks(seedArtist.id, seedPopularity, collabGap);
                    radioTracks.push(...relatedTracks);
                    console.log(`Added ${relatedTracks.length} related artist tracks to fill gap`);
                }
            } catch (error) {
                console.warn('Failed to get related artist tracks:', error.message);
            }
        }
        let externalGenre, externalLabel
        let genreName = seedGenres[0]?.name || 'pop';
        // Step 4: Get random tracks in same genre with similar popularity
        try {

            // If genre is empty or generic, try to get genre from external sources
            if (!seedGenres[0]?.name || seedGenres[0]?.name === 'pop' || seedGenres[0]?.name === 'unknown') {
                console.log('Genre is empty or generic, trying to get genre from external sources...');
                [externalGenre, externalLabel] = await getGenreAndLabelFromExternalSources(seedTrack.title, seedArtist.name, seedAlbum?.title);
                if (externalGenre) {
                    genreName = externalGenre;
                    console.log(`Found genre from external source: "${genreName}"`);
                } else {
                    console.log('Could not determine genre from external sources, using fallback');
                }
            }

            const randomTracks = await getRandomGenreTracks(genreName, seedPopularity);
            radioTracks.push(...randomTracks.slice(0, 4));
            console.log('Genre:', genreName);
            console.log(`[${radioTracks.length}] Added ${Math.min(4, randomTracks.length)} random genre tracks`);
        } catch (error) {
            console.warn('Failed to get random genre tracks:', error.message);
            console.log(`[${radioTracks.length}] Added 0 random genre tracks`);
        }

        // Step 5: Get tracks from same label with same genre
        console.log(externalLabel)
        try {
            if (externalLabel) {
                const labelTracks = await getLabelTracks(externalLabel, genreName, seedPopularity);
                radioTracks.push(...labelTracks.slice(0, 4));
                console.log(`Added ${Math.min(4, labelTracks.length)} tracks from same label`);
            }
        } catch (error) {
            console.warn('Failed to get label tracks:', error.message);
        }

        // Step 6: Fallback to simple methods if we have too few tracks
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
                            source_info: { artist_name: seedArtist.name }
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
                                            source: 'related_artist_simple',
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
                                                source: 'related_artist_simple',
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
                    relatedArtists: radioTracks.filter(t => t.source === 'related_artist_simple').length,
                    sameLabel: radioTracks.filter(t => t.source === 'same_label').length,
                    randomGenre: radioTracks.filter(t => t.source === 'random_genre').length
                }
            }
        });

    } catch (error) {
        console.error('Error creating radio by track:', error);
        res.status(500).json({
            error: 'Failed to create radio by track',
            details: error.message
        });
    }
};

// ==================== HELPER METHODS ====================

/**
 * Get genre information from external sources (Discogs, Beatport)
 */
async function getGenreAndLabelFromExternalSources(trackTitle, artistName, albumTitle) {
    try {
        console.log(`Searching for genre info: "${trackTitle}" by "${artistName}"`);

        // Try Beatport (Discogs returns 403, so skipping it)
        const [beatportGenre,beatportLabel] = await getGenreAndLabelFromBeatport(trackTitle, artistName);
        if (beatportGenre) {
            console.log(`Found genre from Beatport: "${beatportGenre}"`);
            return [beatportGenre, beatportLabel];
        }

        // Try Last.fm artist.getInfo to get first tag as genre
        const lastfmGenre = await getGenreFromLastfm(artistName);
        if (lastfmGenre) {
            console.log(`Found genre from Last.fm: "${lastfmGenre}"`);
            return [lastfmGenre, null]; // Last.fm doesn't provide label info
        }

        console.log('No genre found from external sources');
        return [null, null];
    } catch (error) {
        console.error('Error getting genre from external sources:', error);
        return [null, null];
    }
}


/**
 * Get genre from Beatport
 */
async function getGenreAndLabelFromBeatport(trackTitle, artistName) {
    try {
        // Search for the track on Beatport
        const searchQuery = `${artistName} ${trackTitle}`;
        const searchUrl = `https://www.beatport.com/search?q=${encodeURIComponent(searchQuery)}`;

        console.log(`Searching Beatport: ${searchUrl}`);

        const { data } = await axios.get(searchUrl, {
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
                    return [track.genre[0].genre_name, track.label.label_name];
                }
            }
        }

        return [null, null];
    } catch (error) {
        console.warn('Beatport search failed:', error.message);
        return [null, null];
    }
}

/**
 * Get genre from Last.fm artist.getInfo
 */
async function getGenreFromLastfm(artistName) {
    try {
        console.log(`Getting genre from Last.fm for artist: "${artistName}"`);

        const baseUrl = process.env.BACKEND_URL || 'http://localhost:8000'
        const response = await fetch(`${baseUrl}/lastfm/artist/info?artist=${encodeURIComponent(artistName)}`);

        if (!response.ok) {
            console.warn(`Last.fm API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        if (data.artist && data.artist.tags && data.artist.tags.tag) {
            const tags = Array.isArray(data.artist.tags.tag)
                ? data.artist.tags.tag
                : [data.artist.tags.tag];

            if (tags.length > 0) {
                const firstTag = tags[0].name;
                console.log(`Found Last.fm tag: "${firstTag}" for artist "${artistName}"`);
                return firstTag;
            }
        }

        console.log(`No tags found for artist "${artistName}" on Last.fm`);
        return null;
    } catch (error) {
        console.warn('Last.fm genre lookup failed:', error.message);
        return null;
    }
}

/**
 * Get related releases by year and genre using MusicBrainz
 */
async function getRelatedReleasesByYearAndGenre(artistName, seedYear, genreName) {
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
async function getCollaborationTracks(artistId, targetPopularity) {
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

                        // Look for tracks with multiple contributors (collaborations)
                        const albumCollabs = albumTracks.data.filter(track => {
                            // Check if track has contributors array or multiple artists mentioned in title
                            const hasContributors = track.contributors && track.contributors.length > 1;
                            const titleHasFeaturing = /\b(ft\.?|feat\.?|featuring|with)\b/i.test(track.title);
                            return hasContributors || titleHasFeaturing;
                        });

                        console.log(`Found ${albumCollabs.length} collaboration tracks in album "${album.title}"`);

                        if (albumCollabs.length > 0) {
                            const filteredCollabs = filterByPopularityRange(albumCollabs, targetPopularity);

                            collabTracks.push(...filteredCollabs.map(track => ({
                                ...track,
                                source: 'collaborations',
                                source_info: {
                                    album_title: album.title,
                                    collaboration_type: track.contributors ? 'multi_contributor' : 'featuring'
                                }
                            })));
                        }
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
async function getReleasesByLabelFromMusicBrainz(labelName, genreName, limit = 15) {
    try {
        console.log(`Searching MusicBrainz for releases by label: "${labelName}" with genre: "${genreName}"`);

        // Search for releases by label, optionally filtered by genre
        const searchParams = {
            query: `label:"${labelName}"`,
            limit: limit,
            offset: 0
        };

        // If we have a genre, add it to the search
        if (genreName && genreName !== 'pop') {
            searchParams.query += ` AND tag:"${genreName}"`;
        }

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
            const artistSearchResponse = await makeDeezerRequest(`/search/track?q=artist:"${encodeURIComponent(release.artist)}"&limit=15`);

            if (artistSearchResponse.data && artistSearchResponse.data.length > 0) {
                // Filter by popularity
                const filteredTracks = filterByPopularityRange(artistSearchResponse.data, targetPopularity);

                const processedTracks = filteredTracks.slice(0, 2).map(track => ({
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

async function getLabelTracks(labelName, genreName, targetPopularity) {
    try {
        console.log(`Getting tracks from label "${labelName}" with genre "${genreName}"`);

        // First, try to get releases from MusicBrainz by label
        const labelReleases = await getReleasesByLabelFromMusicBrainz(labelName, genreName, 12);

        if (labelReleases.length > 0) {
            console.log(`Found ${labelReleases.length} releases from MusicBrainz for label "${labelName}"`);
            return await getTracksFromLabelReleases(labelReleases, targetPopularity, 8);
        }


        return shuffleArray(tracks);
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
                    { query: `tag:"${tag}"`, limit: Math.ceil(limit / 4), offset: 0 }, // Top results
                    { query: `tag:"${tag}"`, limit: Math.ceil(limit / 4), offset: Math.ceil(limit / 4) }, // Skip some top results
                    { query: `tag:"${tag}" AND country:*`, limit: Math.ceil(limit / 4), offset: 0 }, // Include country info for diversity
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
async function getReleasesByGenreFromMusicBrainz(genreName, limit = 20) {
    try {
        console.log(`Searching MusicBrainz for releases in genre: "${genreName}"`);

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
                    query: `tag:"${tag}"`,
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
                continue;
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
async function getRandomGenreTracks(genreName, targetPopularity) {
    try {
        console.log(`Looking for random tracks in genre: "${genreName}" using MusicBrainz`);

        let allTracks = [];

        // Use a higher tolerance for genre searches to allow more diverse popularity ranges
        const genreTolerance = 35; // Higher tolerance for genre-based searches

        // If we didn't find enough tracks from artists, try releases
        if (allTracks.length < 8) {
            console.log('Not enough tracks from artists, trying releases from MusicBrainz');

            const genreReleases = await getReleasesByGenreFromMusicBrainz(genreName, 20);
            const artistSet = new Set();
            const releaseSet = new Set();
            if (genreReleases.length > 0) {
                // Get tracks from these releases
                for (const release of genreReleases) { // Limit to top 5 releases
                    try {
                        console.log(`Searching Deezer for tracks from release: "${release.title}" by "${release.artist}"`);
                        if (!artistSet.has(release.artist)) {
                            artistSet.add(release.artist);
                            const releaseSearchResponse = await makeDeezerRequest(`/search/track?q=album:"${encodeURIComponent(release.title)}" artist:"${encodeURIComponent(release.artist)}"&limit=10`);

                            if (releaseSearchResponse.data && releaseSearchResponse.data.length > 0) {
                                console.log(`Found ${releaseSearchResponse.data.length} tracks from Deezer for release "${release.title}"`);

                                // Debug: Log popularity values for first few tracks
                                if (releaseSearchResponse.data.length > 0) {
                                    console.log(`Target popularity: ${targetPopularity}, tolerance: ${genreTolerance}, range: ${Math.max(0, targetPopularity - genreTolerance)} - ${Math.min(100, targetPopularity + genreTolerance)}`);
                                }
                                for (const searchRelease of releaseSearchResponse.data) {
                                    if (searchRelease.artist.name === release.artist && !releaseSet.has(`${release.artist}:${searchRelease.title_short}`)) {
                                        releaseSet.add(`${release.artist}:${searchRelease.title_short}`);
                                        // Filter by popularity with higher tolerance for genre searches
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
                        continue;
                    }
                }
            }
        }
        // TODO If MusicBrainz approach didn't work well, fallback to Last.fm second genre tag


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

// ==================== FALLBACK RADIO METHODS ====================

/**
 * Create simple radio based on Last.fm similar tracks (fallback)
 */
exports.createSimpleRadio = async (req, res) => {
    try {
        const { trackId } = req.params;
        const { limit = 20 } = req.query;

        // Get the seed track information
        const seedTrack = await makeDeezerRequest(`/track/${trackId}`);
        if (!seedTrack || !seedTrack.artist) {
            return res.status(404).json({ error: 'Track not found' });
        }

        // Use artist radio as fallback
        const artistRadio = await makeDeezerRequest(`/artist/${seedTrack.artist.id}/radio`);

        if (!artistRadio.data) {
            return res.status(404).json({ error: 'No radio tracks found' });
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
