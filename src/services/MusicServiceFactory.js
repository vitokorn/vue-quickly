import { MusicServiceInterface } from './MusicServiceInterface.js'
import { SpotifyService } from './services/SpotifyService.js'
import { DeezerService } from './services/DeezerService.js'
import { TidalService } from './services/TidalService.js'
import { SERVICE_TYPES } from './types.js'

export class MusicServiceFactory {
  static services = new Map()

  /**
   * Create a music service instance
   * @param {string} serviceType - The type of service to create
   * @returns {MusicServiceInterface} - The service instance
   */
  static createService(serviceType) {
    if (!Object.values(SERVICE_TYPES).includes(serviceType)) {
      throw new Error(`Unsupported service type: ${serviceType}`)
    }

    // Return cached instance if available
    if (this.services.has(serviceType)) {
      return this.services.get(serviceType)
    }

    let service
    switch (serviceType) {
      case SERVICE_TYPES.SPOTIFY:
        service = new SpotifyService()
        break
      case SERVICE_TYPES.DEEZER:
        service = new DeezerService()
        break
      case SERVICE_TYPES.TIDAL:
        service = new TidalService()
        break
      default:
        throw new Error(`Service implementation not found for: ${serviceType}`)
    }

    // Cache the service instance
    this.services.set(serviceType, service)
    return service
  }

  /**
   * Get all available service types
   * @returns {string[]} - Array of available service types
   */
  static getAvailableServices() {
    return Object.values(SERVICE_TYPES)
  }

  /**
   * Check if a service type is supported
   * @param {string} serviceType - The service type to check
   * @returns {boolean} - Whether the service is supported
   */
  static isServiceSupported(serviceType) {
    return Object.values(SERVICE_TYPES).includes(serviceType)
  }

  /**
   * Get service display name
   * @param {string} serviceType - The service type
   * @returns {string} - The display name
   */
  static getServiceDisplayName(serviceType) {
    const displayNames = {
      [SERVICE_TYPES.SPOTIFY]: 'Spotify',
      [SERVICE_TYPES.DEEZER]: 'Deezer',
      [SERVICE_TYPES.TIDAL]: 'Tidal',
      [SERVICE_TYPES.SPOTYSTEIN]: 'Spotystein',
    }
    return displayNames[serviceType] || serviceType
  }

  /**
   * Get service icon/logo
   * @param {string} serviceType - The service type
   * @returns {string} - The icon path or URL
   */
  static getServiceIcon(serviceType) {
    const icons = {
      [SERVICE_TYPES.SPOTIFY]: '/img/spotify-icon.svg',
      [SERVICE_TYPES.DEEZER]: '/img/deezer-icon.svg',
      [SERVICE_TYPES.TIDAL]: '/img/tidal-icon.svg',
      [SERVICE_TYPES.SPOTYSTEIN]: '/img/spotify-icon.svg', // Use Spotify icon for now
    }
    return icons[serviceType] || '/img/default-service-icon.svg'
  }

  /**
   * Clear all cached service instances
   */
  static clearCache() {
    this.services.clear()
  }

  /**
   * Remove a specific service from cache
   * @param {string} serviceType - The service type to remove
   */
  static removeService(serviceType) {
    this.services.delete(serviceType)
  }
}
