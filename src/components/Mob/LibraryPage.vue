<template>
  <div class="library-page">
    <!-- Library Header -->
    <div class="library-header">
      <h2 class="library-title">Library</h2>
      <p class="library-subtitle">Your saved music and playlists</p>
    </div>

    <!-- Library Sections -->
    <div class="library-sections">
      <PlaylistSelector
          :playlists="spotifyStore.getPlaylists"
          :selected-playlist="selectedPersonalPlaylist"
          title="Your Personal Playlists"
          placeholder="Search personal playlists..."
          :items-per-page="50"
          @playlist-select="(playlistId, event) => { setSelectedPersonalPlaylist(playlistId); spotifyStore.fetchPlaylist(playlistId) }"
          @load-more="handleLoadMorePersonalPlaylists"
      />

      <!-- Saved Tracks Section -->
      <div class="library-section">
        <div class="section-header">
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="section-title">Saved Tracks</h3>
          <span class="section-count">{{ savedTracks.length }}</span>
        </div>

        <div class="saved-tracks-list">
          <div
            v-for="track in savedTracks.slice(0, 3)"
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
          <div v-if="savedTracks.length > 3" class="view-more-item" @click="handleViewMore('saved-tracks')">
            <div class="view-more-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 12a.75.75 0 000-1.5h-3.75V6a.75.75 0 000-1.5h3.75v6.75z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="view-more-text">View all {{ savedTracks.length }} saved tracks</span>
          </div>
        </div>
      </div>

      <!-- Saved Albums Section -->
      <div class="library-section">
        <div class="section-header">
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
              <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
            </svg>
          </div>
          <h3 class="section-title">Saved Albums</h3>
          <span class="section-count">{{ savedAlbums.length }}</span>
        </div>

        <div class="albums-grid">
          <div
            v-for="album in savedAlbums.slice(0, 4)"
            :key="album.id"
            class="album-card"
            @click="handleAlbumClick(album)"
          >
            <div class="album-image">
              <img
                v-if="album.images && album.images[0]"
                :src="album.images[0].url"
                :alt="album.name"
              >
              <div v-else class="album-placeholder">
                <span>💿</span>
              </div>
            </div>
            <div class="album-info">
              <h4 class="album-name">{{ album.name }}</h4>
              <p class="album-artist">{{ formatArtistNames(album.artists) }}</p>
            </div>
          </div>
          <div v-if="savedAlbums.length > 4" class="view-more-item grid-view-more" @click="handleViewMore('albums')">
            <div class="view-more-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 12a.75.75 0 000-1.5h-3.75V6a.75.75 0 000-1.5h3.75v6.75z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="view-more-text">View all</span>
          </div>
        </div>
      </div>

      <!-- Followed Artists Section -->
      <div class="library-section">
        <div class="section-header">
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="section-title">Followed Artists</h3>
          <span class="section-count">{{ followedArtists.length }}</span>
        </div>

        <div class="followed-artists-grid">
          <div
            v-for="artist in followedArtists.slice(0, 4)"
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
          <div v-if="followedArtists.length > 4" class="view-more-item grid-view-more" @click="handleViewMore('followed-artists')">
            <div class="view-more-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 12a.75.75 0 000-1.5h-3.75V6a.75.75 0 000-1.5h3.75v6.75z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="view-more-text">View all</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading States -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your library...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadLibraryContent">Try Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import PlaylistSelector from "../Mob/PlaylistSelector.vue";
import {useSelection} from "../../composables/useSelection.js";

const spotifyStore = useSpotifyStore()

// Reactive state
const loading = ref(false)
const error = ref(null)
const topTracks = ref([])
const topArtists = ref([])
const savedTracks = ref([])
const savedAlbums = ref([])
const followedArtists = ref([])

const {
  selectedItem,
  selectedTopMenu,
  selectedPersonalPlaylist,
  selectedSpotifyPlaylist,
  setSelectedItem,
  setSelectedPersonalPlaylist,
  setSelectedSpotifyPlaylist,
  setSelectedTopMenu
} = useSelection()

// Methods
const loadLibraryContent = async () => {
  loading.value = true
  error.value = null

  try {
    // Load user playlists
    await spotifyStore.fetchPlaylists(0)

    // Load other library content (you'll need to implement these in your spotify store)
    // For now, using placeholder data
    topTracks.value = [
      {
        id: '1',
        name: 'Sample Track 1',
        artists: [{ name: 'Artist 1' }],
        album: { images: [{ url: 'https://via.placeholder.com/150' }] }
      },
      {
        id: '2',
        name: 'Sample Track 2',
        artists: [{ name: 'Artist 2' }],
        album: { images: [{ url: 'https://via.placeholder.com/150' }] }
      }
    ]

    topArtists.value = [
      {
        id: '1',
        name: 'Artist 1',
        images: [{ url: 'https://via.placeholder.com/150' }]
      },
      {
        id: '2',
        name: 'Artist 2',
        images: [{ url: 'https://via.placeholder.com/150' }]
      }
    ]

    savedTracks.value = [
      {
        id: '1',
        name: 'Saved Track 1',
        artists: [{ name: 'Artist 1' }],
        album: { images: [{ url: 'https://via.placeholder.com/150' }] }
      }
    ]

    savedAlbums.value = [
      {
        id: '1',
        name: 'Saved Album 1',
        artists: [{ name: 'Artist 1' }],
        images: [{ url: 'https://via.placeholder.com/150' }]
      }
    ]

    followedArtists.value = [
      {
        id: '1',
        name: 'Followed Artist 1',
        images: [{ url: 'https://via.placeholder.com/150' }]
      }
    ]

  } catch (err) {
    error.value = 'Failed to load library content'
    console.error('Error loading library content:', err)
  } finally {
    loading.value = false
  }
}

const handlePlaylistClick = (playlist) => {
  console.log('Playlist clicked:', playlist)
  // Handle playlist click
}

const handleTrackClick = (track) => {
  console.log('Track clicked:', track)
  // Handle track click
}

const handleArtistClick = (artist) => {
  console.log('Artist clicked:', artist)
  // Handle artist click
}

const handleAlbumClick = (album) => {
  console.log('Album clicked:', album)
  // Handle album click
}

const handleViewMore = (section) => {
  console.log('View more clicked for:', section)
  // Handle view more click
}

const handleLoadMorePersonalPlaylists = async () => {
  try {
    // Load the next batch of 50 playlists
    const currentCount = spotifyStore.getPlaylists.length
    await spotifyStore.fetchPlaylists(currentCount)
  } catch (error) {
    console.error('Failed to load more personal playlists:', error)
  }
}

const formatArtistNames = (artists) => {
  if (!artists || !Array.isArray(artists)) return 'Unknown Artist'
  return artists.map(artist => artist.name).join(', ')
}

// Load content on mount
onMounted(() => {
  loadLibraryContent()
})
</script>

<style scoped>
.library-page {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.library-header {
  text-align: center;
  margin-bottom: 30px;
}

.library-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.library-subtitle {
  font-size: 16px;
  color: #a0a0a0;
  margin: 0;
}

.library-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.library-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  flex: 1;
}

.section-count {
  font-size: 14px;
  color: #a0a0a0;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

/* Playlists List */
.playlists-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.playlist-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
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
  font-size: 20px;
}

.playlist-info {
  flex: 1;
  min-width: 0;
}

.playlist-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.playlist-tracks {
  font-size: 12px;
  color: #a0a0a0;
  margin: 0;
}

/* Tracks List */
.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.track-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.track-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.track-artist {
  font-size: 12px;
  color: #a0a0a0;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Artists Grid */
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
}

.artist-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.artist-card:hover {
  transform: translateY(-2px);
}

.artist-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 8px;
}

.artist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.artist-name {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Saved Tracks List */
.saved-tracks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Albums Grid */
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.album-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.album-card:hover {
  transform: translateY(-2px);
}

.album-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto 8px;
}

.album-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.album-info {
  text-align: center;
}

.album-name {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.album-artist {
  font-size: 11px;
  color: #a0a0a0;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Followed Artists Grid */
.followed-artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
}

/* View More Items */
.view-more-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.view-more-item:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(4px);
}

.view-more-item.grid-view-more {
  flex-direction: column;
  text-align: center;
  padding: 16px;
  aspect-ratio: 1;
  justify-content: center;
}

.view-more-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
  flex-shrink: 0;
}

.view-more-text {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
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
  .library-title {
    font-size: 24px;
  }

  .library-subtitle {
    font-size: 14px;
  }

  .library-section {
    padding: 16px;
  }

  .section-title {
    font-size: 16px;
  }

  .artists-grid,
  .followed-artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
  }

  .artist-image {
    width: 70px;
    height: 70px;
  }

  .albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }

  .album-image {
    width: 100px;
    height: 100px;
  }

  .playlist-item,
  .track-item {
    padding: 8px;
  }

  .playlist-image,
  .track-image {
    width: 40px;
    height: 40px;
  }

  .playlist-name,
  .track-name {
    font-size: 13px;
  }

  .playlist-tracks,
  .track-artist {
    font-size: 11px;
  }
}
</style>
