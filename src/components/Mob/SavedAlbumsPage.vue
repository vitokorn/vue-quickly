<template>
  <div class="saved-albums-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your saved albums...</p>
    </div>

    <!-- Content -->
    <div v-else class="saved-albums-content">
      <div class="albums-section">
        <h2 class="section-title">Your Saved Albums</h2>
        <MobileSavedAlbums />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import MobileSavedAlbums from './MobileSavedAlbums.vue'
import MobileDeeperAlbum from './MobileDeeperAlbum.vue'

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)

// Methods
const loadSavedAlbumsContent = async () => {
  loading.value = true
  try {
    // The MobileSavedAlbums component handles its own data loading
    // This is just for the page-level loading state
  } catch (error) {
    console.error('Failed to load saved albums:', error)
  } finally {
    loading.value = false
  }
}

// Load content on mount
onMounted(() => {
  loadSavedAlbumsContent()
})
</script>

<style scoped>

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
  border: 3px solid var(--search-color);
  border-top: 3px solid var(--active-tab);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.saved-albums-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.albums-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0;
  padding: 0 4px;
}

@media (max-width: 480px) {
  .saved-albums-page {
    padding: 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .saved-albums-content {
    gap: 24px;
  }
}
</style>
