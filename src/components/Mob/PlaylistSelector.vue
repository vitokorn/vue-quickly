<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  playlists: {
    type: Array,
    default: () => []
  },
  selectedPlaylist: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search playlists...'
  },
  title: {
    type: String,
    default: 'Select a playlist'
  },
  itemsPerPage: {
    type: Number,
    default: 50
  }
})

const emit = defineEmits(['playlist-select', 'search', 'load-more', 'playlist-arrow-click'])

const searchTerm = ref('')
const viewMode = ref('list') // 'list' or 'grid'
const currentPage = ref(1)
const showPagination = ref(false)

const filteredPlaylists = computed(() => {
  if (!searchTerm.value) {
    return props.playlists
  }
  return props.playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const displayedPlaylists = computed(() => {
  const startIndex = (currentPage.value - 1) * props.itemsPerPage
  const endIndex = startIndex + props.itemsPerPage
  return filteredPlaylists.value.slice(startIndex, endIndex)
})

const hasMorePlaylists = computed(() => {
  return currentPage.value < totalPages.value
})

const showLoadMoreItem = computed(() => {
  return hasMorePlaylists.value && filteredPlaylists.value.length > props.itemsPerPage && !showPagination.value
})

const totalPages = computed(() => {
  return Math.ceil(filteredPlaylists.value.length / props.itemsPerPage)
})

const handlePlaylistSelect = (playlistId, event) => {
  emit('playlist-select', playlistId, event)
}

const handlePlaylistArrowClick = (playlist) => {
  console.log('PlaylistSelector: Arrow clicked for playlist:', playlist)
  console.log('Playlist name:', playlist?.name)
  console.log('Playlist id:', playlist?.id)
  console.log('Playlist type:', typeof playlist)

  if (!playlist || !playlist.id) {
    console.error('Invalid playlist data:', playlist)
    return
  }

  // Emit a special event for arrow click to show playlist details
  emit('playlist-arrow-click', playlist)
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
</script>

<template>
  <div class="mobile-top-tracks">
    <!-- Modern Header -->
    <div class="">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">{{ title }}</h2>
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
      <div class="search-bar">
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
          <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Playlist List -->
    <div class="my-2">
      <div v-if="filteredPlaylists.length === 0 && searchTerm" class="empty-search">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
          </svg>
        </div>
        <h4>No playlists found</h4>
        <p>Try adjusting your search terms</p>
      </div>

      <div v-else-if="playlists.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
        <h4>No playlists available</h4>
        <p>Create or import playlists to get started</p>
      </div>

      <div v-else class="playlists-container" :class="viewMode">
                        <!-- List View -->
        <template v-if="viewMode === 'list'">
          <div
            v-for="playlist in displayedPlaylists"
            :key="playlist.id"
            @click="handlePlaylistSelect(playlist.id, $event)"
            class="playlist-item list-item"
            :class="{ 'selected': selectedPlaylist === playlist.id }"
          >
            <div v-if="playlist.images && playlist.images.length > 0">
              <img style="height: 55px;width: 55px" :src="playlist.images[0].url" alt="playlist image" />
            </div>
            <div class="playlist-cover" v-else>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="playlist-icon">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
              </svg>
            </div>
            <div class="playlist-info">
              <div class="playlist-name">{{ playlist.name }}</div>
              <p class="playlist-details">
                <span v-if="playlist.tracks && playlist.tracks.length > 0">
                  {{ playlist.tracks.length }} tracks
                </span>
                <span v-if="playlist.owner">{{playlist.owner.display_name}}</span>
                <span v-else>Spotify</span>
              </p>
              <div class="playlist-status">
                <svg v-if="playlist.public" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="lock-icon open">
                  <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9a.75.75 0 010 1.5h-9a1.5 1.5 0 00-1.5 1.5v6.75a1.5 1.5 0 001.5 1.5h12.75a1.5 1.5 0 001.5-1.5v-6.75a1.5 1.5 0 00-1.5-1.5h-3a.75.75 0 010-1.5h3z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="lock-icon closed">
                  <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                </svg>
                <span class="status-text">{{ playlist.public ? 'Public' : 'Private' }}</span>
              </div>
            </div>
            <div class="playlist-arrow" @click.stop="handlePlaylistArrowClick(playlist)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Show More Item for List View -->
          <div
            v-if="showLoadMoreItem"
            @click="handleLoadMoreClick"
            class="playlist-item list-item show-more-item"
          >
            <div class="playlist-cover show-more-cover">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="show-more-icon">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="playlist-info">
              <div class="playlist-name show-more-text">Show More Playlists</div>
              <p class="playlist-details show-more-subtext">
                {{ filteredPlaylists.length - displayedPlaylists.length }} more playlists available
              </p>
            </div>
            <div class="playlist-arrow">
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
            v-for="playlist in displayedPlaylists"
            :key="playlist.id"
            @click="handlePlaylistSelect(playlist.id, $event)"
            class="playlist-item grid-item"
            :class="{ 'selected': selectedPlaylist === playlist.id }"
          >
            <div class="grid-cover">
              <div v-if="playlist.images && playlist.images.length > 0">
                <img :src="playlist.images[0].url" alt="playlist image" />
              </div>
              <div class="playlist-cover" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="playlist-icon">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
                </svg>
              </div>
              <div class="grid-overlay">
                <svg v-if="playlist.public" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="grid-lock-icon open">
                  <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9a.75.75 0 010 1.5h-9a1.5 1.5 0 00-1.5 1.5v6.75a1.5 1.5 0 001.5 1.5h12.75a1.5 1.5 0 001.5-1.5v-6.75a1.5 1.5 0 00-1.5-1.5h-3a.75.75 0 010-1.5h3z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="grid-lock-icon closed">
                  <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="grid-info">
              <div class="grid-name">{{ playlist.name }}</div>
              <div class="grid-details">
                <span v-if="playlist.tracks && playlist.tracks.length > 0">
                  {{ playlist.tracks.length }} tracks
                </span>
                <span v-else>Playlist</span>
              </div>
            </div>
          </div>

          <!-- Show More Item for Grid View -->
          <div
            v-if="showLoadMoreItem"
            @click="handleLoadMoreClick"
            class="playlist-item grid-item show-more-item"
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
              <div class="grid-name show-more-text">{{ filteredPlaylists.length - displayedPlaylists.length }} more</div>
              <div class="grid-details show-more-subtext">playlists</div>
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

</style>
