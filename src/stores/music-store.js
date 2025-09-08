import { defineStore } from 'pinia'
import { musicServiceManager } from '../services/MusicServiceManager.js'
import { SERVICE_TYPES, TIME_RANGES } from '../services/types.js'

export const useMusicStore = defineStore('music', {
  state: () => ({
    // Service management
    currentServiceType: SERVICE_TYPES.SPOTIFY,
    availableServices: [],

    // Loading state
    loading: false,

    // User data
    currentUser: null,
    topTracks: {
      short: [],
      medium: [],
      long: []
    },
    topArtists: {
      short: [],
      medium: [],
      long: []
    },
    savedAlbums: [],
    savedTracks: [],
    savedTracksTotal: 0,
    followedArtists: [],
    playlists: [],

    // Search results
    searchInput: '',
    searchResults: {
      tracks: [],
      artists: [],
      albums: [],
      playlists: []
    },

    // New releases
    newReleases: [],

    // Cache for detailed data
    cache: {
      tracks: new Map(),
      artists: new Map(),
      albums: new Map(),
      playlists: new Map()
    },

    // UI state
    selectedArtistsRange: 1,
    selectedTracksRange: 1,
    searchTimer: null
  }),

  getters: {
    isLoading: (state) => state.loading,
    isAuthenticated: (state) => state.currentUser !== null,
    currentService: () => musicServiceManager.getCurrentService(),
    currentServiceName: (state) => musicServiceManager.getAvailableServices().find(s => s.type === state.currentServiceType)?.name || 'Unknown',

    // Top tracks getters
    getTopTracksShort: (state) => state.topTracks.short,
    getTopTracksMedium: (state) => state.topTracks.medium,
    getTopTracksLong: (state) => state.topTracks.long,

    // Top artists getters
    getTopArtistsShort: (state) => state.topArtists.short,
    getTopArtistsMedium: (state) => state.topArtists.medium,
    getTopArtistsLong: (state) => state.topArtists.long,

    // Other getters
    getSavedAlbums: (state) => state.savedAlbums,
    getSavedTracks: (state) => state.savedTracks,
    getFollowedArtists: (state) => state.followedArtists,
    getPlaylists: (state) => state.playlists,
    getNewReleases: (state) => state.newReleases,
    getSpotifyPlaylists: (state) => state.playlists, // Legacy compatibility

    // Search results getters
    getSearchTracks: (state) => state.searchResults.tracks,
    getSearchArtists: (state) => state.searchResults.artists,
    getSearchAlbums: (state) => state.searchResults.albums,
    getSearchPlaylists: (state) => state.searchResults.playlists
  },

  actions: {
    // Service management actions
    async initializeServices() {
      this.availableServices = musicServiceManager.getAvailableServices()
      this.currentServiceType = musicServiceManager.getCurrentServiceType()
    },

    async switchService(serviceType) {
      this.setLoading(true)
      try {
        const success = await musicServiceManager.switchService(serviceType)
        if (success) {
          this.currentServiceType = serviceType
          // Clear all data when switching services
          this.clearAllData()
        }
        return success
      } catch (error) {
        console.error('Failed to switch service:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async authenticate() {
      this.setLoading(true)
      try {
        await musicServiceManager.authenticate()
        // Authentication will redirect, so we don't need to do anything else here
      } catch (error) {
        console.error('Authentication failed:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    logout() {
      musicServiceManager.logout()
      this.clearAllData()
    },

    // Loading state management
    setLoading(loading) {
      this.loading = loading
    },

    // User data actions
    async fetchCurrentUser() {
      this.setLoading(true)
      try {
        const service = musicServiceManager.getCurrentService()
        this.currentUser = await service.getCurrentUser()
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Top tracks actions
    async fetchTopTracks(timeRange = TIME_RANGES.SHORT) {
      this.setLoading(true)
      try {
        const service = musicServiceManager.getCurrentService()
        const tracks = await service.getTopTracks(timeRange)
        const key = timeRange === TIME_RANGES.SHORT ? 'short' :
          timeRange === TIME_RANGES.MEDIUM ? 'medium' : 'long'
        this.topTracks[key] = tracks
      } catch (error) {
        console.error('Failed to fetch top tracks:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Top artists actions
    async fetchTopArtists(timeRange = TIME_RANGES.SHORT) {
      this.setLoading(true)
      try {
        const service = musicServiceManager.getCurrentService()
        const artists = await service.getTopArtists(timeRange)

        // Fetch top tracks for each artist (if supported by service)
        const artistsWithTracks = await Promise.all(
          artists.map(async (artist) => {
            try {
              const tracks = await service.getArtistTopTracks(artist.id)
              if (tracks.length > 0 && tracks[0].previewUrl) {
                artist.previewUrl = tracks[0].previewUrl
              }
              artist.tracks = tracks
              return artist
            } catch (error) {
              console.error(`Failed to fetch tracks for artist ${artist.id}:`, error)
              return artist
            }
          })
        )

        const key = timeRange === TIME_RANGES.SHORT ? 'short' :
          timeRange === TIME_RANGES.MEDIUM ? 'medium' : 'long'
        this.topArtists[key] = artistsWithTracks
      } catch (error) {
        console.error('Failed to fetch top artists:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Saved albums actions
    async fetchSavedAlbums(offset = 0) {
      this.setLoading(true)
      try {
        // Clear array if this is the first fetch
        if (offset === 0) {
          this.savedAlbums = []
        }

        const service = musicServiceManager.getCurrentService()
        const albums = await service.getSavedAlbums(offset, 20)

        // Enrich albums with track data for preview URLs
        await this.enrichAlbumData(albums.map(item => item.album))

        this.savedAlbums.push(...albums)

        // Continue fetching if there are more albums
        if (albums.length > 0) {
          await this.fetchSavedAlbums(offset + 20)
        }
      } catch (error) {
        console.error('Failed to fetch saved albums:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Saved tracks actions
    async fetchSavedTracks(offset = 0) {
      this.setLoading(true)
      try {
        // Clear array if this is the first fetch
        if (offset === 0) {
          this.savedTracks = []
        }

        const service = musicServiceManager.getCurrentService()
        const response = await service.getSavedTracks(offset, 50)

        // Handle both old and new response formats
        if (response.items && response.total !== undefined) {
          // New format with items and total
          this.savedTracks.push(...response.items)
          this.savedTracksTotal = response.total
        } else {
          // Old format (array of items)
          this.savedTracks.push(...response)
          this.savedTracksTotal = response.length
        }
      } catch (error) {
        console.error('Failed to fetch saved tracks:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Followed artists actions
    async fetchFollowedArtists() {
      this.setLoading(true)
      try {
        const service = musicServiceManager.getCurrentService()
        const artists = await service.getFollowedArtists(50)

        // Fetch top tracks for each artist (if supported by service)
        const artistsWithTracks = await Promise.all(
          artists.map(async (artist) => {
            try {
              const tracks = await service.getArtistTopTracks(artist.id)
              if (tracks.length > 0 && tracks[0].previewUrl) {
                artist.previewUrl = tracks[0].previewUrl
              }
              artist.tracks = tracks
              return artist
            } catch (error) {
              console.error(`Failed to fetch tracks for followed artist ${artist.id}:`, error)
              return artist
            }
          })
        )

        this.followedArtists = artistsWithTracks
      } catch (error) {
        console.error('Failed to fetch followed artists:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Playlists actions
    async fetchPlaylists(offset = 0) {
      this.setLoading(true)
      try {
        const service = musicServiceManager.getCurrentService()
        const playlists = await service.getUserPlaylists(localStorage.getItem('deezer-user-id'), offset)
        this.playlists.push(...playlists)

        // Continue fetching if there are more playlists
        if (playlists.length === 50) {
          await this.fetchPlaylists(offset + 50)
        }
      } catch (error) {
        console.error('Failed to fetch playlists:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchPlaylistTracks(id, offset = 0) {
      try {
        const service = musicServiceManager.getCurrentService()
        const tracks = await service.getPlaylistTracks(id, offset, 100)
        return tracks
      } catch (error) {
        console.error('Failed to fetch playlist tracks:', error)
        throw error
      }
    },

    async createPlaylist(name, description = '') {
      try {
        const service = musicServiceManager.getCurrentService()
        const playlist = await service.createPlaylist(name, description)

        // Add the new playlist to the playlists array
        this.playlists.unshift(playlist)

        return playlist
      } catch (error) {
        console.error('Failed to create playlist:', error)
        throw error
      }
    },

    // New releases actions
    async fetchNewReleases(offset = 0) {
      this.setLoading(true)
      try {
        const service = musicServiceManager.getCurrentService()
        const albums = await service.getNewReleases(20, offset)

        // Enrich albums with track data for preview URLs
        await this.enrichAlbumData(albums)

        this.newReleases.push(...albums)

        // Continue fetching if there are more releases
        if (albums.length > 0 && offset < 100) {
          await this.fetchNewReleases(offset + 20)
        }
      } catch (error) {
        console.error('Failed to fetch new releases:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Spotify playlists actions (legacy method for compatibility)
    async fetchSpotifyPlaylists(offset = 0) {
      this.setLoading(true)
      try {
        const service = musicServiceManager.getCurrentService()
        // Check if the service has a getSpotifyPlaylists method
        if (service.getSpotifyPlaylists) {
          const playlists = await service.getSpotifyPlaylists(offset, 50)
          this.playlists.push(...playlists)
        } else {
          // Fallback to regular playlists
          const playlists = await service.getPlaylists(offset, 50)
          this.playlists.push(...playlists)
        }
      } catch (error) {
        console.error('Failed to fetch Spotify playlists:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Search actions with debouncing
    async search(query) {
      this.searchInput = query

      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      if (!query) {
        this.clearSearchResults()
        return
      }

      this.searchTimer = setTimeout(async () => {
        this.setLoading(true)
        try {
          const service = musicServiceManager.getCurrentService()
          const results = await service.search(query, ['album', 'artist', 'playlist', 'track'], 5)

          this.searchResults.tracks = results.tracks
          this.searchResults.artists = results.artists
          this.searchResults.albums = results.albums
          this.searchResults.playlists = results.playlists

          // Fetch additional data for albums (if supported by service)
          await this.enrichAlbumData(this.searchResults.albums)

          // Fetch additional data for artists (if supported by service)
          await this.enrichArtistData(this.searchResults.artists)

          // Fetch additional data for playlists (if supported by service)
          await this.enrichPlaylistData(this.searchResults.playlists)

        } catch (error) {
          console.error('Failed to search:', error)
          throw error
        } finally {
          this.setLoading(false)
        }
      }, 2000) // 2 second delay
    },

    clearSearchResults() {
      this.searchResults = {
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      }
    },

    // Helper methods to enrich data
    async enrichAlbumData(albums) {
      const service = musicServiceManager.getCurrentService()
      for (const album of albums) {
        try {
          const tracks = await service.getAlbumTracks(album.id)
          album.tracks = tracks
          if (tracks.length > 0 && (tracks[0].preview_url || tracks[0].previewUrl)) {
            album.preview_url = tracks[0].preview_url || tracks[0].previewUrl
            album.previewUrl = tracks[0].preview_url || tracks[0].previewUrl
          }
        } catch (error) {
          console.error(`Failed to enrich album ${album.id}:`, error)
        }
      }
    },

    async enrichArtistData(artists) {
      const service = musicServiceManager.getCurrentService()
      for (const artist of artists) {
        try {
          const tracks = await service.getArtistTopTracks(artist.id)
          artist.tracks = tracks
          if (tracks.length > 0 && tracks[0].previewUrl) {
            artist.previewUrl = tracks[0].previewUrl
          }
        } catch (error) {
          console.error(`Failed to enrich artist ${artist.id}:`, error)
        }
      }
    },

    async enrichPlaylistData(playlists) {
      const service = musicServiceManager.getCurrentService()
      for (const playlist of playlists) {
        try {
          const playlistData = await service.getPlaylist(playlist.id)
          playlist.tracks = playlistData.tracks

          // Handle different track structures for different services
          let firstTrack = null
          if (playlistData.tracks && playlistData.tracks.items && playlistData.tracks.items.length > 0) {
            // Deezer structure: tracks.items[0].track
            firstTrack = playlistData.tracks.items[0].track
          } else if (playlistData.tracks && Array.isArray(playlistData.tracks) && playlistData.tracks.length > 0) {
            // Spotify structure: tracks[0]
            firstTrack = playlistData.tracks[0]
          }

          if (firstTrack && (firstTrack.previewUrl || firstTrack.preview_url)) {
            playlist.previewUrl = firstTrack.previewUrl || firstTrack.preview_url
          }
        } catch (error) {
          console.error(`Failed to enrich playlist ${playlist.id}:`, error)
        }
      }
    },

    // Follow/Unfollow actions
    async followPlaylist(playlist) {
      try {
        const service = musicServiceManager.getCurrentService()
        if (playlist.followed === false) {
          await service.followPlaylist(playlist.id)
          playlist.followed = true
        } else {
          await service.unfollowPlaylist(playlist.id)
          playlist.followed = false
        }
      } catch (error) {
        console.error('Failed to follow/unfollow playlist:', error)
        throw error
      }
    },

    async followArtist(artist) {
      try {
        const service = musicServiceManager.getCurrentService()
        if (artist.followed === false) {
          await service.followArtist(artist.id)
          artist.followed = true
        } else {
          await service.unfollowArtist(artist.id)
          artist.followed = false
        }
      } catch (error) {
        console.error('Failed to follow/unfollow artist:', error)
        throw error
      }
    },

    async followAlbum(album) {
      try {
        const service = musicServiceManager.getCurrentService()
        if (album.followed === false) {
          await service.followAlbum(album.id)
          album.followed = true
        } else {
          await service.unfollowAlbum(album.id)
          album.followed = false
        }
      } catch (error) {
        console.error('Failed to follow/unfollow album:', error)
        throw error
      }
    },

    async followTrack(track) {
      try {
        const service = musicServiceManager.getCurrentService()
        if (track.followed === false) {
          await service.followTrack(track.id)
          track.followed = true
        } else {
          await service.unfollowTrack(track.id)
          track.followed = false
        }
      } catch (error) {
        console.error('Failed to follow/unfollow track:', error)
        throw error
      }
    },

    // UI state actions
    setSelectedArtistsRange(range) {
      this.selectedArtistsRange = range
    },

    setSelectedTracksRange(range) {
      this.selectedTracksRange = range
    },

    setSearchTimer(timer) {
      this.searchTimer = timer
    },

    // Cache management
    getCachedItem(type, id) {
      return this.cache[type].get(id)
    },

    setCachedItem(type, id, data) {
      this.cache[type].set(id, data)
    },

    clearCache(type) {
      if (type) {
        this.cache[type].clear()
      } else {
        Object.keys(this.cache).forEach(key => {
          this.cache[key].clear()
        })
      }
    },

    // Clear all data
    clearAllData() {
      this.currentUser = null
      this.topTracks = { short: [], medium: [], long: [] }
      this.topArtists = { short: [], medium: [], long: [] }
      this.savedAlbums = []
      this.savedTracks = []
      this.followedArtists = []
      this.newReleases = []
      this.playlists = []
      this.searchResults = { tracks: [], artists: [], albums: [], playlists: [] }
      this.loading = false
      this.clearCache()
    }
  }
})
