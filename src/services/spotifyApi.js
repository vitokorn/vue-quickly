import axios from 'axios'

export class SpotifyApiService {
  constructor() {
    this.baseURL = 'https://api.spotify.com/v1'
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
      // Token should be updated in cookies by the backend
      return response.data
    }
    throw new Error('Failed to refresh token')
  }

  // User Data
  async getTopTracks(timeRange = 'short_term') {
    return this.request(`/me/top/tracks?time_range=${timeRange}`)
  }

  async getTopArtists(timeRange = 'short_term') {
    return this.request(`/me/top/artists?time_range=${timeRange}`)
  }

  async getSavedAlbums(offset = 0, limit = 20) {
    return this.request(`/me/albums?offset=${offset}&limit=${limit}`)
  }

  async getSavedTracks(offset = 0, limit = 50) {
    return this.request(`/me/tracks?offset=${offset}&limit=${limit}`)
  }

  async getFollowedArtists(limit = 50) {
    return this.request(`/me/following?type=artist&limit=${limit}`)
  }

  async getPlaylists(offset = 0, limit = 50) {
    return this.request(`/me/playlists?fields=items(name,id)&limit=${limit}&offset=${offset}`)
  }

  // Playlists
  async getPlaylist(id) {
    return this.request(`/playlists/${id}`)
  }

  async getSpotifyPlaylists(offset = 0, limit = 50) {
    return this.request(`/users/spotify/playlists?fields=items(name,id)&limit=${limit}&offset=${offset}`)
  }

  // Artists
  async getArtist(id) {
    return this.request(`/artists/${id}`)
  }

  async getArtistTopTracks(id, market = 'UA') {
    const country = this.getCountry()
    return this.request(`/artists/${id}/top-tracks?market=${market}${country}`)
  }

  async getArtistAlbums(id, includeGroups = 'album', limit = 10) {
    return this.request(`/artists/${id}/albums?include_groups=${includeGroups}&limit=${limit}`)
  }

  async getArtistSingles(id, limit = 10) {
    return this.request(`/artists/${id}/albums?include_groups=single,compilation&limit=${limit}`)
  }

  async getArtistAppearances(id, limit = 10) {
    return this.request(`/artists/${id}/albums?include_groups=appears_on&limit=${limit}`)
  }

  async getRelatedArtists(id) {
    return this.request(`/artists/${id}/related-artists`)
  }

  // Albums
  async getAlbum(id) {
    return this.request(`/albums/${id}`)
  }

  async getAlbumTracks(id) {
    return this.request(`/albums/${id}/tracks`)
  }

  async getAlbums(ids) {
    return this.request(`/albums?ids=${ids}`)
  }

  // Tracks
  async getTrack(id) {
    return this.request(`/tracks/${id}`)
  }

  // Search
  async search(query, types = 'album,artist,playlist,track', limit = 5) {
    return this.request(`/search/?q=${encodeURIComponent(query)}&type=${types}&limit=${limit}`)
  }

  // New Releases
  async getNewReleases(limit = 20, offset = 0) {
    return this.request(`/browse/new-releases?limit=${limit}&offset=${offset}`)
  }

  // Recommendations
  async getRecommendations(params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    return this.request(`/recommendations?${queryString}`)
  }

  // Follow/Unfollow
  async followPlaylist(id) {
    return this.request(`/playlists/${id}/followers`, { method: 'PUT' })
  }

  async unfollowPlaylist(id) {
    return this.request(`/playlists/${id}/followers`, { method: 'DELETE' })
  }

  async followArtist(id) {
    return this.request(`/me/following?type=artist&ids=${id}`, { method: 'PUT' })
  }

  async unfollowArtist(id) {
    return this.request(`/me/following?type=artist&ids=${id}`, { method: 'DELETE' })
  }

  async followAlbum(id) {
    return this.request(`/me/albums?ids=${id}`, { method: 'PUT' })
  }

  async unfollowAlbum(id) {
    return this.request(`/me/albums?ids=${id}`, { method: 'DELETE' })
  }

  async followTrack(id) {
    return this.request(`/me/tracks?ids=${id}`, { method: 'PUT' })
  }

  async unfollowTrack(id) {
    return this.request(`/me/tracks?ids=${id}`, { method: 'DELETE' })
  }

  // Check if following
  async checkFollowingPlaylist(id) {
    const username = this.getUsername()
    return this.request(`/playlists/${id}/followers/contains?ids=${username}`)
  }

  async checkFollowingArtist(id) {
    return this.request(`/me/following/contains?type=artist&ids=${id}`)
  }

  async checkFollowingAlbum(id) {
    return this.request(`/me/albums/contains?ids=${id}`)
  }

  async checkFollowingTrack(id) {
    return this.request(`/me/tracks/contains?ids=${id}`)
  }

  // Create playlist
  async createPlaylist(name) {
    const username = this.getUsername()
    return this.request(`/users/${username}/playlists`, {
      method: 'POST',
      data: { name }
    })
  }

  // Add tracks to playlist
  async addTracksToPlaylist(playlistId, trackIds) {
    const uris = trackIds.map(id => `spotify:track:${id}`).join(',')
    return this.request(`/playlists/${playlistId}/tracks?uris=${uris}`, {
      method: 'POST'
    })
  }
}

export const spotifyApi = new SpotifyApiService()
