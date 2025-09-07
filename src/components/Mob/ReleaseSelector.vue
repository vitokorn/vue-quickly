<script setup>
import {ref, computed} from 'vue'
import {useAudioStore} from '../../stores/audio-store'
import {useDeeperStore} from '../../stores/deeper-store'
import {usePreferencesStore} from '../../stores/preferences-store'
import {useMediaDisplay} from "../../composables/useMediaDisplay.js"
import {useVisibilityManager} from "../../composables/useVisibilityManager"
import MobilePaginationContainer from './MobilePaginationContainer.vue'

const props = defineProps({
  releases: {
    type: Array,
    default: () => []
  },
  selectedRelease: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search releases...'
  },
  title: {
    type: String,
    default: 'New Releases'
  },
  itemsPerPage: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['release-select', 'search', 'load-more', 'refresh'])

// Stores
const audioStore = useAudioStore()
const deeperStore = useDeeperStore()
const preferencesStore = usePreferencesStore()
const visibilityManager = useVisibilityManager()

const searchTerm = ref('')
const currentPage = ref(1)

const filteredReleases = computed(() => {
  if (!searchTerm.value) {
    return props.releases
  }
  return props.releases.filter(release =>
      release.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      release.artists?.some(artist => artist.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
  )
})

const displayedReleases = computed(() => {
  const startIndex = (currentPage.value - 1) * props.itemsPerPage
  const endIndex = startIndex + props.itemsPerPage
  return filteredReleases.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(filteredReleases.value.length / props.itemsPerPage)
})

// Helper function to check if a release is currently playing
const isReleasePlaying = (release) => {
  if (release.tracks && release.tracks.items && release.tracks.items.length > 0) {
    const firstTrack = release.tracks.items[0]
    return audioStore.mobileIsTrackPlaying(firstTrack.id)
  }
  return false
}

const hasPreview = (release) => {
  let test = getReleasePreviewUrl(release)
  return !!test
}

// Helper function to get preview URL for a release
const getReleasePreviewUrl = (release) => {
  if (release.tracks && release.tracks.items && release.tracks.items.length > 0) {
    return release.tracks.items[0].preview_url
  }
  return null
}

const getDisplayClass = (release) => {
  const hasPreview = getReleasePreviewUrl(release)
  const hasImage = release.images && release.images[0]

  if (hasPreview && hasImage) {
    return 'playable'
  } else if (!hasPreview && hasImage) {
    return 'unplayable half-opacity'
  } else if (hasPreview && !hasImage) {
    return 'playable no-image'
  } else {
    return 'unplayable no-image half-opacity'
  }
}

const handleReleaseSelect = (releaseId, event) => {
  emit('release-select', releaseId, event)
}

const handleReleaseClick = (release, event) => {
  // Check if release has tracks with preview URL
  if (release.tracks && release.tracks.items && release.tracks.items.length > 0) {
    const firstTrack = release.tracks.items[0]
    if (firstTrack.preview_url) {
      audioStore.mobileToggleTrack(firstTrack.id, firstTrack.preview_url)
    }
  }
}

const handleSearch = (event) => {
  searchTerm.value = event.target.value
  resetPagination()
  emit('search', event)
}

const clearSearch = () => {
  searchTerm.value = ''
  resetPagination()
  emit('search', {target: {value: ''}})
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

const handlePageChange = (page) => {
  currentPage.value = page
  // Keep pagination visible when changing pages
  if (currentPage.value === totalPages.value) {
    emit('load-more')
  }
}

const resetPagination = () => {
  currentPage.value = 1
}

const handleRefresh = () => {
  emit('refresh')
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
</script>

<template>
  <div class="mobile-top-tracks">
    <!-- Modern Header -->
    <div class="">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">{{ title }} | {{ releases.length }} items</h2>
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
                  :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
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

      <!-- Search and View Controls -->
      <div class="controls-container">
        <div class="search-container">
          <div class="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
              <path fill-rule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clip-rule="evenodd"/>
            </svg>
            <input
                type="text"
                :placeholder="placeholder"
                class="search-input"
                v-model="searchTerm"
                @input="handleSearch"
            >
            <button
                v-if="searchTerm"
                @click="clearSearch"
                class="clear-button"
                type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="clear-icon">
                <path fill-rule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

      </div>

      <!-- Releases Container -->
      <div class="releases-container">
        <div v-if="filteredReleases.length === 0 && searchTerm" class="empty-search">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clip-rule="evenodd"/>
            </svg>
          </div>
          <h4>No releases found</h4>
          <p>Try adjusting your search terms</p>
        </div>

        <div v-else-if="releases.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                    clip-rule="evenodd"/>
            </svg>
          </div>
          <h4>No releases available</h4>
          <p>Check back later for new releases</p>
        </div>

        <div v-else :class="['releases-container', preferencesStore.viewMode]">
          <div
              v-for="(release, index) in displayedReleases"
              :key="index"
              class="song-item"
              @click="handleReleaseClick(release, $event)"
          >
              <div class="item-cover" style="position: relative;">
                <img v-if="release.images && release.images[0]" :src="release.images[0].url" :alt="release.name"/>
                <div v-else class="release-cover">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="release-icon">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-if="hasPreview(release) && isReleasePlaying(release)" class="playing-indicator">
                  <span class="playing-icon">▶️</span>
                </div>
              </div>
            <div class="item-info" @click="handleReleaseSelect(release.id, $event)">
              <div class="item-name">{{ release.name }}</div>
              <span v-if="release.release_date">{{ formatReleaseDate(release.release_date) }}</span>
              <div class="item-artist">{{ formatArtistNames(release.artists) }}</div>
              <div class="album-type-badge">{{release.type}}</div>
            </div>
          </div>
        </div>
      </div>
      <MobilePaginationContainer
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
