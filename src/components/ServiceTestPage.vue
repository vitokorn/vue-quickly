<template>
  <div class="service-test-page">
    <div class="test-header">
      <h2>Multi-Service Music Platform Test</h2>
      <p>Test the new multi-service architecture</p>
    </div>

    <div class="test-sections">
      <!-- Service Selection Test -->
      <div class="test-section">
        <h3>Service Selection</h3>
        <div class="current-service-info">
          <p><strong>Current Service:</strong> {{ musicStore.currentServiceName }}</p>
          <p><strong>Authenticated:</strong> {{ musicStore.isAuthenticated ? 'Yes' : 'No' }}</p>
        </div>
        <ServiceSelector />
      </div>

      <!-- Data Fetching Test -->
      <div class="test-section">
        <h3>Data Fetching Test</h3>
        <div class="test-buttons">
          <button @click="testFetchTopTracks" :disabled="musicStore.isLoading">
            {{ musicStore.isLoading ? 'Loading...' : 'Fetch Top Tracks' }}
          </button>
          <button @click="testFetchTopArtists" :disabled="musicStore.isLoading">
            {{ musicStore.isLoading ? 'Loading...' : 'Fetch Top Artists' }}
          </button>
          <button @click="testSearch" :disabled="musicStore.isLoading">
            {{ musicStore.isLoading ? 'Loading...' : 'Test Search' }}
          </button>
        </div>
        
        <div v-if="musicStore.getTopTracksShort.length > 0" class="test-results">
          <h4>Top Tracks ({{ musicStore.getTopTracksShort.length }})</h4>
          <div class="track-list">
            <div v-for="track in musicStore.getTopTracksShort.slice(0, 3)" :key="track.id" class="track-item">
              <span class="service-badge">{{ track.service }}</span>
              <strong>{{ track.name }}</strong> - {{ track.artists[0]?.name }}
            </div>
          </div>
        </div>

        <div v-if="musicStore.getTopArtistsShort.length > 0" class="test-results">
          <h4>Top Artists ({{ musicStore.getTopArtistsShort.length }})</h4>
          <div class="artist-list">
            <div v-for="artist in musicStore.getTopArtistsShort.slice(0, 3)" :key="artist.id" class="artist-item">
              <span class="service-badge">{{ artist.service }}</span>
              <strong>{{ artist.name }}</strong>
            </div>
          </div>
        </div>

        <div v-if="musicStore.getSearchTracks.length > 0" class="test-results">
          <h4>Search Results ({{ musicStore.getSearchTracks.length }})</h4>
          <div class="search-results">
            <div v-for="track in musicStore.getSearchTracks.slice(0, 3)" :key="track.id" class="search-item">
              <span class="service-badge">{{ track.service }}</span>
              <strong>{{ track.name }}</strong> - {{ track.artists[0]?.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Service Capabilities Test -->
      <div class="test-section">
        <h3>Service Capabilities</h3>
        <div class="capabilities-grid">
          <div v-for="service in musicStore.availableServices" :key="service.type" class="capability-card">
            <h4>{{ service.name }}</h4>
            <div class="capability-list">
              <div class="capability-item">
                <span class="capability-name">Search:</span>
                <span class="capability-status">✅</span>
              </div>
              <div class="capability-item">
                <span class="capability-name">Playlists:</span>
                <span class="capability-status">✅</span>
              </div>
              <div class="capability-item">
                <span class="capability-name">User Library:</span>
                <span class="capability-status">✅</span>
              </div>
              <div class="capability-item">
                <span class="capability-name">Recommendations:</span>
                <span class="capability-status">{{ service.type === 'spotify' ? '✅' : '🚧' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Handling Test -->
      <div class="test-section">
        <h3>Error Handling Test</h3>
        <div class="error-test-buttons">
          <button @click="testUnimplementedService" class="error-test-btn">
            Test Unimplemented Service
          </button>
          <button @click="testInvalidSearch" class="error-test-btn">
            Test Invalid Search
          </button>
        </div>
        <div v-if="errorMessage" class="error-message">
          <strong>Error:</strong> {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMusicStore } from '../stores/music-store'
import ServiceSelector from './ServiceSelector.vue'

const musicStore = useMusicStore()
const errorMessage = ref('')

onMounted(async () => {
  await musicStore.initializeServices()
})

const testFetchTopTracks = async () => {
  try {
    errorMessage.value = ''
    await musicStore.fetchTopTracks('short_term')
  } catch (error) {
    errorMessage.value = error.message
  }
}

const testFetchTopArtists = async () => {
  try {
    errorMessage.value = ''
    await musicStore.fetchTopArtists('short_term')
  } catch (error) {
    errorMessage.value = error.message
  }
}

const testSearch = async () => {
  try {
    errorMessage.value = ''
    await musicStore.search('test')
  } catch (error) {
    errorMessage.value = error.message
  }
}

const testUnimplementedService = async () => {
  try {
    errorMessage.value = ''
    await musicStore.switchService('deezer')
    await musicStore.fetchTopTracks()
  } catch (error) {
    errorMessage.value = error.message
  }
}

const testInvalidSearch = async () => {
  try {
    errorMessage.value = ''
    await musicStore.search('')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<style scoped>
.service-test-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.test-header {
  text-align: center;
  margin-bottom: 3rem;
}

.test-header h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.test-header p {
  color: #666;
  font-size: 1.1rem;
}

.test-sections {
  display: grid;
  gap: 2rem;
}

.test-section {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
}

.test-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.current-service-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.current-service-info p {
  margin: 0.25rem 0;
}

.test-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.test-buttons button {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.test-buttons button:hover:not(:disabled) {
  background: #0056b3;
}

.test-buttons button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.test-results {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.test-results h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.track-list, .artist-list, .search-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.track-item, .artist-item, .search-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.service-badge {
  background: #007bff;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 500;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.capability-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.capability-card h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.capability-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.capability-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.capability-name {
  font-size: 0.9rem;
  color: #666;
}

.capability-status {
  font-size: 1rem;
}

.error-test-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.error-test-btn {
  padding: 0.75rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.error-test-btn:hover {
  background: #c82333;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .service-test-page {
    padding: 1rem;
  }
  
  .test-buttons, .error-test-buttons {
    flex-direction: column;
  }
  
  .capabilities-grid {
    grid-template-columns: 1fr;
  }
}
</style>
