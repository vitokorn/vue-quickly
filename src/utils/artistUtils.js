import { Lists } from '../common/lists'

export const artistUtils = {
  // Format artist names for display
  formatArtistNames: (artists) => {
    return Lists.Ls(artists)
  },

  // Alternative implementation without dependency on Lists
  formatArtistNamesSimple: (artists) => {
    const names = artists.map(({ name }) => name)
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
    return !!artist.preview_url
  },

  // Check if artist has image
  hasImage: (artist) => {
    return !!(artist.images && artist.images[0])
  }
}

