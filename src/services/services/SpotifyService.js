import { MusicServiceInterface } from '../MusicServiceInterface.js'
import {
  Artist,
  Album,
  Track,
  Playlist,
  SearchResults,
  User,
  Image,
  ExternalUrls,
  SERVICE_TYPES,
  TIME_RANGES
} from '../types.js'
import axios from 'axios'

export class SpotifyService extends MusicServiceInterface {
  constructor() {
    super()
    this.baseURL = 'https://api.spotify.com/v1'
    this.serviceType = SERVICE_TYPES.SPOTIFY
  }

  getServiceName() {
    return 'Spotify'
  }

  getServiceType() {
    return this.serviceType
  }

  getToken() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }

  getUsername() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }

  getCountry() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }

  async request(endpoint, options = {}) {
    const token = this.getToken()
    const config = {
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    }

    try {
      const response = await axios(config)
      return response
    } catch (error) {
      if (error.response?.status === 401) {
        await this.refreshToken()
        // Retry the request with new token
        config.headers['Authorization'] = `Bearer ${this.getToken()}`
        return axios(config)
      }
      throw error
    }
  }

  async refreshToken() {
    const username = this.getUsername()
    const response = await axios.get(`/spotify/refresh_token/${username}`)
    if (response.status === 200) {
      return response.data
    }
    throw new Error('Failed to refresh token')
  }

  // Authentication methods
  async authenticate() {
    // Redirect to Spotify OAuth
    window.location.href = '/spotify/login'
  }

  logout() {
    window.location.href = '/spotify/logout'
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  // User data methods
  async getCurrentUser() {
    const response = await this.request('/me')
    return this.transformUser({
      id: response.data.id,
      displayName: response.data.display_name,
      email: response.data.email,
      country: response.data.country,
      images: response.data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
      followers: response.data.followers?.total || 0,
      service: this.serviceType
    })
  }

  async getTopTracks(timeRange = TIME_RANGES.SHORT) {
    const response = await this.request(`/me/top/tracks?time_range=${timeRange}`)
    return response.data.items.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  async getTopArtists(timeRange = TIME_RANGES.SHORT) {
    const response = await this.request(`/me/top/artists?time_range=${timeRange}`)
    return response.data.items.map(artist => this.transformArtist({
      ...artist,
      service: this.serviceType
    }))
  }

  async getSavedAlbums(offset = 0, limit = 20) {
    const response = await this.request(`/me/albums?offset=${offset}&limit=${limit}`)
    // Return the original structure with album property for compatibility
    return response.data.items.map(item => ({
      ...item,
      album: this.transformAlbum({
        ...item.album,
        service: this.serviceType
      })
    }))
  }

  async getSavedTracks(offset = 0, limit = 50) {
    const response = await this.request(`/me/tracks?offset=${offset}&limit=${limit}`)
    // Return the original structure with track property for compatibility
    const items = response.data.items.map(item => ({
      ...item,
      track: this.transformTrack({
        ...item.track,
        service: this.serviceType
      })
    }))

    // Return both items and total for proper pagination
    return {
      items,
      total: response.data.total
    }
  }

  async getFollowedArtists(limit = 50) {
    const response = await this.request(`/me/following?type=artist&limit=${limit}`)
    return response.data.artists.items.map(artist => this.transformArtist({
      ...artist,
      service: this.serviceType
    }))
  }

  // Playlist methods
  async getUserPlaylists(offset = 0) {
      let limit = 50
    const response = await this.request(`/me/playlists?fields=items(name,id,images,owner,public)&limit=${limit}&offset=${offset}`)
    return response.data.items.map(playlist => this.transformPlaylist({
      ...playlist,
      service: this.serviceType
    }))
  }



  async getPlaylists(offset = 0, limit = 50) {
    const response = await this.request(`/users/spotify/playlists?fields=items(name,id,images,owner,public)&limit=${limit}&offset=${offset}`)
    return response.data.items.map(playlist => this.transformPlaylist({
      ...playlist,
      service: this.serviceType
    }))
  }

  async getPlaylist(id) {
    const response = await this.request(`/playlists/${id}`)
    return this.transformPlaylist({
      ...response.data,
      service: this.serviceType
    })
  }

  async getPlaylistTracks(id, offset = 0, limit = 100) {
    const response = await this.request(`/playlists/${id}/tracks?offset=${offset}&limit=${limit}`)
    return response.data.items.map(item => this.transformTrack({
      ...item.track,
      service: this.serviceType
    }))
  }

  async createPlaylist(name, description = '') {
    const username = this.getUsername()
    const response = await this.request(`/users/${username}/playlists`, {
      method: 'POST',
      data: { name, description }
    })
    return this.transformPlaylist({
      ...response.data,
      service: this.serviceType
    })
  }

  async addTracksToPlaylist(playlistId, trackIds) {
    const uris = trackIds.map(id => `spotify:track:${id}`).join(',')
    await this.request(`/playlists/${playlistId}/tracks?uris=${uris}`, {
      method: 'POST'
    })
  }

  // Artist methods
  async getArtist(id) {
    const response = await this.request(`/artists/${id}`)
    return this.transformArtist({
      ...response.data,
      service: this.serviceType
    })
  }

  async getArtistTopTracks(id, market = 'US') {
    const country = this.getCountry()
    const response = await this.request(`/artists/${id}/top-tracks?market=${market}${country}`)
    return response.data.tracks.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  async getArtistAlbums(id, includeGroups = 'album', limit = 10) {
    const response = await this.request(`/artists/${id}/albums?include_groups=${includeGroups}&limit=${limit}`)
    return response.data.items.map(album => this.transformAlbum({
      ...album,
      service: this.serviceType
    }))
  }

  async getArtistSingles(id, limit = 10) {
    const response = await this.request(`/artists/${id}/albums?include_groups=single&limit=${limit}`)
    return response.data.items.map(album => this.transformAlbum({
      ...album,
      service: this.serviceType
    }))
  }

  async getArtistAppearances(id, limit = 10) {
    const response = await this.request(`/artists/${id}/albums?include_groups=appears_on&limit=${limit}`)
    return response.data.items.map(album => this.transformAlbum({
      ...album,
      service: this.serviceType
    }))
  }

  async getRelatedArtists(id) {
    try {
      const response = await this.request(`/artists/${id}/related-artists`)
      return response.data.artists.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      }))
    } catch (error) {
      console.warn('Failed to fetch related artists:', error.message)
      return []
    }
  }

  // Album methods
  async getAlbum(id) {
    const response = await this.request(`/albums/${id}`)
    return this.transformAlbum({
      ...response.data,
      service: this.serviceType
    })
  }

  async getAlbumTracks(id) {
    const response = await this.request(`/albums/${id}/tracks`)
    return response.data.items.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  // Track methods
  async getTrack(id) {
    const response = await this.request(`/tracks/${id}`)
    return this.transformTrack({
      ...response.data,
      service: this.serviceType
    })
  }

  // Search and discovery
  async search(query, types = ['track', 'artist', 'album', 'playlist'], limit = 5) {
    const response = await this.request(`/search/?q=${encodeURIComponent(query)}&type=${types.join(',')}&limit=${limit}`)

    return new SearchResults({
      tracks: response.data.tracks?.items.map(track => this.transformTrack({
        ...track,
        service: this.serviceType
      })) || [],
      artists: response.data.artists?.items.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      })) || [],
      albums: response.data.albums?.items.map(album => this.transformAlbum({
        ...album,
        service: this.serviceType
      })) || [],
      playlists: response.data.playlists?.items.map(playlist => this.transformPlaylist({
        ...playlist,
        service: this.serviceType
      })) || [],
      total: response.data.tracks?.total || 0
    })
  }

  async getNewReleases(limit = 20, offset = 0) {
    const response = await this.request(`/browse/new-releases?limit=${limit}&offset=${offset}`)
    return response.data.albums.items.map(album => this.transformAlbum({
      ...album,
      service: this.serviceType
    }))
  }

  async getRecommendations(params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const response = await this.request(`/recommendations?${queryString}`)
    return response.data.tracks.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  // Follow/Unfollow methods
  async followArtist(id) {
    await this.request(`/me/following?type=artist&ids=${id}`, { method: 'PUT' })
  }

  async unfollowArtist(id) {
    await this.request(`/me/following?type=artist&ids=${id}`, { method: 'DELETE' })
  }

  async followAlbum(id) {
    await this.request(`/me/albums?ids=${id}`, { method: 'PUT' })
  }

  async unfollowAlbum(id) {
    await this.request(`/me/albums?ids=${id}`, { method: 'DELETE' })
  }

  async followTrack(id) {
    await this.request(`/me/tracks?ids=${id}`, { method: 'PUT' })
  }

  async unfollowTrack(id) {
    await this.request(`/me/tracks?ids=${id}`, { method: 'DELETE' })
  }

  async followPlaylist(id) {
    await this.request(`/playlists/${id}/followers`, { method: 'PUT' })
  }

  async unfollowPlaylist(id) {
    await this.request(`/playlists/${id}/followers`, { method: 'DELETE' })
  }

  // Check following status
  async checkFollowingArtist(id) {
    const response = await this.request(`/me/following/contains?type=artist&ids=${id}`)
    return response.data[0]
  }

  async checkFollowingAlbum(id) {
    const response = await this.request(`/me/albums/contains?ids=${id}`)
    return response.data[0]
  }

  async checkFollowingTrack(id) {
    const response = await this.request(`/me/tracks/contains?ids=${id}`)
    return response.data[0]
  }

  async checkFollowingPlaylist(id) {
    const username = this.getUsername()
    const response = await this.request(`/playlists/${id}/followers/contains?ids=${username}`)
    return response.data[0]
  }

  // Data transformation methods
  transformTrack(data) {
    return new Track({
      id: data.id,
      name: data.name,
      artists: data.artists?.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      })) || [],
      album: data.album ? this.transformAlbum({
        ...data.album,
        service: this.serviceType
      }) : null,
      duration: data.duration_ms || data.duration,
      previewUrl: data.preview_url,
      externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
      service: this.serviceType,
      popularity: data.popularity || 0,
      trackNumber: data.track_number || 0,
      discNumber: data.disc_number || 1,
      followed: data.followed || false
    })
  }

  transformArtist(data) {
    return new Artist({
      id: data.id,
      name: data.name,
      images: data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
      genres: data.genres || [],
      externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
      service: this.serviceType,
      popularity: data.popularity || 0,
      followers: data.followers?.total || 0,
      followed: data.followed || false
    })
  }

  transformAlbum(data) {
    return new Album({
      id: data.id,
      name: data.name,
      artists: data.artists?.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      })) || [],
      images: data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
      releaseDate: data.release_date,
      totalTracks: data.total_tracks || 0,
      externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
      service: this.serviceType,
      albumType: data.album_type || 'album',
      followed: data.followed || false
    })
  }

  transformPlaylist(data) {
    return new Playlist({
      id: data.id,
      name: data.name,
      description: data.description || '',
      images: data.images?.map(img => new Image(img.url, img.width, img.height)) || [],
      owner: data.owner,
      public: data.public || false,
      totalTracks: data.tracks?.total || 0,
      externalUrls: new ExternalUrls(this.serviceType, data.external_urls || {}),
      service: this.serviceType,
      followed: data.followed || false,
      tracks: data.tracks?.items?.map(item => this.transformTrack({
        ...item.track,
        service: this.serviceType
      })) || []
    })
  }

  transformUser(data) {
    return new User({
      id: data.id,
      displayName: data.displayName,
      email: data.email,
      country: data.country,
      images: data.images,
      followers: data.followers,
      service: this.serviceType
    })
  }
}
