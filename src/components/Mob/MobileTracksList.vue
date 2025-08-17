<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from "../../stores/spotify-store"
import MobileTrackItem from './MobileTrackItem.vue'

const spotifyStore = useSpotifyStore()
const tracks = ref([])
const loading = ref(false)

onMounted(async () => {
  await loadSampleTracks()
})

const loadSampleTracks = async () => {
  loading.value = true
  try {
    // Load top tracks as sample data
    await spotifyStore.fetchTopTracks('short_term')
    tracks.value = spotifyStore.getTopTracksShort.slice(0, 10) // Show first 10 tracks
  } catch (error) {
    console.error('Failed to load tracks:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mobile-tracks-list">
    <div class="list-header">
      <h3>Sample Tracks</h3>
      <p>Click tracks to add them to your queue</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading tracks...</p>
    </div>

    <div v-else-if="tracks.length > 0" class="tracks-container">
      <MobileTrackItem
        v-for="track in tracks"
        :key="track.id"
        :track="track"
        section-name="topTracks"
        parent-id="short_term"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
        </svg>
      </div>
      <h4>No tracks available</h4>
      <p>Try refreshing or check your connection</p>
    </div>
  </div>
</template>

<style scoped>
.mobile-tracks-list {
  width: 100%;
}

.list-header {
  margin-bottom: 20px;
  text-align: center;
}

.list-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.list-header p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

.tracks-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
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

.loading p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: #a0a0a0;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .list-header h3 {
    font-size: 16px;
  }

  .list-header p {
    font-size: 13px;
  }

  .tracks-container {
    gap: 10px;
  }
}
</style>
