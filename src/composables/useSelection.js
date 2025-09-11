import { ref } from 'vue'

export function useSelection() {
  const selectedItem = ref(null)
  const selectedTopMenu = ref(null)
  const selectedPersonalPlaylist = ref(null)
  const selectedSpotifyPlaylist = ref(null)
  const selectedGenrePlaylist = ref(null)

  const setSelectedItem = (value) => {
    selectedItem.value = value
  }

  const setSelectedPersonalPlaylist = (value) => {
    selectedPersonalPlaylist.value = value
  }

  const setSelectedSpotifyPlaylist = (value) => {
    selectedSpotifyPlaylist.value = value
  }

  const setSelectedGenrePlaylist = (value) => {
    selectedGenrePlaylist.value = value
  }

  const setSelectedTopMenu = (value) => {
    selectedTopMenu.value = selectedTopMenu.value === value ? null : value
  }

  const clearSelections = () => {
    selectedItem.value = null
    selectedPersonalPlaylist.value = null
    selectedSpotifyPlaylist.value = null
    selectedGenrePlaylist.value = null
  }

  return {
    selectedItem,
    selectedTopMenu,
    selectedPersonalPlaylist,
    selectedSpotifyPlaylist,
    selectedGenrePlaylist,
    setSelectedItem,
    setSelectedPersonalPlaylist,
    setSelectedSpotifyPlaylist,
    setSelectedGenrePlaylist,
    setSelectedTopMenu,
    clearSelections
  }
}

