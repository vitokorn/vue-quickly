<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'
import ReleaseSelector from "./ReleaseSelector.vue";

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Composables
const { selectedItem, setSelectedItem } = useSelection()

// Local state
const loading = ref(false)
const selectedRelease = ref(null)
const savedAlbums = ref([])

// Methods
const loadSavedAlbums = async () => {
  if (spotifyStore.getSavedAlbums && spotifyStore.getSavedAlbums.length > 0) {
    console.log('Using cached saved albums data')
    savedAlbums.value = spotifyStore.getSavedAlbums.map(item => item.album)
    return
  }

  loading.value = true
  try {
    // Load saved albums from Spotify API
    await spotifyStore.fetchSavedAlbums(0)
    // Spotify returns saved albums in format: { added_at: "...", album: {...} }
    savedAlbums.value = (spotifyStore.getSavedAlbums || []).map(item => item.album)
  } catch (error) {
    console.error('Failed to load saved albums:', error)
  } finally {
    loading.value = false
  }
}

const handleReleaseSelect = async (releaseId, event) => {
  selectedRelease.value = releaseId
  const release = savedAlbums.value.find(r => r.id === releaseId)
  console.log('Release selected:', release)

  if (release) {
    await deeperStore.getAlbumDetails(release, 'savedAlbums')
  }
}

const handleAlbumClick = async (album, event) => {
  setSelectedItem(album.id)
  const sectionName = 'savedAlbums'

  await deeperStore.getAlbumDetails(album, 'savedAlbums')

  // Show the deeper album component
  console.log('Showing deeper album for:', album.name)
}

const handleAlbumThreeDotsClick = async (album, event) => {
  event.stopPropagation() // Prevent triggering the main click event

  await deeperStore.getAlbumDetails(album, 'savedAlbums')

  // RecTrackM will automatically render the deeper album component
  // No need to manually show/hide components
  console.log('Album details loaded for:', album.name)
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const handleRefresh = async () => {
  // Clear existing data and fetch fresh
  spotifyStore.savedAlbums = []
  await loadSavedAlbums()
}

// Helper functions
const formatArtistNames = (artists) => {
  if (!artists || !Array.isArray(artists)) return 'Unknown Artist'
  return artists.map(artist => artist.name).join(', ')
}

const formatReleaseDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load initial data
onMounted(async () => {
  await loadSavedAlbums()
})
</script>

<template>
  <div class="mobile-top-tracks">

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading saved albums...</p>
    </div>

    <!-- Content -->
    <div v-else class="new-releases-content">
      <div class="releases-section">
        <ReleaseSelector
            :releases="savedAlbums"
            :selected-release="selectedRelease"
            title="Saved Albums"
            placeholder="Search releases..."
            :items-per-page="20"
            @release-select="handleReleaseSelect"
            @refresh="handleRefresh"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
