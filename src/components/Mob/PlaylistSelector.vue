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
  <div class="mobile-playlist-selector">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
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
<!--        <button class="refresh-btn" @click="handleRefresh" :disabled="loading">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">-->
<!--            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />-->
<!--          </svg>-->
<!--        </button>-->
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

    <!-- Playlist List -->
    <div class="playlists-container">
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
.mobile-playlist-selector {
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
  width: 100%!important;
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

.playlists-container {
  width: 100%;
}

.playlists-container.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlists-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 0 4px;
}

.playlist-item {
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

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.playlist-item.selected {
  background: rgba(30, 215, 96, 0.2);
  border-color: rgba(30, 215, 96, 0.4);
}

/* Grid Item Styles */
.grid-item {
  flex-direction: column;
  padding: 12px;
  text-align: center;
  min-height: 180px;
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
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-lock-icon {
  width: 16px;
  height: 16px;
}

.grid-lock-icon.open {
  color: #1db954;
}

.grid-lock-icon.closed {
  color: #ff6b6b;
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
}

.playlist-cover {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.playlist-icon {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.playlist-info {
  flex: 1;
  min-width: 0;
  gap: 0px;
}

.playlist-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-details {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

.playlist-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.lock-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.lock-icon.open {
  color: #1db954;
}

.lock-icon.closed {
  color: #ff6b6b;
}

.status-text {
  font-size: 12px;
  color: #a0a0a0;
  font-weight: 500;
}

.playlist-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.playlist-arrow:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #a0a0a0;
  transition: color 0.2s ease;
}

.playlist-item:hover .arrow-icon {
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

/* Load More Button Styles */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 0 20px;
}

.load-more-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.load-more-button:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-1px);
}

.load-more-button:active {
  transform: translateY(0);
}

.load-more-icon {
  width: 16px;
  height: 16px;
}

/* Grid Load More Button */
.grid-load-more {
  grid-column: 1 / -1;
  margin-top: 16px;
}

.grid-load-more-button {
  max-width: 200px;
  width: auto;
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
.playlists-container.grid .pagination-container {
  grid-column: 1 / -1;
  margin-top: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.playlists-container.grid .pagination-button {
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

:root.metro .mobile-playlist-selector {
  font-family: 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif;
}

:root.metro .section-header {
  padding: 16px 20px 8px 20px;
}

:root.metro .section-header .section-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 24px;
  text-transform: none;
  letter-spacing: normal;
}

:root.metro .section-header p {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
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

/* Controls bar */
:root.metro .controls-container {
  padding: 0 20px;
}

:root.metro .view-toggle {
  background: transparent;
  border-radius: 0;
  padding: 0;
  gap: 0;
}

:root.metro .refresh-btn,
:root.metro .view-toggle-btn,
:root.metro .view-toggle-button {
  background: transparent;
  color: #cccccc;
  border: none;
  border-radius: 0;
  width: 40px;
  height: 40px;
  padding: 8px;
}

:root.metro .refresh-btn:hover,
:root.metro .view-toggle-btn:hover,
:root.metro .view-toggle-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .refresh-btn svg,
:root.metro .view-toggle-btn svg {
  width: 16px;
  height: 16px;
}

:root.metro .playlist-item {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 16px 20px;
  margin: 0 20px 8px 20px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

:root.metro .playlist-item:hover {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .playlist-item.selected {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .playlist-cover {
  background: #333333;
  border: none;
  border-radius: 0;
  width: 60px;
  height: 60px;
}

:root.metro .playlist-placeholder {
  background: #333333;
}

:root.metro .playlist-placeholder svg {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
}

:root.metro .playlist-name {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

:root.metro .playlist-owner {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .playlist-tracks {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
}

:root.metro .arrow-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

:root.metro .playlist-item:hover .arrow-icon {
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

:root.metro .playlist-type-badge {
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

:root.metro .grid-owner {
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

/* Cupertino liquid glass theme */
:root.cupertino .mobile-playlist-selector {
  background: linear-gradient(135deg, #e8f0ff 0%, #f8f9fb 40%, #ffe9f3 100%);
}

:root.cupertino .section-header {
  padding: 16px 20px 8px 20px;
}

:root.cupertino .section-header .section-title {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .section-header p {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .refresh-button {
  background: rgba(255, 255, 255, 0.45);
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .refresh-button:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
  transform: none;
}

:root.cupertino .refresh-icon {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .view-toggle {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.12);
}

:root.cupertino .view-toggle-button {
  background: transparent;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
}

:root.cupertino .view-toggle-button:hover {
  background: rgba(255, 255, 255, 0.6);
}

:root.cupertino .view-toggle-button.active {
  background: rgba(255, 255, 255, 0.75);
  color: rgba(0, 0, 0, 0.9);
}

:root.cupertino .view-icon {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .view-toggle-button.active .view-icon {
  color: rgba(0, 0, 0, 0.9);
}

:root.cupertino .search-input {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 24px;
  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.12);
}

:root.cupertino .search-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

:root.cupertino .search-input:focus {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.16);
}

:root.cupertino .search-icon {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .clear-button:hover {
  background: rgba(255, 255, 255, 0.6);
}

:root.cupertino .clear-icon {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .playlist-item {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .playlist-item:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px rgba(31, 38, 135, 0.16);
}

:root.cupertino .playlist-item.selected {
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .playlist-cover {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;
}

:root.cupertino .playlist-name {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .playlist-details {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .playlist-status {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .lock-icon.open {
  color: #2e7d32;
}

:root.cupertino .lock-icon.closed {
  color: #b71c1c;
}

:root.cupertino .status-text {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .playlist-arrow:hover {
  background: rgba(255, 255, 255, 0.6);
}

:root.cupertino .arrow-icon {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .playlist-item:hover .arrow-icon {
  color: rgba(0, 0, 0, 0.8);
}

:root.cupertino .grid-item {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .grid-item:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px rgba(31, 38, 135, 0.16);
}

:root.cupertino .grid-cover {
  border-radius: 12px;
}

:root.cupertino .grid-overlay {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

:root.cupertino .playlist-type-badge {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 10px;
  font-weight: 400;
  text-transform: none;
}

:root.cupertino .grid-name {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .grid-details {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .empty-search h4,
:root.cupertino .empty-state h4 {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .empty-search p,
:root.cupertino .empty-state p {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .empty-icon {
  color: rgba(0, 0, 0, 0.4);
}

:root.cupertino .pagination-container {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
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

:root.cupertino .pagination-info {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .show-more-item {
  background: rgba(255, 255, 255, 0.55) !important;
  border-color: rgba(255, 255, 255, 0.7) !important;
}

:root.cupertino .show-more-item:hover {
  background: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(255, 255, 255, 0.8) !important;
}

:root.cupertino .show-more-cover {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .show-more-text {
  color: rgba(0, 0, 0, 0.8) !important;
  font-weight: 600;
}

:root.cupertino .show-more-subtext {
  color: rgba(0, 0, 0, 0.6) !important;
}

:root.cupertino .show-more-grid-cover {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .show-more-grid-text {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}
</style>
