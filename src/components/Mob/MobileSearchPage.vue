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
          <button class="view-toggle-btn" @click="toggleViewMode" :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Songs Section -->
      <div v-if="spotifyStore.getSearchTracks.length > 0" class="mobile-search-section">
        <h3 class="section-title">Songs</h3>
        <div :class="['releases-container', preferencesStore.viewMode]">
          <MobileTrackItem
            v-for="(track, index) in spotifyStore.getSearchTracks"
            :key="index"
            :track="track"
            :num="0"
            :view-mode="preferencesStore.viewMode"
            @click="handleTrackClick"
            @coverClick="handleCoverClick"
            @infoClick="handleInfoClick"
          />
        </div>
      </div>

      <!-- Artists Section -->
      <div v-if="spotifyStore.getSearchArtists.length > 0" class="mobile-search-section">
        <h3 class="section-title">Artists</h3>
        <div :class="['releases-container', preferencesStore.viewMode]">
          <div
            v-for="(artist, index) in spotifyStore.getSearchArtists"
            :key="index"
            class="song-item"
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
      <div v-if="spotifyStore.getSearchAlbums.length > 0" class="mobile-search-section">
        <h3 class="section-title">Albums</h3>
        <div :class="['releases-container', preferencesStore.viewMode]">
          <div
            v-for="(album, index) in spotifyStore.getSearchAlbums"
            :key="index"
            class="song-item"
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
      <div v-if="spotifyStore.getSearchPlaylists.length > 0" class="mobile-search-section">
        <h3 class="section-title">Playlists</h3>
        <div :class="['releases-container', preferencesStore.viewMode]">
          <div
            v-for="(playlist, index) in spotifyStore.getSearchPlaylists"
            :key="index"
            class="song-item"
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
import { usePreferencesStore } from '../../stores/preferences-store'
import { useAudioStore } from '../../stores/audio-store'
import MobileTrackItem from './MobileTrackItem.vue'

// Stores
const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()
const queueStore = useQueueStore()
const preferencesStore = usePreferencesStore()
const audioStore = useAudioStore()

// Local state
const searchQuery = ref('')

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
  preferencesStore.toggleViewMode()
}

const handleTrackClick = async (track, event) => {
  if (deeperStore.getIsGloballyLoading) return
  await deeperStore.getTrackDetails(track, 'search')
  queueStore.addToQueue(track)
}

const handleCoverClick = async (track, event) => {
  console.log('Cover clicked for:', track.name)
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    console.log('Playing audio preview for:', track.name)
    await audioStore.mobileToggleTrack(track.id, previewUrl)
  } else {
    console.log('No preview URL available for:', track.name)
  }
}

const handleInfoClick = async (track, event) => {
  console.log('Info clicked for:', track.name)
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

</style>
