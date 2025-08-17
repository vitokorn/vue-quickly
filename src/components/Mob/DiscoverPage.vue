<template>
  <div class="discover-page">
    <!-- Discover Header -->
    <div class="discover-header">
      <h2 class="discover-title">Discover</h2>
      <p class="discover-subtitle">Find new music and artists</p>
    </div>

    <!-- Spotify Playlists Section -->
    <div class="discover-section">
      <div class="section-header">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
        <h3 class="section-title">Spotify Playlists</h3>
      </div>
      
      <div class="playlists-grid">
        <div 
          v-for="playlist in spotifyPlaylists" 
          :key="playlist.id"
          class="playlist-card"
          @click="handlePlaylistClick(playlist)"
        >
          <div class="playlist-image">
            <img 
              v-if="playlist.images && playlist.images[0]" 
              :src="playlist.images[0].url" 
              :alt="playlist.name"
            >
            <div v-else class="playlist-placeholder">
              <span>🎵</span>
            </div>
          </div>
          <div class="playlist-info">
            <h4 class="playlist-name">{{ playlist.name }}</h4>
            <p class="playlist-description">{{ playlist.description || `${playlist.tracks?.total || 0} tracks` }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Releases Section -->
    <div class="discover-section">
      <div class="section-header">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="section-title">New Releases</h3>
      </div>
      
      <div class="releases-grid">
        <div 
          v-for="release in newReleases" 
          :key="release.id"
          class="release-card"
          @click="handleReleaseClick(release)"
        >
          <div class="release-image">
            <img 
              v-if="release.images && release.images[0]" 
              :src="release.images[0].url" 
              :alt="release.name"
            >
            <div v-else class="release-placeholder">
              <span>🎵</span>
            </div>
          </div>
          <div class="release-info">
            <h4 class="release-name">{{ release.name }}</h4>
            <p class="release-artist">{{ formatArtistNames(release.artists) }}</p>
            <p class="release-date">{{ formatReleaseDate(release.release_date) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading States -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading discoveries...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadDiscoverContent">Try Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'

const spotifyStore = useSpotifyStore()

// Reactive state
const loading = ref(false)
const error = ref(null)
const spotifyPlaylists = ref([])
const newReleases = ref([])

// Methods
const loadDiscoverContent = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Load Spotify playlists
    await spotifyStore.fetchPlaylists(0)
    spotifyPlaylists.value = spotifyStore.getPlaylists.slice(0, 6) // Show first 6 playlists
    
    // Load new releases (you'll need to implement this in your spotify store)
    // newReleases.value = await spotifyStore.fetchNewReleases()
    
    // For now, using placeholder data
    newReleases.value = [
      {
        id: '1',
        name: 'Sample Album 1',
        artists: [{ name: 'Artist 1' }],
        images: [{ url: 'https://via.placeholder.com/150' }],
        release_date: '2024-01-15'
      },
      {
        id: '2',
        name: 'Sample Album 2',
        artists: [{ name: 'Artist 2' }],
        images: [{ url: 'https://via.placeholder.com/150' }],
        release_date: '2024-01-10'
      }
    ]
  } catch (err) {
    error.value = 'Failed to load discover content'
    console.error('Error loading discover content:', err)
  } finally {
    loading.value = false
  }
}

const handlePlaylistClick = (playlist) => {
  // Handle playlist click - you can navigate to playlist details or play it
  console.log('Playlist clicked:', playlist)
  // You might want to emit an event or navigate to a playlist view
}

const handleReleaseClick = (release) => {
  // Handle release click - you can navigate to album details or play it
  console.log('Release clicked:', release)
  // You might want to emit an event or navigate to an album view
}

const formatArtistNames = (artists) => {
  if (!artists || !Array.isArray(artists)) return 'Unknown Artist'
  return artists.map(artist => artist.name).join(', ')
}

const formatReleaseDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Load content on mount
onMounted(() => {
  loadDiscoverContent()
})
</script>

<style scoped>
.discover-page {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.discover-header {
  text-align: center;
  margin-bottom: 30px;
}

.discover-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.discover-subtitle {
  font-size: 16px;
  color: #a0a0a0;
  margin: 0;
}

.discover-section {
  margin-bottom: 40px;
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
}

/* Playlists Grid */
.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.playlist-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.playlist-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.playlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.playlist-info {
  text-align: center;
}

.playlist-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.playlist-description {
  font-size: 12px;
  color: #a0a0a0;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Releases Grid */
.releases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.release-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.release-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.release-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.release-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.release-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.release-info {
  text-align: center;
}

.release-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.release-artist {
  font-size: 12px;
  color: #a0a0a0;
  margin: 0 0 2px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.release-date {
  font-size: 11px;
  color: #808080;
  margin: 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #a0a0a0;
  margin: 0;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 40px 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state p {
  color: #ef4444;
  margin: 0 0 16px 0;
}

.retry-button {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: rgba(102, 126, 234, 0.2);
}

/* Responsive Design */
@media (max-width: 480px) {
  .discover-title {
    font-size: 24px;
  }

  .discover-subtitle {
    font-size: 14px;
  }

  .section-title {
    font-size: 18px;
  }

  .playlists-grid,
  .releases-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .playlist-card,
  .release-card {
    padding: 8px;
  }

  .playlist-name,
  .release-name {
    font-size: 13px;
  }

  .playlist-description,
  .release-artist {
    font-size: 11px;
  }

  .release-date {
    font-size: 10px;
  }
}
</style>
