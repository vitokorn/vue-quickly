import {MusicServiceFactory} from './MusicServiceFactory.js'
import {SERVICE_TYPES} from './types.js'

export class MusicServiceManager {
    constructor() {
        this.currentService = null
        this.currentServiceType = this.getStoredServiceType() || SERVICE_TYPES.SPOTIFY
        this.initializeService()
    }

    /**
     * Initialize the current service
     */
    initializeService() {
        try {
            this.currentService = MusicServiceFactory.createService(this.currentServiceType)
        } catch (error) {
            console.error('Failed to initialize music service:', error)
            // Fallback to Spotify if initialization fails
            this.currentServiceType = SERVICE_TYPES.SPOTIFY
            this.currentService = MusicServiceFactory.createService(this.currentServiceType)
        }
    }

    /**
     * Get the current service instance
     * @returns {MusicServiceInterface} - The current service
     */
    getCurrentService() {
        return this.currentService
    }

    /**
     * Get the current service type
     * @returns {string} - The current service type
     */
    getCurrentServiceType() {
        return this.currentServiceType
    }

    /**
     * Switch to a different music service
     * @param {string} serviceType - The service type to switch to
     * @returns {Promise<boolean>} - Whether the switch was successful
     */
    async switchService(serviceType) {
        if (!MusicServiceFactory.isServiceSupported(serviceType)) {
            throw new Error(`Unsupported service type: ${serviceType}`)
        }

        if (serviceType === this.currentServiceType) {
            return true // Already using this service
        }

        try {
            // Clear current service cache
            MusicServiceFactory.removeService(this.currentServiceType)

            // Set new service
            this.currentServiceType = serviceType
            this.currentService = MusicServiceFactory.createService(serviceType)

            // Store the new service type
            this.storeServiceType(serviceType)

            return true
        } catch (error) {
            console.error('Failed to switch service:', error)
            return false
        }
    }

    /**
     * Get all available services
     * @returns {Array} - Array of available service objects
     */
    getAvailableServices() {
        return MusicServiceFactory.getAvailableServices().map(serviceType => ({
            type: serviceType,
            name: MusicServiceFactory.getServiceDisplayName(serviceType),
            icon: MusicServiceFactory.getServiceIcon(serviceType),
            isCurrent: serviceType === this.currentServiceType
        }))
    }

    /**
     * Check if the current service is authenticated
     * @returns {boolean} - Whether the current service is authenticated
     */
    isAuthenticated() {
        return this.currentService ? this.currentService.isAuthenticated() : false
    }

    /**
     * Authenticate with the current service
     * @returns {Promise<void>}
     */
    async authenticate() {
        if (!this.currentService) {
            throw new Error('No service initialized')
        }
        return this.currentService.authenticate()
    }

    /**
     * Logout from the current service
     */
    logout() {
        if (this.currentService) {
            this.currentService.logout()
        }
    }

    /**
     * Get service-specific authentication URL
     * @param {string} serviceType - The service type
     * @returns {string} - The authentication URL
     */
    getAuthenticationUrl(serviceType) {
        const service = MusicServiceFactory.createService(serviceType)
        // This would need to be implemented in each service
        return service.getAuthenticationUrl ? service.getAuthenticationUrl() : null
    }

    /**
     * Store the current service type in localStorage
     * @param {string} serviceType - The service type to store
     */
    storeServiceType(serviceType) {
        try {
            localStorage.setItem('musicServiceType', serviceType)
        } catch (error) {
            console.warn('Failed to store service type:', error)
        }
    }

    /**
     * Get the stored service type from localStorage
     * @returns {string|null} - The stored service type
     */
    getStoredServiceType() {
        try {
            return localStorage.getItem('musicServiceType')
        } catch (error) {
            console.warn('Failed to get stored service type:', error)
            return null
        }
    }

    /**
     * Clear stored service type
     */
    clearStoredServiceType() {
        try {
            localStorage.removeItem('musicServiceType')
        } catch (error) {
            console.warn('Failed to clear stored service type:', error)
        }
    }

    /**
     * Reset to default service (Spotify)
     */
    resetToDefault() {
        this.switchService(SERVICE_TYPES.SPOTIFY)
    }

    /**
     * Get service capabilities
     * @param {string} serviceType - The service type
     * @returns {Object} - Service capabilities
     */
    getServiceCapabilities(serviceType) {
        const capabilities = {
            [SERVICE_TYPES.SPOTIFY]: {
                search: true,
                playlists: true,
                recommendations: true,
                userLibrary: true,
                follow: true,
                newReleases: true
            },
            [SERVICE_TYPES.DEEZER]: {
                search: true,
                playlists: true,
                recommendations: false, // May vary
                userLibrary: true,
                follow: true,
                newReleases: true
            },
            [SERVICE_TYPES.TIDAL]: {
                search: true,
                playlists: true,
                recommendations: false, // May vary
                userLibrary: true,
                follow: true,
                newReleases: true
            },
            [SERVICE_TYPES.APPLE]: {
                search: true,
                playlists: true,
                recommendations: true,
                userLibrary: true,
                follow: true,
                newReleases: true
            },
        }

        return capabilities[serviceType] || {}
    }
}

// Create a singleton instance
export const musicServiceManager = new MusicServiceManager()
