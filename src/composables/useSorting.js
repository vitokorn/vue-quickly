import { computed } from 'vue'

export function useSorting() {
  // Generic sorting function for tracks
  const sortTracks = (items, sortOption) => {
    const itemsCopy = [...items]
    switch (sortOption) {
      case 'track':
        return itemsCopy.sort((a, b) => a.name.localeCompare(b.name))
      case 'album':
        return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name))
      case 'artist':
        return itemsCopy.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name))
      case 'popularity':
        return itemsCopy.sort((a, b) => a.popularity > b.popularity)
      case 'release_date':
        return itemsCopy.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date))
      case 'duration':
        return itemsCopy.sort((a, b) => a.duration_ms > b.duration_ms)
      default:
        return itemsCopy
    }
  }

  // Generic sorting function for artists
  const sortArtists = (items, sortOption) => {
    const itemsCopy = [...items]
    switch (sortOption) {
      case 'artist':
        return itemsCopy.sort((a, b) => a.name.localeCompare(b.name))
      case 'popularity':
        return itemsCopy.sort((a, b) => a.popularity > b.popularity)
      case 'followers':
        return itemsCopy.sort((a, b) => a.followers > b.followers)
      default:
        return itemsCopy
    }
  }

  // Generic sorting function for albums
  const sortAlbums = (items, sortOption) => {
    const itemsCopy = [...items]
    switch (sortOption) {
      case 'name':
      case 'album':
        return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name))
      case 'artist':
        return itemsCopy.sort((a, b) => a.album.artists[0].name.localeCompare(b.album.artists[0].name))
      case 'popularity':
        return itemsCopy.sort((a, b) => a.album.popularity > b.album.popularity)
      case 'release_date':
        return itemsCopy.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date))
      case 'number_of_tracks':
        return itemsCopy.sort((a, b) => a.album.total_tracks > b.album.total_tracks)
      default:
        return itemsCopy
    }
  }

  // Create computed sorters for different data types
  const createTrackSorter = (items, sortOption) => {
    return computed(() => sortTracks(items.value, sortOption.value))
  }

  const createArtistSorter = (items, sortOption) => {
    return computed(() => sortArtists(items.value, sortOption.value))
  }

  const createAlbumSorter = (items, sortOption) => {
    return computed(() => sortAlbums(items.value, sortOption.value))
  }

  return {
    sortTracks,
    sortArtists,
    sortAlbums,
    createTrackSorter,
    createArtistSorter,
    createAlbumSorter
  }
}

