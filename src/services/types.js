// Common data types for all music services
export const SERVICE_TYPES = {
  SPOTIFY: 'spotify',
  DEEZER: 'deezer',
  TIDAL: 'tidal',
  NAPSTER: 'napster'
}

export const TIME_RANGES = {
  SHORT: 'short_term',
  MEDIUM: 'medium_term',
  LONG: 'long_term'
}

export const SEARCH_TYPES = {
  TRACK: 'track',
  ARTIST: 'artist',
  ALBUM: 'album',
  PLAYLIST: 'playlist'
}

// Common interfaces
export class Image {
  constructor(url, width = null, height = null) {
    this.url = url
    this.width = width
    this.height = height
  }
}

export class ExternalUrls {
  constructor(service, urls = {}) {
    this.service = service
    this.urls = urls
  }
}

export class Artist {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.images = data.images || []
    this.genres = data.genres || []
    this.externalUrls = data.externalUrls || new ExternalUrls(data.service)
    this.service = data.service
    this.popularity = data.popularity || 0
    this.followers = data.followers || 0
    this.followed = data.followed || false
  }
}

export class Album {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.artists = data.artists || []
    this.images = data.images || []
    this.releaseDate = data.releaseDate
    this.totalTracks = data.totalTracks || 0
    this.externalUrls = data.externalUrls || new ExternalUrls(data.service)
    this.service = data.service
    this.albumType = data.albumType || 'album'
    this.followed = data.followed || false
  }
}

export class Track {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.artists = data.artists || []
    this.album = data.album
    this.duration = data.duration || 0
    this.previewUrl = data.previewUrl
    this.externalUrls = data.externalUrls || new ExternalUrls(data.service)
    this.service = data.service
    this.popularity = data.popularity || 0
    this.trackNumber = data.trackNumber || 0
    this.discNumber = data.discNumber || 1
    this.followed = data.followed || false
  }
}

export class Playlist {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.description = data.description || ''
    this.images = data.images || []
    this.owner = data.owner
    this.public = data.public || false
    this.totalTracks = data.totalTracks || 0
    this.externalUrls = data.externalUrls || new ExternalUrls(data.service)
    this.service = data.service
    this.followed = data.followed || false
    this.tracks = data.tracks || []
  }
}

export class SearchResults {
  constructor(data) {
    this.tracks = data.tracks || []
    this.artists = data.artists || []
    this.albums = data.albums || []
    this.playlists = data.playlists || []
    this.total = data.total || 0
  }
}

export class RecommendationParams {
  constructor(data) {
    this.seedArtists = data.seedArtists || []
    this.seedTracks = data.seedTracks || []
    this.seedGenres = data.seedGenres || []
    this.limit = data.limit || 20
    this.targetEnergy = data.targetEnergy
    this.targetValence = data.targetValence
    this.targetDanceability = data.targetDanceability
    this.targetPopularity = data.targetPopularity
  }
}

export class User {
  constructor(data) {
    this.id = data.id
    this.displayName = data.displayName
    this.email = data.email
    this.country = data.country
    this.images = data.images || []
    this.followers = data.followers || 0
    this.service = data.service
  }
}
