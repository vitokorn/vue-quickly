import {defineStore} from 'pinia'
import {musicServiceManager} from '../services/MusicServiceManager'
import {useVisibilityManager} from '../composables/useVisibilityManager'
import {toRaw} from 'vue'

export const useDeeperStore = defineStore('deeper', {
    state: () => ({
        // Current section being displayed
        currentSection: 'search',

        // Loading states for deeper elements
        loading: {
            tracks: new Set(),
            artists: new Set(),
            albums: new Set(),
            playlists: new Set(),
            'user-playlists': new Set(),
            seedArtists: new Set(),
            seedTracks: new Set(),
            genres: new Set(),
        },

        // Currently loading items for UI feedback

        // Global loading state to prevent multiple clicks
        isGloballyLoading: false,

        // Detailed data sections
        sections: {
            yourPlaylists: [],
            topArtists: [],
            topArtists6: [],
            topArtistsAll: [],
            topTracks: [],
            topTracks6: [],
            topTracksAll: [],
            savedAlbums: [],
            savedTracks: [],
            followedArtists: [],
            newReleases: [],
            spotifyPlaylists: [],
            categories: [],
            categoryPlaylists: [],
            genres: [],
            genrePlaylists: [],
            genreContent: [],
            search: [],
            artistDetails: []
        },

        // Cache for detailed data
        cache: {
            tracks: new Map(),
            artists: new Map(),
            albums: new Map(),
            playlists: new Map(),
            seedArtists: new Map(),
            seedTracks: new Map(),
            categories: new Map(),
            genres: new Map()
        }
    }),

    getters: {
        getSectionData: (state) => (sectionName) => state.sections[sectionName] || [],

        getCachedTrack: (state) => (id) => state.cache.tracks.get(id),
        getCachedArtist: (state) => (id) => state.cache.artists.get(id),
        getCachedAlbum: (state) => (id) => state.cache.albums.get(id),
        getCachedPlaylist: (state) => (id) => state.cache.playlists.get(id),
        getCachedSeedArtist: (state) => (id) => state.cache.seedArtists.get(id),
        getCachedSeedTrack: (state) => (id) => state.cache.seedTracks.get(id),
        getCachedCategory: (state) => (id) => state.cache.categories.get(id),
        getCachedGenre: (state) => (id) => state.cache.genres.get(id),

        // Loading state getters
        isTrackLoading: (state) => (id) => state.loading.tracks.has(id),
        isArtistLoading: (state) => (id) => state.loading.artists.has(id),
        isAlbumLoading: (state) => (id) => state.loading.albums.has(id),
        isPlaylistLoading: (state) => (id) => state.loading.playlists.has(id),
        isSeedArtistLoading: (state) => (id) => state.loading.seedArtists.has(id),
        isSeedTrackLoading: (state) => (id) => state.loading.seedTracks.has(id),

        // Currently loading getter

        // Global loading getter
        getIsGloballyLoading: (state) => state.isGloballyLoading
    },

    actions: {
        // Set current section
        setCurrentSection(sectionName) {
            this.currentSection = sectionName
            console.log('Current section set to:', sectionName)
        },

        // Loading state management
        setLoading(type, id, isLoading) {
            if (isLoading) {
                this.loading[type].add(id)
            } else {
                this.loading[type].delete(id)
            }
        },

        clearLoading(type) {
            this.loading[type].clear()
        },

        clearAllLoading() {
            Object.keys(this.loading).forEach(key => {
                this.loading[key].clear()
            })
        },

        // Global loading management
        setGlobalLoading(isLoading) {
            this.isGloballyLoading = isLoading
        },

        // Add item to section
        addToSection(sectionName, item) {
            console.log('addToSection called with sectionName:', sectionName, 'item:', item.id, 'type:', item.type, 'parentKey:', item.parentKey)
            if (!this.sections[sectionName]) {
                this.sections[sectionName] = []
            }

            // Check if this exact item already exists (same id, type, and parentKey)
            if (item.parentKey !== undefined) {
                const existingIndex = this.sections[sectionName].findIndex(i =>
                    i.id === item.id &&
                    i.type === item.type &&
                    (i.parentKey || null) === (item.parentKey || null)
                )
                if (existingIndex !== -1) {
                    console.log('Item already exists in section, skipping')
                    return
                }
            }

            const existingIndex = this.sections[sectionName].findIndex(i => i.id === item.id)
            if (existingIndex === -1) {
                this.sections[sectionName].push(item)
                console.log('Added item to section. Section now has', this.sections[sectionName].length, 'items')
            } else {
                console.log('Item already exists in section')
            }
        },

        // Clear section
        clearSection(sectionName) {
            if (this.sections[sectionName]) {
                this.sections[sectionName] = []
            }
        },

        // Remove item from section
        removeFromSection(sectionName, itemId) {
            if (this.sections[sectionName]) {
                const index = this.sections[sectionName].findIndex(item => item.id === itemId)
                if (index > -1) {
                    this.sections[sectionName].splice(index, 1)
                }
            }
        },

        // Hide the parent root component (key without parent tag) when adding a same-type child
        hideRootComponentForParent(type, visibilityManager, parentId) {
            if (!parentId) return
            const rootKey = `${type}_${parentId}`
            if (visibilityManager.isComponentRegistered(rootKey)) {
                visibilityManager.hideComponent(rootKey)
            }
        },

        // Remove an entire subtree rooted at rootId (root + all descendants) in given section
        removeSubtree(sectionName, rootId, visibilityManager, rootTypePrefix = null) {
            const sectionItems = this.sections[sectionName] || []
            const toRemove = new Set([rootId])
            let added = true
            while (added) {
                added = false
                for (const it of sectionItems) {
                    if (it.parentKey && toRemove.has(it.parentKey) && !toRemove.has(it.id)) {
                        toRemove.add(it.id)
                        added = true
                    }
                }
            }
            // Remove from section
            this.sections[sectionName] = sectionItems.filter(it => !toRemove.has(it.id))
            // Hide root if prefix provided
            if (rootTypePrefix) {
                const rootKey = `${rootTypePrefix}_${rootId}`
                if (visibilityManager.isComponentRegistered(rootKey)) {
                    visibilityManager.hideComponent(rootKey)
                }
            }
            // Hide all with parent tag of any removed id
            for (const key of visibilityManager.getRegisteredComponents()) {
                for (const remId of toRemove) {
                    const tag = `__p:${remId}__`
                    if (key.includes(tag)) {
                        visibilityManager.hideComponent(key)
                        break
                    }
                }
            }
            // Clear pending visibility for any subtree keys
            const pendingEntries = visibilityManager.getPendingRequests()
            for (const [pKey] of pendingEntries) {
                for (const remId of toRemove) {
                    const tag = `__p:${remId}__`
                    if (pKey.includes(tag)) {
                        visibilityManager.visibilityState.pendingVisibility.delete(pKey)
                    }
                }
            }
        },

        // Remove all descendants whose ancestry includes the given parentKey (but do not remove the parent itself)
        removeDescendantsOfParent(sectionName, parentKey, visibilityManager) {
            const sectionItems = this.sections[sectionName] || []
            const toRemove = new Set()
            let added = true
            // Start with direct children of parentKey
            for (const it of sectionItems) {
                if (it.parentKey === parentKey) {
                    toRemove.add(it.id)
                }
            }
            // Expand to deeper descendants
            while (added) {
                added = false
                for (const it of sectionItems) {
                    if (it.parentKey && toRemove.has(it.parentKey) && !toRemove.has(it.id)) {
                        toRemove.add(it.id)
                        added = true
                    }
                }
            }
            // Remove from section and hide components
            if (toRemove.size > 0) {
                this.sections[sectionName] = sectionItems.filter(it => !toRemove.has(it.id))
                for (const key of visibilityManager.getRegisteredComponents()) {
                    for (const remId of toRemove) {
                        if (key === `deepertracks_${remId}` || key === `deeperalbum_${remId}` || key === `trackartist_${remId}` || key === `seed_tracks_st${remId}` || key === `seed_artists_sa${remId}`) {
                            visibilityManager.hideComponent(key)
                        }
                        const tag = `__p:${remId}__`
                        if (key.includes(tag)) {
                            visibilityManager.hideComponent(key)
                        }
                    }
                }
                // Clear pending for those descendants
                const pendingEntries = visibilityManager.getPendingRequests()
                for (const [pKey] of pendingEntries) {
                    for (const remId of toRemove) {
                        const tag = `__p:${remId}__`
                        if (pKey.includes(tag)) {
                            visibilityManager.visibilityState.pendingVisibility.delete(pKey)
                        }
                    }
                }
            }
        },

        // Hide all components of given types within the same parent branch
        hideTypesInParent(types, visibilityManager, parentKey) {
            if (!parentKey) return
            const parentTag = `__p:${parentKey}__`
            // Hide registered
            for (const key of visibilityManager.getRegisteredComponents()) {
                for (const t of types) {
                    if (key.startsWith(`${t}_`) && key.includes(parentTag)) {
                        visibilityManager.hideComponent(key)
                    }
                }
            }
            // Clear pending for these types under the parent
            const pendingEntries = visibilityManager.getPendingRequests()
            for (const [pKey] of pendingEntries) {
                for (const t of types) {
                    if (pKey.startsWith(`${t}_`) && pKey.includes(parentTag)) {
                        visibilityManager.visibilityState.pendingVisibility.delete(pKey)
                    }
                }
            }
        },

        // Track details
        async getTrackDetails(item, sectionName, parentKey = null) {
            console.log('getTrackDetails called with item:', item.id, 'sectionName:', sectionName)

            // Set loading state
            this.setLoading('tracks', item.id, true)
            this.setGlobalLoading(true)

            try {
                let trackData = item

                // Check if we have cached data
                const cached = this.getCachedTrack(item.id)
                if (cached) {
                    trackData = cached
                    console.log('Using cached track data for:', item.id)
                } else {
                    console.log('Creating new track data for:', item.id)
                    // Prepare track data - create a new object to avoid modifying reactive properties
                    if (item.track && (typeof item.track === 'object')) {
                        trackData = {...item.track}
                    } else {
                        trackData = {...item}
                    }
                    trackData.type = 'deepertracks'
                    trackData = toRaw(trackData)

                    // Check if user follows this track
                    try {
                        const service = musicServiceManager.getCurrentService()
                        const response = await service.checkFollowingTrack(trackData.id)
                        trackData.followed = response
                    } catch (error) {
                        console.error(258,error)
                        trackData.followed = false
                    }

                    // Cache the track data
                    this.cache.tracks.set(trackData.id, trackData)
                }

                // Use explicit parentKey only; no auto-derivation.
                const effectiveParentKey = parentKey || null
                // Create a new object with parentKey to avoid modifying reactive properties
                trackData = {...trackData, parentKey: effectiveParentKey}

                // Initialize visibility manager before any usage
                const visibilityManager = useVisibilityManager()

                // If this is a new ROOT track, replace root and purge entire subtree of previous root
                if (!effectiveParentKey) {
                    const sectionItems = this.sections[sectionName] || []
                    const prevRoot = sectionItems.find(it => it.type === 'deepertracks' && (!it.parentKey || it.parentKey === null))
                    if (prevRoot && prevRoot.id !== trackData.id) {
                        this.removeSubtree(sectionName, prevRoot.id, visibilityManager, 'deepertracks')
                    }
                } else {
                    // We are opening a child deeper track under a parent branch, remove other children of that parent
                    this.removeDescendantsOfParent(sectionName, effectiveParentKey, visibilityManager)
                }

                // Add to section
                console.log('Adding track to section:', sectionName, 'Track ID:', trackData.id, 'parentKey:', effectiveParentKey)
                this.addToSection(sectionName, trackData)

                // Ensure the target component is visible now (re-clicks or replacements)
                const targetKey = `deepertracks_${trackData.id}${effectiveParentKey ? `__p:${effectiveParentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                console.log('Track added to section, component will show when registered')
                return trackData
            } finally {
                // Clear loading state
                this.setLoading('tracks', item.id, false)
                this.setGlobalLoading(false)
            }
        },

        // Helper method to hide all components of a specific type
        hideAllComponentsOfType(type, visibilityManager) {
            console.log('hideAllComponentsOfType called for type:', type)
            // Get all registered components and hide those of the specified type
            const registeredComponents = visibilityManager.getRegisteredComponents()
            console.log('All registered components:', registeredComponents)

            let hiddenCount = 0
            for (const key of registeredComponents) {
                if (key.startsWith(type + '_')) {
                    console.log('Hiding component:', key, 'because it matches type:', type)
                    visibilityManager.hideComponent(key)
                    hiddenCount++
                }
            }
            console.log(`Hidden ${hiddenCount} components of type: ${type}`)
        },

        // Helper method to hide the currently visible component of a specific type
        // Optionally scoped by parentKey (null = root-level only)
        hideVisibleComponentOfType(type, visibilityManager, parentKey = null) {
            console.log('hideVisibleComponentOfType called for type:', type, 'parentKey:', parentKey)
            // Get all registered components and hide only the currently visible one of the specified type
            const registeredComponents = visibilityManager.getRegisteredComponents()
            console.log('All registered components:', registeredComponents)

            let hiddenCount = 0
            for (const key of registeredComponents) {
                if (!key.startsWith(type + '_')) continue

                // Parent-aware filtering using optional suffix "__p:<parentKey>__"
                const hasParentTag = key.includes('__p:')
                if (parentKey) {
                    const parentTag = `__p:${parentKey}__`
                    if (!key.includes(parentTag)) continue
                } else {
                    // Root-level: ignore keys that have a parent tag
                    if (hasParentTag) continue
                }

                const isVisible = visibilityManager.isComponentVisible(key)
                console.log(`Component ${key} - type: ${type}, visible: ${isVisible}`)
                if (isVisible) {
                    console.log('Hiding currently visible component:', key, 'because it matches type/parent:', type, parentKey)
                    visibilityManager.hideComponent(key)
                    hiddenCount++
                }
            }
            console.log(`Hidden ${hiddenCount} currently visible components of type: ${type}`)
        },

        // Artist details
        async getArtistDetails(item, sectionName, parentKey = null) {
            console.log('getArtistDetails called with item:', item.id, 'sectionName:', sectionName)

            // Set loading state
            this.setLoading('artists', item.id, true)
            this.setGlobalLoading(true)

            try {
                let artistData = this.getCachedArtist(item.id)

                if (!artistData) {
                    console.log('Fetching new artist data for:', item.id)
                    // Fetch comprehensive artist data
                    const service = musicServiceManager.getCurrentService()
                    const [artistInfo, topTracks, albums, singles, appearances, playlists, related] = await Promise.all([
                        service.getArtist(item.id),
                        service.getArtistTopTracks(item.id),
                        service.getArtistAlbums(item.id),
                        service.getArtistSingles(item.id),
                        service.getArtistAppearances(item.id),
                        service.getArtistPlaylists(item.id),
                        service.getRelatedArtists(item.id)
                    ])

                console.log('API responses:', {
                    artistInfo: artistInfo,
                    topTracks: topTracks,
                    albums: albums,
                    singles: singles,
                    appearances: appearances,
                    playlists: playlists,
                    related: related
                })

                // Check if user follows this artist
                let followed = false
                try {
                    const service = musicServiceManager.getCurrentService()
                    const followResponse = await service.checkFollowingArtist(item.id)
                    followed = followResponse
                } catch (error) {
                    followed = false
                }

                // Create array structure like the old system
                const trackartistArray = []

                // Add artist info
                const artistDataItem = {
                    ...artistInfo,
                    followed,
                    type: 'trackartist'
                }
                trackartistArray.push(artistDataItem)

                // Add top tracks
                const topTracksItem = {
                    tracks: topTracks,
                    type: 'top_tracks'
                }
                trackartistArray.push(topTracksItem)

                // Add albums
                const enrichedAlbums = await this.enrichAlbums(albums)
                const albumsItem = {
                    items: enrichedAlbums,
                    type: 'albums'
                }
                trackartistArray.push(albumsItem)

                // Add singles
                const enrichedSingles = await this.enrichAlbums(singles)
                const singlesItem = {
                    items: enrichedSingles,
                    type: 'single'
                }
                trackartistArray.push(singlesItem)

                // Add appearances
                const enrichedAppearances = await this.enrichAlbums(appearances)
                const appearancesItem = {
                    items: enrichedAppearances,
                    type: 'appears_on'
                }
                trackartistArray.push(appearancesItem)

                // Check if top tracks are empty and create fallback from album tracks
                if (!topTracks || topTracks.length === 0) {
                    console.log('Top tracks empty, creating fallback from album tracks for artist:', item.id)
                    const fallbackTracks = await this.createFallbackTopTracks(item.id, albums)
                    if (fallbackTracks.length > 0) {
                        // Update the existing top tracks item
                        const topTracksIndex = trackartistArray.findIndex(item => item.type === 'top_tracks')
                        if (topTracksIndex !== -1) {
                            trackartistArray[topTracksIndex].tracks = fallbackTracks
                            console.log('Updated top tracks with fallback:', fallbackTracks.length, 'tracks')
                        }
                    }
                }

                // Add playlists
                const enrichedPlaylists = await this.enrichPlaylists(playlists)
                const playlistsItem = {
                    items: enrichedPlaylists,
                    type: 'playlists'
                }
                trackartistArray.push(playlistsItem)

                // Add related artists
                const enrichedRelated = await this.enrichArtists(related)
                const relatedItem = {
                    artists: enrichedRelated,
                    type: 'related-artists'
                }
                trackartistArray.push(relatedItem)

                // Wrap in an object payload
                artistData = {
                    id: item.id,
                    type: 'trackartist',
                    data: trackartistArray
                }
                this.cache.artists.set(item.id, artistData)
            } else {
                console.log('Using cached artist data for:', item.id)
            }

                // Attach explicit parent context (no derivation for artists)
                const derivedParentKey = parentKey || null
                // Create a new object with parentKey to avoid modifying reactive properties
                artistData = {...artistData, parentKey: derivedParentKey}

                const visibilityManager = useVisibilityManager()

                // Enhanced cleanup logic for artists
                if (derivedParentKey) {
                    // If this is a related artist, remove descendants of the parent
                    this.removeDescendantsOfParent(sectionName, derivedParentKey, visibilityManager)
                } else {
                    // If this is a root artist, remove all existing trackartist components and their descendants
                    // This ensures that when switching between different root artists, previous related artists are cleaned up
                    const sectionItems = this.sections[sectionName] || []
                    const existingArtists = sectionItems.filter(item => item.type === 'trackartist')

                    for (const existingArtist of existingArtists) {
                        if (existingArtist.id !== item.id) {
                            // Remove the entire subtree rooted at this artist
                            this.removeSubtree(sectionName, existingArtist.id, visibilityManager, 'trackartist')
                        }
                    }
                }

                // Add to section
                console.log('Adding artist data to section:', sectionName, 'parentKey:', derivedParentKey)
                this.addToSection(sectionName, artistData)

                // Hide the currently visible trackartist component within same parent context
                this.hideVisibleComponentOfType('trackartist', visibilityManager, derivedParentKey)

                // Ensure target is visible
                const targetKey = `trackartist_${item.id}${derivedParentKey ? `__p:${derivedParentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                // Don't call showComponent here - let the component show itself when it's registered
                console.log('Artist added to section, component will show when registered')

                return artistData
            } finally {
                // Clear loading state
                this.setLoading('artists', item.id, false)
                this.setGlobalLoading(false)
            }
        },

        // Album details
        async getAlbumDetails(item, sectionName, parentKey = null) {
            // Set loading state
            this.setLoading('albums', item.id, true)
            this.setGlobalLoading(true)

            try {
                let albumData = item

                // Check if we have cached data
                const cached = this.getCachedAlbum(item.id)
                if (cached) {
                    albumData = cached
                } else {
                    // Create a new object to avoid modifying reactive properties
                    if (item.album) {
                        albumData = {...item.album, album: true}
                    } else {
                        albumData = {...item}
                    }
                    albumData.type = 'deeperalbum'

                    // Check if user follows this album
                    try {
                        const service = musicServiceManager.getCurrentService()
                        const response = await service.checkFollowingAlbum(albumData.id)
                        albumData.followed = response
                    } catch (error) {
                        albumData.followed = false
                    }

                    // Cache the album data
                    this.cache.albums.set(albumData.id, albumData)
                }

                // Attach explicit parent context (no derivation for albums)
                const derivedParentKey = parentKey || null
                // Create a new object with parentKey to avoid modifying reactive properties
                albumData = {...albumData, parentKey: derivedParentKey}

                const visibilityManager = useVisibilityManager()

                // Replace previous album under the same parent and purge its subtree only for same type
                if (derivedParentKey) {
                    this.removeDescendantsOfParent(sectionName, derivedParentKey, visibilityManager)
                }

                // Add to section
                this.addToSection(sectionName, albumData)

                // Hide the currently visible deeperalbum component within same parent context
                this.hideVisibleComponentOfType('deeperalbum', visibilityManager, derivedParentKey)

                // Ensure target is visible
                const targetKey = `deeperalbum_${item.id}${derivedParentKey ? `__p:${derivedParentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                // Don't call showComponent here - let the component show itself when it's registered
                console.log('Album added to section, component will show when registered')

                return albumData
            } finally {
                // Clear loading state
                this.setLoading('albums', item.id, false)
                this.setGlobalLoading(false)
            }
        },

        // Playlist details
        async getPlaylistDetails(item, sectionName, parentKey = null) {
            // Set loading state
            this.setLoading('playlists', item.id, true)
            this.setGlobalLoading(true)

            try {
                let playlistData = item

                // Check if we have cached data
                const cached = this.getCachedPlaylist(item.id)
                if (cached) {
                    playlistData = cached

                } else {
                    playlistData = {...item}
                    playlistData.type = 'deeperplaylist'

                    // Check if user follows this album
                    try {
                        const service = musicServiceManager.getCurrentService()
                        const response = await service.checkFollowingPlaylist(playlistData.id)
                        playlistData.followed = response
                    } catch (error) {
                        playlistData.followed = false
                    }

                    // Cache the album data
                    this.cache.playlists.set(playlistData.id, playlistData)
                }

            // Ensure tracks and description are populated; fetch full playlist if missing/empty
            try {
                // Check both old structure (tracks.items) and new structure (tracks directly)
                const hasTracks = playlistData.tracks && (
                    (playlistData.tracks.items && playlistData.tracks.items.length > 1) ||
                    (Array.isArray(playlistData.tracks) && playlistData.tracks.length > 1)
                )

                // Check if description is missing or empty
                const hasDescription = playlistData.description && playlistData.description.trim().length > 0

                // Fetch full playlist data if tracks or description are missing
                if (!hasTracks || !hasDescription) {
                    const service = musicServiceManager.getCurrentService()
                    const fullResponse = await service.getPlaylist(playlistData.id)

                    if (fullResponse) {
                        // Update tracks if missing
                        if (!hasTracks && fullResponse.tracks) {
                            playlistData.tracks = fullResponse.tracks
                        }

                        // Update description if missing
                        if (!hasDescription && fullResponse.description) {
                            playlistData.description = fullResponse.description
                        }

                        // Update cache with enriched data
                        this.cache.playlists.set(playlistData.id, playlistData)
                    }
                }
            } catch (e) {
                console.warn('Failed to ensure playlist tracks/description; proceeding with existing data', e)
            }

                // Attach explicit parent context (no derivation for albums)
                const derivedParentKey = parentKey || null
                // Create a new object with parentKey to avoid modifying reactive properties
                playlistData = {...playlistData, parentKey: derivedParentKey}

                const visibilityManager = useVisibilityManager()

                // Replace previous playlist under the same parent and purge its subtree only for same type
                if (derivedParentKey) {
                    this.removeDescendantsOfParent(sectionName, derivedParentKey, visibilityManager)
                }

                // Add to section
                this.addToSection(sectionName, playlistData)

                // Hide the currently visible deeperplaylist component within same parent context
                this.hideVisibleComponentOfType('deeperplaylist', visibilityManager, derivedParentKey)

                // Ensure target is visible
                const targetKey = `deeperplaylist_${item.id}${derivedParentKey ? `__p:${derivedParentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                // Don't call showComponent here - let the component show itself when it's registered
                console.log('Playlist added to section, component will show when registered')

                return playlistData
            } finally {
                // Clear loading state
                this.setLoading('playlists', item.id, false)
                this.setGlobalLoading(false)
            }
        },

        // Get details for a specific genre playlist/artist (routes to playlist or artist details)
        async getGenreDetails(item, sectionName, parentKey = null) {
            const loadingKey = item.genreId || item.id
            // Set loading state
            this.setLoading('playlists', loadingKey, true)
            this.setGlobalLoading(true)
            console.log(item, sectionName, parentKey)
            try {
                const service = musicServiceManager.getCurrentService()
                const visibilityManager = useVisibilityManager()
                this.cache.genres.set(item.id, item)
                // Fetch the concrete playlist representing this genre
                let playlistData = await service.getGenrePlaylist(item.id)
                if (!playlistData) {
                    throw new Error('No playlist data returned for genre')
                }
                console.log('item', item, 'playlistData', playlistData)
                // Attach explicit parent context and set correct type
                const derivedParentKey = parentKey || null
                playlistData = { ...playlistData, type: 'deeperplaylist', parentKey: derivedParentKey }

                // Cache the playlist
                this.cache.playlists.set(playlistData.id, playlistData)


                // Replace previous deeperplaylist under the same parent
                if (derivedParentKey) {
                    this.removeDescendantsOfParent(sectionName, derivedParentKey, visibilityManager)
                }

                // Add to section
                this.addToSection(sectionName, playlistData)

                // Hide the currently visible deeperplaylist component within same parent context
                this.hideVisibleComponentOfType('deeperplaylist', visibilityManager, derivedParentKey)

                // Ensure target is visible (use the actual playlist id)
                const targetKey = `deeperplaylist_${playlistData.id}${derivedParentKey ? `__p:${derivedParentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                console.log('Genre playlist added to section, component will show when registered')
                return playlistData
            } catch (error) {
                console.error('❌ DeeperStore: Failed to get genre details:', error)
                throw error
            } finally {
                // Clear loading state
                this.setLoading('playlists', loadingKey, false)
                this.setGlobalLoading(false)
            }
        },

        // User playlists
        async getUserPlaylists(user, sectionName, parentKey = null) {
            // Set loading state
            this.setLoading('user-playlists', user.id, true)
            this.setGlobalLoading(true)

            try {
                const service = musicServiceManager.getCurrentService()

                // Get user playlists from the service
                const playlists = await service.getUserPlaylists(user.id, 20)
                // Create user playlists data structure
                const userPlaylistsData = {
                    id: `user-playlists-${user.id}`,
                    name: `${user.display_name}'s Playlists`,
                    type: 'user-playlists',
                    owner: user,
                    playlists: playlists,
                    parentKey: parentKey
                }
                for (const playlist of userPlaylistsData.playlists) {
                    playlist.tracks = await service.getPlaylistTracks(playlist.id, 0, 1)
                }
                console.log('userPlaylistsData', userPlaylistsData)

                const visibilityManager = useVisibilityManager()

                // Replace previous user playlists under the same parent
                if (parentKey) {
                    this.removeDescendantsOfParent(sectionName, parentKey, visibilityManager)
                }

                // Add to section
                this.addToSection(sectionName, userPlaylistsData)

                // Hide the currently visible component within same parent context
                this.hideVisibleComponentOfType('user-playlists', visibilityManager, parentKey)

                // Ensure target is visible
                const targetKey = `user-playlists_${user.id}${parentKey ? `__p:${parentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                console.log('User playlists added to section, component will show when registered')

                return userPlaylistsData
            } catch (error) {
                console.error('Failed to get user playlists:', error)
                throw error
            } finally {
                // Clear loading state
                this.setLoading('user-playlists', user.id, false)
                this.setGlobalLoading(false)
            }
        },

        // Seed artist recommendations
        async getSeedArtistRecommendations(item, sectionName, parentKey = null) {
            const seedId = `sa${item.id}`

            // Set loading state
            this.setLoading('seedArtists', seedId, true)
            this.setGlobalLoading(true)

            try {
                let seedData = this.getCachedSeedArtist(seedId)

                if (!seedData) {
                    const service = musicServiceManager.getCurrentService()
                    const response = await service.getRecommendations({
                        seedArtists: [item], // Pass the full artist object
                        limit: 50,
                        offset: 0,
                        market: 'UA'
                    })

                    seedData = {
                        tracks: response,
                        type: 'seed_artists',
                        id: seedId,
                        name: item.name,
                        artists: item.artists
                    }

                    // Cache the seed data
                    this.cache.seedArtists.set(seedId, seedData)
                }

                // Add to section
                // Create a new object with parentKey to avoid modifying reactive properties
                seedData = {...seedData, parentKey: parentKey || null}
                const visibilityManager = useVisibilityManager()

                if (seedData.parentKey) {
                    this.removeDescendantsOfParent(sectionName, seedData.parentKey, visibilityManager)
                }

                this.addToSection(sectionName, seedData)

                // Hide the currently visible seed_artists component before showing the new one
                this.hideVisibleComponentOfType('seed_artists', visibilityManager, seedData.parentKey)

                // Ensure target is visible
                const targetKey = `seed_artists_${seedId}${seedData.parentKey ? `__p:${seedData.parentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                // Don't call showComponent here - let the component show itself when it's registered
                console.log('Seed artists added to section, component will show when registered')

                return seedData
            } finally {
                // Clear loading state
                this.setLoading('seedArtists', seedId, false)
                this.setGlobalLoading(false)
            }
        },

        // Seed track recommendations
        async getSeedTrackRecommendations(item, sectionName, parentKey = null) {
            const seedId = `st${item.id}`

            // Set loading state
            this.setLoading('seedTracks', seedId, true)
            this.setGlobalLoading(true)

            try {
                let seedData = this.getCachedSeedTrack(seedId)

                if (!seedData) {
                    const service = musicServiceManager.getCurrentService()
                    const response = await service.getRecommendations({
                        seedTracks: [item], // Pass the full track object
                        limit: 20,
                        offset: 0,
                        market: 'UA'
                    })
                    console.log(response)

                    seedData = {
                        tracks: response,
                        type: 'seed_tracks',
                        id: seedId,
                        name: item.name,
                        artists: item.artists
                    }

                    // Cache the seed data
                    this.cache.seedTracks.set(seedId, seedData)
                }

                // Attach parent context so seed tracks are purged with their ancestor
                // Create a new object with parentKey to avoid modifying reactive properties
                seedData = {...seedData, parentKey: parentKey || null}

                // Use visibility manager
                const visibilityManager = useVisibilityManager()

                if (seedData.parentKey) {
                    this.removeDescendantsOfParent(sectionName, seedData.parentKey, visibilityManager)
                }

                // Now add the seed item to the section
                this.addToSection(sectionName, seedData)

                // Hide any currently visible seed_tracks in the same parent branch
                this.hideVisibleComponentOfType('seed_tracks', visibilityManager, seedData.parentKey)

                // Ensure target is visible
                const targetKey = `seed_tracks_${seedId}${seedData.parentKey ? `__p:${seedData.parentKey}__` : ''}`
                visibilityManager.showComponent(targetKey)

                // Don't call showComponent here - component also shows itself on mount
                console.log('Seed tracks added to section, component will show when registered')

                return seedData
            } finally {
                // Clear loading state
                this.setLoading('seedTracks', seedId, false)
                this.setGlobalLoading(false)
            }
        },

        // Helper methods
        async enrichAlbums(albums) {
            const enrichedAlbums = []

            for (const album of albums) {
                try {
                    const service = musicServiceManager.getCurrentService()
                    const tracksResponse = await service.getAlbumTracks(album.id)
                    const tracks = tracksResponse
                    album.tracks = tracks

                    if (tracks.length > 0 && (tracks[0].preview_url || tracks[0].previewUrl)) {
                        album.preview_url = tracks[0].preview_url || tracks[0].previewUrl
                    }

                    if (album.images.length > 0 && album.images[0]?.url) {
                        enrichedAlbums.push(album)
                    } else {
                        album.images[0] = {url: ''}
                        enrichedAlbums.push(album)
                    }
                } catch (error) {
                    console.error(`Failed to enrich album ${album.id}:`, error)
                }
            }

            return enrichedAlbums
        },

        async enrichPlaylists(playlists) {
            const enrichedPlaylists = []

            for (const playlist of playlists) {
                try {
                    const service = musicServiceManager.getCurrentService()
                    const tracksResponse = await service.getPlaylistTracks(playlist.id)
                    const tracks = tracksResponse
                    playlist.tracks = tracks

                    if (tracks.length > 0 && (tracks[0].preview_url || tracks[0].previewUrl)) {
                        playlist.preview_url = tracks[0].preview_url || tracks[0].previewUrl
                    }

                    if (playlist.images.length > 0 && playlist.images[0]?.url) {
                        enrichedPlaylists.push(playlist)
                    } else {
                        playlist.images[0] = {url: ''}
                        enrichedPlaylists.push(playlist)
                    }
                } catch (error) {
                    console.error(`Failed to enrich playlist ${playlist.id}:`, error)
                    // Still add the playlist even if enrichment fails
                    if (playlist.images.length > 0 && playlist.images[0]?.url) {
                        enrichedPlaylists.push(playlist)
                    } else {
                        playlist.images[0] = {url: ''}
                        enrichedPlaylists.push(playlist)
                    }
                }
            }

            return enrichedPlaylists
        },

        async createFallbackTopTracks(artistId, albums) {
            const service = musicServiceManager.getCurrentService()
            const allTracks = []

            try {
                // Process all albums since data is cached
                for (const album of albums) {
                    try {
                        // Pass album data to getAlbumTracks to avoid extra API calls
                        const tracks = await service.getAlbumTracks(album.id, album)
                        allTracks.push(...tracks)
                    } catch (error) {
                        console.warn('Failed to get tracks for album:', album.id, error)
                    }
                }

                if (allTracks.length === 0) {
                    return []
                }

                // Sort tracks by rank (higher rank = more popular)
                const sortedTracks = [...allTracks].sort((a, b) => {
                    const rankA = a.rank || a.popularity || 0
                    const rankB = b.rank || b.popularity || 0
                    return rankB - rankA // Sort descending (highest rank first)
                })

                // Get top 5 tracks from Deezer albums
                const deezerTopTracks = sortedTracks.slice(0, 5)

                // Helper function to normalize track info for comparison
                const normalizeTrackInfo = (track) => {
                    const name = (track.name || track.title || '').toLowerCase().trim()
                    const artist = (track.artist?.name || track.artist || '').toLowerCase().trim()
                    return `${name}|${artist}`
                }

                // Try to get Last.fm top tracks and add 5 more
                let finalTracks = [...deezerTopTracks]

                try {
                    const lastfmTracks = await this.getLastFmTopTracks(artistId, service)
                    if (lastfmTracks && lastfmTracks.length > 0) {
                        // Create a set of existing track identifiers from Deezer tracks
                        const existingTracks = new Set(deezerTopTracks.map(normalizeTrackInfo))

                        // Filter out Last.fm tracks that already exist in Deezer tracks
                        const uniqueLastfmTracks = lastfmTracks.filter(track =>
                            !existingTracks.has(normalizeTrackInfo(track))
                        )

                        finalTracks.unshift(...uniqueLastfmTracks.slice(0, 5))
                        console.log('Combined tracks: 5 from Deezer albums + ', uniqueLastfmTracks.length, 'unique from Last.fm')
                    } else {
                        // If no Last.fm tracks, try Deezer radio for variety
                        console.log('No Last.fm tracks found, trying Deezer radio by track')
                        await this.tryDeezerRadioFallback(finalTracks, sortedTracks, service, 'lastfm_empty')
                    }
                } catch (error) {
                    console.warn('Failed to get Last.fm tracks, trying Deezer radio fallback:', error)
                    // If Last.fm fails, try Deezer radio before falling back to more album tracks
                    await this.tryDeezerRadioFallback(finalTracks, sortedTracks, service, 'lastfm_failed')
                }

                return finalTracks

            } catch (error) {
                console.error('Error creating fallback top tracks for artist:', artistId, error)
                return []
            }
        },

        async tryDeezerRadioFallback(finalTracks, sortedTracks, service, reason = 'fallback') {
            try {
                // Only try radio for Deezer service
                if (service.getServiceType() !== 'deezer') {
                    console.log('Radio fallback only available for Deezer service, using additional album tracks')
                    const additionalDeezerTracks = sortedTracks.slice(5, 10)
                    finalTracks.push(...additionalDeezerTracks)
                    return
                }

                // Try to get a seed track for radio generation
                let seedTrack = null

                // First try to use the first track from sorted tracks as seed
                if (sortedTracks.length > 0) {
                    seedTrack = sortedTracks[0]
                }

                // If no seed track from albums, try to use the first track from finalTracks
                if (!seedTrack && finalTracks.length > 0) {
                    seedTrack = finalTracks[0]
                }

                if (!seedTrack || !seedTrack.id) {
                    console.warn('No seed track available for radio, using additional album tracks')
                    const additionalDeezerTracks = sortedTracks.slice(5, 10)
                    finalTracks.push(...additionalDeezerTracks)
                    return
                }

                console.log(`Creating radio using seed track: "${seedTrack.name}" (ID: ${seedTrack.id})`)

                // Create radio using the seed track
                const radioTracks = await service.createRadioByTrack(seedTrack.id, 8)

                if (radioTracks && radioTracks.length > 0) {
                    // Filter out duplicates by comparing with existing tracks
                    const existingTrackIds = new Set([
                        ...finalTracks.map(t => t.id),
                        ...sortedTracks.map(t => t.id)
                    ])

                    const uniqueRadioTracks = radioTracks.filter(track =>
                        track && track.id && !existingTrackIds.has(track.id)
                    )

                    if (uniqueRadioTracks.length > 0) {
                        // Add radio tracks to the final list
                        finalTracks.push(...uniqueRadioTracks.slice(0, 5))
                        console.log(`Added ${Math.min(5, uniqueRadioTracks.length)} unique radio tracks (reason: ${reason})`)
                        return
                    } else {
                        console.log('All radio tracks were duplicates, using additional album tracks')
                    }
                } else {
                    console.warn('Radio creation failed or returned no tracks')
                }

                // Fallback to additional album tracks if radio fails or returns no unique tracks
                const additionalDeezerTracks = sortedTracks.slice(5, 10)
                finalTracks.push(...additionalDeezerTracks)
                console.log(`Added ${additionalDeezerTracks.length} additional album tracks as fallback`)

            } catch (error) {
                console.error('Error in Deezer radio fallback:', error)

                // Final fallback to additional album tracks
                const additionalDeezerTracks = sortedTracks.slice(5, 10)
                finalTracks.push(...additionalDeezerTracks)
                console.log(`Radio fallback failed, added ${additionalDeezerTracks.length} additional album tracks`)
            }
        },

        async getLastFmTopTracks(artistId, service) {
            try {
                // First get the artist name from the service
                const artistInfo = await service.getArtist(artistId)
                if (!artistInfo || !artistInfo.name) {
                    console.warn('No artist name found for ID:', artistId)
                    return []
                }

                // Make request to Last.fm backend
                const response = await fetch(`/lastfm/artist/top-tracks?artist=${encodeURIComponent(artistInfo.name)}&limit=10`)

                if (!response.ok) {
                    console.warn('Last.fm top tracks request failed:', response.status)
                    return []
                }

                const lastfmData = await response.json()

                if (!lastfmData.toptracks || !lastfmData.toptracks.track) {
                    console.warn('No top tracks data from Last.fm for artist:', artistInfo.name)
                    return []
                }

                const lastfmTracks = Array.isArray(lastfmData.toptracks.track)
                    ? lastfmData.toptracks.track
                    : [lastfmData.toptracks.track]

                // Search each Last.fm track in Deezer and transform to Deezer format
                const deezerTracks = []

                for (const lastfmTrack of lastfmTracks) {
                    try {
                        const searchQuery = `${artistInfo.name} ${lastfmTrack.name}`
                        const searchResponse = await service.request(`/search/track?q=${encodeURIComponent(searchQuery)}&limit=5`)
                        for (let track of searchResponse.data) {
                            if (track.title_short === lastfmTrack.name && track.artist.name === artistInfo.name) {
                                const transformedTrack = service.transformTrack(track)
                                if (transformedTrack) {
                                    deezerTracks.push(transformedTrack)
                                }
                            }
                        }
                    } catch (error) {
                        console.warn('Failed to search/transform Last.fm track:', lastfmTrack.name, error)
                    }
                }

                console.log(`Found ${deezerTracks.length} Last.fm tracks in Deezer for artist:`, artistInfo.name)
                return deezerTracks

            } catch (error) {
                console.error('Error getting Last.fm top tracks:', error)
                return []
            }
        },

        async enrichArtists(artists) {
            const enrichedArtists = []

            for (const artist of artists) {
                try {
                    const service = musicServiceManager.getCurrentService()
                    const tracksResponse = await service.getArtistTopTracks(artist.id, 'UA')
                    const tracks = tracksResponse

                    if (tracks.length > 0 && (tracks[0].preview_url || tracks[0].previewUrl)) {
                        artist.preview_url = tracks[0].preview_url || tracks[0].previewUrl
                    }

                    if (artist.images.length > 0 && artist.images[0]?.url) {
                        enrichedArtists.push(artist)
                    } else {
                        artist.images[0] = {url: ''}
                        enrichedArtists.push(artist)
                    }
                } catch (error) {
                    console.error(`Failed to enrich artist ${artist.id}:`, error)
                }
            }

            return enrichedArtists
        },

        // Clear all sections
        clearAllSections() {
            Object.keys(this.sections).forEach(key => {
                this.sections[key] = []
            })
        },

        // Clear cache
        clearCache(type) {
            if (type) {
                this.cache[type].clear()
            } else {
                Object.keys(this.cache).forEach(key => {
                    this.cache[key].clear()
                })
            }
        },

        // Categories methods
        async getCategories(sectionName, offset = 0, limit = 50) {
            this.setGlobalLoading(true)

            try {
                const service = musicServiceManager.getCurrentService()
                const response = await service.getCategories(offset, limit)

                // Add categories to section and cache
                response.items.forEach(category => {
                    const categoryData = {
                        ...category,
                        type: 'category',
                        parentKey: null
                    }
                    this.addToSection(sectionName, categoryData)

                    // Cache the category data for later use
                    this.cache.categories.set(category.id, categoryData)
                })

                return response
            } catch (error) {
                console.error('Failed to get categories:', error)
                throw error
            } finally {
                this.setGlobalLoading(false)
            }
        },

        async getCategoryPlaylists(categoryId, sectionName, parentKey = null) {
            this.setGlobalLoading(true)

            try {
                const service = musicServiceManager.getCurrentService()

                const response = await service.getCategoryPlaylists(categoryId, 0, 50)

                // Add playlists to section
                response.items.forEach(playlist => {
                    const playlistData = {
                        ...playlist,
                        type: 'category-playlist',
                        parentKey: parentKey
                    }
                    this.addToSection(sectionName, playlistData)
                })

                return response
            } catch (error) {
                console.error('Failed to get category playlists:', error)
                throw error
            } finally {
                this.setGlobalLoading(false)
            }
        }
    }
})
