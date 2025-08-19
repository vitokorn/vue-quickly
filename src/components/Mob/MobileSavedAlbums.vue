<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Composables
const { selectedItem, setSelectedItem } = useSelection()

// Local state
const loading = ref(false)
const viewMode = ref('grid') // 'list' or 'grid'
const savedAlbums = ref([])

// Methods
const loadSavedAlbums = async () => {
  loading.value = true
  try {
    // Load saved albums from Spotify API
    await spotifyStore.fetchSavedAlbums(0)
    // Spotify returns saved albums in format: { added_at: "...", album: {...} }
    savedAlbums.value = (spotifyStore.getSavedAlbums || []).map(item => item.album)
  } catch (error) {
    console.error('Failed to load saved albums:', error)
  } finally {
    loading.value = false
  }
}

const handleAlbumClick = async (album, event) => {
  setSelectedItem(album.id)
  const sectionName = 'savedAlbums'
  
  // Add album to deeper store for savedAlbums section
  const albumData = {
    ...album,
    type: 'album',
    parentKey: 'libraryPage'
  }
  
  deeperStore.addToSection('savedAlbums', albumData)
  deeperStore.setCurrentSection('savedAlbums')
  
  // Show the deeper album component
  console.log('Showing deeper album for:', album.name)
}

const handleAlbumThreeDotsClick = async (album, event) => {
  event.stopPropagation() // Prevent triggering the main click event
  
  // Add album to deeper store for savedAlbums section
  const albumData = {
    ...album,
    type: 'album',
    parentKey: 'libraryPage'
  }
  
  deeperStore.addToSection('savedAlbums', albumData)
  deeperStore.setCurrentSection('savedAlbums')
  
  // Show the deeper album component using visibility manager
  const { useVisibilityManager } = await import('../../composables/useVisibilityManager')
  const visibilityManager = useVisibilityManager()
  const albumKey = `deeperalbum_${album.id}__p:libraryPage__`
  visibilityManager.showComponent(albumKey)
  
  console.log('Showing deeper album for:', album.name, 'with key:', albumKey)
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const handleRefresh = async () => {
  await loadSavedAlbums()
}

// Helper functions
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

// Load initial data
onMounted(async () => {
  await loadSavedAlbums()
})
</script>

<template>
  <div class="mobile-saved-albums">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
        </svg>
      </div>
      <h3 class="section-title">Saved Albums</h3>
      <div class="action-buttons">
        <button class="view-toggle-btn" @click="toggleViewMode" :title="viewMode === 'list' ? 'Switch to Grid View' : 'Switch to List View'">
          <svg v-if="viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18A2.25 2.25 0 018.25 20H6A2.25 2.25 0 013.75 17.75v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18A2.25 2.25 0 0118.25 20h-2.25A2.25 2.25 0 0113.75 17.75v-2.25z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>
        <button class="refresh-btn" @click="handleRefresh" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading saved albums...</p>
    </div>

    <!-- Albums Grid/List -->
    <div v-else-if="savedAlbums.length > 0" class="albums-container">
      <div class="albums-container" :class="viewMode">
        <!-- List View -->
        <template v-if="viewMode === 'list'">
          <div
            v-for="album in savedAlbums.slice(0, 8)"
            :key="album.id"
            :class="['album-item', 'list-item', { 'selected': selectedItem === album.id }]"
            @click="handleAlbumClick(album, $event)"
          >
            <div class="album-cover">
              <img 
                v-if="album.images && album.images.length > 0" 
                :src="album.images[0].url" 
                :alt="album.name"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="album-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
                </svg>
              </div>
            </div>
            <div class="album-info">
              <div class="album-name">{{ album.name }}</div>
              <div class="album-details">
                <span>{{ formatArtistNames(album.artists) }}</span>
                <span v-if="album.release_date">{{ formatReleaseDate(album.release_date) }}</span>
              </div>
              <div class="album-type">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
                </svg>
                <span class="type-text">{{ album.album_type || 'Album' }}</span>
              </div>
            </div>
            <!-- Three dots menu button -->
            <button
              class="three-dots-button"
              @click="handleAlbumThreeDotsClick(album, $event)"
              title="More options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="three-dots-icon">
                <path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="album-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Grid View -->
        <template v-else>
          <div
            v-for="album in savedAlbums.slice(0, 12)"
            :key="album.id"
            :class="['album-item', 'grid-item', { 'selected': selectedItem === album.id }]"
            @click="handleAlbumClick(album, $event)"
          >
            <div class="grid-cover">
              <img 
                v-if="album.images && album.images.length > 0" 
                :src="album.images[0].url" 
                :alt="album.name"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="album-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
                </svg>
              </div>
              <div class="grid-overlay">
                <span class="album-type-badge">{{ album.album_type || 'Album' }}</span>
              </div>
            </div>
            <div class="grid-info">
              <div class="grid-name">{{ album.name }}</div>
              <div class="grid-details">
                <span>{{ formatArtistNames(album.artists) }}</span>
                <span v-if="album.release_date">{{ formatReleaseDate(album.release_date) }}</span>
              </div>
            </div>
            <!-- Three dots menu button for grid view -->
            <button
              class="grid-three-dots-button"
              @click="handleAlbumThreeDotsClick(album, $event)"
              title="More options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="three-dots-icon">
                <path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
        </svg>
      </div>
      <h4>No saved albums</h4>
      <p>Start saving your favorite albums to see them here</p>
    </div>
  </div>
</template>

<style scoped>
.mobile-saved-albums {
  width: 100%;
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
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #a0a0a0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.view-toggle-btn svg {
  width: 16px;
  height: 16px;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #a0a0a0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
}

.albums-container {
  width: 100%;
}

.albums-container.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.albums-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 0 4px;
}

/* Album Item Styles */
.album-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 16px;
}

.album-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.album-item.selected {
  background: rgba(30, 215, 96, 0.2);
  border-color: rgba(30, 215, 96, 0.4);
}

.album-cover {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.album-placeholder svg {
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.5);
}

.album-info {
  flex: 1;
  min-width: 0;
  gap: 0px;
  margin-right: 8px;
}

.album-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-details {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.album-type {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.type-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #1db954;
}

.type-text {
  font-size: 12px;
  color: #a0a0a0;
  font-weight: 500;
  text-transform: uppercase;
}

.album-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #a0a0a0;
  transition: color 0.2s ease;
}

.album-item:hover .arrow-icon {
  color: #ffffff;
}

/* Grid Item Styles */
.grid-item {
  flex-direction: column;
  padding: 12px;
  text-align: center;
  min-height: 180px;
  position: relative;
}

.grid-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.grid-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.grid-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-type-badge {
  font-size: 10px;
  color: #ffffff;
  font-weight: 600;
  text-transform: uppercase;
}

.grid-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.grid-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.grid-details {
  font-size: 12px;
  color: #a0a0a0;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.loading-state {
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

.loading-state p {
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

/* Three dots button styles */
.three-dots-button {
  background: none;
  border: none;
  color: #a0a0a0;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.three-dots-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.three-dots-icon {
  width: 16px;
  height: 16px;
}

/* Grid three dots button */
.grid-three-dots-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: #ffffff;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.grid-three-dots-button:hover {
  background: rgba(0, 0, 0, 0.9);
}

.grid-item {
  position: relative;
}

/* Responsive Design */
@media (max-width: 480px) {
  .section-title {
    font-size: 18px;
  }

  .albums-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .grid-item {
    min-height: 160px;
  }

  .grid-name {
    font-size: 13px;
  }

  .grid-details {
    font-size: 11px;
  }
}

</style>
