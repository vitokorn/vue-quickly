<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useAudioStore } from '../../stores/audio-store'
import { useQueueStore } from '../../stores/queue-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'
import MobileTrackItem from './MobileTrackItem.vue'

const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Composables
const { selectedItem, setSelectedItem } = useSelection()

// Local state
const loading = ref(false)
const savedTracks = ref([])

// Methods
const loadSavedTracks = async () => {
  loading.value = true
  try {
    // Load saved tracks from Spotify API
    await spotifyStore.fetchSavedTracks(0)
    // Spotify returns saved tracks in format: { added_at: "...", track: {...} }
    savedTracks.value = (spotifyStore.getSavedTracks || []).map(item => item.track)
  } catch (error) {
    console.error('Failed to load saved tracks:', error)
  } finally {
    loading.value = false
  }
}

const handleTrackClick = async (track, event) => {
  setSelectedItem(track.id)
  const sectionName = 'savedTracks'
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
}

const handleRefresh = async () => {
  await loadSavedTracks()
}

// Load initial data
onMounted(async () => {
  await loadSavedTracks()
})
</script>

<template>
  <div class="mobile-saved-tracks">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="section-title">Saved Tracks</h3>
      <div class="action-buttons">
        <button class="refresh-btn" @click="handleRefresh" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading saved tracks...</p>
    </div>

    <!-- Tracks List -->
    <div v-else-if="savedTracks.length > 0" class="tracks-container">
      <MobileTrackItem
        v-for="track in savedTracks.slice(0, 10)"
        :key="track.id"
        :track="track"
        section-name="savedTracks"
        parent-id="saved"
        @click="handleTrackClick"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
        </svg>
      </div>
      <h4>No saved tracks</h4>
      <p>Start saving your favorite tracks to see them here</p>
    </div>
  </div>
</template>

<style scoped>
.mobile-saved-tracks {
  width: 100%;
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
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #a0a0a0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
}

.tracks-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: #a0a0a0;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .section-title {
    font-size: 18px;
  }

  .tracks-container {
    gap: 10px;
  }
}

:root.metro .mobile-saved-tracks {
  font-family: 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif;
}

:root.metro .section-header {
  padding: 16px 20px 8px 20px;
}

:root.metro .section-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 24px;
  text-transform: none;
  letter-spacing: normal;
}

:root.metro .section-icon {
  background: transparent;
  border-radius: 0;
  width: 24px;
  height: 24px;
}

:root.metro .section-icon svg {
  color: rgba(255, 255, 255, 0.8);
  width: 18px;
  height: 18px;
}

:root.metro .action-buttons {
  gap: 6px;
}

:root.metro .refresh-btn {
  background: transparent;
  color: #cccccc;
  border: none;
  border-radius: 0;
  width: 40px;
  height: 40px;
  padding: 8px;
}

:root.metro .refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

:root.metro .refresh-btn svg {
  width: 16px;
  height: 16px;
}

:root.metro .loading-spinner {
  border: 3px solid #333333;
  border-top: 3px solid #0078d4;
}

:root.metro .loading-state p {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

:root.metro .empty-state h4 {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 20px;
}

:root.metro .empty-state p {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .empty-icon {
  background: #333333;
  border-radius: 0;
}

:root.metro .empty-icon svg {
  color: rgba(255, 255, 255, 0.6);
  font-size: 32px;
}

/* Cupertino liquid glass theme */
:root.cupertino .mobile-saved-tracks {
  background: linear-gradient(135deg, #e8f0ff 0%, #f8f9fb 40%, #ffe9f3 100%);
}

:root.cupertino .section-header {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 30px rgba(31, 38, 135, 0.12);
}

:root.cupertino .section-title {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .section-icon {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .section-icon svg {
  color: rgba(0, 0, 0, 0.6);
  width: 18px;
  height: 18px;
}

:root.cupertino .action-buttons {
  gap: 6px;
}

:root.cupertino .refresh-btn {
  background: rgba(255, 255, 255, 0.45);
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .refresh-btn svg {
  width: 16px;
  height: 16px;
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .loading-spinner {
  border: 3px solid rgba(0, 0, 0, 0.05);
  border-top: 3px solid rgba(0, 0, 0, 0.4);
}

:root.cupertino .loading-state p {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .empty-state h4 {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .empty-state p {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .empty-icon {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .empty-icon svg {
  color: rgba(0, 0, 0, 0.4);
  font-size: 32px;
}
</style>
