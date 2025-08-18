<template>
  <div class="discover-page">
    <!-- Discover Header -->
    <div class="discover-header">
      <h2 class="discover-title">Discover</h2>
      <p class="discover-subtitle">Find new music and artists</p>
    </div>

    <!-- Spotify Playlists Section -->
    <div class="discover-section">
      <div class="section-header">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
        <h3 class="section-title">Spotify Playlists</h3>
      </div>

      <!-- Using PlaylistSelector component -->
      <PlaylistSelector
        :playlists="spotifyStore.getSpotifyPlaylists"
        :selected-playlist="selectedPlaylist"
        title="Your Spotify Playlists"
        placeholder="Search your playlists..."
        :items-per-page="5"
        @playlist-select="handlePlaylistSelect"
        @search="handlePlaylistSearch"
        @load-more="handleLoadMorePlaylists"
      />
    </div>

    <!-- New Releases Section -->
    <div class="discover-section">
      <div class="section-header">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="section-title">New Releases</h3>
      </div>

      <!-- Using ReleaseSelector component -->
      <ReleaseSelector
        :releases="newReleases"
        :selected-release="selectedRelease"
        title="Latest Releases"
        placeholder="Search releases..."
        :items-per-page="10"
        @release-select="handleReleaseSelect"
        @search="handleReleaseSearch"
        @load-more="handleLoadMoreReleases"
        @refresh="handleRefreshReleases"
      />
    </div>

    <!-- Loading States -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading discoveries...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadDiscoverContent">Try Again</button>
    </div>

    <!-- Deeper Tracks Modal -->
    <div v-if="deeperTracks.length > 0" class="deeper-tracks-modal">
      <div class="modal-overlay" @click="deeperStore.clearSection('newReleases')"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Track Details</h3>
          <button class="close-button" @click="deeperStore.clearSection('newReleases')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="deeper-tracks-wrapper">
            <DeeperTracks
              v-for="(track, index) in deeperTracks"
              :key="track.id"
              :d="track"
              :num="7"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import PlaylistSelector from './PlaylistSelector.vue'
import ReleaseSelector from './ReleaseSelector.vue'
import DeeperTracks from './DeeperTracks.vue'

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)
const error = ref(null)
const selectedPlaylist = ref(null)
const selectedRelease = ref(null)

// Computed properties
const newReleases = computed(() => spotifyStore.getNewReleases || [])

// Computed for deeper tracks
const deeperTracks = computed(() => deeperStore.getSectionData('newReleases'))

// Methods
const loadDiscoverContent = async () => {
  loading.value = true
  error.value = null

  try {
    // Load Spotify playlists
    await spotifyStore.fetchSpotifyPlaylists(0)

    // Load new releases
    await spotifyStore.fetchNewReleases(0)
  } catch (err) {
    error.value = 'Failed to load discover content'
    console.error('Error loading discover content:', err)
  } finally {
    loading.value = false
  }
}

const handlePlaylistSelect = (playlistId, event) => {
  selectedPlaylist.value = playlistId
  const playlist = spotifyStore.getSpotifyPlaylists.find(p => p.id === playlistId)
  console.log('Playlist selected:', playlist)
  // Handle playlist selection - you can navigate to playlist details or play it
}

const handlePlaylistSearch = (event) => {
  console.log('Searching for playlists:', event.target.value)
  // The PlaylistSelector component handles the filtering internally
}

const handleLoadMorePlaylists = async () => {
  try {
    // For pagination, we need to ensure we have enough playlists loaded
    // If we don't have enough playlists for the current page, load more
    const currentCount = spotifyStore.getSpotifyPlaylists.length
    const itemsPerPage = 5
    const targetCount = currentCount + itemsPerPage
    console.log(itemsPerPage)
    console.log(currentCount)
    // Load more playlists if needed
    if (currentCount < targetCount) {
      await spotifyStore.fetchSpotifyPlaylists(currentCount)
    }
  } catch (error) {
    console.error('Failed to load more playlists:', error)
  }
}

const handleReleaseSelect = (releaseId, event) => {
  selectedRelease.value = releaseId
  const release = newReleases.value.find(r => r.id === releaseId)
  console.log('Release selected:', release)
  // Handle release selection - you can navigate to album details or play it
  // You might want to emit an event or navigate to an album view
}

const handleReleaseSearch = (event) => {
  console.log('Searching for releases:', event.target.value)
  // The ReleaseSelector component handles the filtering internally
}

const handleLoadMoreReleases = async () => {
  try {
    // Load more releases using the current count as offset
    const currentCount = newReleases.value.length
    await spotifyStore.fetchNewReleases(currentCount)
  } catch (error) {
    console.error('Failed to load more releases:', error)
  }
}

const handleRefreshReleases = () => {
  spotifyStore.fetchNewReleases(0)
}

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

// Load content on mount
onMounted(() => {
  loadDiscoverContent()
})
</script>

<style scoped>
.discover-page {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.discover-header {
  text-align: center;
  margin-bottom: 30px;
}

.discover-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.discover-subtitle {
  font-size: 16px;
  color: #a0a0a0;
  margin: 0;
}

.discover-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  width: 32px;
  height: 32px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

/* PlaylistSelector and ReleaseSelector components are now used for their respective sections */

/* Loading State */
.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #a0a0a0;
  margin: 0;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 40px 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state p {
  color: #ef4444;
  margin: 0 0 16px 0;
}

.retry-button {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: rgba(102, 126, 234, 0.2);
}

/* Deeper Tracks Modal */
.deeper-tracks-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  width: 100vw;
  height: 100%;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 111;
}

.modal-content {
  position: relative;
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  width: 90vw;
  max-width: 350px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  z-index: 112;
  box-sizing: border-box;
  margin: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
  background: #333333;
  overflow-x: hidden;
  box-sizing: border-box;
}

.deeper-tracks-wrapper {
  width: 100%;
  overflow-x: hidden;
}

.deeper-tracks-wrapper :deep(.modern-track-card) {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.deeper-tracks-wrapper :deep(.track-main) {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deeper-tracks-wrapper :deep(.track-info) {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
}

.deeper-tracks-wrapper :deep(.track-title) {
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1.3;
}

.deeper-tracks-wrapper :deep(.artists-section) {
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.deeper-tracks-wrapper :deep(.artists-list) {
  max-width: 100%;
  overflow: hidden;
  flex-wrap: wrap;
  box-sizing: border-box;
  display: flex;
  gap: 4px;
  align-items: center;
}

.deeper-tracks-wrapper :deep(.track-actions) {
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.deeper-tracks-wrapper :deep(.recommend-btn),
.deeper-tracks-wrapper :deep(.spotify-link) {
  width: 100%;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  box-sizing: border-box;
  padding: 10px 12px;
  font-size: 14px;
  text-align: left;
  justify-content: flex-start;
}

/* Tablet Design */
@media (min-width: 768px) and (max-width: 1024px) {
  .deeper-tracks-modal {
    padding: 30px;
  }

  .modal-content {
    width: 70vw;
    max-width: 600px;
    margin: auto;
  }

  .modal-body {
    padding: 24px;
  }

  .deeper-tracks-wrapper :deep(.modern-track-card) {
    padding: 20px;
  }

  .deeper-tracks-wrapper :deep(.track-title) {
    font-size: 18px;
  }

  .deeper-tracks-wrapper :deep(.recommend-btn),
  .deeper-tracks-wrapper :deep(.spotify-link) {
    font-size: 16px;
    padding: 12px 16px;
  }
}

/* Responsive Design */
@media (max-width: 582px) {
  .deeper-tracks-modal {
    padding: 15px;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }

  .modal-content {
    width: 90vw;
    max-width: 380px;
    margin: auto;
  }

  .modal-body {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .discover-title {
    font-size: 24px;
  }

  .discover-subtitle {
    font-size: 14px;
  }

  .section-title {
    font-size: 18px;
  }

  .deeper-tracks-modal {
    padding: 10px;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    width: 95vw;
    max-width: 350px;
    margin: auto;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-body {
    padding: 16px;
    max-height: calc(90vh - 70px);
  }
}

/* Extra small screens */
@media (max-width: 478px) {
  .modal-content {
    width: 95vw;
    max-width: 320px;
    margin: auto;
  }

  .modal-body {
    padding: 12px;
  }

  .deeper-tracks-wrapper :deep(.modern-track-card) {
    padding: 12px;
  }

  .deeper-tracks-wrapper :deep(.track-title) {
    font-size: 14px;
  }

  .deeper-tracks-wrapper :deep(.recommend-btn),
  .deeper-tracks-wrapper :deep(.spotify-link) {
    font-size: 12px;
    padding: 8px 10px;
  }
}

/* Very small screens */
@media (max-width: 360px) {
  .modal-content {
    width: 98vw;
    max-width: 300px;
    margin: auto;
  }

  .modal-body {
    padding: 8px;
  }

  .deeper-tracks-wrapper :deep(.modern-track-card) {
    padding: 8px;
  }

  .deeper-tracks-wrapper :deep(.track-title) {
    font-size: 13px;
  }

  .deeper-tracks-wrapper :deep(.recommend-btn),
  .deeper-tracks-wrapper :deep(.spotify-link) {
    font-size: 11px;
    padding: 6px 8px;
  }
}
</style>
