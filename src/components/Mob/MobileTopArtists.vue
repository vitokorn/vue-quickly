<script setup>
import {ref, computed, onMounted} from 'vue'
import {useSpotifyStore} from '../../stores/spotify-store'
import {useAudioStore} from '../../stores/audio-store'
import {useDeeperStore} from '../../stores/deeper-store'
import {useSelection} from '../../composables/useSelection.js'
import ArtistItem from '../ArtistItem.vue'

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
        <div class="header-actions">
          <button class="refresh-btn" @click="handleRefresh" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                    clip-rule="evenodd"/>
            </svg>
          </button>
          <button class="view-toggle-btn" @click="toggleViewMode"
                  :title="viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z"
                    clip-rule="evenodd"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd"/>
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
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading top artists...</p>
    </div>

    <!-- Artists Grid/List -->
    <template v-else-if="topArtists.length > 0" class="artists-container">
      <div class="releases-container" :class="viewMode">
        <!-- List View -->
        <template v-if="viewMode === 'list'">
          <div
              v-for="artist in topArtists.slice(0, 8)"
              :key="artist.id"
              :class="['artist-item', 'list-item', { 'selected': selectedItem === '2' + artist.id }]"
              @click="handleArtistClick(artist, $event)"
              @mouseover="handleArtistHover"
              @mouseleave="handleArtistLeave"
          >
            <div class="artist-cover">
              <img
                  v-if="artist.images && artist.images.length > 0"
                  :src="artist.images[0].url"
                  :alt="artist.name"
                  @error="$event.target.style.display = 'none'"
              />
              <div v-else class="artist-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/>
                </svg>
              </div>
            </div>
            <div class="artist-info">
              <div class="artist-name">{{ artist.name }}</div>
              <div class="artist-details">
                <span v-if="artist.followers">{{ formatFollowers(artist.followers.total) }} followers</span>
                <span v-if="artist.genres && artist.genres.length > 0">{{ formatGenres(artist.genres) }}</span>
              </div>
              <div class="artist-type">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path
                      d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/>
                </svg>
                <span class="type-text">Artist</span>
              </div>
            </div>
            <div class="artist-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd"
                      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                      clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </template>

        <!-- Grid View -->
        <template v-else>
          <div
              v-for="artist in topArtists.slice(0, 12)"
              :key="artist.id"
              :class="['artist-item', 'grid-item', { 'selected': selectedItem === '2' + artist.id }]"
              @click="handleArtistClick(artist, $event)"
              @mouseover="handleArtistHover"
              @mouseleave="handleArtistLeave"
          >
            <div class="grid-cover">
              <img
                  v-if="artist.images && artist.images.length > 0"
                  :src="artist.images[0].url"
                  :alt="artist.name"
                  @error="$event.target.style.display = 'none'"
              />
              <div v-else class="artist-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/>
                </svg>
              </div>
            </div>
            <div class="grid-info">
              <div class="grid-name">{{ artist.name }}</div>
              <div class="grid-details">
                <span v-if="artist.followers">{{ formatFollowers(artist.followers.total) }} followers</span>
                <span v-if="artist.genres && artist.genres.length > 0">{{ formatGenres(artist.genres) }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
              d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"/>
        </svg>
      </div>
      <h4>No top artists available</h4>
      <p>Try refreshing or check your connection</p>
    </div>
  </div>
</template>

<style scoped>
</style>
