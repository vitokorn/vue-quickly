import {defineStore} from 'pinia'
import {spotifyApi} from '../services/spotifyApi'
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
            seedArtists: new Set(),
            seedTracks: new Set()
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
            seedTracks: new Map()
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
                        const response = await spotifyApi.checkFollowingTrack(trackData.id)
                        trackData.followed = response.data[0]
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
                    const [artistInfo, topTracks, albums, singles, appearances, related] = await Promise.all([
                        spotifyApi.getArtist(item.id),
                        spotifyApi.getArtistTopTracks(item.id),
                        spotifyApi.getArtistAlbums(item.id),
                        spotifyApi.getArtistSingles(item.id),
                        spotifyApi.getArtistAppearances(item.id),
                        spotifyApi.getRelatedArtists(item.id)
                    ])

                console.log('API responses:', {
                    artistInfo: artistInfo.data,
                    topTracks: topTracks.data,
                    albums: albums.data,
                    singles: singles.data,
                    appearances: appearances.data,
                    related: related.data
                })

                // Check if user follows this artist
                let followed = false
                try {
                    const followResponse = await spotifyApi.checkFollowingArtist(item.id)
                    followed = followResponse.data[0]
                } catch (error) {
                    followed = false
                }

                // Create array structure like the old system
                const trackartistArray = []

                // Add artist info
                const artistDataItem = {
                    ...artistInfo.data,
                    followed,
                    type: 'trackartist'
                }
                trackartistArray.push(artistDataItem)

                // Add top tracks
                const topTracksItem = {
                    ...topTracks.data,
                    type: 'top_tracks'
                }
                trackartistArray.push(topTracksItem)

                // Add albums
                const enrichedAlbums = await this.enrichAlbums(albums.data.items)
                const albumsItem = {
                    items: enrichedAlbums,
                    type: 'albums'
                }
                trackartistArray.push(albumsItem)

                // Add singles
                const enrichedSingles = await this.enrichAlbums(singles.data.items)
                const singlesItem = {
                    items: enrichedSingles,
                    type: 'single'
                }
                trackartistArray.push(singlesItem)

                // Add appearances
                const enrichedAppearances = await this.enrichAlbums(appearances.data.items)
                const appearancesItem = {
                    items: enrichedAppearances,
                    type: 'appears_on'
                }
                trackartistArray.push(appearancesItem)

                // Add related artists
                const enrichedRelated = await this.enrichArtists(related.data.artists)
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

                if (derivedParentKey) {
                    this.removeDescendantsOfParent(sectionName, derivedParentKey, visibilityManager)
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
                        const response = await spotifyApi.checkFollowingAlbum(albumData.id)
                        albumData.followed = response.data[0]
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
                        const response = await spotifyApi.checkFollowingPlaylist(playlistData.id)
                        playlistData.followed = response.data[0]
                    } catch (error) {
                        playlistData.followed = false
                    }

                    // Cache the album data
                    this.cache.playlists.set(playlistData.id, playlistData)
                }

            // Ensure tracks are populated; fetch full playlist if missing/empty
            try {
                if (!playlistData.tracks || !playlistData.tracks.items || playlistData.tracks.items.length === 0) {
                    const fullResponse = await spotifyApi.getPlaylist(playlistData.id)
                    if (fullResponse?.data?.tracks) {
                        playlistData.tracks = fullResponse.data.tracks
                    }
                }
            } catch (e) {
                console.warn('Failed to ensure playlist tracks; proceeding with existing data', e)
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

        // Seed artist recommendations
        async getSeedArtistRecommendations(item, sectionName, parentKey = null) {
            const seedId = `sa${item.id}`
            
            // Set loading state
            this.setLoading('seedArtists', seedId, true)
            this.setGlobalLoading(true)
            
            try {
                let seedData = this.getCachedSeedArtist(seedId)

                if (!seedData) {
                    const response = await spotifyApi.getRecommendations({
                        seed_artists: item.id,
                        limit: 50,
                        offset: 0,
                        market: 'UA'
                    })

                    seedData = {
                        tracks: response.data.tracks,
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
                    const response = await spotifyApi.getRecommendations({
                        seed_tracks: item.id,
                        limit: 50,
                        offset: 0,
                        market: 'UA'
                    })

                    seedData = {
                        tracks: response.data.tracks,
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

        // Legacy method for compatibility with existing components
        async seedTracks(payload) {
            console.log('seedTracks called with:', payload)
            const {item, num, parent} = payload

            // Get section name based on num
            let sectionName
            switch (num) {
                case 1:
                    sectionName = 'yourPlaylists';
                    break
                case 2:
                    sectionName = 'topArtists';
                    break
                case 22:
                    sectionName = 'topArtists6';
                    break
                case 23:
                    sectionName = 'topArtistsAll';
                    break
                case 3:
                    sectionName = 'topTracks';
                    break
                case 32:
                    sectionName = 'topTracks6';
                    break
                case 33:
                    sectionName = 'topTracksAll';
                    break
                case 4:
                    sectionName = 'savedAlbums';
                    break
                case 5:
                    sectionName = 'savedTracks';
                    break
                case 6:
                    sectionName = 'followedArtists';
                    break
                case 7:
                    sectionName = 'newReleases';
                    break
                case 8:
                    sectionName = 'spotifyPlaylists';
                    break
                case 10:
                    sectionName = 'search';
                    break
                default:
                    sectionName = 'search'
            }

            // Call the new method
            return await this.getSeedTrackRecommendations(item, sectionName, parent || null)
        },

        // Legacy method for mobile components compatibility
        async seedTracksM(payload) {
            console.log('seedTracksM called with:', payload)
            const {item, num, parent} = payload

            // Get section name based on num
            let sectionName
            switch (num) {
                case 1:
                    sectionName = 'yourPlaylists';
                    break
                case 2:
                    sectionName = 'topArtists';
                    break
                case 22:
                    sectionName = 'topArtists6';
                    break
                case 23:
                    sectionName = 'topArtistsAll';
                    break
                case 3:
                    sectionName = 'topTracks';
                    break
                case 32:
                    sectionName = 'topTracks6';
                    break
                case 33:
                    sectionName = 'topTracksAll';
                    break
                case 4:
                    sectionName = 'savedAlbums';
                    break
                case 5:
                    sectionName = 'savedTracks';
                    break
                case 6:
                    sectionName = 'followedArtists';
                    break
                case 7:
                    sectionName = 'newReleases';
                    break
                case 8:
                    sectionName = 'spotifyPlaylists';
                    break
                case 10:
                    sectionName = 'search';
                    break
                default:
                    sectionName = 'search'
            }

            // Call the new method (same as seedTracks for now)
            return await this.getSeedTrackRecommendations(item, sectionName, parent || null)
        },

        // Helper methods
        async enrichAlbums(albums) {
            const enrichedAlbums = []

            for (const album of albums) {
                try {
                    const tracksResponse = await spotifyApi.getAlbumTracks(album.id)
                    const tracks = tracksResponse.data.items
                    album.tracks = tracks

                    if (tracks.length > 0 && tracks[0].preview_url) {
                        album.preview_url = tracks[0].preview_url
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

        async enrichArtists(artists) {
            const enrichedArtists = []

            for (const artist of artists) {
                try {
                    const tracksResponse = await spotifyApi.getArtistTopTracks(artist.id, 'UA')
                    const tracks = tracksResponse.data.tracks

                    if (tracks.length > 0 && tracks[0].preview_url) {
                        artist.preview_url = tracks[0].preview_url
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
        }
    }
})
