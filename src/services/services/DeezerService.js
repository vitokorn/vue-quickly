import { MusicServiceInterface } from '../MusicServiceInterface.js'
import { SERVICE_TYPES } from '../types.js'

export class DeezerService extends MusicServiceInterface {
  constructor() {
    super()
    this.baseURL = 'https://api.deezer.com'
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
        return { items: [], total: 0 }
      }

      // Resolve loved playlist id (cached, with paginated discovery fallback)
      const lovedId = await this.getOrFindLovedPlaylistId(userId)
      if (!lovedId) {
        return { items: [], total: 0 }
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
      return { items, total }
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

  async getPlaylistTracks(id, offset, limit) {
    throw new Error('Deezer getPlaylistTracks not yet implemented')
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
      const response = await this.request(`/artist/${id}/top`)
      return response.data.map(track => this.transformTrack(track))
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
      const allAlbums = await this.getAllArtistAlbums(id)
      // Filter for compilation appearances
      const appearances = allAlbums.filter(album =>
        album.record_type === 'compilation'
      ).slice(0, limit) // Apply limit after filtering
      return appearances.map(album => this.transformAlbum(album))
    } catch (error) {
      console.error('Deezer getArtistAppearances error:', error)
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

  // Playlist methods
  async getPlaylist(id) {
    try {
      const response = await this.request(`/playlist/${id}`)
      return this.transformPlaylist(response)
    } catch (error) {
      console.error('Deezer getPlaylist error:', error)
      throw error
    }
  }

  async getUserPlaylists(offset = 0, userId) {
    try {
        let limit = 20
        let url = `/user/${userId}/playlists?limit=${limit}&index=${offset}`
        if (offset > 0) {
            url += `&index=${offset}`
        }
      const response = await this.request(url)
      return response.data.map(playlist => this.transformPlaylist(playlist))
    } catch (error) {
      console.error('Deezer getUserPlaylists error:', error)
      throw error
    }
  }

  async getPlaylists(limit = 20, offset = 0) {
    try {
        const response = await this.request(`/user/${userId}/playlists?limit=${limit}&index=${offset}`)
      const data = response?.data || []
      return data.map(playlist => this.transformPlaylist(playlist)).filter(p => p !== null)
    } catch (error) {
      console.error('Deezer getChartPlaylists error:', error)
      throw error
    }
  }

    async getSpotifyPlaylists(limit = 20, offset = 0) {
        try {
            // const response = await this.request(`/user/637006841/playlists?limit=${limit}&index=${offset}`)
            const response = await this.request(`/chart/0/playlists?limit=${limit}&index=${offset}`)
            const data = response?.data || []
            return data.map(playlist => this.transformPlaylist(playlist)).filter(p => p !== null)
        } catch (error) {
            console.error('Deezer getChartPlaylists error:', error)
            throw error
        }
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
          searchResults.playlists = playlistsResponse.data.map(playlist => this.transformPlaylist(playlist)).filter(playlist => playlist !== null)
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
      // Deezer doesn't have a direct recommendations endpoint like Spotify
      // We'll use the artist radio endpoint as a workaround for recommendations
      if (params.seedArtists && params.seedArtists.length > 0) {
        const artistId = params.seedArtists[0].id
        const response = await this.request(`/artist/${artistId}/radio`)
        return response.data.map(track => this.transformTrack(track))
      }

      // If no seed artists, return empty array
      return []
    } catch (error) {
      console.error('Deezer getRecommendations error:', error)
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
          { url: response.picture_small, height: 56, width: 56 },
          { url: response.picture_medium, height: 250, width: 250 },
          { url: response.picture_big, height: 500, width: 500 },
          { url: response.picture_xl, height: 1000, width: 1000 }
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

    return {
      id: data.id.toString(),
      name: data.title,
      artists: artists,
      album: data.album ? this.transformAlbum(data.album) : null,
      duration_ms: parseInt(data.duration) * 1000, // Convert seconds to milliseconds
      preview_url: data.preview || null,
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

    return {
      id: data.id.toString(),
      name: data.title,
      description: data.description || '',
      images: this.transformImages([
        { url: data.picture_small, height: 56, width: 56 },
        { url: data.picture_medium, height: 250, width: 250 },
        { url: data.picture_big, height: 500, width: 500 },
        { url: data.picture_xl, height: 1000, width: 1000 }
      ]),
      external_urls: {
        spotify: data.link,
        deezer: data.link
      },
      tracks: tracks,
      owner: {
        display_name: data.creator?.name || data.user?.name || 'Unknown',
        id: (data.creator?.id || data.user?.id)?.toString() || 'unknown'
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
}
