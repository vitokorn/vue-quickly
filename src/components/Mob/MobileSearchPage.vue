<template>
  <div class="mobile-search-page">
    <!-- Search Header -->
    <div class="search-header">
      <div class="search-input-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
          <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch"
          placeholder="Search for songs, artists, albums..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="clear-icon">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="spotifyStore.isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Searching...</p>
    </div>

    <!-- Search Results -->
    <div v-else-if="hasSearchResults" class="search-results">
      <!-- Results Header with View Toggle -->
      <div class="results-header">
        <div class="results-info">
          <h3 class="results-title">Search Results</h3>
          <p class="results-count">{{ totalResults }} results found</p>
        </div>
        <div class="header-actions">
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

      <!-- Songs Section -->
      <div v-if="spotifyStore.getSearchTracks.length > 0" class="search-section">
        <h3 class="section-title">Songs</h3>
        <div :class="['releases-container', viewMode]">
          <div 
            v-for="(track, index) in spotifyStore.getSearchTracks" 
            :key="index"
            class="search-item"
            @click="handleTrackClick(track, $event)"
          >
            <div class="item-cover">
              <img 
                :src="track.album?.images?.[0]?.url || '/default-album.png'" 
                :alt="track.name"
                class="cover-image"
              />
            </div>
            <div class="item-info">
              <div class="item-name">{{ track.name }}</div>
              <div class="item-artist">{{ track.artists.map(a => a.name).join(', ') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Artists Section -->
      <div v-if="spotifyStore.getSearchArtists.length > 0" class="search-section">
        <h3 class="section-title">Artists</h3>
        <div :class="['releases-container', viewMode]">
          <div 
            v-for="(artist, index) in spotifyStore.getSearchArtists" 
            :key="index"
            class="search-item"
            @click="handleArtistClick(artist, $event)"
          >
            <div class="item-cover">
              <img 
                :src="artist.images?.[0]?.url || '/default-artist.png'" 
                :alt="artist.name"
                class="cover-image"
              />
            </div>
            <div class="item-info">
              <div class="item-name">{{ artist.name }}</div>
              <div class="item-artist">{{ artist.genres?.slice(0, 2).join(', ') || 'Artist' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Albums Section -->
      <div v-if="spotifyStore.getSearchAlbums.length > 0" class="search-section">
        <h3 class="section-title">Albums</h3>
        <div :class="['releases-container', viewMode]">
          <div 
            v-for="(album, index) in spotifyStore.getSearchAlbums" 
            :key="index"
            class="search-item"
            @click="handleAlbumClick(album, $event)"
          >
            <div class="item-cover">
              <img 
                :src="album.images?.[0]?.url || '/default-album.png'" 
                :alt="album.name"
                class="cover-image"
              />
            </div>
            <div class="item-info">
              <div class="item-name">{{ album.name }}</div>
              <div class="item-artist">{{ album.artists.map(a => a.name).join(', ') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Playlists Section -->
      <div v-if="spotifyStore.getSearchPlaylists.length > 0" class="search-section">
        <h3 class="section-title">Playlists</h3>
        <div :class="['releases-container', viewMode]">
          <div 
            v-for="(playlist, index) in spotifyStore.getSearchPlaylists" 
            :key="index"
            class="search-item"
            @click="handlePlaylistClick(playlist, $event)"
          >
            <div class="item-cover">
              <img 
                :src="playlist.images?.[0]?.url || '/default-playlist.png'" 
                :alt="playlist.name"
                class="cover-image"
              />
            </div>
            <div class="item-info">
              <div class="item-name">{{ playlist.name }}</div>
              <div class="item-artist">{{ playlist.owner?.display_name || 'Playlist' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery && !spotifyStore.isLoading" class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <h3 class="empty-state-title">No results found</h3>
      <p class="empty-state-text">Try searching for something else</p>
    </div>

    <!-- Welcome State -->
    <div v-else class="empty-state">
      <div class="empty-state-icon">🎵</div>
      <h3 class="empty-state-title">Search Music</h3>
      <p class="empty-state-text">Find your favorite songs, artists, albums, and playlists</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useQueueStore } from '../../stores/queue-store'

// Stores
const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()
const queueStore = useQueueStore()

// Local state
const searchQuery = ref('')
const viewMode = ref('list') // 'list' or 'grid'

// Computed
const hasSearchResults = computed(() => {
  return spotifyStore.getSearchTracks.length > 0 || 
         spotifyStore.getSearchArtists.length > 0 || 
         spotifyStore.getSearchAlbums.length > 0 || 
         spotifyStore.getSearchPlaylists.length > 0
})

const totalResults = computed(() => {
  return spotifyStore.getSearchTracks.length + 
         spotifyStore.getSearchArtists.length + 
         spotifyStore.getSearchAlbums.length + 
         spotifyStore.getSearchPlaylists.length
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    spotifyStore.search(searchQuery.value)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  spotifyStore.clearSearchResults()
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const handleTrackClick = async (track, event) => {
  if (deeperStore.getIsGloballyLoading) return
  await deeperStore.getTrackDetails(track, 'search')
  queueStore.addToQueue(track)
}

const handleArtistClick = async (artist, event) => {
  if (deeperStore.getIsGloballyLoading) return
  await deeperStore.getArtistDetails(artist, 'search')
}

const handleAlbumClick = async (album, event) => {
  if (deeperStore.getIsGloballyLoading) return
  await deeperStore.getAlbumDetails(album, 'search')
}

const handlePlaylistClick = async (playlist, event) => {
  if (deeperStore.getIsGloballyLoading) return
  await deeperStore.getPlaylistDetails(playlist, 'search')
}
</script>

<style scoped>
.mobile-search-page {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
}

.search-header {
  margin-bottom: 30px;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 12px 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 12px;
}

.clear-icon {
  width: 16px;
  height: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}


.loading-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 500;
}


.search-results {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.results-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.results-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.results-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}



.search-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}



.search-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.releases-container.grid .search-item {
  flex-direction: column;
  text-align: center;
  gap: 12px;
  padding: 12px;
}

.releases-container.list .search-item {
  flex-direction: row;
  text-align: left;
}

.search-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.item-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.releases-container.grid .item-cover {
  width: 100%;
  height: 120px;
  border-radius: 12px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.releases-container.grid .item-info {
  width: 100%;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.releases-container.grid .item-name {
  font-size: 14px;
  white-space: normal;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-artist {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.releases-container.grid .item-artist {
  font-size: 12px;
  white-space: normal;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
}

.empty-state-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 300px;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .mobile-search-page {
    padding: 16px;
  }
  
  .search-item {
    padding: 12px;
    gap: 12px;
  }
  
  .item-cover {
    width: 50px;
    height: 50px;
  }
  
  .item-name {
    font-size: 15px;
  }
  
  .item-artist {
    font-size: 13px;
  }
}
</style>
