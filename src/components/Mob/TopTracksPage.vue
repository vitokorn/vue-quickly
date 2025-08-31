<template>
  <div class="top-tracks-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your top tracks...</p>
    </div>

    <!-- Content -->
    <div v-else class="top-tracks-content">
      <!-- Time Range Selector -->
      <div class="time-range-section">
        <h2 class="section-title">Your Top Tracks</h2>
        <div class="time-range-buttons">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            class="time-range-btn"
            :class="{ active: selectedTimeRange === range.value }"
            @click="handleTimeRangeChange(range.value)"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <!-- Top Tracks Section -->
      <div class="tracks-section">
        <MobileTopTracks />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import MobileTopTracks from './MobileTopTracks.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)
const selectedTimeRange = ref('short_term')

// Time range options
const timeRanges = [
  { value: 'short_term', label: '4 Weeks' },
  { value: 'medium_term', label: '6 Months' },
  { value: 'long_term', label: 'All Time' }
]

// Methods
const loadTopTracksContent = async () => {
  const timeRangeKey = selectedTimeRange.value === 'short_term' ? 'short' :
                      selectedTimeRange.value === 'medium_term' ? 'medium' : 'long'
  const existingData = spotifyStore[`getTopTracks${timeRangeKey.charAt(0).toUpperCase() + timeRangeKey.slice(1)}`]

  if (existingData && existingData.length > 0) {
    console.log('Using cached top tracks data for', selectedTimeRange.value)
    return
  }

  loading.value = true
  try {
    await spotifyStore.fetchTopTracks(selectedTimeRange.value)
  } catch (error) {
    console.error('Failed to load top tracks:', error)
  } finally {
    loading.value = false
  }
}

const handleTimeRangeChange = async (timeRange) => {
  selectedTimeRange.value = timeRange

  // Check if data already exists in store for the new time range
  const timeRangeKey = timeRange === 'short_term' ? 'short' :
                      timeRange === 'medium_term' ? 'medium' : 'long'
  const existingData = spotifyStore[`getTopTracks${timeRangeKey.charAt(0).toUpperCase() + timeRangeKey.slice(1)}`]

  if (existingData && existingData.length > 0) {
    console.log('Using cached top tracks data for', timeRange)
    return
  }

  loading.value = true
  try {
    await spotifyStore.fetchTopTracks(timeRange)
  } catch (error) {
    console.error('Failed to load top tracks for time range:', error)
  } finally {
    loading.value = false
  }
}

// Load content on mount
onMounted(() => {
  loadTopTracksContent()
})
</script>

<style scoped>
.top-tracks-page {
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

.top-tracks-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.time-range-section {
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

.time-range-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.time-range-btn {
  background: var(--theme-queue-button);
  border: none;
  color: var(--search-color);
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  min-width: 80px;
}

.time-range-btn:hover {
  background: var(--theme-queue-button-hover);
  transform: translateY(-1px);
}

.time-range-btn.active {
  background: var(--active-tab);
  color: white;
  box-shadow: 0 2px 8px var(--active-tab-component);
}

.tracks-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 480px) {
  .top-tracks-page {
    padding: 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .time-range-buttons {
    gap: 6px;
  }

  .time-range-btn {
    padding: 8px 12px;
    font-size: 13px;
    min-width: 70px;
  }

  .top-tracks-content {
    gap: 24px;
  }
}
</style>
