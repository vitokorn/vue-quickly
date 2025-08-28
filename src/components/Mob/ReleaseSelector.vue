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
  <div class="mobile-top-tracks">
    <!-- Modern Header -->
    <div class="">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">New Releases | {{ releases.length }} items</h2>
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
  </div>
</template>

<style scoped>

</style>
