
export const artistUtils = {

  // Alternative implementation without dependency on Lists
  formatArtistNamesSimple: (artists) => {
    if (!artists || !Array.isArray(artists) || artists.length === 0) {
      return 'Unknown Artist'
    }
    
    const names = artists.map(({ name }) => name).filter(name => name) // Filter out undefined names
    if (names.length === 0) {
      return 'Unknown Artist'
    }
    
    const finalName = names.pop()
    return names.length ?
      names.join(', ') + ' & ' + finalName :
      finalName
  },

  // Get primary artist name
  getPrimaryArtist: (artists) => {
    return artists?.[0]?.name || 'Unknown Artist'
  },

  // Check if artist has preview URL
  hasPreview: (artist) => {
    return !!(artist.preview_url || artist.previewUrl)
  },

  // Check if artist has image
  hasImage: (artist) => {
    return !!(artist.images && artist.images[0])
  }
}

