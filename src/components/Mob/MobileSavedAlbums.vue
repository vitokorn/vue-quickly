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
  if (spotifyStore.getSavedAlbums && spotifyStore.getSavedAlbums.length > 0) {
    console.log('Using cached saved albums data')
    savedAlbums.value = spotifyStore.getSavedAlbums.map(item => item.album)
    return
  }

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

  await deeperStore.getAlbumDetails(album, 'savedAlbums')

  // Show the deeper album component
  console.log('Showing deeper album for:', album.name)
}

const handleAlbumThreeDotsClick = async (album, event) => {
  event.stopPropagation() // Prevent triggering the main click event

  await deeperStore.getAlbumDetails(album, 'savedAlbums')

  // Show the deeper album component using visibility manager
  const { useVisibilityManager } = await import('../../composables/useVisibilityManager')
  const visibilityManager = useVisibilityManager()
  const albumKey = `deeperalbum_${album.id}__p:savedAlbumsPage__`
  visibilityManager.showComponent(albumKey)

  console.log('Showing deeper album for:', album.name, 'with key:', albumKey)
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const handleRefresh = async () => {
  // Clear existing data and fetch fresh
  spotifyStore.savedAlbums = []
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
  <div class="mobile-top-tracks">
    <!-- Modern Header -->
    <div class="section-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">Saved Albums</h2>
        </div>
        <div class="header-actions">
          <button class="refresh-btn" @click="handleRefresh" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
            </svg>
          </button>
          <button class="view-toggle-btn" @click="toggleViewMode" :title="viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading saved albums...</p>
    </div>

    <!-- Albums Grid/List -->
    <div v-else-if="savedAlbums.length > 0" class="albums-container">
      <div class="releases-container" :class="viewMode">
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
</style>
