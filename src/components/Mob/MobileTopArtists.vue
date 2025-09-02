<script setup>
import {ref, computed, onMounted} from 'vue'
import {useSpotifyStore} from '../../stores/spotify-store'
import {useAudioStore} from '../../stores/audio-store'
import {useDeeperStore} from '../../stores/deeper-store'
import {useSelection} from '../../composables/useSelection.js'
import MobileArtistDisplaySection from "./MobileArtistDisplaySection.vue";

const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const deeperStore = useDeeperStore()

// Composables
const {selectedItem, setSelectedItem} = useSelection()

// Local state
const selectedTimeRange = ref(1) // 1 = short_term, 2 = medium_term, 3 = long_term
const loading = ref(false)
const viewMode = ref('grid') // 'list' or 'grid'

// Computed properties
const topArtists = computed(() => {
  switch (selectedTimeRange.value) {
    case 1:
      return spotifyStore.getTopArtistsShort || []
    case 2:
      return spotifyStore.getTopArtistsMedium || []
    case 3:
      return spotifyStore.getTopArtistsLong || []
    default:
      return spotifyStore.getTopArtistsShort || []
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
const loadTopArtists = async (timeRange) => {
  const rangeString = timeRange === 1 ? 'short_term' : timeRange === 2 ? 'medium_term' : 'long_term'
  const timeRangeKey = rangeString === 'short_term' ? 'short' :
                      rangeString === 'medium_term' ? 'medium' : 'long'
  const existingData = spotifyStore[`getTopArtists${timeRangeKey.charAt(0).toUpperCase() + timeRangeKey.slice(1)}`]

  if (existingData && existingData.length > 0) {
    console.log('Using cached top artists data for', rangeString)
    return
  }

  loading.value = true
  try {
    await spotifyStore.fetchTopArtists(rangeString)
  } catch (error) {
    console.error('Failed to load top artists:', error)
  } finally {
    loading.value = false
  }
}

const handleTimeRangeChange = async (rangeId) => {
  selectedTimeRange.value = rangeId
  await loadTopArtists(rangeId)
}

const handleArtistClick = async (artist, event) => {
  setSelectedItem(artist.id)
  const sectionName = 'topArtists'

  // Add artist to deeper store for topArtists section
  await deeperStore.getArtistDetails(artist, sectionName)

  // Show the deeper artist component using visibility manager
  const {useVisibilityManager} = await import('../../composables/useVisibilityManager')
  const visibilityManager = useVisibilityManager()
  const artistKey = `trackartist_${artist.id}__p:topArtistsPage__`
  visibilityManager.showComponent(artistKey)

  console.log('Showing deeper artist for:', artist.name, 'with key:', artistKey)
}

const handleArtistHover = (event) => {
  audioStore.handleAudioHover(event)
}

const handleArtistLeave = (event) => {
  audioStore.handleAudioLeave(event)
}

const handleRefresh = async () => {
  // Clear existing data and fetch fresh
  const rangeString = selectedTimeRange.value === 1 ? 'short_term' : selectedTimeRange.value === 2 ? 'medium_term' : 'long_term'
  const timeRangeKey = rangeString === 'short_term' ? 'short' :
                      rangeString === 'medium_term' ? 'medium' : 'long'
  spotifyStore[`topArtists.${timeRangeKey}`] = []
  await loadTopArtists(selectedTimeRange.value)
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

// Formatting functions
const formatFollowers = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

const formatGenres = (genres) => {
  if (!genres || genres.length === 0) return ''
  // Take first 2 genres and capitalize first letter
  return genres.slice(0, 2).map(genre =>
      genre.charAt(0).toUpperCase() + genre.slice(1)
  ).join(', ')
}

// Load initial data
onMounted(async () => {
  await loadTopArtists(selectedTimeRange.value)
})
</script>

<template>
  <!-- Section Header -->
  <div class="mobile-top-tracks">
    <!-- Modern Header -->
    <div class="section-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">Top Artists</h2>
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
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading top artists...</p>
    </div>

    <MobileArtistDisplaySection
        title="Top Artists"
        :artists="topArtists"
        :view-mode="viewMode"
        @artist-click="handleArtistClick"
    />
  </div>
</template>

<style scoped>
</style>
