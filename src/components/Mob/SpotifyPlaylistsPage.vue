<template>
  <div class="playlists-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading playlists...</p>
    </div>

    <!-- Content -->
    <div v-else class="playlists-content">
      <div class="playlists-section">
        <PlaylistSelector
          :playlists="spotifyStore.getSpotifyPlaylists"
          :selected-playlist="selectedSpotifyPlaylist"
          title="Spotify Playlists"
          placeholder="Search Spotify playlists..."
          :items-per-page="10"
          @playlist-arrow-click="handleSpotifyPlaylistArrowClick"
          @search="handlePlaylistSearch"
          @load-more="handleLoadMoreSpotifyPlaylists"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import PlaylistSelector from './PlaylistSelector.vue'
import MobileDeeperPlaylist from './MobileDeeperPlaylist.vue'
import { useSelection } from '../../composables/useSelection.js'

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)
const error = ref(null)
const selectedPersonalPlaylist = ref(null)
const selectedSpotifyPlaylist = ref(null)

const {
  selectedPersonalPlaylist: selectedPersonal,
  setSelectedPersonalPlaylist
} = useSelection()

// Methods
const loadPlaylistsContent = async () => {
  const hasPersonalPlaylists = spotifyStore.getPlaylists && spotifyStore.getPlaylists.length > 0
  const hasSpotifyPlaylists = spotifyStore.getSpotifyPlaylists && spotifyStore.getSpotifyPlaylists.length > 0

  if (hasPersonalPlaylists && hasSpotifyPlaylists) {
    console.log('Using cached playlists data')
    return
  }

  loading.value = true
  error.value = null

  try {
    // Load both personal and Spotify playlists
    await Promise.all([
      hasPersonalPlaylists ? Promise.resolve() : spotifyStore.fetchPlaylists(0),
      hasSpotifyPlaylists ? Promise.resolve() : spotifyStore.fetchSpotifyPlaylists(0)
    ])
  } catch (err) {
    error.value = 'Failed to load playlists'
    console.error('Error loading playlists:', err)
  } finally {
    loading.value = false
  }
}

const handleLoadMorePersonalPlaylists = async () => {
  try {
    const currentCount = spotifyStore.getPlaylists.length
    await spotifyStore.fetchPlaylists(currentCount)
  } catch (error) {
    console.error('Failed to load more personal playlists:', error)
  }
}

const handleLoadMoreSpotifyPlaylists = async () => {
  try {
    const currentCount = spotifyStore.getSpotifyPlaylists.length
    await spotifyStore.fetchSpotifyPlaylists(currentCount)
  } catch (error) {
    console.error('Failed to load more Spotify playlists:', error)
  }
}

const handlePersonalPlaylistSelect = async (playlistId, event) => {
  setSelectedPersonalPlaylist(playlistId)
  const playlist = spotifyStore.getPlaylists.find(p => p.id === playlistId)
  console.log('Personal playlist selected:', playlist)

  if (playlist) {
    const playlistData = {
      ...playlist,
      type: 'deeperplaylist',
    }

    deeperStore.addToSection('yourPlaylists', playlistData)
    deeperStore.setCurrentSection('yourPlaylists')
  }
}

const handlePersonalPlaylistArrowClick = async (playlist) => {
  console.log('Personal playlist arrow clicked:', playlist)

  if (playlist) {
    try {
      await deeperStore.getPlaylistDetails(playlist, 'yourPlaylists')
      console.log('Playlist details fetched and added to section')
    } catch (error) {
      console.error('Error fetching playlist details:', error)
    }
  }
}

const handleSpotifyPlaylistArrowClick = async (playlist) => {
  console.log('Spotify playlist arrow clicked:', playlist)

  if (playlist) {
    try {
      await deeperStore.getPlaylistDetails(playlist, 'spotifyPlaylists')
      console.log('Playlist details fetched and added to section')
    } catch (error) {
      console.error('Error fetching playlist details:', error)
    }
  }
}

const handlePlaylistSearch = (event) => {
  console.log('Searching for playlists:', event.target.value)
}

// Load content on mount
onMounted(() => {
  loadPlaylistsContent()
})
</script>

<style scoped>
.playlists-page {
  padding: 20px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--search-color);
  border-top: 3px solid var(--active-tab);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.playlists-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.playlists-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0;
  padding: 0 4px;
}

@media (max-width: 480px) {
  .playlists-page {
    padding: 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .playlists-content {
    gap: 32px;
  }
}
</style>
