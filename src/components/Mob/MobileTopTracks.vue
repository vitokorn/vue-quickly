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
    <!-- Modern Header -->
    <div class="section-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">Top Tracks</h2>
          <p class="section-subtitle">{{ timeRangeLabel }}</p>
        </div>
        <div class="header-actions">
          <button class="refresh-btn" @click="handleRefresh" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
            </svg>
          </button>
          <button class="view-toggle-btn" @click="toggleViewMode" :title="viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modern Time Range Selector -->
      <div class="time-range-selector">
        <button
          v-for="range in [
            { id: 1, label: 'Month' },
            { id: 2, label: '6 Months' },
            { id: 3, label: 'All Time' }
          ]"
          :key="range.id"
          class="time-range-btn"
          :class="{ active: selectedTimeRange === range.id }"
          @click="handleTimeRangeChange(range.id)"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- Modern Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading top tracks...</p>
    </div>

    <!-- Modern Content -->
    <div v-else class="section-content">
      <div v-if="topTracks.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>No tracks found</h3>
        <p>Your top tracks will appear here</p>
      </div>

      <div v-else :class="['tracks-container', viewMode]">
        <MobileTrackItem
          v-for="(track, index) in topTracks"
          :key="track.id"
          :track="track"
          :section-name="'topTracks'"
          @click="handleTrackClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-top-tracks {
  padding: 24px;
}

/* Modern Header */
.section-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-text {
  flex: 1;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0 0 4px 0;
}

.section-subtitle {
  font-size: 14px;
  color: var(--search-color);
  margin: 0;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.refresh-btn,
.view-toggle-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: var(--title-color);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.refresh-btn:hover,
.view-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.refresh-btn svg,
.view-toggle-btn svg {
  width: 16px;
  height: 16px;
}

/* Modern Time Range Selector */
.time-range-selector {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px;
  border-radius: 12px;
}

.time-range-btn {
  background: none;
  border: none;
  color: var(--search-color);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.time-range-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.time-range-btn.active {
  background: var(--active-tab);
  color: white;
  box-shadow: 0 2px 8px rgba(240, 55, 165, 0.3);
}

/* Modern Loading State */
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
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid var(--active-tab);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 16px;
  color: var(--search-color);
  margin: 0;
  opacity: 0.8;
}

/* Modern Content */
.section-content {
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--title-color);
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: var(--search-color);
  margin: 0;
  opacity: 0.8;
}

/* Tracks Container */
.tracks-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tracks-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .mobile-top-tracks {
    padding: 20px 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .section-subtitle {
    font-size: 13px;
  }

  .header-actions {
    gap: 6px;
  }

  .refresh-btn,
  .view-toggle-btn {
    width: 32px;
    height: 32px;
    padding: 6px;
  }

  .refresh-btn svg,
  .view-toggle-btn svg {
    width: 14px;
    height: 14px;
  }

  .time-range-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .loading-state,
  .empty-state {
    padding: 40px 16px;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    margin-bottom: 12px;
  }

  .loading-state p {
    font-size: 14px;
  }

  .empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .empty-state h3 {
    font-size: 16px;
  }

  .empty-state p {
    font-size: 13px;
  }

  .tracks-container.grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

/* Dark theme support */
:root.dark .refresh-btn,
:root.dark .view-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark .refresh-btn:hover,
:root.dark .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark .time-range-selector {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .time-range-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--active-tab);
}

/* Dark-blue theme support */
:root.dark-blue .refresh-btn,
:root.dark-blue .view-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark-blue .refresh-btn:hover,
:root.dark-blue .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark-blue .time-range-selector {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-blue .time-range-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-blue .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--active-tab);
}

/* DQ theme support */
:root.dq .refresh-btn,
:root.dq .view-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dq .refresh-btn:hover,
:root.dq .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dq .time-range-selector {
  background: rgba(255, 255, 255, 0.1);
}

:root.dq .time-range-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dq .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--active-tab);
}

/* Windows Aero theme support */
:root.aero .refresh-btn,
:root.aero .view-toggle-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:root.aero .refresh-btn:hover,
:root.aero .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

:root.aero .time-range-selector {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:root.aero .time-range-btn {
  color: rgba(255, 255, 255, 0.8);
}

:root.aero .time-range-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.aero .time-range-btn.active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:root.aero .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #ffffff;
}

:root.metro .refresh-btn,
:root.metro .view-toggle-btn {
  background: transparent;
  color: white;
  border: none;
  border-radius: 0;
  width: 48px;
  height: 48px;
  padding: 12px;
}

:root.metro .refresh-btn:hover,
:root.metro .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .time-range-selector {
  background: #2d2d2d;
  border: none;
  border-radius: 0;
  padding: 4px;
  margin-bottom: 16px;
}

:root.metro .time-range-btn {
  color: #cccccc;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
  border-radius: 0;
  padding: 8px 16px;
}

:root.metro .time-range-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .time-range-btn.active {
  background: #0078d4;
  color: white;
  box-shadow: none;
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

:root.metro .empty-state h3 {
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

:root.metro .section-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 24px;
}

:root.metro .section-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

/* Material theme support */
:root.material .refresh-btn,
:root.material .view-toggle-btn {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
  border: none;
}

:root.material .refresh-btn:hover,
:root.material .view-toggle-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}

:root.material .time-range-selector {
  background: #f5f5f5;
  border: none;
}

:root.material .time-range-btn {
  color: #757575;
}

:root.material .time-range-btn:hover {
  background: #e3f2fd;
}

:root.material .time-range-btn.active {
  background: #2196f3;
  color: white;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

:root.material .loading-spinner {
  border: 3px solid #e3f2fd;
  border-top: 3px solid #2196f3;
}

/* Cupertino liquid glass theme */
:root.cupertino .mobile-top-tracks {
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

:root.cupertino .section-subtitle {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .refresh-btn,
:root.cupertino .view-toggle-btn {
  background: rgba(255, 255, 255, 0.45);
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .refresh-btn:hover,
:root.cupertino .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .time-range-selector {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .time-range-btn {
  color: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
}

:root.cupertino .time-range-btn:hover {
  background: rgba(255, 255, 255, 0.6);
}

:root.cupertino .time-range-btn.active {
  background: rgba(255, 255, 255, 0.75);
  color: rgba(0, 0, 0, 0.9);
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.16);
}

:root.cupertino .loading-spinner {
  border: 3px solid rgba(0, 0, 0, 0.05);
  border-top: 3px solid rgba(0, 0, 0, 0.4);
}

:root.cupertino .loading-state p {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .empty-state h3 {
  color: rgba(0, 0, 0, 0.8);
}

:root.cupertino .empty-state p {
  color: rgba(0, 0, 0, 0.6);
}

/* Aero theme text color adjustments */
:root.aero .section-title {
  color: #ffffff;
}

:root.aero .section-subtitle {
  color: rgba(255, 255, 255, 0.85);
}

:root.aero .loading-state p,
:root.aero .empty-state p {
  color: rgba(255, 255, 255, 0.85);
}
</style>

