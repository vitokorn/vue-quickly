/**
 * Utility functions for handling section names and navigation
 */

/**
 * Get section name from numeric identifier
 * @param {number} num - The numeric section identifier
 * @returns {string} The section name
 */
export function getSectionName(num) {
    switch (num) {
        case 1:
            return 'yourPlaylists'
        case 2:
            return 'topArtists'
        case 3:
            return 'topTracks'
        case 4:
            return 'savedAlbums'
        case 5:
            return 'savedTracks'
        case 6:
            return 'followedArtists'
        case 7:
            return 'newReleases'
        case 8:
            return 'spotifyPlaylists'
        case 9:
            return 'categories'
        case 10:
            return 'search'
        case 11:
            return 'genres'
        case 13:
            return 'queue'
        case 22:
            return 'topArtists6'
        case 23:
            return 'topArtistsAll'
        case 32:
            return 'topTracks6'
        case 33:
            return 'topTracksAll'
        default:
            return 'search'
    }
}
