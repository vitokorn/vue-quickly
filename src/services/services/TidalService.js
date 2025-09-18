import { MusicServiceInterface } from '../MusicServiceInterface.js'
import { SERVICE_TYPES } from '../types.js'

export class TidalService extends MusicServiceInterface {
  constructor() {
    super()
    this.baseURL = 'https://api.tidal.com/v1'
    this.serviceType = SERVICE_TYPES.TIDAL
    this.backendUrl = 'http://localhost:8000'
  }

  getServiceName() {
    return 'Tidal'
  }

  getServiceType() {
    return this.serviceType
  }

  // Authentication methods
  async authenticate() {
    try {
      // Redirect to backend for OAuth flow
      const authUrl = `${this.backendUrl}/tidal/auth`
      window.location.href = authUrl
    } catch (error) {
      console.error('Tidal authentication error:', error)
      throw new Error('Failed to authenticate with Tidal')
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${this.backendUrl}/tidal/refresh`, {
        method: 'POST',
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to refresh Tidal token')
      }
      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Tidal token refresh error:', error)
      throw error
    }
  }

  logout() {
    try {
      // Clear local storage
      localStorage.removeItem('tidal_access_token')
      localStorage.removeItem('tidal_refresh_token')
      localStorage.removeItem('tidal_user_id')
      // Clear cookies via backend
      fetch(`${this.backendUrl}/tidal/logout`, {
        method: 'POST',
        credentials: 'include'
      }).catch(error => {
        console.warn('Failed to logout from backend:', error)
      })
    } catch (error) {
      console.error('Tidal logout error:', error)
      throw error
    }
  }

  isAuthenticated() {
    // Check for stored tokens
    const accessToken = localStorage.getItem('tidal_access_token')
    const refreshToken = localStorage.getItem('tidal_refresh_token')
    return !!(accessToken && refreshToken)
  }

  // Helper method for making Tidal API requests
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('tidal_access_token')
    if (!token) {
      throw new Error('No access token found')
    }

    const url = `${this.baseURL}${endpoint}`
    const config = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      if (response.status === 401) {
        // Token expired, try to refresh
        try {
          await this.refreshToken()
          // Retry with new token
          const newToken = localStorage.getItem('tidal_access_token')
          config.headers['Authorization'] = `Bearer ${newToken}`
          const retryResponse = await fetch(url, config)
          return await retryResponse.json()
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          throw new Error('Authentication failed')
        }
      }

      if (!response.ok) {
        throw new Error(`Tidal API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Tidal API request error:', error)
      throw error
    }
  }

  // User data methods
  async getCurrentUser() {
    try {
      const data = await this.request('/users/me')
      return this.transformUser(data)
    } catch (error) {
      console.error('Tidal getCurrentUser error:', error)
      throw error
    }
  }

  async getTopTracks(timeRange) {
    try {
      // Tidal doesn't have a direct "top tracks" endpoint like Spotify
      // We'll use the user's favorite tracks instead
      const data = await this.request('/users/me/favorites/tracks?limit=50')
      return data.items?.map(track => this.transformTrack(track)) || []
    } catch (error) {
      console.error('Tidal getTopTracks error:', error)
      throw error
    }
  }

  async getTopArtists(timeRange) {
    try {
      // Use favorite artists as top artists
      const data = await this.request('/users/me/favorites/artists?limit=50')
      return data.items?.map(artist => this.transformArtist(artist)) || []
    } catch (error) {
      console.error('Tidal getTopArtists error:', error)
      throw error
    }
  }

  async getSavedAlbums(offset, limit) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 20
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      const data = await this.request(`/users/me/favorites/albums?limit=${safeLimit}&offset=${safeOffset}`)
      return data.items?.map(album => ({
        album: this.transformAlbum(album),
        added_at: new Date().toISOString() // Tidal doesn't provide added_at for favorites
      })) || []
    } catch (error) {
      console.error('Tidal getSavedAlbums error:', error)
      throw error
    }
  }

  async getSavedTracks(offset, limit) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      const data = await this.request(`/users/me/favorites/tracks?limit=${safeLimit}&offset=${safeOffset}`)
      const items = data.items?.map(track => ({
        track: this.transformTrack(track),
        added_at: new Date().toISOString() // Tidal doesn't provide added_at for favorites
      })) || []

      return {
        items,
        total: data.totalNumberOfItems || items.length
      }
    } catch (error) {
      console.error('Tidal getSavedTracks error:', error)
      throw error
    }
  }

  async getFollowedArtists(limit) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50
      const data = await this.request(`/users/me/favorites/artists?limit=${safeLimit}`)
      return data.items?.map(artist => this.transformArtist(artist)) || []
    } catch (error) {
      console.error('Tidal getFollowedArtists error:', error)
      throw error
    }
  }

  // Playlist methods
  async getPlaylists(offset, limit) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      const data = await this.request(`/users/me/playlists?limit=${safeLimit}&offset=${safeOffset}`)
      return data.items?.map(playlist => this.transformPlaylist(playlist)) || []
    } catch (error) {
      console.error('Tidal getPlaylists error:', error)
      throw error
    }
  }

  async getPlaylist(id) {
    try {
      const data = await this.request(`/playlists/${id}`)
      return this.transformPlaylist(data)
    } catch (error) {
      console.error('Tidal getPlaylist error:', error)
      throw error
    }
  }

  async getPlaylistTracks(id, offset, limit) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 100
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      const data = await this.request(`/playlists/${id}/tracks?limit=${safeLimit}&offset=${safeOffset}`)
      return data.items?.map(track => this.transformTrack(track)) || []
    } catch (error) {
      console.error('Tidal getPlaylistTracks error:', error)
      throw error
    }
  }

  async createPlaylist(name, description) {
    try {
      const payload = {
        title: name,
        description: description || ''
      }

      const data = await this.request('/playlists', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      return this.transformPlaylist(data)
    } catch (error) {
      console.error('Tidal createPlaylist error:', error)
      throw error
    }
  }

  async addTracksToPlaylist(playlistId, trackIds) {
    try {
      const payload = {
        trackIds: trackIds.map(id => id.toString())
      }

      await this.request(`/playlists/${playlistId}/tracks`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      return true
    } catch (error) {
      console.error('Tidal addTracksToPlaylist error:', error)
      throw error
    }
  }

  // Artist methods
  async getArtist(id) {
    try {
      const data = await this.request(`/artists/${id}`)
      return this.transformArtist(data)
    } catch (error) {
      console.error('Tidal getArtist error:', error)
      throw error
    }
  }

  async getArtistTopTracks(id, market) {
    try {
      const data = await this.request(`/artists/${id}/toptracks?limit=10`)
      return data.items?.map(track => this.transformTrack(track)) || []
    } catch (error) {
      console.error('Tidal getArtistTopTracks error:', error)
      throw error
    }
  }

  async getArtistAlbums(id, includeGroups, limit) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 10
      const data = await this.request(`/artists/${id}/albums?limit=${safeLimit}`)
      return data.items?.map(album => this.transformAlbum(album)) || []
    } catch (error) {
      console.error('Tidal getArtistAlbums error:', error)
      throw error
    }
  }

  async getRelatedArtists(id) {
    try {
      const data = await this.request(`/artists/${id}/similar?limit=10`)
      return data.items?.map(artist => this.transformArtist(artist)) || []
    } catch (error) {
      console.error('Tidal getRelatedArtists error:', error)
      throw error
    }
  }

  async getArtistAppearances(id, limit = 10) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 10
      // Get tracks where the artist appears (could include singles, compilations, etc.)
      const data = await this.request(`/artists/${id}/tracks?limit=${safeLimit}`)
      return data.items?.map(track => this.transformTrack(track)) || []
    } catch (error) {
      console.error('Tidal getArtistAppearances error:', error)
      throw error
    }
  }

  async getArtistPlaylists(id, limit = 10) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 10
      // Tidal might not have a direct endpoint for artist playlists, so we'll return empty array
      return []
    } catch (error) {
      console.error('Tidal getArtistPlaylists error:', error)
      throw error
    }
  }

  // Album methods
  async getAlbum(id) {
    try {
      const data = await this.request(`/albums/${id}`)
      return this.transformAlbum(data)
    } catch (error) {
      console.error('Tidal getAlbum error:', error)
      throw error
    }
  }

  async getAlbumTracks(id) {
    try {
      const data = await this.request(`/albums/${id}/tracks`)
      return data.items?.map(track => this.transformTrack(track)) || []
    } catch (error) {
      console.error('Tidal getAlbumTracks error:', error)
      throw error
    }
  }

  // Track methods
  async getTrack(id) {
    try {
      const data = await this.request(`/tracks/${id}`)
      return this.transformTrack(data)
    } catch (error) {
      console.error('Tidal getTrack error:', error)
      throw error
    }
  }

  // Search and discovery
  async search(query, types, limit) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 5
      const typeParam = Array.isArray(types) ? types.join(',') : 'track,artist,album,playlist'

      const data = await this.request(`/search?query=${encodeURIComponent(query)}&types=${typeParam}&limit=${safeLimit}`)

      const results = {
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      }

      if (data.tracks?.items) {
        results.tracks = data.tracks.items.map(track => this.transformTrack(track))
      }
      if (data.artists?.items) {
        results.artists = data.artists.items.map(artist => this.transformArtist(artist))
      }
      if (data.albums?.items) {
        results.albums = data.albums.items.map(album => this.transformAlbum(album))
      }
      if (data.playlists?.items) {
        results.playlists = data.playlists.items.map(playlist => this.transformPlaylist(playlist))
      }

      return results
    } catch (error) {
      console.error('Tidal search error:', error)
      throw error
    }
  }

  async getNewReleases(limit, offset) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 20
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      const data = await this.request(`/albums/new?limit=${safeLimit}&offset=${safeOffset}`)
      return data.items?.map(album => this.transformAlbum(album)) || []
    } catch (error) {
      console.error('Tidal getNewReleases error:', error)
      throw error
    }
  }

  async getRecommendations(params) {
    try {
      // Tidal recommendations might be based on user favorites or radio
      // For now, let's return some popular tracks
      const data = await this.request('/tracks/popular?limit=20')
      return data.items?.map(track => this.transformTrack(track)) || []
    } catch (error) {
      console.error('Tidal getRecommendations error:', error)
      throw error
    }
  }

  // Follow/Unfollow methods
  async followArtist(id) {
    try {
      await this.request(`/users/me/favorites/artists/${id}`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Tidal followArtist error:', error)
      throw error
    }
  }

  async unfollowArtist(id) {
    try {
      await this.request(`/users/me/favorites/artists/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Tidal unfollowArtist error:', error)
      throw error
    }
  }

  async followAlbum(id) {
    try {
      await this.request(`/users/me/favorites/albums/${id}`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Tidal followAlbum error:', error)
      throw error
    }
  }

  async unfollowAlbum(id) {
    try {
      await this.request(`/users/me/favorites/albums/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Tidal unfollowAlbum error:', error)
      throw error
    }
  }

  async followTrack(id) {
    try {
      await this.request(`/users/me/favorites/tracks/${id}`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Tidal followTrack error:', error)
      throw error
    }
  }

  async unfollowTrack(id) {
    try {
      await this.request(`/users/me/favorites/tracks/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Tidal unfollowTrack error:', error)
      throw error
    }
  }

  async followPlaylist(id) {
    try {
      await this.request(`/users/me/follows/playlists/${id}`, {
        method: 'POST'
      })
      return true
    } catch (error) {
      console.error('Tidal followPlaylist error:', error)
      throw error
    }
  }

  async unfollowPlaylist(id) {
    try {
      await this.request(`/users/me/follows/playlists/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Tidal unfollowPlaylist error:', error)
      throw error
    }
  }

  // Check following status
  async checkFollowingArtist(id) {
    try {
      const response = await this.request(`/users/me/favorites/artists/contains?ids=${id}`)
      return Array.isArray(response) ? response[0] : false
    } catch (error) {
      console.error('Tidal checkFollowingArtist error:', error)
      return false
    }
  }

  async checkFollowingAlbum(id) {
    try {
      const response = await this.request(`/users/me/favorites/albums/contains?ids=${id}`)
      return Array.isArray(response) ? response[0] : false
    } catch (error) {
      console.error('Tidal checkFollowingAlbum error:', error)
      return false
    }
  }

  async checkFollowingTrack(id) {
    try {
      const response = await this.request(`/users/me/favorites/tracks/contains?ids=${id}`)
      return Array.isArray(response) ? response[0] : false
    } catch (error) {
      console.error('Tidal checkFollowingTrack error:', error)
      return false
    }
  }

  async checkFollowingPlaylist(id) {
    try {
      const response = await this.request(`/users/me/follows/playlists/contains?ids=${id}`)
      return Array.isArray(response) ? response[0] : false
    } catch (error) {
      console.error('Tidal checkFollowingPlaylist error:', error)
      return false
    }
  }

  async getUserPlaylists(userId, limit = 20, offset=0) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 20
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      const data = await this.request(`/users/${userId}/playlists?limit=${safeLimit}&offset=${safeOffset}`)
      return data.items?.map(playlist => this.transformPlaylist(playlist)) || []
    } catch (error) {
      console.error('Tidal getUserPlaylists error:', error)
      throw error
    }
  }

  // Categories methods
  async getCategories(offset = 0, limit = 50) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      const data = await this.request(`/genres?limit=${safeLimit}&offset=${safeOffset}`)
      return data.items?.map(category => ({
        id: category.id || category.name?.toLowerCase().replace(/\s+/g, '-'),
        name: category.name || '',
        images: category.picture ? [{
          url: category.picture,
          height: 640,
          width: 640
        }] : []
      })) || []
    } catch (error) {
      console.error('Tidal getCategories error:', error)
      throw error
    }
  }

  async getCategoryPlaylists(categoryId, offset = 0, limit = 50) {
    try {
      const safeLimit = typeof limit === 'number' && limit > 0 ? limit : 50
      const safeOffset = typeof offset === 'number' && offset >= 0 ? offset : 0

      // Tidal might use moods/playlists by genre
      const data = await this.request(`/genres/${categoryId}/playlists?limit=${safeLimit}&offset=${safeOffset}`)
      return data.items?.map(playlist => this.transformPlaylist(playlist)) || []
    } catch (error) {
      console.error('Tidal getCategoryPlaylists error:', error)
      throw error
    }
  }

  // Transformation methods to convert Tidal format to our standard format
  transformTrack(data) {
    if (!data || !data.id) {
      console.warn('Invalid track data:', data)
      return null
    }

    const shortTitle = this.generateShortTitle(data.title || data.name || '')
    console.log(`Tidal track: "${data.title || data.name}" -> short: "${shortTitle}"`)

    return {
      id: data.id.toString(),
      name: data.title || data.name || '',
      title_short: shortTitle,
      artists: data.artists ? data.artists.map(artist => this.transformArtist(artist)).filter(a => a !== null) : [],
      album: data.album ? this.transformAlbum(data.album) : null,
      duration_ms: data.duration ? data.duration * 1000 : 0, // Convert seconds to milliseconds
      previewUrl: data.audioPreview?.url || null,
      external_urls: {
        tidal: data.url || `https://tidal.com/track/${data.id}`
      },
      images: data.album?.cover ? [{
        url: data.album.cover,
        height: 640,
        width: 640
      }] : [],
      service: this.serviceType,
      popularity: data.popularity || 0,
      trackNumber: data.trackNumber || 0,
      discNumber: data.volumeNumber || 1,
      followed: false, // We'll check this separately if needed
      explicit: data.explicit || false
    }
  }

  transformArtist(data) {
    if (!data || !data.id) {
      console.warn('Invalid artist data:', data)
      return null
    }

    return {
      id: data.id.toString(),
      name: data.name || '',
      images: data.picture ? [{
        url: data.picture,
        height: 640,
        width: 640
      }] : [],
      external_urls: {
        tidal: data.url || `https://tidal.com/artist/${data.id}`
      },
      genres: data.genres || [],
      followers: {
        total: data.followerCount || 0
      },
      service: this.serviceType,
      popularity: data.popularity || 0,
      followed: false // We'll check this separately if needed
    }
  }

  transformAlbum(data) {
    if (!data || !data.id) {
      console.warn('Invalid album data:', data)
      return null
    }

    return {
      id: data.id.toString(),
      name: data.title || data.name || '',
      artists: data.artists ? data.artists.map(artist => this.transformArtist(artist)).filter(a => a !== null) : [],
      images: data.cover ? [{
        url: data.cover,
        height: 640,
        width: 640
      }] : [],
      external_urls: {
        tidal: data.url || `https://tidal.com/album/${data.id}`
      },
      releaseDate: data.releaseDate || null,
      totalTracks: data.numberOfTracks || data.trackCount || 0,
      service: this.serviceType,
      albumType: data.type || 'album',
      followed: false, // We'll check this separately if needed
      explicit: data.explicit || false
    }
  }

  transformPlaylist(data) {
    if (!data || !data.uuid) {
      console.warn('Invalid playlist data:', data)
      return null
    }

    return {
      id: data.uuid,
      name: data.title || '',
      description: data.description || '',
      images: data.squareImage ? [{
        url: data.squareImage,
        height: 640,
        width: 640
      }] : [],
      owner: {
        display_name: data.creator?.name || 'Unknown',
        external_urls: {
          tidal: data.creator?.url || `https://tidal.com/profile/${data.creator?.id || 'unknown'}`
        },
        id: data.creator?.id?.toString() || 'unknown',
        type: "user",
        uri: `tidal:user:${data.creator?.id || 'unknown'}`,
        images: [],
        country: data.creator?.country || null,
        tracklist: null
      },
      public: data.publicPlaylist || false,
      totalTracks: data.numberOfTracks || 0,
      external_urls: {
        tidal: data.url || `https://tidal.com/playlist/${data.uuid}`
      },
      service: this.serviceType,
      followed: false, // We'll check this separately if needed
      tracks: data.tracks ? {
        items: data.tracks.map(track => ({
          track: this.transformTrack(track)
        })),
        total: data.numberOfTracks || data.tracks.length
      } : null
    }
  }

  transformUser(data) {
    if (!data || !data.id) {
      console.warn('Invalid user data:', data)
      return null
    }

    return {
      id: data.id.toString(),
      displayName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username || 'Unknown User',
      email: data.email || null,
      country: data.country || null,
      images: data.picture ? [{
        url: data.picture,
        height: 640,
        width: 640
      }] : [],
      followers: data.followerCount || 0,
      service: this.serviceType
    }
  }

  // Helper method for generating short titles (inherited from base class but can be overridden)
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
}
