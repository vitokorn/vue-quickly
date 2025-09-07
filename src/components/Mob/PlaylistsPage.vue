<template>
  <div class="playlists-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading playlists...</p>
    </div>

    <!-- Content -->
    <div v-else class="playlists-content">
      <!-- Personal Playlists Section -->
      <div class="playlists-section">
        <PlaylistSelector
          :playlists="musicStore.getPlaylists"
          :selected-playlist="selectedPersonalPlaylist"
          title="Your Playlists"
          placeholder="Search personal playlists..."
          :items-per-page="10"
          @playlist-arrow-click="handlePersonalPlaylistArrowClick"
          @load-more="handleLoadMorePersonalPlaylists"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMusicStore } from '../../stores/music-store'
import { useDeeperStore } from '../../stores/deeper-store'
import PlaylistSelector from './PlaylistSelector.vue'
import MobileDeeperPlaylist from './MobileDeeperPlaylist.vue'
import { useSelection } from '../../composables/useSelection.js'

const musicStore = useMusicStore()
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
  const hasPersonalPlaylists = musicStore.getPlaylists && musicStore.getPlaylists.length > 0
  const hasSpotifyPlaylists = musicStore.getSpotifyPlaylists && musicStore.getSpotifyPlaylists.length > 0

  if (hasPersonalPlaylists && hasSpotifyPlaylists) {
    console.log('Using cached playlists data')
    return
  }

  loading.value = true
  error.value = null

  try {
    // Load both personal and Spotify playlists
    await Promise.all([
      hasPersonalPlaylists ? Promise.resolve() : musicStore.fetchPlaylists(0),
      hasSpotifyPlaylists ? Promise.resolve() : musicStore.fetchSpotifyPlaylists(0)
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
    const currentCount = musicStore.getPlaylists.length
    await musicStore.fetchPlaylists(currentCount)
  } catch (error) {
    console.error('Failed to load more personal playlists:', error)
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

const handleSpotifyPlaylistSelect = async (playlistId, event) => {
  selectedSpotifyPlaylist.value = playlistId
  const playlist = musicStore.getSpotifyPlaylists.find(p => p.id === playlistId)
  console.log('Spotify playlist selected:', playlist)

  if (playlist) {
    const playlistData = {
      ...playlist,
      type: 'deeperplaylist',
    }

    deeperStore.addToSection('spotifyPlaylists', playlistData)
    deeperStore.setCurrentSection('spotifyPlaylists')
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

@media (max-width: 480px) {
  .playlists-page {
    padding: 16px;
  }

  .playlists-content {
    gap: 32px;
  }
}
</style>
