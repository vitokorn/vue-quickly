// Abstract interface for all music services
import {
  Artist,
  Album,
  Track,
  Playlist,
  SearchResults,
  RecommendationParams,
  User,
  TIME_RANGES
} from './types.js'

export class MusicServiceInterface {
  constructor() {
    if (this.constructor === MusicServiceInterface) {
      throw new Error('MusicServiceInterface is abstract and cannot be instantiated')
    }
  }

  // Authentication methods
  async authenticate() {
    throw new Error('authenticate() must be implemented by subclass')
  }

  async refreshToken() {
    throw new Error('refreshToken() must be implemented by subclass')
  }

  logout() {
    throw new Error('logout() must be implemented by subclass')
  }

  isAuthenticated() {
    throw new Error('isAuthenticated() must be implemented by subclass')
  }

  // User data methods
  async getCurrentUser() {
    throw new Error('getCurrentUser() must be implemented by subclass')
  }

  async getTopTracks(timeRange = TIME_RANGES.SHORT) {
    throw new Error('getTopTracks() must be implemented by subclass')
  }

  async getTopArtists(timeRange = TIME_RANGES.SHORT) {
    throw new Error('getTopArtists() must be implemented by subclass')
  }

  async getSavedAlbums(offset = 0, limit = 20) {
    throw new Error('getSavedAlbums() must be implemented by subclass')
  }

  async getSavedTracks(offset = 0, limit = 50) {
    throw new Error('getSavedTracks() must be implemented by subclass')
  }

  async getFollowedArtists(limit = 50) {
    throw new Error('getFollowedArtists() must be implemented by subclass')
  }

  // Playlist methods
  async getPlaylists(offset = 0, limit = 50) {
    throw new Error('getPlaylists() must be implemented by subclass')
  }

  async getPlaylist(id) {
    throw new Error('getPlaylist() must be implemented by subclass')
  }

  async getPlaylistTracks(id, offset = 0, limit = 100) {
    throw new Error('getPlaylistTracks() must be implemented by subclass')
  }

  async createPlaylist(name, description = '') {
    throw new Error('createPlaylist() must be implemented by subclass')
  }

  async addTracksToPlaylist(playlistId, trackIds) {
    throw new Error('addTracksToPlaylist() must be implemented by subclass')
  }

  // Artist methods
  async getArtist(id) {
    throw new Error('getArtist() must be implemented by subclass')
  }

  async getArtistTopTracks(id, market = 'US', bypass=true) {
    throw new Error('getArtistTopTracks() must be implemented by subclass')
  }

  async getArtistAlbums(id, includeGroups = 'album', limit = 10) {
    throw new Error('getArtistAlbums() must be implemented by subclass')
  }

  async getRelatedArtists(id) {
    throw new Error('getRelatedArtists() must be implemented by subclass')
  }

  async getArtistAppearances(id, limit = 10) {
    throw new Error('getArtistAppearances() must be implemented by subclass')
  }

  async getArtistPlaylists(id, limit = 10) {
    throw new Error('getArtistPlaylists() must be implemented by subclass')
  }

  async getUserPlaylists(userId, limit = 20) {
    throw new Error('getUserPlaylists() must be implemented by subclass')
  }

  // Album methods
  async getAlbum(id) {
    throw new Error('getAlbum() must be implemented by subclass')
  }

  async getAlbumTracks(id) {
    throw new Error('getAlbumTracks() must be implemented by subclass')
  }

  // Track methods
  async getTrack(id) {
    throw new Error('getTrack() must be implemented by subclass')
  }

  // Search and discovery
  async search(query, types = ['track', 'artist', 'album', 'playlist'], limit = 5) {
    throw new Error('search() must be implemented by subclass')
  }

  async getNewReleases(limit = 20, offset = 0) {
    throw new Error('getNewReleases() must be implemented by subclass')
  }

  async getRecommendations(params) {
    throw new Error('getRecommendations() must be implemented by subclass')
  }

  // Follow/Unfollow methods
  async followArtist(id) {
    throw new Error('followArtist() must be implemented by subclass')
  }

  async unfollowArtist(id) {
    throw new Error('unfollowArtist() must be implemented by subclass')
  }

  async followAlbum(id) {
    throw new Error('followAlbum() must be implemented by subclass')
  }

  async unfollowAlbum(id) {
    throw new Error('unfollowAlbum() must be implemented by subclass')
  }

  async followTrack(id) {
    throw new Error('followTrack() must be implemented by subclass')
  }

  async unfollowTrack(id) {
    throw new Error('unfollowTrack() must be implemented by subclass')
  }

  async followPlaylist(id) {
    throw new Error('followPlaylist() must be implemented by subclass')
  }

  async unfollowPlaylist(id) {
    throw new Error('unfollowPlaylist() must be implemented by subclass')
  }

  // Check following status
  async checkFollowingArtist(id) {
    throw new Error('checkFollowingArtist() must be implemented by subclass')
  }

  async checkFollowingAlbum(id) {
    throw new Error('checkFollowingAlbum() must be implemented by subclass')
  }

  async checkFollowingTrack(id) {
    throw new Error('checkFollowingTrack() must be implemented by subclass')
  }

  async checkFollowingPlaylist(id) {
    throw new Error('checkFollowingPlaylist() must be implemented by subclass')
  }

  // Utility methods
  getServiceName() {
    throw new Error('getServiceName() must be implemented by subclass')
  }

  getServiceType() {
    throw new Error('getServiceType() must be implemented by subclass')
  }

  // Data transformation helpers (can be overridden by subclasses)
  transformTrack(data) {
    return new Track(data)
  }

  transformArtist(data) {
    return new Artist(data)
  }

  transformAlbum(data) {
    return new Album(data)
  }

  transformPlaylist(data) {
    return new Playlist(data)
  }

  transformUser(data) {
    return new User(data)
  }
}
