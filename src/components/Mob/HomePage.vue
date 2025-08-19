<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useAudioStore } from '../../stores/audio-store'
import { useQueueStore } from '../../stores/queue-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'
import MobileTopTracks from './MobileTopTracks.vue'
import MobileTopArtists from './MobileTopArtists.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'
import MobileDeeperArtist from './MobileDeeperArtist.vue'
import QueueDisplay from './QueueDisplay.vue'
import MobileTracksList from './MobileTracksList.vue'

const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Composables
const { selectedItem, setSelectedItem } = useSelection()

// Local state
const searchQuery = ref('')
const loading = ref(false)

// Methods
const handleSearch = () => {
  // Handle search functionality
  console.log('Search query:', searchQuery.value)
}

const loadHomeContent = async () => {
  loading.value = true
  try {
    // Load initial data for homepage
    await Promise.all([
      spotifyStore.fetchTopTracks('short_term'),
      spotifyStore.fetchTopArtists('short_term')
    ])
  } catch (error) {
    console.error('Failed to load home content:', error)
  } finally {
    loading.value = false
  }
}

// Load content on mount
onMounted(() => {
  loadHomeContent()
})
</script>

<template>
  <div class="home-page">
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

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your music...</p>
    </div>

    <!-- Content Sections -->
    <div v-else class="home-sections">
      <!-- Top Tracks Section -->
      <div class="home-section">
        <MobileTopTracks />
      </div>

      <!-- Top Artists Section -->
      <div class="home-section">
        <MobileTopArtists />
      </div>
    </div>
    
    <!-- Mobile Deeper Tracks Component -->
    <MobileDeeperTracks
      v-for="track in deeperStore.getSectionData('topTracks')"
      :key="track.id"
      :d="track"
      :num="3"
    />
    
    <!-- Mobile Deeper Artist Component -->
    <MobileDeeperArtist
      v-for="artist in deeperStore.getSectionData('topArtists')"
      :key="artist.id"
      :d="artist"
      :num="2"
    />
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

/* Search Bar Styles */
.search-container {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 24px;
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 16px;
  color: #a0a0a0;
  margin: 0;
}

/* Home Sections */
.home-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.home-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 480px) {
  .home-page {
    padding: 16px;
  }

  .search-container {
    margin-bottom: 20px;
  }

  .home-sections {
    gap: 24px;
  }

  .home-section {
    padding: 16px;
  }

  .loading-state {
    padding: 40px 16px;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
  }

  .loading-state p {
    font-size: 14px;
  }
}
</style>
