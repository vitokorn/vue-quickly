import { defineStore } from 'pinia'
import { spotifyApi } from '../services/spotifyApi'
import { useVisibilityManager } from '../composables/useVisibilityManager'

export const useSpotifyStore = defineStore('spotify', {
  state: () => ({
    // Loading state
    loading: false,
    
    // User data
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
    followedArtists: [],
    playlists: [],
    
    // Search results
    searchResults: {
      tracks: [],
      artists: [],
      albums: [],
      playlists: []
    },
    
    // New releases
    newReleases: [],
    
    // Spotify playlists
    spotifyPlaylists: [],
    
    // Cache for detailed data
    cache: {
      tracks: new Map(),
      artists: new Map(),
      albums: new Map(),
      playlists: new Map()
    },
    
    // Current selections
    currentPlaylist: null,
    currentSpotifyPlaylist: null,
    
    // UI state
    selectedArtistsRange: 1,
    selectedTracksRange: 1,
    searchTimer: null
  }),

  getters: {
    isLoading: (state) => state.loading,
    
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
    getSpotifyPlaylists: (state) => state.spotifyPlaylists,
    getCurrentPlaylist: (state) => state.currentPlaylist,
    getCurrentSpotifyPlaylist: (state) => state.currentSpotifyPlaylist,
    
    // Search results getters
    getSearchTracks: (state) => state.searchResults.tracks,
    getSearchArtists: (state) => state.searchResults.artists,
    getSearchAlbums: (state) => state.searchResults.albums,
    getSearchPlaylists: (state) => state.searchResults.playlists
  },

  actions: {
    setLoading(loading) {
      this.loading = loading
    },

    // Top tracks actions
    async fetchTopTracks(timeRange = 'short_term') {
      this.setLoading(true)
      try {
        const response = await spotifyApi.getTopTracks(timeRange)
        const key = timeRange === 'short_term' ? 'short' : 
                   timeRange === 'medium_term' ? 'medium' : 'long'
        this.topTracks[key] = response.data.items
      } catch (error) {
        console.error('Failed to fetch top tracks:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Top artists actions
    async fetchTopArtists(timeRange = 'short_term') {
      this.setLoading(true)
      try {
        const response = await spotifyApi.getTopArtists(timeRange)
        const artists = response.data.items
        
        // Fetch top tracks for each artist
        const artistsWithTracks = await Promise.all(
          artists.map(async (artist) => {
            try {
              const tracksResponse = await spotifyApi.getArtistTopTracks(artist.id)
              const tracks = tracksResponse.data.tracks
              if (tracks.length > 0 && tracks[0].preview_url) {
                artist.preview_url = tracks[0].preview_url
              }
              artist.tracks = tracks
              return artist
            } catch (error) {
              console.error(`Failed to fetch tracks for artist ${artist.id}:`, error)
              return artist
            }
          })
        )
        
        const key = timeRange === 'short_term' ? 'short' : 
                   timeRange === 'medium_term' ? 'medium' : 'long'
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
        
        const response = await spotifyApi.getSavedAlbums(offset, 20)
        this.savedAlbums.push(...response.data.items)
        
        // Continue fetching if there are more albums
        if (response.data.items.length > 0) {
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
        
        const response = await spotifyApi.getSavedTracks(offset, 50)
        this.savedTracks.push(...response.data.items)
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
        const response = await spotifyApi.getFollowedArtists(50)
        const artists = response.data.artists.items
        
        // Fetch top tracks for each artist
        const artistsWithTracks = await Promise.all(
          artists.map(async (artist) => {
            try {
              const tracksResponse = await spotifyApi.getArtistTopTracks(artist.id, 'UA')
              const tracks = tracksResponse.data.tracks
              if (tracks.length > 0 && tracks[0].preview_url) {
                artist.preview_url = tracks[0].preview_url
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
        const response = await spotifyApi.getPlaylists(offset, 50)
        this.playlists.push(...response.data.items)
        
        // Continue fetching if there are more playlists
        if (response.data.items.length > 0) {
          await this.fetchPlaylists(offset + 50)
        }
      } catch (error) {
        console.error('Failed to fetch playlists:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchPlaylist(id) {
      try {
        const response = await spotifyApi.getPlaylist(id)
        const playlist = response.data
        
        // Check if user follows this playlist
        try {
          const followResponse = await spotifyApi.checkFollowingPlaylist(id)
          playlist.followed = followResponse.data[0]
        } catch (error) {
          playlist.followed = false
        }
        
        this.currentPlaylist = playlist
        return playlist
      } catch (error) {
        console.error('Failed to fetch playlist:', error)
        throw error
      }
    },

    async createPlaylist(name) {
      try {
        const response = await spotifyApi.createPlaylist(name)
        const playlist = response.data
        
        // Add the new playlist to the playlists array
        this.playlists.unshift(playlist)
        
        return playlist
      } catch (error) {
        console.error('Failed to create playlist:', error)
        throw error
      }
    },

    // Spotify playlists actions
    async fetchSpotifyPlaylists(offset = 0) {
      this.setLoading(true)
      try {
        const response = await spotifyApi.getSpotifyPlaylists(offset, 50)
        this.spotifyPlaylists.push(...response.data.items)
      } catch (error) {
        console.error('Failed to fetch Spotify playlists:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchSpotifyPlaylist(id) {
      try {
        const response = await spotifyApi.getPlaylist(id)
        const playlist = response.data
        this.currentSpotifyPlaylist = playlist
        return playlist
      } catch (error) {
        console.error('Failed to fetch Spotify playlist:', error)
        throw error
      }
    },

    // New releases actions
    async fetchNewReleases(offset = 0) {
      this.setLoading(true)
      try {
        const response = await spotifyApi.getNewReleases(20, offset)
        const albumIds = response.data.albums.items.map(album => album.id)
        
        if (albumIds.length > 0 && offset < 100) {
          const albumsResponse = await spotifyApi.getAlbums(albumIds.join(','))
          this.newReleases.push(...albumsResponse.data.albums)
          
          // Continue fetching if there are more releases
          if (albumsResponse.data.albums.length > 0 && offset < 100) {
            await this.fetchNewReleases(offset + 20)
          }
        }
      } catch (error) {
        console.error('Failed to fetch new releases:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // Search actions
    async search(query) {
      if (!query) {
        this.clearSearchResults()
        return
      }

      this.setLoading(true)
      try {
        const response = await spotifyApi.search(query, 'album,artist,playlist,track', 5)
        
        this.searchResults.tracks = response.data.tracks.items
        this.searchResults.artists = response.data.artists.items
        this.searchResults.albums = response.data.albums.items
        this.searchResults.playlists = response.data.playlists.items
        
        // Fetch additional data for albums
        await this.enrichAlbumData(this.searchResults.albums)
        
        // Fetch additional data for artists
        await this.enrichArtistData(this.searchResults.artists)
        
        // Fetch additional data for playlists
        await this.enrichPlaylistData(this.searchResults.playlists)
        
      } catch (error) {
        console.error('Failed to search:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
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
      for (const album of albums) {
        try {
          const tracksResponse = await spotifyApi.getAlbumTracks(album.id)
          const tracks = tracksResponse.data.items
          album.tracks = tracks
          if (tracks.length > 0 && tracks[0].preview_url) {
            album.preview_url = tracks[0].preview_url
          }
        } catch (error) {
          console.error(`Failed to enrich album ${album.id}:`, error)
        }
      }
    },

    async enrichArtistData(artists) {
      for (const artist of artists) {
        try {
          const tracksResponse = await spotifyApi.getArtistTopTracks(artist.id, 'UA')
          const tracks = tracksResponse.data.tracks
          artist.tracks = tracks
          if (tracks.length > 0 && tracks[0].preview_url) {
            artist.preview_url = tracks[0].preview_url
          }
        } catch (error) {
          console.error(`Failed to enrich artist ${artist.id}:`, error)
        }
      }
    },

    async enrichPlaylistData(playlists) {
      for (const playlist of playlists) {
        try {
          const playlistResponse = await spotifyApi.getPlaylist(playlist.id)
          const tracks = playlistResponse.data.tracks
          playlist.tracks = tracks
          if (tracks.items.length > 0 && tracks.items[0].track?.preview_url) {
            playlist.preview_url = tracks.items[0].track.preview_url
          }
        } catch (error) {
          console.error(`Failed to enrich playlist ${playlist.id}:`, error)
        }
      }
    },

    // Follow/Unfollow actions
    async followPlaylist(playlist) {
      try {
        if (playlist.followed === false) {
          await spotifyApi.followPlaylist(playlist.id)
          playlist.followed = true
        } else {
          await spotifyApi.unfollowPlaylist(playlist.id)
          playlist.followed = false
        }
      } catch (error) {
        console.error('Failed to follow/unfollow playlist:', error)
        throw error
      }
    },

    async followArtist(artist) {
      try {
        if (artist.followed === false) {
          await spotifyApi.followArtist(artist.id)
          artist.followed = true
        } else {
          await spotifyApi.unfollowArtist(artist.id)
          artist.followed = false
        }
      } catch (error) {
        console.error('Failed to follow/unfollow artist:', error)
        throw error
      }
    },

    async followAlbum(album) {
      try {
        if (album.followed === false) {
          await spotifyApi.followAlbum(album.id)
          album.followed = true
        } else {
          await spotifyApi.unfollowAlbum(album.id)
          album.followed = false
        }
      } catch (error) {
        console.error('Failed to follow/unfollow album:', error)
        throw error
      }
    },

    async followTrack(track) {
      try {
        if (track.followed === false) {
          await spotifyApi.followTrack(track.id)
          track.followed = true
        } else {
          await spotifyApi.unfollowTrack(track.id)
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
      this.topTracks = []
      this.topArtists = []
      this.savedAlbums = []
      this.savedTracks = []
      this.followedArtists = []
      this.newReleases = []
      this.playlists = []
      this.currentPlaylist = null
      this.currentSpotifyPlaylist = null
      this.isLoading = false
    },

    // Legacy method for compatibility
    async reloadST(payload) {
      console.log('reloadST called with:', payload)
      // For now, just log the call - this can be implemented later
      return true
    },

    // Legacy method for compatibility
    async reloadSA(payload) {
      console.log('reloadSA called with:', payload)
      // For now, just log the call - this can be implemented later
      return true
    },

    // Legacy method for compatibility
    async getTheSoundOf(payload) {
      console.log('getTheSoundOf called with:', payload)
      // For now, just log the call - this can be implemented later
      return true
    }
  }
})
