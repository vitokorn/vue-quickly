import {MusicServiceInterface} from '../MusicServiceInterface.js'
import {Image, SERVICE_TYPES} from '../types.js'
import {useDeeperStore} from '../../stores/deeper-store.js'

export class DeezerService extends MusicServiceInterface {
    constructor() {
        super()
        this.baseURL = 'https://api.deezer.com'
        this.backendUrl = 'http://localhost:8000'
        this.serviceType = SERVICE_TYPES.DEEZER
    }

    getServiceName() {
        return 'Deezer'
    }

    getServiceType() {
        return this.serviceType
    }

    // Authentication methods
    async authenticate() {
        // TODO: Implement Deezer OAuth flow
        throw new Error('Deezer authentication not yet implemented')
    }

    async refreshToken() {
        // TODO: Implement Deezer token refresh
        throw new Error('Deezer token refresh not yet implemented')
    }

    logout() {
        // TODO: Implement Deezer logout
        throw new Error('Deezer logout not yet implemented')
    }

    isAuthenticated() {
        // TODO: Check Deezer authentication status
        return false
    }

    // User data methods
    async getCurrentUser() {
        throw new Error('Deezer getCurrentUser not yet implemented')
    }

    async getTopTracks(timeRange) {
        throw new Error('Deezer getTopTracks not yet implemented')
    }

    async getTopArtists(timeRange) {
        throw new Error('Deezer getTopArtists not yet implemented')
    }

    async getSavedAlbums(offset, limit) {
        try {
            const userId = localStorage.getItem('deezer-user-id')
            if (!userId) {
                return []
            }

            const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 20
            const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

            const resp = await this.request(`/user/${userId}/albums?limit=${safeLimit}&index=${safeOffset}`)
            const data = resp?.data || []

            // Return array of { album: Album, added_at }
            return data
                .map(a => ({
                    album: this.transformAlbum(a),
                    added_at: a?.time_add ? new Date(a.time_add * 1000).toISOString() : new Date().toISOString()
                }))
                .filter(item => item.album !== null)
        } catch (error) {
            console.error('Deezer getSavedAlbums error:', error)
            throw error
        }
    }

    async getSavedTracks(offset, limit) {
        try {
            // Require user id set via DeezerWelcomeModal
            const userId = localStorage.getItem('deezer-user-id')
            if (!userId) {
                return {items: [], total: 0}
            }

            // Resolve loved playlist id (cached, with paginated discovery fallback)
            const lovedId = await this.getOrFindLovedPlaylistId(userId)
            if (!lovedId) {
                return {items: [], total: 0}
            }

            // Fetch tracks from the loved playlist with pagination
            const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50
            const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0
            const playlistResponse = await this.request(`/playlist/${lovedId}?limit=${safeLimit}&index=${safeOffset}`)

            const items = (playlistResponse?.tracks?.data || []).map(track => ({
                track: this.transformTrack(track),
                // Deezer exposes time_add (unix seconds) on items in some endpoints; fallback to now
                added_at: track?.time_add ? new Date(track.time_add * 1000).toISOString() : new Date().toISOString()
            })).filter(i => i.track !== null)

            const total = playlistResponse?.nb_tracks || playlistResponse?.tracks?.total || playlistResponse?.tracks?.data?.length || 0
            return {items, total}
        } catch (error) {
            console.error('Deezer getSavedTracks error:', error)
            throw error
        }
    }

    // Resolve and cache the loved playlist id for a user, paginating through all playlists if needed
    async getOrFindLovedPlaylistId(userId) {
        // Check cache first
        if (this.lovedPlaylistIdCache.has(userId)) {
            return this.lovedPlaylistIdCache.get(userId)
        }

        // Paginate over user playlists to find is_loved_track === true
        const pageSize = 100
        let index = 0
        let total = Infinity

        while (index < total) {
            const resp = await this.request(`/user/${userId}/playlists?limit=${pageSize}&index=${index}`)
            const data = resp?.data || []
            if (typeof resp?.total === 'number') total = resp.total

            // Try to find loved within this page
            const loved = data.find(p => p && p.is_loved_track === true)
            if (loved && loved.id) {
                const lovedId = loved.id
                this.lovedPlaylistIdCache.set(userId, lovedId)
                return lovedId
            }

            // If page smaller than pageSize, no more pages
            if (data.length < pageSize) break
            index += pageSize
        }

        // Not found
        this.lovedPlaylistIdCache.set(userId, null)
        return null
    }

    async getFollowedArtists(limit = 50, offset = 0) {
        try {
            const userId = localStorage.getItem('deezer-user-id')
            if (!userId) {
                return []
            }

            const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50
            const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

            const resp = await this.request(`/user/${userId}/artists?limit=${safeLimit}&index=${safeOffset}`)
            const data = resp?.data || []

            return data
                .map(artist => this.transformArtist(artist))
                .filter(a => a !== null)
        } catch (error) {
            console.error('Deezer getFollowedArtists error:', error)
            throw error
        }
    }

    // Playlist methods
    async getPlaylists(offset, limit) {
        throw new Error('Deezer getPlaylists not yet implemented')
    }

    async getSpotifyPlaylists(offset, limit) {
        throw new Error('Deezer getPlaylists not yet implemented')
    }


    async getPlaylist(id) {
        throw new Error('Deezer getPlaylist not yet implemented')
    }

    async getPlaylistTracks(id, offset = 0, limit = 50) {
        try {
            const response = await this.request(`/playlist/${id}/tracks?limit=${limit}&index=${offset}`)
            return response.data.map(track => this.transformTrack(track))
        } catch (error) {
            console.error('Deezer getPlaylistTracks error:', error)
            throw error
        }
    }

    async getGenrePlaylist(id) {
        const deeperStore = useDeeperStore()
        const cachedPlaylist = deeperStore.getCachedGenre(id)
        try {
            // Fallback to radio tracks for the genre id
            const tracks = await this.getRadioTracks(id, 0, 50)
            return {
                id: `radio_${id}`,
                name: cachedPlaylist.name,
                description: cachedPlaylist.description,
                images: [],
                owner: { display_name: 'Deezer' },
                public: false,
                totalTracks: tracks.length,
                external_urls: { deezer: `https://www.deezer.com/radio/${id}` },
                service: this.serviceType,
                tracks: { items: tracks.map(t => ({ track: t })), total: tracks.length }
            }
        } catch (e) {
            console.error('Deezer getGenrePlaylist fallback failed', e)
            throw e
        }
    }

    async createPlaylist(name, description) {
        throw new Error('Deezer createPlaylist not yet implemented')
    }

    async addTracksToPlaylist(playlistId, trackIds) {
        throw new Error('Deezer addTracksToPlaylist not yet implemented')
    }

    // Artist methods
    async getArtist(id) {
        try {
            const response = await this.request(`/artist/${id}`)
            return this.transformArtist(response)
        } catch (error) {
            console.error('Deezer getArtist error:', error)
            throw error
        }
    }

    async getArtistTopTracks(id, market) {
        try {
            let first_response = await this.request(`/artist/${id}/top`)
            let second_response = await this.request(`/artist/${id}/top?index=5`)
            let response = first_response.data.concat(second_response.data)
            return response.map(track => this.transformTrack(track))
        } catch (error) {
            console.error('Deezer getArtistTopTracks error:', error)
            throw error
        }
    }

    // Cache for artist albums to avoid multiple requests
    artistAlbumsCache = new Map()
    // Cache for loved-tracks playlist id per user
    lovedPlaylistIdCache = new Map()

    async getArtistAlbums(id, includeGroups, limit = 20) {
        try {
            const allAlbums = await this.getAllArtistAlbums(id)
            // Filter to only include albums (exclude singles, EPs, and compilations)
            const albums = allAlbums.filter(album =>
                album.record_type === 'album'
            ).slice(0, limit) // Apply limit after filtering
            return albums.map(album => this.transformAlbum(album))
        } catch (error) {
            console.error('Deezer getArtistAlbums error:', error)
            throw error
        }
    }

    async getRelatedArtists(id) {
        try {
            const response = await this.request(`/artist/${id}/related`)
            return response.data.map(artist => this.transformArtist(artist))
        } catch (error) {
            console.error('Deezer getRelatedArtists error:', error)
            throw error
        }
    }

    // Single method to get all artist albums (cached) - uses fixed limit for consistent caching
    async getAllArtistAlbums(id) {
        const cacheKey = `${id}` // Remove limit from cache key to ensure all methods share same cache

        if (this.artistAlbumsCache.has(cacheKey)) {
            console.log('Using cached albums for artist:', id)
            return this.artistAlbumsCache.get(cacheKey)
        }

        try {
            console.log('Fetching albums from API for artist:', id)
            const response = await this.request(`/artist/${id}/albums?limit=50`) // Fixed limit for caching
            this.artistAlbumsCache.set(cacheKey, response.data)
            return response.data
        } catch (error) {
            console.error('Deezer getAllArtistAlbums error:', error)
            throw error
        }
    }

    // Additional artist methods for deeper functionality (now using cached data)
    async getArtistSingles(id, limit = 10) {
        try {
            const allAlbums = await this.getAllArtistAlbums(id)
            // Filter for singles and EPs
            const singles = allAlbums.filter(album =>
                album.record_type === 'single' || album.record_type === 'ep'
            ).slice(0, limit) // Apply limit after filtering
            return singles.map(album => this.transformAlbum(album))
        } catch (error) {
            console.error('Deezer getArtistSingles error:', error)
            throw error
        }
    }

    async getArtistAppearances(id, limit = 10) {
        try {
            // Get artist albums and filter for compilation albums where artist appears
            const response = await this.request(`/artist/${id}/albums`)
            const albums = response.data || []

            // Filter for compilation albums (where artist appears but doesn't own)
            const compilationAlbums = albums.filter(album =>
                album.record_type === 'compilation' ||
                (album.artist && album.artist.id !== parseInt(id))
            ).slice(0, limit)

            return compilationAlbums.map(album => this.transformAlbum(album))
        } catch (error) {
            console.error('Deezer getArtistAppearances error:', error)
            throw error
        }
    }

    async getArtistPlaylists(id, limit = 10) {
        try {
            // Use artist playlists endpoint to find playlists featuring this artist
            const response = await this.request(`/artist/${id}/playlists`)
            const playlists = response.data || []
            return playlists.slice(0, limit).map(playlist => this.transformPlaylist(playlist))
        } catch (error) {
            console.error('Deezer getArtistPlaylists error:', error)
            throw error
        }
    }

    async getArtistRadio(id) {
        try {
            const response = await this.request(`/artist/${id}/radio`)
            return response.data.map(track => this.transformTrack(track))
        } catch (error) {
            console.error('Deezer getArtistRadio error:', error)
            throw error
        }
    }

    // Album methods
    async getAlbum(id) {
        try {
            const response = await this.request(`/album/${id}`)
            return this.transformAlbum(response)
        } catch (error) {
            console.error('Deezer getAlbum error:', error)
            throw error
        }
    }

    async getAlbumTracks(id) {
        try {
            const response = await this.request(`/album/${id}/tracks`)
            return response.data.map(track => this.transformTrack(track))
        } catch (error) {
            console.error('Deezer getAlbumTracks error:', error)
            throw error
        }
    }

    // Track methods
    async getTrack(id) {
        try {
            const response = await this.request(`/track/${id}`)
            return this.transformTrack(response)
        } catch (error) {
            console.error('Deezer getTrack error:', error)
            throw error
        }
    }

    // Helper method to create owner images array
    createOwnerImages(userData) {
        if (!userData) return []

        const images = []
        if (userData.picture_small) images.push(new Image(userData.picture_small, 56, 56))
        if (userData.picture_medium) images.push(new Image(userData.picture_medium, 250, 250))
        if (userData.picture_big) images.push(new Image(userData.picture_big, 500, 500))
        if (userData.picture_xl) images.push(new Image(userData.picture_xl, 1000, 1000))

        return images
    }

    // Playlist methods
    async getPlaylist(id) {
        try {
            const response = await this.request(`/playlist/${id}`)
            const playlist = this.transformPlaylist(response)

            // Enrich owner data with user profile information
            if (playlist && playlist.owner && playlist.owner.id) {
                try {
                    const userResponse = await this.request(`/user/${playlist.owner.id}`)
                    if (userResponse) {
                        // Update owner with complete user data
                        playlist.owner = {
                            ...playlist.owner,
                            images: this.createOwnerImages(userResponse),
                            picture: userResponse.picture,
                            picture_small: userResponse.picture_small,
                            picture_medium: userResponse.picture_medium,
                            picture_big: userResponse.picture_big,
                            picture_xl: userResponse.picture_xl,
                            country: userResponse.country,
                            tracklist: userResponse.tracklist
                        }
                    }
                } catch (userError) {
                    console.warn(`Failed to fetch user data for playlist ${id}:`, userError)
                    // Continue with existing owner data if user fetch fails
                }
            }

            return playlist
        } catch (error) {
            console.error('Deezer getPlaylist error:', error)
            throw error
        }
    }


    async getPlaylists(userId, limit = 20, offset = 0) {
        try {
            const response = await this.request(`/user/${userId}/playlists?limit=${limit}&index=${offset}`)
            const data = response?.data || []
            return data.map(playlist => this.transformPlaylist(playlist)).filter(p => p !== null)
        } catch (error) {
            console.error('Deezer getPlaylists error:', error)
            throw error
        }
    }

    async getSpotifyPlaylists(limit = 20, offset = 0) {
        try {
            // const response = await this.request(`/user/637006841/playlists?limit=${limit}&index=${offset}`)
            const response = await this.request(`/chart/0/playlists?limit=${limit}&index=${offset}`)
            const data = response?.data || []
            const playlists = data.map(playlist => this.transformPlaylist(playlist)).filter(p => p !== null)

            // Enrich playlists with missing descriptions
            return await this.enrichPlaylistsWithDescriptions(playlists)
        } catch (error) {
            console.error('Deezer getChartPlaylists error:', error)
            throw error
        }
    }

    async enrichPlaylistsWithDescriptions(playlists) {
        const enrichedPlaylists = []

        for (const playlist of playlists) {
            try {
                // Check if description is missing or empty
                if (!playlist.description || playlist.description.trim().length === 0) {
                    // Fetch full playlist data to get description
                    const fullPlaylist = await this.getPlaylist(playlist.id)
                    if (fullPlaylist && fullPlaylist.description) {
                        playlist.description = fullPlaylist.description
                    }
                }
                enrichedPlaylists.push(playlist)
            } catch (error) {
                console.warn(`Failed to enrich playlist ${playlist.id} with description:`, error)
                // Still add the playlist even if enrichment fails
                enrichedPlaylists.push(playlist)
            }
        }

        return enrichedPlaylists
    }


    // Search and discovery
    async search(query, types, limit = 20) {
        try {
            const searchResults = {
                tracks: [],
                artists: [],
                albums: [],
                playlists: []
            }

            // Search for each type if specified
            if (!types || types.includes('track')) {
                const tracksResponse = await this.request(`/search/track?q=${encodeURIComponent(query)}&limit=${limit}`)
                console.log('Tracks response:', tracksResponse)
                if (tracksResponse && tracksResponse.data && Array.isArray(tracksResponse.data)) {
                    searchResults.tracks = tracksResponse.data.map(track => this.transformTrack(track)).filter(track => track !== null)
                } else {
                    console.warn('Invalid tracks response structure:', tracksResponse)
                    searchResults.tracks = []
                }
            }

            if (!types || types.includes('artist')) {
                const artistsResponse = await this.request(`/search/artist?q=${encodeURIComponent(query)}&limit=${limit}`)
                console.log('Artists response:', artistsResponse)
                if (artistsResponse && artistsResponse.data && Array.isArray(artistsResponse.data)) {
                    searchResults.artists = artistsResponse.data.map(artist => this.transformArtist(artist)).filter(artist => artist !== null)
                } else {
                    console.warn('Invalid artists response structure:', artistsResponse)
                    searchResults.artists = []
                }
            }

            if (!types || types.includes('album')) {
                const albumsResponse = await this.request(`/search/album?q=${encodeURIComponent(query)}&limit=${limit}`)
                console.log('Albums response:', albumsResponse)
                if (albumsResponse && albumsResponse.data && Array.isArray(albumsResponse.data)) {
                    searchResults.albums = albumsResponse.data.map(album => this.transformAlbum(album)).filter(album => album !== null)
                } else {
                    console.warn('Invalid albums response structure:', albumsResponse)
                    searchResults.albums = []
                }
            }

            if (!types || types.includes('playlist')) {
                const playlistsResponse = await this.request(`/search/playlist?q=${encodeURIComponent(query)}&limit=${limit}`)
                console.log('Playlists response:', playlistsResponse)
                if (playlistsResponse && playlistsResponse.data && Array.isArray(playlistsResponse.data)) {
                    const playlists = playlistsResponse.data.map(playlist => this.transformPlaylist(playlist)).filter(playlist => playlist !== null)
                    // Enrich playlists with missing descriptions
                    searchResults.playlists = await this.enrichPlaylistsWithDescriptions(playlists)
                } else {
                    console.warn('Invalid playlists response structure:', playlistsResponse)
                    searchResults.playlists = []
                }
            }

            return searchResults
        } catch (error) {
            console.error('Deezer search error:', error)
            throw error
        }
    }

    async getNewReleases(limit = 20, offset = 0) {
        try {
            const response = await this.request(`/editorial/0/releases`)
            const albums = response.data.slice(offset, offset + limit) // Apply offset and limit
            return albums.map(album => this.transformAlbum(album))
        } catch (error) {
            console.error('Deezer getNewReleases error:', error)
            throw error
        }
    }

    async getRecommendations(params) {
        try {
            // Handle seed tracks by getting similar tracks from Last.fm and searching in Deezer
            if (params.seedTracks && params.seedTracks.length > 0) {
                const recommendations = []

                for (const seedTrack of params.seedTracks) {
                    console.log('seedTrack:', seedTrack)
                    try {
                        // Use title_short if available, otherwise fall back to full name
                        const trackTitle = seedTrack.title_short || seedTrack.name
                        const fallbackTitle = seedTrack.title_short ? seedTrack.name : null
                        console.log(`Searching Last.fm with title: "${trackTitle}" (original: "${seedTrack.name}")`)

                        // Get similar tracks from Last.fm for this seed track
                        const similarTracks = await this.getSimilarTracksFromLastfm(
                            seedTrack.artists[0].name,
                            trackTitle,
                            params.limit || 10,
                            fallbackTitle
                        )
                        recommendations.push(...similarTracks)
                    } catch (error) {
                        console.error(`Error getting similar tracks for seed track "${seedTrack.name}":`, error)
                    }
                }

                // Remove duplicates and limit results
                const uniqueRecommendations = this.removeDuplicateTracks(recommendations)
                return uniqueRecommendations.slice(0, params.limit || 20)
            }

            // Handle seed artists using Deezer's artist radio endpoint
            if (params.seedArtists && params.seedArtists.length > 0) {
                const artistId = params.seedArtists[0].id
                const response = await this.request(`/artist/${artistId}/radio`)
                return response.data.map(track => this.transformTrack(track))
            }

            // If no seed data, return empty array
            return []
        } catch (error) {
            console.error('Deezer getRecommendations error:', error)
            throw error
        }
    }

    // Categories methods
    async getCategories(offset = 0, limit = 50) {
        try {
            const response = await this.request(`/radio/lists?index=${offset}&limit=${limit}`)

            // Transform radio items according to the actual API response structure
            const radioItems = response.data.map(radio => ({
                id: radio.id,
                name: radio.title, // Use 'title' instead of 'name'
                type: 'radio',
                icons: radio.picture ? [{url: radio.picture}] : [],
                href: radio.link || `https://www.deezer.com/radio/${radio.id}`,
                tracklist: radio.tracklist,
                description: radio.description || '',
                // Add additional image sizes if available
                images: radio.picture_medium ? [
                    { url: radio.picture_small, height: 56, width: 56 },
                    { url: radio.picture_medium, height: 250, width: 250 },
                    { url: radio.picture_big, height: 500, width: 500 },
                    { url: radio.picture_xl, height: 1000, width: 1000 }
                ] : []
            }))

            return {
                items: radioItems,
                total: response.total,
                next: response.next,
                previous: null // Radio lists don't seem to have 'prev' field
            }
        } catch (error) {
            console.error('Deezer getCategories error:', error)
            throw error
        }
    }

    async getCategoryPlaylists(categoryId, offset = 0, limit = 50) {
        try {
            // Check if this is a radio category (radio IDs are numeric)
            if (!isNaN(categoryId)) {
                // For radio categories, return radio tracks as a playlist-like structure
                const tracks = await this.getRadioTracks(categoryId, offset, limit)

                // Get the cached category to use its name
                const deeperStore = useDeeperStore()
                const cachedCategory = deeperStore.getCachedCategory(categoryId)

                return {
                    items: [{
                        id: `radio_${categoryId}`,
                        name: cachedCategory ? cachedCategory.name : `Radio ${categoryId}`,
                        type: 'radio',
                        tracks: {
                            items: tracks.map(track => ({ track })),
                            total: tracks.length
                        }
                    }],
                    total: 1,
                    next: null,
                    previous: null
                }
            }

            // For genre categories, use the original logic
            const response = await this.request(`/genre/${categoryId}/playlists?index=${offset}&limit=${limit}`)
            return {
                items: response.data.data.map(playlist => this.transformPlaylist(playlist)),
                total: response.data.total,
                next: response.data.next,
                previous: response.data.prev
            }
        } catch (error) {
            console.error('Deezer getCategoryPlaylists error:', error)
            throw error
        }
    }

    // Radio methods
    async getRadioTracks(radioId, offset = 0, limit = 50) {
        try {
            const response = await this.request(`/radio/${radioId}/tracks?index=${offset}&limit=${limit}`)
            return response.data.map(track => this.transformTrack(track))
        } catch (error) {
            console.error('Deezer getRadioTracks error:', error)
            throw error
        }
    }

    // Genres methods
    async getGenres(offset = 0, limit = 50) {
        try {
            console.log('🎵 DeezerService: Fetching genres with offset:', offset, 'limit:', limit)
            const response = await this.request(`/genre?index=${offset}&limit=${limit}`)
            console.log('📦 DeezerService: Genres response:', response)

            // Transform genre data to match the expected format
            const genres = response.data.map(genre => ({
                id: genre.id.toString(),
                name: genre.name,
                type: 'genre',
                icons: genre.picture ? [{url: genre.picture}] : [],
                href: genre.link || `https://www.deezer.com/genre/${genre.id}`,
                description: genre.name,
                // Add additional image sizes if available
                images: genre.picture_medium ? [
                    { url: genre.picture_big, height: 500, width: 500 },
                    { url: genre.picture_xl, height: 1000, width: 1000 }
                ] : []
            }))

            return {
                items: genres,
                total: response.total || genres.length,
                next: offset + limit < (response.total || genres.length) ? `/genre?index=${offset + limit}&limit=${limit}` : null,
                previous: offset > 0 ? `/genre?index=${Math.max(0, offset - limit)}&limit=${limit}` : null
            }
        } catch (error) {
            console.error('Deezer getGenres error:', error)
            throw error
        }
    }


    // User methods
    async getUser(id) {
        try {
            const response = await this.request(`/user/${id}`)
            return {
                id: response.id,
                display_name: response.name,
                name: response.name,
                country: response.country,
                images: this.transformImages([
                    {url: response.picture_small, height: 56, width: 56},
                    {url: response.picture_medium, height: 250, width: 250},
                    {url: response.picture_big, height: 500, width: 500},
                    {url: response.picture_xl, height: 1000, width: 1000}
                ])
            }
        } catch (error) {
            console.error('Deezer getUser error:', error)
            throw error
        }
    }

    // Follow/Unfollow methods
    async followArtist(id) {
        throw new Error('Deezer followArtist not yet implemented')
    }

    async unfollowArtist(id) {
        throw new Error('Deezer unfollowArtist not yet implemented')
    }

    async followAlbum(id) {
        throw new Error('Deezer followAlbum not yet implemented')
    }

    async unfollowAlbum(id) {
        throw new Error('Deezer unfollowAlbum not yet implemented')
    }

    async followTrack(id) {
        throw new Error('Deezer followTrack not yet implemented')
    }

    async unfollowTrack(id) {
        throw new Error('Deezer unfollowTrack not yet implemented')
    }

    async followPlaylist(id) {
        throw new Error('Deezer followPlaylist not yet implemented')
    }

    async unfollowPlaylist(id) {
        throw new Error('Deezer unfollowPlaylist not yet implemented')
    }

    // Check following status
    async checkFollowingArtist(id) {
        throw new Error('Deezer checkFollowingArtist not yet implemented')
    }

    async checkFollowingAlbum(id) {
        throw new Error('Deezer checkFollowingAlbum not yet implemented')
    }

    async checkFollowingTrack(id) {
        throw new Error('Deezer checkFollowingTrack not yet implemented')
    }

    async checkFollowingPlaylist(id) {
        throw new Error('Deezer checkFollowingPlaylist not yet implemented')
    }

    // Helper method for making requests
    async request(endpoint) {
        // Try multiple CORS proxy options
        const proxies = [
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://thingproxy.freeboard.io/fetch/'
        ]

        const targetUrl = `${this.baseURL}${endpoint}`

        for (let i = 0; i < proxies.length; i++) {
            try {
                const proxyUrl = proxies[i]
                const fullUrl = i === 0 ? `${proxyUrl}${encodeURIComponent(targetUrl)}` : `${proxyUrl}${targetUrl}`

                const response = await fetch(fullUrl, {
                    headers: {
                        'Accept': 'application/json'
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    console.log(`Proxy ${i + 1} success for ${endpoint}:`, data)
                    return data
                }
            } catch (error) {
                console.warn(`Proxy ${i + 1} failed:`, error.message)
                if (i === proxies.length - 1) {
                    throw new Error(`All CORS proxies failed. Last error: ${error.message}`)
                }
            }
        }
    }

    // Transformation methods to convert Deezer format to our standard format
    transformTrack(data) {
        if (!data || !data.id) {
            console.warn('Invalid track data:', data)
            return null
        }

        // Handle contributors array for more detailed artist information
        let artists = []
        if (data.contributors && Array.isArray(data.contributors)) {
            artists = data.contributors.map(contributor => this.transformArtist(contributor))
        } else if (data.artist) {
            artists = [this.transformArtist(data.artist)]
        }

        const shortTitle = this.generateShortTitle(data.title)
        console.log(`Deezer track: "${data.title}" -> short: "${shortTitle}"`)

        return {
            id: data.id.toString(),
            name: data.title,
            title_short: shortTitle,
            artists: artists,
            album: data.album ? this.transformAlbum(data.album) : null,
            duration_ms: parseInt(data.duration) * 1000, // Convert seconds to milliseconds
            previewUrl: data.preview || null,
            external_urls: {
                spotify: data.link,
                deezer: data.link
            },
            images: this.transformImages(data.album?.cover_medium ? [{
                url: data.album.cover_medium,
                height: 250,
                width: 250
            }] : []),
            // Additional Deezer-specific fields
            readable: data.readable || false,
            rank: data.rank || 0,
            explicit_lyrics: data.explicit_lyrics || false,
            explicit_content_lyrics: data.explicit_content_lyrics || 0,
            explicit_content_cover: data.explicit_content_cover || 0,
            service: this.serviceType
        }
    }

    transformArtist(data) {
        if (!data || !data.id) {
            console.warn('Invalid artist data:', data)
            return null
        }

        return {
            id: data.id.toString(),
            name: data.name,
            images: this.transformImages(data.picture_medium ? [{
                url: data.picture_medium,
                height: 250,
                width: 250
            }] : []),
            external_urls: {
                spotify: data.link,
                deezer: data.link
            },
            followers: {
                total: data.nb_fan || 0
            },
            // Additional Deezer-specific fields
            genres: [], // Deezer doesn't provide genres in artist data
            popularity: 0, // Deezer doesn't provide popularity score
            nb_album: data.nb_album || 0,
            radio: data.radio || false,
            service: this.serviceType
        }
    }

    transformAlbum(data) {
        if (!data || !data.id) {
            console.warn('Invalid album data:', data)
            return null
        }

        return {
            id: data.id.toString(),
            name: data.title,
            artists: data.artist ? [this.transformArtist(data.artist)] : [],
            images: this.transformImages(data.cover_medium ? [{
                url: data.cover_medium,
                height: 250,
                width: 250
            }] : []),
            external_urls: {
                spotify: data.link,
                deezer: data.link
            },
            total_tracks: data.nb_tracks || 0,
            // Additional Deezer-specific fields
            release_date: data.release_date || null,
            record_type: data.record_type || 'album',
            fans: data.fans || 0,
            genre_id: data.genre_id || null,
            explicit_lyrics: data.explicit_lyrics || false,
            service: this.serviceType
        }
    }

    transformPlaylist(data) {
        if (!data || !data.id) {
            console.warn('Invalid playlist data:', data)
            return null
        }

        // Transform tracks if they exist in the playlist data
        let tracks = null
        console.log('809', data.tracks)
        if (data.tracks && data.tracks.data && Array.isArray(data.tracks.data)) {
            tracks = {
                items: data.tracks.data.map(track => ({
                    track: this.transformTrack(track)
                })),
                total: data.nb_tracks || data.tracks.data.length
            }
        } else {
            tracks = {
                total: data.nb_tracks || 0
            }
        }
        console.log('playlist 767', data)
        return {
            id: data.id.toString(),
            name: data.title,
            description: data.description || '',
            images: this.transformImages([
                {url: data.picture_big, height: 500, width: 500},
                {url: data.picture_xl, height: 1000, width: 1000}
            ]),
            external_urls: {
                spotify: data.link,
                deezer: data.link
            },
            tracks: tracks,
            owner: {
                display_name: data.creator?.name || data.user?.name || 'Unknown',
                external_urls: {
                    deezer: data.creator?.link || data.user?.link || `https://www.deezer.com/profile/${(data.creator?.id || data.user?.id)?.toString() || 'unknown'}`
                },
                href: `https://api.deezer.com/user/${(data.creator?.id || data.user?.id)?.toString() || 'unknown'}`,
                id: (data.creator?.id || data.user?.id)?.toString() || 'unknown',
                type: "user",
                uri: `deezer:user:${(data.creator?.id || data.user?.id)?.toString() || 'unknown'}`,
                // Additional Deezer-specific fields
                images: this.createOwnerImages(data.creator || data.user),
                country: data.creator?.country || data.user?.country,
                tracklist: data.creator?.tracklist || data.user?.tracklist
            },
            public: data.public || false,
            service: this.serviceType
        }
    }


    transformImages(images) {
        if (!images || !Array.isArray(images)) {
            return []
        }
        return images.map(img => ({
            url: img.url,
            height: img.height || null,
            width: img.width || null
        }))
    }

    // ==================== HELPER METHODS ====================

    /**
     * Generate a short title by removing common suffixes and extra information
     * @param {string} fullTitle - The full track title
     * @returns {string} - The shortened title
     */
    generateShortTitle(fullTitle) {
        if (!fullTitle) return ''

        let shortTitle = fullTitle.trim()

        // Remove common remix indicators
        const remixPatterns = [
            /\s*-\s*[^-]*(?:remix|edit|version|mix|radio|single|extended|club|dub|instrumental|acoustic|live|demo|original|explicit|clean)\s*$/i,
            /\s*\([^)]*(?:remix|edit|version|mix|radio|single|extended|club|dub|instrumental|acoustic|live|demo|original|explicit|clean)[^)]*\)\s*$/i,
            /\s*\[[^\]]*(?:remix|edit|version|mix|radio|single|extended|club|dub|instrumental|acoustic|live|demo|original|explicit|clean)[^\]]*\]\s*$/i
        ]

        for (const pattern of remixPatterns) {
            shortTitle = shortTitle.replace(pattern, '')
        }

        // Remove common prefixes
        const prefixPatterns = [
            /^(?:feat\.|ft\.|featuring)\s*/i,
            /^(?:prod\.|produced by)\s*/i
        ]

        for (const pattern of prefixPatterns) {
            shortTitle = shortTitle.replace(pattern, '')
        }

        // Remove extra whitespace and return
        return shortTitle.trim()
    }

    /**
     * Remove duplicate tracks based on track ID
     * @param {Array} tracks - Array of track objects
     * @returns {Array} Array of unique tracks
     */
    removeDuplicateTracks(tracks) {
        const seen = new Set()
        return tracks.filter(track => {
            if (seen.has(track.id)) {
                return false
            }
            seen.add(track.id)
            return true
        })
    }

    // ==================== LAST.FM INTEGRATION METHODS ====================

    /**
     * Get similar tracks from Last.fm and search them in Deezer
     * @param {string} artist - Artist name
     * @param {string} track - Track name
     * @param {number} limit - Number of similar tracks to fetch (default: 10)
     * @returns {Promise<Object>} Combined results from Last.fm and Deezer
     */
    async getSimilarTracksForDeezer(artist, track, limit = 10) {
        try {
            if (!artist || !track) {
                throw new Error('Artist and track parameters are required')
            }

            // Get similar tracks from backend (which uses Last.fm)
            const backendResponse = await fetch(`${this.backendUrl}/lastfm/similar-tracks-for-deezer?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&limit=${limit}`)
            const backendData = await backendResponse.json()

            if (!backendResponse.ok) {
                // If backend fails, try fallback to similar artists
                if (backendResponse.status === 404) {
                    return await this.getSimilarArtistsAsTracks(artist, limit)
                }
                throw new Error(backendData.error || 'Failed to get similar tracks from backend')
            }

            const similarTracks = backendData.similarTracks || []

            // Search each similar track in Deezer
            const deezerResults = []

            for (const lastfmTrack of similarTracks) {
                try {
                    const searchQuery = `${lastfmTrack.artist} ${lastfmTrack.name}`
                    const deezerResponse = await this.request(`/search/track?q=${encodeURIComponent(searchQuery)}&limit=1`)

                    if (deezerResponse && deezerResponse.data && deezerResponse.data.length > 0) {
                        const deezerTrack = deezerResponse.data[0]
                        deezerResults.push({
                            lastfmTrack: {
                                name: lastfmTrack.name,
                                artist: lastfmTrack.artist,
                                playcount: lastfmTrack.playcount,
                                match: lastfmTrack.match,
                                url: lastfmTrack.url,
                                duration: lastfmTrack.duration,
                                images: lastfmTrack.images
                            },
                            deezerTrack: this.transformTrack(deezerTrack),
                            searchQuery: searchQuery
                        })
                    } else {
                        // Track not found in Deezer
                        deezerResults.push({
                            lastfmTrack: {
                                name: lastfmTrack.name,
                                artist: lastfmTrack.artist,
                                playcount: lastfmTrack.playcount,
                                match: lastfmTrack.match,
                                url: lastfmTrack.url,
                                duration: lastfmTrack.duration,
                                images: lastfmTrack.images
                            },
                            deezerTrack: null,
                            searchQuery: searchQuery,
                            error: 'Track not found in Deezer'
                        })
                    }
                } catch (error) {
                    console.error(`Error searching track "${lastfmTrack.name}" by "${lastfmTrack.artist}" in Deezer:`, error)
                    deezerResults.push({
                        lastfmTrack: {
                            name: lastfmTrack.name,
                            artist: lastfmTrack.artist,
                            playcount: lastfmTrack.playcount,
                            match: lastfmTrack.match,
                            url: lastfmTrack.url,
                            duration: lastfmTrack.duration,
                            images: lastfmTrack.images
                        },
                        deezerTrack: null,
                        searchQuery: `${lastfmTrack.artist} ${lastfmTrack.name}`,
                        error: 'Search failed'
                    })
                }
            }

            return {
                originalTrack: backendData.originalTrack,
                similarTracks: similarTracks,
                deezerResults: deezerResults,
                summary: {
                    totalSimilarTracks: similarTracks.length,
                    foundInDeezer: deezerResults.filter(r => r.deezerTrack !== null).length,
                    notFoundInDeezer: deezerResults.filter(r => r.deezerTrack === null).length
                }
            }

        } catch (error) {
            console.error('Error getting similar tracks for Deezer:', error)
            throw error
        }
    }


    /**
     * Get similar artists and their top tracks as fallback when similar tracks are not available
     * @param {string} artist - Artist name
     * @param {number} limit - Number of similar artists to fetch (default: 10)
     * @returns {Promise<Object>} Combined results from Last.fm and Deezer
     */
    async getSimilarArtistsAsTracks(artist, limit = 10) {
        try {
            if (!artist) {
                throw new Error('Artist parameter is required')
            }

            // Get similar artists from backend (which uses Last.fm)
            const similarArtistsResponse = await fetch(`${this.backendUrl}/lastfm/artist/similar?artist=${encodeURIComponent(artist)}&limit=${limit}`)
            const similarArtistsData = await similarArtistsResponse.json()

            if (!similarArtistsResponse.ok || !similarArtistsData.similarartists || !similarArtistsData.similarartists.artist) {
                return {
                    originalTrack: {artist, track: 'N/A'},
                    similarTracks: [],
                    deezerResults: [],
                    summary: {
                        totalSimilarTracks: 0,
                        foundInDeezer: 0,
                        notFoundInDeezer: 0
                    },
                    fallbackUsed: 'similar_artists',
                    fallbackMessage: 'No similar artists found'
                }
            }

            const similarArtists = Array.isArray(similarArtistsData.similarartists.artist)
                ? similarArtistsData.similarartists.artist
                : [similarArtistsData.similarartists.artist]

            // Get top track for each similar artist
            const deezerResults = []
            const similarTracks = []

            for (const lastfmArtist of similarArtists) {
                try {
                    // Get top track for this artist from backend
                    const topTracksResponse = await fetch(`${this.backendUrl}/lastfm/artist/top-tracks?artist=${encodeURIComponent(lastfmArtist.name)}&limit=1`)
                    const topTracksData = await topTracksResponse.json()

                    if (topTracksResponse.ok && topTracksData.toptracks && topTracksData.toptracks.track && topTracksData.toptracks.track.length > 0) {
                        const topTrack = Array.isArray(topTracksData.toptracks.track)
                            ? topTracksData.toptracks.track[0]
                            : topTracksData.toptracks.track

                        // Create a similar track object from the top track
                        const similarTrack = {
                            name: topTrack.name,
                            artist: {
                                name: lastfmArtist.name
                            },
                            playcount: topTrack.playcount || '0',
                            match: lastfmArtist.match || '0',
                            url: topTrack.url,
                            duration: topTrack.duration || '0',
                            image: topTrack.image || lastfmArtist.image || []
                        }

                        similarTracks.push(similarTrack)

                        // Search this track in Deezer
                        const searchQuery = `${lastfmArtist.name} ${topTrack.name}`
                        const deezerResponse = await this.request(`/search/track?q=${encodeURIComponent(searchQuery)}&limit=1`)

                        if (deezerResponse && deezerResponse.data && deezerResponse.data.length > 0) {
                            const deezerTrack = deezerResponse.data[0]
                            deezerResults.push({
                                lastfmTrack: {
                                    name: topTrack.name,
                                    artist: lastfmArtist.name,
                                    playcount: topTrack.playcount || '0',
                                    match: lastfmArtist.match || '0',
                                    url: topTrack.url,
                                    duration: topTrack.duration || '0',
                                    images: topTrack.image || lastfmArtist.image || []
                                },
                                deezerTrack: this.transformTrack(deezerTrack),
                                searchQuery: searchQuery,
                                source: 'similar_artist_top_track'
                            })
                        } else {
                            // Track not found in Deezer
                            deezerResults.push({
                                lastfmTrack: {
                                    name: topTrack.name,
                                    artist: lastfmArtist.name,
                                    playcount: topTrack.playcount || '0',
                                    match: lastfmArtist.match || '0',
                                    url: topTrack.url,
                                    duration: topTrack.duration || '0',
                                    images: topTrack.image || lastfmArtist.image || []
                                },
                                deezerTrack: null,
                                searchQuery: searchQuery,
                                error: 'Track not found in Deezer',
                                source: 'similar_artist_top_track'
                            })
                        }
                    } else {
                        // No top tracks found for this artist
                        deezerResults.push({
                            lastfmTrack: {
                                name: 'Unknown',
                                artist: lastfmArtist.name,
                                playcount: '0',
                                match: lastfmArtist.match || '0',
                                url: lastfmArtist.url,
                                duration: '0',
                                images: lastfmArtist.image || []
                            },
                            deezerTrack: null,
                            searchQuery: lastfmArtist.name,
                            error: 'No top tracks found',
                            source: 'similar_artist_no_tracks'
                        })
                    }
                } catch (error) {
                    console.error(`Error getting top track for artist "${lastfmArtist.name}":`, error)
                    // Still add the artist info even if we can't get their top track
                    deezerResults.push({
                        lastfmTrack: {
                            name: 'Unknown',
                            artist: lastfmArtist.name,
                            playcount: '0',
                            match: lastfmArtist.match || '0',
                            url: lastfmArtist.url,
                            duration: '0',
                            images: lastfmArtist.image || []
                        },
                        deezerTrack: null,
                        searchQuery: lastfmArtist.name,
                        error: 'Failed to get top track',
                        source: 'similar_artist_fallback'
                    })
                }
            }

            return {
                originalTrack: {
                    artist,
                    track: 'N/A',
                    lastfmUrl: `https://www.last.fm/music/${encodeURIComponent(artist)}`
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
                deezerResults: deezerResults,
                summary: {
                    totalSimilarTracks: similarTracks.length,
                    foundInDeezer: deezerResults.filter(r => r.deezerTrack !== null).length,
                    notFoundInDeezer: deezerResults.filter(r => r.deezerTrack === null).length
                },
                fallbackUsed: 'similar_artists',
                fallbackMessage: `Found ${similarTracks.length} tracks from similar artists`
            }

        } catch (error) {
            console.error('Error getting similar artists as tracks:', error)
            throw error
        }
    }


    /**
     * Get similar tracks from Last.fm and return only Deezer results
     * @param {string} artist - Artist name
     * @param {string} track - Track name
     * @param {number} limit - Number of similar tracks to fetch (default: 10)
     * @param {string} fallbackTrack - Optional fallback track name to try if first search fails
     * @returns {Promise<Array>} Array of Deezer tracks found
     */
    async getSimilarTracksFromLastfm(artist, track, limit = 10, fallbackTrack = null) {
        try {
            const results = await this.getSimilarTracksForDeezer(artist, track, limit)
            const foundTracks = results.deezerResults
                .filter(result => result.deezerTrack !== null)
                .map(result => result.deezerTrack)
            console.log(foundTracks)
            console.log(track)
            console.log(fallbackTrack)
            // If no tracks found and we have a fallback, try the fallback
            if (foundTracks.length === 0 && fallbackTrack && fallbackTrack !== track) {
                console.log(`No tracks found for "${track}", trying fallback "${fallbackTrack}"`)
                try {
                    const fallbackResults = await this.getSimilarTracksForDeezer(artist, fallbackTrack, limit)
                    return fallbackResults.deezerResults
                        .filter(result => result.deezerTrack !== null)
                        .map(result => result.deezerTrack)
                } catch (fallbackError) {
                    console.error('Fallback search also failed:', fallbackError)
                }
            }

            return foundTracks
        } catch (error) {
            console.error('Error getting similar tracks from Last.fm:', error)
            throw error
        }
    }

    async getUserPlaylists(userId, limit = 20) {
        try {
            if (!userId) {
                userId = localStorage.getItem('deezer-user-id')
            }
            // Fetch both user data and playlists in parallel
            const [userResponse, playlistsResponse] = await Promise.all([
                this.request(`/user/${userId}`),
                this.request(`/user/${userId}/playlists?limit=${limit}`)
            ])

            const userData = userResponse || {}
            const playlists = playlistsResponse.data || []

            // Transform playlists and add Spotify-style owner data to each playlist
            const transformedPlaylists = playlists.map(playlist => {
                const transformedPlaylist = this.transformPlaylist(playlist)
                // Add Spotify-style owner data to the playlist
                if (transformedPlaylist) {
                    transformedPlaylist.owner = {
                        display_name: userData.name,
                        external_urls: {
                            deezer: userData.link || `https://www.deezer.com/profile/${userData.id}`
                        },
                        href: `https://api.deezer.com/user/${userData.id}`,
                        id: userData.id,
                        type: "user",
                        uri: `deezer:user:${userData.id}`,
                        // Additional Deezer-specific fields
                        images: this.createOwnerImages(userData),
                        picture: userData.picture,
                        picture_small: userData.picture_small,
                        picture_medium: userData.picture_medium,
                        picture_big: userData.picture_big,
                        picture_xl: userData.picture_xl,
                        country: userData.country,
                        tracklist: userData.tracklist
                    }
                }
                return transformedPlaylist
            })

            return transformedPlaylists
        } catch (error) {
            console.error('Deezer getUserPlaylists error:', error)
            throw error
        }
    }
}
