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
    <!-- Modern Search Bar -->
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

    <!-- Modern Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your music...</p>
    </div>

    <!-- Modern Content Sections -->
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
  padding: 0;
  max-width: 100%;
}

/* Modern Search Container */
.search-container {
  margin-bottom: 24px;
}

.search-bar {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-bar:focus-within {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--search-color);
  opacity: 0.6;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  color: var(--title-color);
  font-size: 16px;
  font-weight: 500;
  outline: none;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--search-color);
  opacity: 0.6;
}

/* Modern Loading State */
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
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid var(--active-tab);
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
  color: var(--search-color);
  margin: 0;
  opacity: 0.8;
}

/* Modern Home Sections */
.home-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 480px) {
  .search-bar {
    padding: 14px 16px;
    border-radius: 12px;
  }

  .search-input {
    font-size: 14px;
  }

  .loading-state {
    padding: 40px 16px;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    margin-bottom: 12px;
  }

  .loading-state p {
    font-size: 14px;
  }

  .home-sections {
    gap: 20px;
  }
}

/* Dark theme support */
:root.dark .search-bar {
  background: rgba(42, 46, 47, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .search-bar:focus-within {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:root.dark .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--active-tab);
}

:root.dark .home-section {
  background: rgba(42, 46, 47, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .home-section:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Dark-blue theme support */
:root.dark-blue .search-bar {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .search-bar:focus-within {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:root.dark-blue .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--active-tab);
}

:root.dark-blue .home-section {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .home-section:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* DQ theme support */
:root.dq .search-bar {
  background: rgba(28, 26, 45, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .search-bar:focus-within {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:root.dq .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--active-tab);
}

:root.dq .home-section {
  background: rgba(28, 26, 45, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .home-section:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}
</style>
