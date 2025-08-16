import { defineStore } from 'pinia'
import { spotifyApi } from '../services/spotifyApi'
import { useVisibilityManager } from '../composables/useVisibilityManager'
import { toRaw } from 'vue'

export const useDeeperStore = defineStore('deeper', {
  state: () => ({
    // Current section being displayed
    currentSection: 'search',
    
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
      seedArtists: new Map(),
      seedTracks: new Map()
    }
  }),

  getters: {
    getSectionData: (state) => (sectionName) => state.sections[sectionName] || [],
    
    getCachedTrack: (state) => (id) => state.cache.tracks.get(id),
    getCachedArtist: (state) => (id) => state.cache.artists.get(id),
    getCachedAlbum: (state) => (id) => state.cache.albums.get(id),
    getCachedSeedArtist: (state) => (id) => state.cache.seedArtists.get(id),
    getCachedSeedTrack: (state) => (id) => state.cache.seedTracks.get(id)
  },

  actions: {
    // Set current section
    setCurrentSection(sectionName) {
      this.currentSection = sectionName
      console.log('Current section set to:', sectionName)
    },
    
    // Add item to section
    addToSection(sectionName, item) {
      console.log('addToSection called with sectionName:', sectionName, 'item:', item.id, 'type:', item.type)
      if (!this.sections[sectionName]) {
        this.sections[sectionName] = []
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

    // Track details
    async getTrackDetails(item, sectionName) {
      console.log('getTrackDetails called with item:', item.id, 'sectionName:', sectionName)
      let trackData = item
      
      // Check if we have cached data
      const cached = this.getCachedTrack(item.id)
      if (cached) {
        trackData = cached
        console.log('Using cached track data for:', item.id)
      } else {
        console.log('Creating new track data for:', item.id)
        // Prepare track data
        if (item.track) {
          trackData = item.track
        }
        trackData.type = 'deepertracks'
        trackData = toRaw(trackData)
        
        // Check if user follows this track
        try {
          const response = await spotifyApi.checkFollowingTrack(trackData.id)
          trackData.followed = response.data[0]
        } catch (error) {
          trackData.followed = false
        }
        
        // Cache the track data
        this.cache.tracks.set(trackData.id, trackData)
      }
      
      // Add to section
      console.log('Adding track to section:', sectionName, 'Track ID:', trackData.id)
      this.addToSection(sectionName, trackData)
      
      // Use visibility manager to hide other components of the same type
      const visibilityManager = useVisibilityManager()
      
      // Hide the currently visible deepertracks component before showing the new one
      this.hideVisibleComponentOfType('deepertracks', visibilityManager)
      
      // Don't call showComponent here - let the component show itself when it's registered
      console.log('Track added to section, component will show when registered')
      
      return trackData
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
    hideVisibleComponentOfType(type, visibilityManager) {
      console.log('hideVisibleComponentOfType called for type:', type)
      // Get all registered components and hide only the currently visible one of the specified type
      const registeredComponents = visibilityManager.getRegisteredComponents()
      console.log('All registered components:', registeredComponents)
      
      let hiddenCount = 0
      for (const key of registeredComponents) {
        if (key.startsWith(type + '_')) {
          const isVisible = visibilityManager.isComponentVisible(key)
          console.log(`Component ${key} - type: ${type}, visible: ${isVisible}`)
          if (isVisible) {
            console.log('Hiding currently visible component:', key, 'because it matches type:', type)
            visibilityManager.hideComponent(key)
            hiddenCount++
          }
        }
      }
      console.log(`Hidden ${hiddenCount} currently visible components of type: ${type}`)
    },

    // Artist details
    async getArtistDetails(item, sectionName) {
      console.log('getArtistDetails called with item:', item.id, 'sectionName:', sectionName)
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
        const trackartist = []
        
        // Add artist info
        const artistDataItem = {
          ...artistInfo.data,
          followed,
          type: 'trackartist'
        }
        trackartist.push(artistDataItem)
        
        // Add top tracks
        const topTracksItem = {
          ...topTracks.data,
          type: 'top_tracks'
        }
        trackartist.push(topTracksItem)
        
        // Add albums
        const enrichedAlbums = await this.enrichAlbums(albums.data.items)
        const albumsItem = {
          items: enrichedAlbums,
          type: 'albums'
        }
        trackartist.push(albumsItem)
        
        // Add singles
        const enrichedSingles = await this.enrichAlbums(singles.data.items)
        const singlesItem = {
          items: enrichedSingles,
          type: 'single'
        }
        trackartist.push(singlesItem)
        
        // Add appearances
        const enrichedAppearances = await this.enrichAlbums(appearances.data.items)
        const appearancesItem = {
          items: enrichedAppearances,
          type: 'appears_on'
        }
        trackartist.push(appearancesItem)
        
        // Add related artists
        const enrichedRelated = await this.enrichArtists(related.data.artists)
        const relatedItem = {
          artists: enrichedRelated,
          type: 'related-artists'
        }
        trackartist.push(relatedItem)
        
        // Set the array as the artist data
        artistData = trackartist
        artistData.id = item.id
        artistData.type = 'trackartist'
        
        console.log('Final artist data structure:', artistData)
        
        // Cache the artist data
        this.cache.artists.set(item.id, artistData)
      } else {
        console.log('Using cached artist data for:', item.id)
      }
      
      // Add to section
      console.log('Adding artist data to section:', sectionName)
      this.addToSection(sectionName, artistData)
      
      // Use visibility manager to hide other components of the same type
      const visibilityManager = useVisibilityManager()
      
      // Hide the currently visible trackartist component before showing the new one
      this.hideVisibleComponentOfType('trackartist', visibilityManager)
      
      // Don't call showComponent here - let the component show itself when it's registered
      console.log('Artist added to section, component will show when registered')
      
      return artistData
    },

    // Album details
    async getAlbumDetails(item, sectionName) {
      let albumData = item
      
      // Check if we have cached data
      const cached = this.getCachedAlbum(item.id)
      if (cached) {
        albumData = cached
      } else {
        if (item.album) {
          albumData = item.album
          albumData.album = true
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
      
      // Add to section
      this.addToSection(sectionName, albumData)
      
      // Use visibility manager to hide other components of the same type
      const visibilityManager = useVisibilityManager()
      
      // Hide the currently visible deeperalbum component before showing the new one
      this.hideVisibleComponentOfType('deeperalbum', visibilityManager)
      
      // Don't call showComponent here - let the component show itself when it's registered
      console.log('Album added to section, component will show when registered')
      
      return albumData
    },

    // Seed artist recommendations
    async getSeedArtistRecommendations(item, sectionName) {
      const seedId = `sa${item.id}`
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
      this.addToSection(sectionName, seedData)
      
      // Use visibility manager to hide other components of the same type
      const visibilityManager = useVisibilityManager()
      
      // Hide the currently visible seed_artists component before showing the new one
      this.hideVisibleComponentOfType('seed_artists', visibilityManager)
      
      // Don't call showComponent here - let the component show itself when it's registered
      console.log('Seed artists added to section, component will show when registered')
      
      return seedData
    },

    // Seed track recommendations
    async getSeedTrackRecommendations(item, sectionName) {
      const seedId = `st${item.id}`
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
      
      // Add to section
      this.addToSection(sectionName, seedData)
      
      // Use visibility manager to hide other components of the same type
      const visibilityManager = useVisibilityManager()
      
      // Hide the currently visible seed_tracks component before showing the new one
      this.hideVisibleComponentOfType('seed_tracks', visibilityManager)
      
      // Don't call showComponent here - let the component show itself when it's registered
      console.log('Seed tracks added to section, component will show when registered')
      
      return seedData
    },

    // Legacy method for compatibility with existing components
    async seedTracks(payload) {
      console.log('seedTracks called with:', payload)
      const { item, num, sib, child } = payload
      
      // Get section name based on num
      let sectionName
      switch (num) {
        case 1: sectionName = 'yourPlaylists'; break
        case 2: sectionName = 'topArtists'; break
        case 22: sectionName = 'topArtists6'; break
        case 23: sectionName = 'topArtistsAll'; break
        case 3: sectionName = 'topTracks'; break
        case 32: sectionName = 'topTracks6'; break
        case 33: sectionName = 'topTracksAll'; break
        case 4: sectionName = 'savedAlbums'; break
        case 5: sectionName = 'savedTracks'; break
        case 6: sectionName = 'followedArtists'; break
        case 7: sectionName = 'newReleases'; break
        case 8: sectionName = 'spotifyPlaylists'; break
        case 10: sectionName = 'search'; break
        default: sectionName = 'search'
      }
      
      // Call the new method
      return await this.getSeedTrackRecommendations(item, sectionName)
    },

    // Legacy method for mobile components compatibility
    async seedTracksM(payload) {
      console.log('seedTracksM called with:', payload)
      const { item, num, sib, child, parent } = payload
      
      // Get section name based on num
      let sectionName
      switch (num) {
        case 1: sectionName = 'yourPlaylists'; break
        case 2: sectionName = 'topArtists'; break
        case 22: sectionName = 'topArtists6'; break
        case 23: sectionName = 'topArtistsAll'; break
        case 3: sectionName = 'topTracks'; break
        case 32: sectionName = 'topTracks6'; break
        case 33: sectionName = 'topTracksAll'; break
        case 4: sectionName = 'savedAlbums'; break
        case 5: sectionName = 'savedTracks'; break
        case 6: sectionName = 'followedArtists'; break
        case 7: sectionName = 'newReleases'; break
        case 8: sectionName = 'spotifyPlaylists'; break
        case 10: sectionName = 'search'; break
        default: sectionName = 'search'
      }
      
      // Call the new method (same as seedTracks for now)
      return await this.getSeedTrackRecommendations(item, sectionName)
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
            album.images[0] = { url: '' }
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
            artist.images[0] = { url: '' }
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
