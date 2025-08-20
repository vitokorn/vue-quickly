<script setup>
import { ref, computed } from 'vue'
import { useAudioStore } from '../../stores/audio-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useMediaDisplay } from "../../composables/useMediaDisplay.js"
import { useVisibilityManager } from "../../composables/useVisibilityManager"

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
const visibilityManager = useVisibilityManager()

const searchTerm = ref('')
const viewMode = ref('grid') // 'list' or 'grid'
const currentPage = ref(1)
const showPagination = ref(false)
const loading = ref(false)

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

const hasMoreReleases = computed(() => {
  return currentPage.value < totalPages.value
})

const showLoadMoreItem = computed(() => {
  return hasMoreReleases.value && filteredReleases.value.length > props.itemsPerPage && !showPagination.value
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

const handleDeeperAlbumClick = (release, event) => {
  event.stopPropagation() // Prevent triggering the main click event

  // Add album to deeper store for newReleases section
  const albumData = {
    ...release,
    type: 'album',
    parentKey: 'releaseSelector'
  }

  deeperStore.addToSection('newReleases', albumData)
  deeperStore.setCurrentSection('newReleases')

  // Show the deeper album component using visibility manager
  const playlistKey = `deeperalbum_${release.id}__p:releaseSelector__`
  visibilityManager.showComponent(playlistKey)

  // Show the deeper album component
  console.log('Showing deeper album for:', release.name)
}

const handleSearch = (event) => {
  searchTerm.value = event.target.value
  resetPagination()
  emit('search', event)
}

const clearSearch = () => {
  searchTerm.value = ''
  resetPagination()
  emit('search', { target: { value: '' } })
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const handleLoadMoreClick = () => {
  showPagination.value = true
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
  showPagination.value = false
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
  <div class="mobile-release-selector">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="section-title">{{ title }}</h3>
      <div class="action-buttons">
        <button class="view-toggle-btn" @click="toggleViewMode" :title="viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'">
          <svg v-if="viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18A2.25 2.25 0 018.25 20H6A2.25 2.25 0 013.75 17.75v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18A2.25 2.25 0 0118.25 20h-2.25A2.25 2.25 0 0113.75 17.75v-2.25z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>
        <button class="refresh-btn" @click="handleRefresh" :disabled="loading" title="Refresh releases">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search and View Controls -->
    <div class="controls-container">
      <div class="search-container">
        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
            <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
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
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
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
            <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
          </svg>
        </div>
        <h4>No releases found</h4>
        <p>Try adjusting your search terms</p>
      </div>

      <div v-else-if="releases.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
          </svg>
        </div>
        <h4>No releases available</h4>
        <p>Check back later for new releases</p>
      </div>

      <div v-else class="releases-container" :class="viewMode">
        <!-- List View -->
        <template v-if="viewMode === 'list'">
          <div
            v-for="release in displayedReleases"
            :key="release.id"
            @click="handleReleaseClick(release, $event)"
            class="release-item list-item"
            :class="{
              'selected': selectedRelease === release.id,
              'playing': isReleasePlaying(release),
              'has-preview': getReleasePreviewUrl(release)
            }"
          >
            <div v-if="release.images && release.images[0]">
              <img style="height: 55px;width: 55px" :src="release.images[0].url" :alt="release.name" />
            </div>
            <div class="release-cover" v-else>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="release-icon">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="release-info">
              <div class="release-name">{{ release.name }}</div>
              <p class="release-details">
                <span>{{ formatArtistNames(release.artists) }}</span>
                <span v-if="release.release_date">{{ formatReleaseDate(release.release_date) }}</span>
              </p>
              <div class="release-type">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
                </svg>
                <span class="type-text">{{ release.album_type || 'Album' }}</span>
              </div>
              <!-- Preview indicator -->
              <div v-if="getReleasePreviewUrl(release)" class="preview-indicator">
                <svg v-if="isReleasePlaying(release)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="playing-icon">
                  <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="play-icon">
                  <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <!-- Three dots menu button -->
            <button
              class="three-dots-button"
              @click="handleDeeperAlbumClick(release, $event)"
              title="More options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="three-dots-icon">
                <path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="release-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Show More Item for List View -->
          <div
            v-if="showLoadMoreItem"
            @click="handleLoadMoreClick"
            class="release-item list-item show-more-item"
          >
            <div class="release-cover show-more-cover">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="show-more-icon">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="release-info">
              <div class="release-name show-more-text">Show More Releases</div>
              <p class="release-details show-more-subtext">
                {{ filteredReleases.length - displayedReleases.length }} more releases available
              </p>
            </div>
            <div class="release-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="showPagination" class="pagination-container">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-button"
            >
              Previous
            </button>
            <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-button"
            >
              Next
            </button>
          </div>
        </template>

        <!-- Grid View -->
        <template v-else>
          <div
            v-for="release in displayedReleases"
            :key="release.id"
            @click="handleReleaseClick(release, $event)"
            class="release-item grid-item"
            :class="{
              'selected': selectedRelease === release.id,
              'playing': isReleasePlaying(release),
              'has-preview': getReleasePreviewUrl(release)
            }"
          >
            <div class="grid-cover" :class="getDisplayClass(release)">
              <div v-if="release.images && release.images[0]">
                <img :src="release.images[0].url" :alt="release.name" />
              </div>
              <div class="release-cover" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="release-icon">
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="grid-overlay">
                <span class="release-type-badge">{{ release.album_type || 'Album' }}</span>
              </div>
            </div>
            <div class="grid-info">
              <div class="grid-name">{{ release.name }}</div>
              <div class="grid-details">
                <span>{{ formatArtistNames(release.artists) }}</span>
                <span v-if="release.release_date">{{ formatReleaseDate(release.release_date) }}</span>
              </div>
            </div>
            <!-- Three dots menu button for grid view -->
            <button
              class="grid-three-dots-button"
              @click="handleDeeperAlbumClick(release, $event)"
              title="More options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="three-dots-icon">
                <path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Show More Item for Grid View -->
          <div
            v-if="showLoadMoreItem"
            @click="handleLoadMoreClick"
            class="release-item grid-item show-more-item"
          >
            <div class="grid-cover show-more-grid-cover">
              <div class="show-more-grid-content">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="show-more-grid-icon">
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
                </svg>
                <div class="show-more-grid-text">Show More</div>
              </div>
            </div>
            <div class="grid-info">
              <div class="grid-name show-more-text">{{ filteredReleases.length - displayedReleases.length }} more</div>
              <div class="grid-details show-more-subtext">releases</div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="showPagination" class="pagination-container">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-button"
            >
              Previous
            </button>
            <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-button"
            >
              Next
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-release-selector {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
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

.controls-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.search-container {
  flex: 1;
}



.search-bar {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #a0a0a0;
  z-index: 1;
}

.search-input {
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 0 48px 0 48px;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #a0a0a0;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.clear-button {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.clear-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.clear-icon {
  width: 16px;
  height: 16px;
  color: #a0a0a0;
}

.releases-container {
  width: 100%;
}

.releases-container.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.releases-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 0 4px;
}

.release-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 16px;
}

.release-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.release-item.selected {
  background: rgba(30, 215, 96, 0.2);
  border-color: rgba(30, 215, 96, 0.4);
}

.release-item.playing {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.4);
}

.release-item.has-preview {
  cursor: pointer;
}

.release-item.has-preview:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Grid Item Styles */
.grid-item {
  flex-direction: column;
  padding: 12px;
  text-align: center;
  min-height: 180px;
  position: relative;
}

.grid-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.grid-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.grid-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.release-type-badge {
  font-size: 10px;
  color: #ffffff;
  font-weight: 600;
  text-transform: uppercase;
}

.grid-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.grid-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.grid-details {
  font-size: 12px;
  color: #a0a0a0;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.release-cover {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.release-icon {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.release-info {
  flex: 1;
  min-width: 0;
  gap: 0px;
  margin-right: 8px;
}

.release-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.release-details {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.release-type {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.type-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #1db954;
}

.type-text {
  font-size: 12px;
  color: #a0a0a0;
  font-weight: 500;
  text-transform: uppercase;
}

/* Preview indicator styles */
.preview-indicator {
  position: absolute;
  top: 14px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.play-icon,
.playing-icon {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

.playing-icon {
  color: #1db954;
}

.grid-preview-indicator {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.grid-preview-indicator .play-icon,
.grid-preview-indicator .playing-icon {
  width: 14px;
  height: 14px;
  color: #ffffff;
}

.grid-preview-indicator .playing-icon {
  color: #1db954;
}

/* Three dots button styles */
.three-dots-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;
}

.three-dots-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.three-dots-icon {
  width: 20px;
  height: 20px;
  color: #a0a0a0;
  transition: color 0.3s ease;
}

.three-dots-button:hover .three-dots-icon {
  color: #ffffff;
}

/* Grid three dots button */
.grid-three-dots-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 32%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  backdrop-filter: blur(4px);
}

.grid-three-dots-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.grid-three-dots-button .three-dots-icon {
  width: 12px;
  height: 12px;
  color: #ffffff;
}

.release-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #a0a0a0;
  transition: color 0.2s ease;
}

.release-item:hover .arrow-icon {
  color: #ffffff;
}

.empty-search,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #a0a0a0;
  margin-bottom: 16px;
}

.empty-search h4,
.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.empty-search p,
.empty-state p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 0 20px;
}

.pagination-button {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;
}

.pagination-button:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-1px);
}

.pagination-button:disabled {
  background: rgba(102, 126, 234, 0.05);
  color: #a0a0a0;
  cursor: not-allowed;
  border-color: rgba(102, 126, 234, 0.1);
}

.pagination-button:disabled:hover {
  transform: none;
}

.pagination-info {
  font-size: 14px;
  color: #a0a0a0;
  font-weight: 500;
}

/* Grid Pagination Specific Styles */
.releases-container.grid .pagination-container {
  grid-column: 1 / -1;
  margin-top: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.releases-container.grid .pagination-button {
  min-width: 80px;
  padding: 8px 12px;
  font-size: 13px;
}

/* Show More Item Styles */
.show-more-item {
  background: rgba(102, 126, 234, 0.1) !important;
  border-color: rgba(102, 126, 234, 0.3) !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.show-more-item:hover {
  background: rgba(102, 126, 234, 0.15) !important;
  border-color: rgba(102, 126, 234, 0.5) !important;
  transform: translateY(-1px);
}

.show-more-cover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.show-more-icon {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.show-more-text {
  color: #667eea !important;
  font-weight: 600;
}

.show-more-subtext {
  color: #a0a0a0 !important;
}

/* Grid Show More Styles */
.show-more-grid-cover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.show-more-grid-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  gap: 8px;
}

.show-more-grid-icon {
  width: 32px;
  height: 32px;
  color: #ffffff;
}

.show-more-grid-text {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

:root.metro .mobile-release-selector {
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

/* Controls */
:root.metro .controls-container { padding: 0 20px; }

:root.metro .view-toggle-btn,
:root.metro .refresh-btn {
  background: transparent;
  color: #cccccc;
  border: none;
  border-radius: 0;
  width: 40px;
  height: 40px;
  padding: 8px;
}

:root.metro .view-toggle-btn:hover,
:root.metro .refresh-btn:hover { 
  background: rgba(255, 255, 255, 0.1); 
  transform: none; 
  border-color: transparent; 
}

:root.metro .view-toggle-btn svg,
:root.metro .refresh-btn svg { 
  width: 16px; 
  height: 16px; 
  color: rgba(255,255,255,0.8); 
}

:root.metro .release-item {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 16px 20px;
  margin: 0 20px 8px 20px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

:root.metro .release-item:hover {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .release-item.selected {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .release-cover {
  background: #333333;
  border: none;
  border-radius: 0;
  width: 60px;
  height: 60px;
}

:root.metro .release-placeholder {
  background: #333333;
}

:root.metro .release-placeholder svg {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
}

:root.metro .release-name {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

:root.metro .release-artists {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .release-type {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
}

:root.metro .arrow-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

:root.metro .release-item:hover .arrow-icon {
  color: white;
}

:root.metro .grid-item {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 12px;
  margin: 0;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

:root.metro .grid-item:hover {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .grid-cover {
  background: #333333;
  border: none;
  border-radius: 0;
}

:root.metro .grid-overlay {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0;
}

:root.metro .release-type-badge {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 10px;
  font-weight: 400;
  text-transform: none;
}

:root.metro .grid-name {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .grid-artists {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
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

:root.metro .pagination-container {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 16px 20px;
}

:root.metro .pagination-button {
  background: #1f1f1f;
  color: white;
  border: none;
  border-radius: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

:root.metro .pagination-button:hover:not(:disabled) {
  background: #2d2d2d;
  color: white;
}

:root.metro .pagination-button:disabled {
  background: #333333;
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
}

:root.metro .pagination-button.active {
  background: #0078d4;
  color: white;
  box-shadow: none;
}

:root.metro .pagination-info {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .show-more-item {
  background: #2d2d2d !important;
  border: none !important;
  border-left: 4px solid #0078d4 !important;
}

:root.metro .show-more-item:hover {
  background: #333333 !important;
  transform: none;
}

:root.metro .show-more-cover {
  background: #0078d4;
  border-radius: 0;
}

:root.metro .show-more-text {
  color: #0078d4 !important;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

:root.metro .show-more-subtext {
  color: rgba(255, 255, 255, 0.8) !important;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .show-more-grid-cover {
  background: #0078d4;
  border-radius: 0;
}

:root.metro .show-more-grid-text {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

/* Material Design 3 theme support */
:root.material .mobile-release-selector {
  background: #fafafa;
}

:root.material .selector-header h3 {
  color: #1d1b20;
  font-weight: 600;
}

:root.material .selector-header p { color: #49454f; }

:root.material .refresh-button {
  background: transparent;
  border: none;
  border-radius: 20px;
  width: 40px;
  height: 40px;
}

:root.material .refresh-button:hover { background: rgba(103, 80, 164, 0.08); }

:root.material .refresh-icon { color: #1d1b20; }

:root.material .view-toggle { background: transparent; padding: 0; gap: 8px; }

:root.material .view-toggle-button {
  border-radius: 20px;
  width: 40px;
  height: 40px;
}

:root.material .view-toggle-button:hover { background: rgba(103, 80, 164, 0.08); }

:root.material .view-toggle-button.active { background: rgba(103, 80, 164, 0.12); }

:root.material .view-icon { color: #1d1b20; }

:root.material .search-input {
  background: #e7e0ec;
  border: none;
  border-radius: 28px;
  color: #1d1b20;
}

:root.material .search-input::placeholder { color: #49454f; }

:root.material .search-input:focus {
  outline: 2px solid #6750a4;
  background: #ece6f0;
}

:root.material .clear-button:hover { background: rgba(103, 80, 164, 0.08); }

:root.material .clear-icon { color: #49454f; }

:root.material .release-item {
  background: #ffffff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
}

:root.material .release-item:hover { background: #f6f2fa; }

:root.material .release-item.selected { background: #eaddff; }

:root.material .release-item.playing { background: #f3edf7; }

:root.material .release-cover { background: #e7e0ec; border-radius: 12px; }

:root.material .release-name { color: #1d1b20; font-weight: 600; }

:root.material .release-details { color: #49454f; }

:root.material .type-icon { color: #6750a4; }

:root.material .type-text { color: #49454f; text-transform: none; }

:root.material .grid-cover { border-radius: 12px; }

:root.material .grid-overlay {
  background: rgba(231, 224, 236, 0.9);
  border-radius: 8px;
}

:root.material .release-type-badge { color: #49454f; font-weight: 600; }

:root.material .grid-name { color: #1d1b20; font-weight: 600; }

:root.material .grid-details { color: #49454f; }

:root.material .three-dots-button { border-radius: 20px; }

:root.material .three-dots-button:hover { background: rgba(103, 80, 164, 0.08); }

:root.material .three-dots-icon { color: #1d1b20; }

:root.material .grid-three-dots-button {
  background: rgba(0,0,0,0.6);
  border-radius: 12px;
}

:root.material .grid-three-dots-button:hover { background: rgba(0,0,0,0.7); }

:root.material .arrow-icon { color: #49454f; }

:root.material .release-item:hover .arrow-icon { color: #1d1b20; }

:root.material .pagination-container { background: transparent; padding: 16px 20px; }

:root.material .pagination-button {
  background: #eaddff;
  color: #21005d;
  border: none;
  border-radius: 20px;
}

:root.material .pagination-button:hover { background: #d0bcff; }

:root.material .pagination-button:disabled {
  background: #e6e0e9;
  color: #79747e;
}

:root.material .pagination-info { color: #49454f; }

:root.material .show-more-item { background: #f3edf7 !important; border: none !important; }

:root.material .show-more-cover { background: #6750a4; border-radius: 12px; }

:root.material .show-more-text { color: #6750a4 !important; font-weight: 600; }

:root.material .show-more-subtext { color: #49454f !important; }

/* Windows Aero theme text color adjustments */
:root.aero .selector-header h3 { color: #ffffff; }
:root.aero .selector-header p { color: rgba(255, 255, 255, 0.85); }

:root.aero .release-name,
:root.aero .grid-name { color: #ffffff; }

:root.aero .release-details,
:root.aero .grid-details,
:root.aero .type-text,
:root.aero .pagination-info { color: rgba(255, 255, 255, 0.85); }

:root.aero .three-dots-icon,
:root.aero .arrow-icon,
:root.aero .search-icon,
:root.aero .clear-icon,
:root.aero .view-icon { color: rgba(255, 255, 255, 0.85); }

/* Cupertino liquid glass theme */
:root.cupertino .mobile-release-selector {
  background: linear-gradient(135deg, #e8f0ff 0%, #f8f9fb 40%, #ffe9f3 100%);
}

:root.cupertino .section-header {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 30px rgba(31, 38, 135, 0.12);
  border-radius: 12px;
  padding: 12px 16px;
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
}

:root.cupertino .view-toggle-btn,
:root.cupertino .refresh-btn {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .view-toggle-btn:hover,
:root.cupertino .refresh-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
  transform: none;
}

:root.cupertino .view-toggle-btn svg,
:root.cupertino .refresh-btn svg { 
  color: rgba(0, 0, 0, 0.6); 
}

:root.cupertino .controls-container { gap: 12px; }

:root.cupertino .search-bar .search-icon { color: rgba(0, 0, 0, 0.6); }

:root.cupertino .search-input {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 24px;
  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.12);
}

:root.cupertino .search-input::placeholder { color: rgba(0, 0, 0, 0.5); }

:root.cupertino .search-input:focus {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.16);
}

:root.cupertino .clear-button:hover { background: rgba(255, 255, 255, 0.6); }
:root.cupertino .clear-icon { color: rgba(0, 0, 0, 0.6); }

:root.cupertino .release-item {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .release-item:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px rgba(31, 38, 135, 0.16);
}

:root.cupertino .release-item.selected { background: rgba(255, 255, 255, 0.75); }

:root.cupertino .release-cover { background: rgba(255, 255, 255, 0.55); border: 1px solid rgba(255,255,255,0.7); }

:root.cupertino .release-name,
:root.cupertino .grid-name { color: rgba(0, 0, 0, 0.8); font-weight: 600; }

:root.cupertino .release-details,
:root.cupertino .grid-details { color: rgba(0, 0, 0, 0.6); }

:root.cupertino .type-icon { color: #2e7d32; }
:root.cupertino .type-text { color: rgba(0, 0, 0, 0.6); text-transform: none; }

:root.cupertino .three-dots-button { border-radius: 12px; }
:root.cupertino .three-dots-button:hover { background: rgba(255, 255, 255, 0.6); }
:root.cupertino .three-dots-icon { color: rgba(0, 0, 0, 0.6); }

:root.cupertino .grid-cover { border-radius: 12px; }
:root.cupertino .grid-overlay { background: rgba(255, 255, 255, 0.8); border-radius: 8px; }

:root.cupertino .releases-container.grid .pagination-container {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .pagination-button {
  background: rgba(255, 255, 255, 0.45);
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .pagination-button:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .pagination-button:disabled {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.4);
}

:root.cupertino .pagination-info { color: rgba(0, 0, 0, 0.6); }

:root.cupertino .empty-search h4,
:root.cupertino .empty-state h4 { color: rgba(0, 0, 0, 0.8); font-weight: 600; }

:root.cupertino .empty-search p,
:root.cupertino .empty-state p { color: rgba(0, 0, 0, 0.6); }

:root.cupertino .empty-icon { color: rgba(0, 0, 0, 0.4); }
</style>
