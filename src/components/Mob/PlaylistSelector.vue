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
  }
})

const emit = defineEmits(['playlist-select', 'search'])

const searchTerm = ref('')
const viewMode = ref('list') // 'list' or 'grid'

const filteredPlaylists = computed(() => {
  if (!searchTerm.value) {
    return props.playlists
  }
  return props.playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const handlePlaylistSelect = (playlistId, event) => {
  emit('playlist-select', playlistId, event)
}

const handleSearch = (event) => {
  searchTerm.value = event.target.value
  emit('search', event)
}

const clearSearch = () => {
  searchTerm.value = ''
  emit('search', { target: { value: '' } })
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}
</script>

<template>
  <div class="mobile-playlist-selector">
    <!-- Header -->
    <div class="selector-header">
      <h3>{{ title }}</h3>
      <p v-if="playlists.length > 0">{{ playlists.length }} playlists available</p>
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
      
      <!-- View Mode Toggle -->
      <div class="view-toggle">
        <button 
          @click="toggleViewMode" 
          class="view-toggle-button"
          :class="{ 'active': viewMode === 'list' }"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="view-icon">
            <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          @click="toggleViewMode" 
          class="view-toggle-button"
          :class="{ 'active': viewMode === 'grid' }"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="view-icon">
            <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
          </svg>
        </button>
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
            v-for="playlist in filteredPlaylists"
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
                <span>{{playlist.owner.display_name}}</span>
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
            <div class="playlist-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Grid View -->
        <template v-else>
          <div
            v-for="playlist in filteredPlaylists"
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

.selector-header {
  margin-bottom: 24px;
  text-align: center;
}

.selector-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.selector-header p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
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

.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.view-toggle-button {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-toggle-button.active {
  background: rgba(255, 255, 255, 0.2);
}

.view-icon {
  width: 18px;
  height: 18px;
  color: #a0a0a0;
}

.view-toggle-button.active .view-icon {
  color: #ffffff;
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
</style>
