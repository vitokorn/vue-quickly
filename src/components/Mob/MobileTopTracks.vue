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
const selectedTimeRange = ref(1) // 1 = short_term, 2 = medium_term, 3 = long_term
const loading = ref(false)
const viewMode = ref('list') // 'list' or 'grid'

// Computed properties
const topTracks = computed(() => {
  switch (selectedTimeRange.value) {
    case 1:
      return spotifyStore.getTopTracksShort || []
    case 2:
      return spotifyStore.getTopTracksMedium || []
    case 3:
      return spotifyStore.getTopTracksLong || []
    default:
      return spotifyStore.getTopTracksShort || []
  }
})

const timeRangeLabel = computed(() => {
  switch (selectedTimeRange.value) {
    case 1:
      return 'Last month'
    case 2:
      return 'Last 6 months'
    case 3:
      return 'All time'
    default:
      return 'Last month'
  }
})

// Methods
const loadTopTracks = async (timeRange) => {
  loading.value = true
  try {
    const rangeString = timeRange === 1 ? 'short_term' : timeRange === 2 ? 'medium_term' : 'long_term'
    await spotifyStore.fetchTopTracks(rangeString)
  } catch (error) {
    console.error('Failed to load top tracks:', error)
  } finally {
    loading.value = false
  }
}

const handleTimeRangeChange = async (rangeId) => {
  selectedTimeRange.value = rangeId
  await loadTopTracks(rangeId)
}

const handleTrackClick = async (track, event) => {
  console.log('Track clicked:', track.name, 'Preview URL:', track.preview_url || track.previewUrl)
  setSelectedItem(track.id)
  const sectionName = 'topTracks'
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
  
  // Also play audio preview if available
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    console.log('Playing audio preview for:', track.name)
    await audioStore.mobileToggleTrack(track.id, previewUrl)
  } else {
    console.log('No preview URL available for:', track.name)
  }
}

const handleRefresh = async () => {
  await loadTopTracks(selectedTimeRange.value)
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

// Load initial data
onMounted(async () => {
  await loadTopTracks(selectedTimeRange.value)
})
</script>

<template>
  <div class="mobile-top-tracks">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
        </svg>
      </div>
      <h3 class="section-title">Top Tracks</h3>
    </div>

    <!-- Time Range Selector -->
    <div class="time-range-selector">
      <div class="range-buttons">
        <button 
          :class="['range-btn', { active: selectedTimeRange === 1 }]"
          @click="handleTimeRangeChange(1)"
        >
          Last month
        </button>
        <button 
          :class="['range-btn', { active: selectedTimeRange === 2 }]"
          @click="handleTimeRangeChange(2)"
        >
          Last 6 months
        </button>
        <button 
          :class="['range-btn', { active: selectedTimeRange === 3 }]"
          @click="handleTimeRangeChange(3)"
        >
          All time
        </button>
      </div>
      <div class="action-buttons">
        <button class="view-toggle-btn" @click="toggleViewMode" :title="viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'">
          <svg v-if="viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18A2.25 2.25 0 018.25 20H6A2.25 2.25 0 013.75 17.75v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18A2.25 2.25 0 0118.25 20h-2.25A2.25 2.25 0 0113.75 17.75v-2.25z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>
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
      <p>Loading top tracks...</p>
    </div>

    <!-- Tracks List/Grid -->
    <div v-else-if="topTracks.length > 0" :class="['tracks-container', { 'grid-view': viewMode === 'grid' }]">
      <MobileTrackItem
        v-for="track in topTracks.slice(0, viewMode === 'grid' ? 12 : 10)"
        :key="track.id"
        :track="track"
        section-name="topTracks"
        :parent-id="selectedTimeRange === 1 ? 'short_term' : selectedTimeRange === 2 ? 'medium_term' : 'long_term'"
        @click="handleTrackClick"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
        </svg>
      </div>
      <h4>No top tracks available</h4>
      <p>Try refreshing or check your connection</p>
    </div>
  </div>
</template>

<style scoped>
.mobile-top-tracks {
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
}

.time-range-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.range-buttons {
  display: flex;
  gap: 8px;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.range-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #a0a0a0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.range-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.range-btn.active {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border-color: rgba(102, 126, 234, 0.4);
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

.view-toggle-btn {
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

.view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.view-toggle-btn svg {
  width: 16px;
  height: 16px;
}

.tracks-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tracks-container.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
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

  .range-btn {
    font-size: 11px;
    padding: 6px 8px;
  }

  .tracks-container {
    gap: 10px;
  }

  .tracks-container.grid-view {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
