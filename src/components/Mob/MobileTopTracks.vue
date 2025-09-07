<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useAudioStore } from '../../stores/audio-store'
import { useQueueStore } from '../../stores/queue-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useSelection } from '../../composables/useSelection.js'
import MobileTrackItem from './MobileTrackItem.vue'

const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const preferencesStore = usePreferencesStore()

// Composables
const { selectedItem, setSelectedItem } = useSelection()

// Local state
const selectedTimeRange = ref(1) // 1 = short_term, 2 = medium_term, 3 = long_term
const loading = ref(false)

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
  const rangeString = timeRange === 1 ? 'short_term' : timeRange === 2 ? 'medium_term' : 'long_term'
  const timeRangeKey = rangeString === 'short_term' ? 'short' :
                      rangeString === 'medium_term' ? 'medium' : 'long'
  const existingData = spotifyStore[`getTopTracks${timeRangeKey.charAt(0).toUpperCase() + timeRangeKey.slice(1)}`]

  if (existingData && existingData.length > 0) {
    console.log('Using cached top tracks data for', rangeString)
    return
  }

  loading.value = true
  try {
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

  await deeperStore.getTrackDetails(track, 'topTracks')

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

const handleCoverClick = async (track, event) => {
  console.log('Cover clicked for:', track.name)
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    console.log('Playing audio preview for:', track.name)
    await audioStore.mobileToggleTrack(track.id, previewUrl)
  } else {
    console.log('No preview URL available for:', track.name)
  }
}

const handleInfoClick = async (track, event) => {
  console.log('Info clicked for:', track.name)
  setSelectedItem(track.id)

  await deeperStore.getTrackDetails(track, 'topTracks')

  queueStore.addToQueue(track)
}

const handleRefresh = async () => {
  // Clear existing data and fetch fresh
  const rangeString = selectedTimeRange.value === 1 ? 'short_term' : selectedTimeRange.value === 2 ? 'medium_term' : 'long_term'
  const timeRangeKey = rangeString === 'short_term' ? 'short' :
                      rangeString === 'medium_term' ? 'medium' : 'long'
  spotifyStore[`topTracks.${timeRangeKey}`] = []
  await loadTopTracks(selectedTimeRange.value)
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
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
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">Top Tracks</h2>
        </div>
        <div class="header-actions">
          <button class="refresh-btn" @click="handleRefresh" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
            </svg>
          </button>
          <button class="view-toggle-btn" @click="toggleViewMode" :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
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

      <div v-else :class="['releases-container', preferencesStore.viewMode]">
        <MobileTrackItem
          v-for="(track, index) in topTracks"
          :key="track.id"
          :track="track"
          :num="3"
          :view-mode="preferencesStore.viewMode"
          @click="handleTrackClick"
          @coverClick="handleCoverClick"
          @infoClick="handleInfoClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

