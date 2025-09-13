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

export class AppleService extends MusicServiceInterface {
  constructor() {
    super()
    this.baseURL = 'https://api.music.apple.com/v1'
    this.serviceType = SERVICE_TYPES.APPLE
  }

  getServiceName() {
    return 'Apple Music'
  }

  getServiceType() {
    return this.serviceType
  }

  getToken() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)apple_access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }

  getUsername() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)apple_username\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }

  getCountry() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)apple_country\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }

  async request(endpoint, options = {}) {
    const token = this.getToken()
    const config = {
      url: `${this.baseURL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Music-User-Token': this.getMusicUserToken(),
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
        config.headers['Music-User-Token'] = this.getMusicUserToken()
        return axios(config)
      }
      throw error
    }
  }

  getMusicUserToken() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)apple_music_user_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
  }

  async refreshToken() {
    const username = this.getUsername()
    const response = await axios.get(`/apple/refresh_token/${username}`)
    if (response.status === 200) {
      return response.data
    }
    throw new Error('Failed to refresh token')
  }

  // Authentication methods
  async authenticate() {
    // Redirect to Apple Music OAuth
    window.location.href = '/apple/login'
  }

  logout() {
    window.location.href = '/apple/logout'
  }

  isAuthenticated() {
    return !!this.getToken() && !!this.getMusicUserToken()
  }

  // User data methods
  async getCurrentUser() {
    const response = await this.request('/me')
    return this.transformUser({
      id: response.data.id,
      displayName: response.data.attributes?.name || 'Apple Music User',
      email: '', // Apple doesn't provide email
      country: response.data.attributes?.storefront || 'us',
      images: [], // Apple doesn't provide user images
      followers: 0,
      service: this.serviceType
    })
  }

  async getTopTracks(timeRange = TIME_RANGES.SHORT) {
    // Apple Music doesn't have top tracks in the same way, but we can use heavy rotation
    const response = await this.request('/me/recent/played/tracks')
    return response.data.data.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  async getTopArtists(timeRange = TIME_RANGES.SHORT) {
    // Apple Music doesn't have top artists, but we can use recently played
    const response = await this.request('/me/recent/played')
    const artists = response.data.data
      .filter(item => item.type === 'artists')
      .map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      }))
    return artists
  }

  async getSavedAlbums(offset = 0, limit = 20) {
    const response = await this.request(`/me/library/albums?offset=${offset}&limit=${limit}`)
    return response.data.data.map(item => ({
      ...item,
      album: this.transformAlbum({
        ...item,
        service: this.serviceType
      })
    }))
  }

  async getSavedTracks(offset = 0, limit = 50) {
    const response = await this.request(`/me/library/songs?offset=${offset}&limit=${limit}`)
    const items = response.data.data.map(item => ({
      ...item,
      track: this.transformTrack({
        ...item,
        service: this.serviceType
      })
    }))

    return {
      items,
      total: response.data.meta?.total || items.length
    }
  }

  async getFollowedArtists(limit = 50) {
    // Apple Music doesn't have followed artists in the same way
    // We can return empty array or implement alternative
    console.warn('getFollowedArtists not fully implemented for Apple Music service')
    return []
  }

  // Playlist methods
  async getPlaylists(offset = 0, limit = 50) {
    const response = await this.request(`/me/library/playlists?offset=${offset}&limit=${limit}`)
    return response.data.data.map(playlist => this.transformPlaylist({
      ...playlist,
      service: this.serviceType
    }))
  }

  async getPlaylist(id) {
    const response = await this.request(`/me/library/playlists/${id}`)
    return this.transformPlaylist({
      ...response.data.data[0],
      service: this.serviceType
    })
  }

  async getPlaylistTracks(id, offset = 0, limit = 100) {
    const response = await this.request(`/me/library/playlists/${id}/tracks?offset=${offset}&limit=${limit}`)
    return response.data.data.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  async createPlaylist(name, description = '') {
    const response = await this.request('/me/library/playlists', {
      method: 'POST',
      data: {
        attributes: {
          name,
          description
        }
      }
    })
    return this.transformPlaylist({
      ...response.data.data[0],
      service: this.serviceType
    })
  }

  async addTracksToPlaylist(playlistId, trackIds) {
    const tracks = trackIds.map(id => ({ id, type: 'songs' }))
    await this.request(`/me/library/playlists/${playlistId}/tracks`, {
      method: 'POST',
      data: { data: tracks }
    })
  }

  // Artist methods
  async getArtist(id) {
    const response = await this.request(`/catalog/${this.getStorefront()}/artists/${id}`)
    return this.transformArtist({
      ...response.data.data[0],
      service: this.serviceType
    })
  }

  async getArtistTopTracks(id, market = 'us') {
    const response = await this.request(`/catalog/${this.getStorefront()}/artists/${id}/view/top-songs`)
    return response.data.data.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  async getArtistAlbums(id, includeGroups = 'album', limit = 10) {
    const response = await this.request(`/catalog/${this.getStorefront()}/artists/${id}/albums?limit=${limit}`)
    return response.data.data.map(album => this.transformAlbum({
      ...album,
      service: this.serviceType
    }))
  }

  async getRelatedArtists(id) {
    try {
      const response = await this.request(`/catalog/${this.getStorefront()}/artists/${id}/similar-artists`)
      return response.data.data.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      }))
    } catch (error) {
      console.warn('Failed to fetch related artists:', error.message)
      return []
    }
  }

  async getArtistAppearances(id, limit = 10) {
    // Apple Music doesn't have "appears on" in the same way
    return []
  }

  async getArtistPlaylists(id, limit = 10) {
    console.warn('getArtistPlaylists not implemented for Apple Music service')
    return []
  }

  async getUserPlaylists(userId, limit = 20) {
    // For Apple Music, userId is not used the same way
    return this.getPlaylists(0, limit)
  }

  // Album methods
  async getAlbum(id) {
    const response = await this.request(`/catalog/${this.getStorefront()}/albums/${id}`)
    return this.transformAlbum({
      ...response.data.data[0],
      service: this.serviceType
    })
  }

  async getAlbumTracks(id) {
    const response = await this.request(`/catalog/${this.getStorefront()}/albums/${id}/tracks`)
    return response.data.data.map(track => this.transformTrack({
      ...track,
      service: this.serviceType
    }))
  }

  // Track methods
  async getTrack(id) {
    const response = await this.request(`/catalog/${this.getStorefront()}/songs/${id}`)
    return this.transformTrack({
      ...response.data.data[0],
      service: this.serviceType
    })
  }

  // Search and discovery
  async search(query, types = ['track', 'artist', 'album', 'playlist'], limit = 5) {
    const appleTypes = types.map(type => {
      switch (type) {
        case 'track': return 'songs'
        case 'artist': return 'artists'
        case 'album': return 'albums'
        case 'playlist': return 'playlists'
        default: return type
      }
    }).join(',')

    const response = await this.request(`/catalog/${this.getStorefront()}/search?term=${encodeURIComponent(query)}&types=${appleTypes}&limit=${limit}`)

    return new SearchResults({
      tracks: response.data.results?.songs?.data?.map(track => this.transformTrack({
        ...track,
        service: this.serviceType
      })) || [],
      artists: response.data.results?.artists?.data?.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      })) || [],
      albums: response.data.results?.albums?.data?.map(album => this.transformAlbum({
        ...album,
        service: this.serviceType
      })) || [],
      playlists: response.data.results?.playlists?.data?.map(playlist => this.transformPlaylist({
        ...playlist,
        service: this.serviceType
      })) || [],
      total: 0
    })
  }

  async getNewReleases(limit = 20, offset = 0) {
    const response = await this.request(`/catalog/${this.getStorefront()}/albums?filter[release-date]=${this.getCurrentYear()}-01-01T00:00:00Z&limit=${limit}&offset=${offset}`)
    return response.data.data.map(album => this.transformAlbum({
      ...album,
      service: this.serviceType
    }))
  }

  async getRecommendations(params) {
    // Apple Music recommendations are limited, we'll return empty array for now
    console.warn('getRecommendations not fully implemented for Apple Music service')
    return []
  }

  // Categories methods - Apple Music doesn't have browse categories like Spotify
  async getCategories(offset = 0, limit = 50) {
    console.warn('getCategories not implemented for Apple Music service')
    return { items: [], total: 0 }
  }

  async getCategoryPlaylists(categoryId, offset = 0, limit = 50) {
    console.warn('getCategoryPlaylists not implemented for Apple Music service')
    return { items: [], total: 0 }
  }

  // Follow/Unfollow methods - Apple Music has limited social features
  async followArtist(id) {
    console.warn('followArtist not implemented for Apple Music service')
  }

  async unfollowArtist(id) {
    console.warn('unfollowArtist not implemented for Apple Music service')
  }

  async followAlbum(id) {
    await this.request('/me/library', {
      method: 'POST',
      data: { data: [{ id, type: 'albums' }] }
    })
  }

  async unfollowAlbum(id) {
    await this.request(`/me/library/albums/${id}`, { method: 'DELETE' })
  }

  async followTrack(id) {
    await this.request('/me/library', {
      method: 'POST',
      data: { data: [{ id, type: 'songs' }] }
    })
  }

  async unfollowTrack(id) {
    await this.request(`/me/library/songs/${id}`, { method: 'DELETE' })
  }

  async followPlaylist(id) {
    console.warn('followPlaylist not implemented for Apple Music service')
  }

  async unfollowPlaylist(id) {
    console.warn('unfollowPlaylist not implemented for Apple Music service')
  }

  // Check following status
  async checkFollowingArtist(id) {
    console.warn('checkFollowingArtist not implemented for Apple Music service')
    return false
  }

  async checkFollowingAlbum(id) {
    try {
      await this.request(`/me/library/albums/${id}`)
      return true
    } catch (error) {
      return false
    }
  }

  async checkFollowingTrack(id) {
    try {
      await this.request(`/me/library/songs/${id}`)
      return true
    } catch (error) {
      return false
    }
  }

  async checkFollowingPlaylist(id) {
    console.warn('checkFollowingPlaylist not implemented for Apple Music service')
    return false
  }

  // Utility methods
  getStorefront() {
    return this.getCountry() || 'us'
  }

  getCurrentYear() {
    return new Date().getFullYear()
  }

  // Data transformation methods
  transformTrack(data) {
    return new Track({
      id: data.id,
      name: data.attributes?.name || '',
      title_short: data.attributes?.name || '',
      artists: data.relationships?.artists?.data?.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      })) || [],
      album: data.relationships?.albums?.data?.[0] ? this.transformAlbum({
        ...data.relationships.albums.data[0],
        service: this.serviceType
      }) : null,
      duration: data.attributes?.durationInMillis || 0,
      previewUrl: data.attributes?.previews?.[0]?.url || null,
      externalUrls: new ExternalUrls(this.serviceType, {
        apple: data.attributes?.url || `https://music.apple.com/${this.getStorefront()}/song/${data.id}`
      }),
      service: this.serviceType,
      popularity: data.attributes?.playParams?.catalogId ? 50 : 0, // Apple doesn't provide popularity
      trackNumber: data.attributes?.trackNumber || 0,
      discNumber: data.attributes?.discNumber || 1,
      followed: data.attributes?.libraryId ? true : false
    })
  }

  transformArtist(data) {
    return new Artist({
      id: data.id,
      name: data.attributes?.name || '',
      images: data.attributes?.artwork ? [new Image(
        data.attributes.artwork.url.replace('{w}x{h}', '300x300'),
        300,
        300
      )] : [],
      genres: data.attributes?.genreNames || [],
      externalUrls: new ExternalUrls(this.serviceType, {
        apple: data.attributes?.url || `https://music.apple.com/${this.getStorefront()}/artist/${data.id}`
      }),
      service: this.serviceType,
      popularity: 0, // Apple doesn't provide popularity
      followers: 0, // Apple doesn't provide follower counts
      followed: false
    })
  }

  transformAlbum(data) {
    return new Album({
      id: data.id,
      name: data.attributes?.name || '',
      artists: data.relationships?.artists?.data?.map(artist => this.transformArtist({
        ...artist,
        service: this.serviceType
      })) || [],
      images: data.attributes?.artwork ? [new Image(
        data.attributes.artwork.url.replace('{w}x{h}', '300x300'),
        300,
        300
      )] : [],
      releaseDate: data.attributes?.releaseDate || '',
      totalTracks: data.attributes?.trackCount || 0,
      externalUrls: new ExternalUrls(this.serviceType, {
        apple: data.attributes?.url || `https://music.apple.com/${this.getStorefront()}/album/${data.id}`
      }),
      service: this.serviceType,
      albumType: data.attributes?.albumType || 'album',
      followed: data.attributes?.libraryId ? true : false
    })
  }

  transformPlaylist(data) {
    return new Playlist({
      id: data.id,
      name: data.attributes?.name || '',
      description: data.attributes?.description?.standard || '',
      images: data.attributes?.artwork ? [new Image(
        data.attributes.artwork.url.replace('{w}x{h}', '300x300'),
        300,
        300
      )] : [],
      owner: data.attributes?.curatorName || 'Apple Music',
      public: !data.attributes?.isPrivate || false,
      totalTracks: data.attributes?.trackCount || 0,
      externalUrls: new ExternalUrls(this.serviceType, {
        apple: data.attributes?.url || `https://music.apple.com/${this.getStorefront()}/playlist/${data.id}`
      }),
      service: this.serviceType,
      followed: false,
      tracks: data.relationships?.tracks?.data?.map(track => this.transformTrack({
        ...track,
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
