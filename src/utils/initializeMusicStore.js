import { musicServiceManager } from '../services/MusicServiceManager.js'

/**
 * Initialize the music store and service manager
 * This should be called when the app starts
 */
export async function initializeMusicStore() {
  try {
    // The service manager initializes automatically in its constructor
    // We just need to verify it's working
    
    console.log('Music store initialized successfully')
    console.log('Current service:', musicServiceManager.getCurrentServiceType())
    console.log('Available services:', musicServiceManager.getAvailableServices())
    
    return true
  } catch (error) {
    console.error('Failed to initialize music store:', error)
    return false
  }
}

/**
 * Check if the current service is authenticated
 */
export function isCurrentServiceAuthenticated() {
  return musicServiceManager.isAuthenticated()
}

/**
 * Get the current service type
 */
export function getCurrentServiceType() {
  return musicServiceManager.getCurrentServiceType()
}
