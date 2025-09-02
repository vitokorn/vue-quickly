<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

const props = defineProps({
  artists: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['artist-click'])

const loading = ref(false)

// Composables
const { selectedItem, setSelectedItem } = useSelection()

// Local state
const viewMode = ref('grid') // 'list' or 'grid'
const followedArtists = ref([])

// Methods

// Note: This component doesn't handle artist clicks directly
// It emits events to the parent component which handles the deeper artist logic

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const handleRefresh = async () => {
  // Clear existing data and fetch fresh
  spotifyStore.followedArtists = []
  await loadFollowedArtists()
}

// Helper functions
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

const trackClass = computed(() => {
  const baseClass = 'mobile-track-item'
  const viewClass = viewMode.value === 'grid' ? 'grid' : 'list-view'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${viewClass} ${selectedClass}`.trim()
})

</script>

<template>
  <div class="mobile-top-tracks">
    <!-- Modern Header -->
    <div class="section-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">{{title}}</h2>
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
    </div>

    <!-- Artists Grid/List -->
      <div class="releases-container" :class="viewMode">
        <!-- List View -->
        <template v-if="viewMode === 'list'">
          <div
              v-for="artist in artists"
              :key="artist.id"
              :class="trackClass"
              @click="$emit('artist-click', artist, $event)"
          >
            <div class="track-image">
              <img
                  class="track-cover"
                  v-if="artist.images && artist.images.length > 0"
                  :src="artist.images[0].url"
                  :alt="artist.name"
                  @error="$event.target.style.display = 'none'"
              />
              <div v-else class="artist-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
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
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
                <span class="type-text">Artist</span>
              </div>
            </div>
            <div class="artist-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Grid View -->
        <template v-else>
          <div
              v-for="artist in artists"
              :key="artist.id"
              :class="trackClass"
              @click="$emit('artist-click', artist, $event)"
          >
            <div class="track-image">
              <img
                  class="track-cover"
                  v-if="artist.images && artist.images.length > 0"
                  :src="artist.images[0].url"
                  :alt="artist.name"
                  @error="$event.target.style.display = 'none'"
              />
              <div v-else class="artist-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
            </div>
            <div class="track-details">
              <div class="track-name">{{ artist.name }}</div>
              <div class="track-details">
                <div style="font-size: small" v-if="artist.followers">{{ formatFollowers(artist.followers.total) }} followers</div>
                <div style="font-size: smaller" v-if="artist.genres && artist.genres.length > 0">{{ formatGenres(artist.genres) }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>

    <!-- Empty State -->
    <div v-if="!artists.length" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clip-rule="evenodd" />
        </svg>
      </div>
      <h4>No followed artists</h4>
      <p>Start following your favorite artists to see them here</p>
    </div>
  </div>
</template>

<style scoped>
</style>
