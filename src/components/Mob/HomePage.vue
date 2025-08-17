<script setup>
import { ref } from 'vue'
import QueueDisplay from './QueueDisplay.vue'
import MobileTracksList from './MobileTracksList.vue'

const searchQuery = ref('')

const handleSearch = () => {
  // Handle search functionality
  console.log('Search query:', searchQuery.value)
}
</script>

<template>
  <!-- Search Bar -->
  <div class="search-container">
    <div class="search-bar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
      </svg>
      <input
          type="text"
          placeholder="Search artists, songs, albums..."
          class="search-input"
          v-model="searchQuery"
          @input="handleSearch"
      >
    </div>
  </div>

  <!-- Queue Display -->
  <QueueDisplay />

  <!-- Sample Tracks List -->
  <MobileTracksList />

  <!-- Top Tracks Section -->
  <div class="library-section">
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>
      </div>
      <h3 class="section-title">Top Tracks</h3>
      <span class="section-count">{{ topTracks.length }}</span>
    </div>

    <div class="tracks-list">
      <div
          v-for="track in topTracks.slice(0, 3)"
          :key="track.id"
          class="track-item"
          @click="handleTrackClick(track)"
      >
        <div class="track-image">
          <img
              v-if="track.album?.images && track.album.images[0]"
              :src="track.album.images[0].url"
              :alt="track.name"
          >
          <div v-else class="track-placeholder">
            <span>🎵</span>
          </div>
        </div>
        <div class="track-info">
          <h4 class="track-name">{{ track.name }}</h4>
          <p class="track-artist">{{ formatArtistNames(track.artists) }}</p>
        </div>
      </div>
      <div v-if="topTracks.length > 3" class="view-more-item" @click="handleViewMore('tracks')">
        <div class="view-more-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 12a.75.75 0 000-1.5h-3.75V6a.75.75 0 000-1.5h3.75v6.75z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="view-more-text">View all {{ topTracks.length }} tracks</span>
      </div>
    </div>
  </div>

  <!-- Top Artists Section -->
  <div class="library-section">
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="section-title">Top Artists</h3>
      <span class="section-count">{{ topArtists.length }}</span>
    </div>

    <div class="artists-grid">
      <div
          v-for="artist in topArtists.slice(0, 4)"
          :key="artist.id"
          class="artist-card"
          @click="handleArtistClick(artist)"
      >
        <div class="artist-image">
          <img
              v-if="artist.images && artist.images[0]"
              :src="artist.images[0].url"
              :alt="artist.name"
          >
          <div v-else class="artist-placeholder">
            <span>👤</span>
          </div>
        </div>
        <h4 class="artist-name">{{ artist.name }}</h4>
      </div>
      <div v-if="topArtists.length > 4" class="view-more-item grid-view-more" @click="handleViewMore('artists')">
        <div class="view-more-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 12a.75.75 0 000-1.5h-3.75V6a.75.75 0 000-1.5h3.75v6.75z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="view-more-text">View all</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

/* Search Bar Styles */
.search-container {
  width: 100%;
  box-sizing: border-box;
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
  padding: 0 16px 0 48px;
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

</style>
