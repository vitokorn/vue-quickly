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
const followedArtists = ref([])

// Methods
const loadFollowedArtists = async () => {
  loading.value = true
  try {
    // Load followed artists from Spotify API
    await spotifyStore.fetchFollowedArtists()
    followedArtists.value = spotifyStore.getFollowedArtists || []
  } catch (error) {
    console.error('Failed to load followed artists:', error)
  } finally {
    loading.value = false
  }
}

const handleArtistClick = async (artist, event) => {
  setSelectedItem(artist.id)
  const sectionName = 'followedArtists'

  // Add artist to deeper store for followedArtists section
  const artistData = {
    ...artist,
    type: 'artist',
    parentKey: 'libraryPage'
  }

  deeperStore.addToSection('followedArtists', artistData)
  deeperStore.setCurrentSection('followedArtists')

  // Show the deeper artist component using visibility manager
  const { useVisibilityManager } = await import('../../composables/useVisibilityManager')
  const visibilityManager = useVisibilityManager()
  const artistKey = `deeperartist_${artist.id}__p:libraryPage__`
  visibilityManager.showComponent(artistKey)

  console.log('Showing deeper artist for:', artist.name, 'with key:', artistKey)
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const handleRefresh = async () => {
  await loadFollowedArtists()
}

// Helper functions
const formatFollowers = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

const formatGenres = (genres) => {
  if (!genres || genres.length === 0) return ''
  // Take first 2 genres and capitalize first letter
  return genres.slice(0, 2).map(genre =>
    genre.charAt(0).toUpperCase() + genre.slice(1)
  ).join(', ')
}

// Load initial data
onMounted(async () => {
  await loadFollowedArtists()
})
</script>

<template>
  <div class="mobile-followed-artists">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clip-rule="evenodd" />
        </svg>
      </div>
      <h3 class="section-title">Followed Artists</h3>
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
      <p>Loading followed artists...</p>
    </div>

    <!-- Artists Grid/List -->
    <div v-else-if="followedArtists.length > 0" class="artists-container">
      <div class="artists-container" :class="viewMode">
        <!-- List View -->
        <template v-if="viewMode === 'list'">
          <div
            v-for="artist in followedArtists.slice(0, 8)"
            :key="artist.id"
            :class="['artist-item', 'list-item', { 'selected': selectedItem === artist.id }]"
            @click="handleArtistClick(artist, $event)"
          >
            <div class="artist-cover">
              <img
                v-if="artist.images && artist.images.length > 0"
                :src="artist.images[0].url"
                :alt="artist.name"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="artist-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
            </div>
            <div class="artist-info">
              <div class="artist-name">{{ artist.name }}</div>
              <div class="artist-details">
                <span v-if="artist.followers">{{ formatFollowers(artist.followers.total) }} followers</span>
                <span v-if="artist.genres && artist.genres.length > 0">{{ formatGenres(artist.genres) }}</span>
              </div>
              <div class="artist-type">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
                <span class="type-text">Artist</span>
              </div>
            </div>
            <div class="artist-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </template>

        <!-- Grid View -->
        <template v-else>
          <div
            v-for="artist in followedArtists.slice(0, 12)"
            :key="artist.id"
            :class="['artist-item', 'grid-item', { 'selected': selectedItem === artist.id }]"
            @click="handleArtistClick(artist, $event)"
          >
            <div class="grid-cover">
              <img
                v-if="artist.images && artist.images.length > 0"
                :src="artist.images[0].url"
                :alt="artist.name"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="artist-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
              <div class="grid-overlay">
                <span class="artist-type-badge">Artist</span>
              </div>
            </div>
            <div class="grid-info">
              <div class="grid-name">{{ artist.name }}</div>
              <div class="grid-details">
                <span v-if="artist.followers">{{ formatFollowers(artist.followers.total) }} followers</span>
                <span v-if="artist.genres && artist.genres.length > 0">{{ formatGenres(artist.genres) }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clip-rule="evenodd" />
        </svg>
      </div>
      <h4>No followed artists</h4>
      <p>Start following your favorite artists to see them here</p>
    </div>
  </div>
</template>

<style scoped>
.mobile-followed-artists {
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

.artists-container {
  width: 100%;
}

.artists-container.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.artists-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 0 4px;
}

/* Artist Item Styles */
.artist-item {
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

.artist-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.artist-item.selected {
  background: rgba(30, 215, 96, 0.2);
  border-color: rgba(30, 215, 96, 0.4);
}

.artist-cover {
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

.artist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.artist-placeholder svg {
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.5);
}

.artist-info {
  flex: 1;
  min-width: 0;
  gap: 0px;
  margin-right: 8px;
}

.artist-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-details {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.artist-type {
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

.artist-arrow {
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

.artist-item:hover .arrow-icon {
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

.artist-type-badge {
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

/* Responsive Design */
@media (max-width: 480px) {
  .section-title {
    font-size: 18px;
  }

  .artists-container.grid {
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

:root.metro .mobile-followed-artists {
  font-family: 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif;
}

:root.metro .section-header {
  padding: 16px 20px 8px 20px;
}

:root.metro .section-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 24px;
  text-transform: none;
  letter-spacing: normal;
}

:root.metro .section-icon {
  background: transparent;
  border-radius: 0;
  width: 24px;
  height: 24px;
}

:root.metro .section-icon svg {
  color: rgba(255, 255, 255, 0.8);
  width: 18px;
  height: 18px;
}

:root.metro .refresh-btn,
:root.metro .view-toggle-btn {
  background: transparent;
  color: #cccccc;
  border: none;
  border-radius: 0;
  width: 40px;
  height: 40px;
  padding: 8px;
}

:root.metro .refresh-btn:hover,
:root.metro .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .refresh-btn svg,
:root.metro .view-toggle-btn svg {
  width: 16px;
  height: 16px;
}

:root.metro .artist-item {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 16px 20px;
  margin: 0 20px 8px 20px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

:root.metro .artist-item:hover {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .artist-item.selected {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .artist-cover {
  background: #333333;
  border: none;
  border-radius: 0;
  width: 60px;
  height: 60px;
}

:root.metro .artist-placeholder {
  background: #333333;
}

:root.metro .artist-placeholder svg {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
}

:root.metro .artist-name {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

:root.metro .artist-details {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .artist-type {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
  text-transform: none;
}

:root.metro .arrow-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

:root.metro .artist-item:hover .arrow-icon {
  color: white;
}

:root.metro .grid-item {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 12px;
  margin: 0;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

:root.metro .grid-item:hover {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .grid-cover {
  background: #333333;
  border: none;
  border-radius: 0;
}

:root.metro .grid-overlay {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0;
}

:root.metro .artist-type-badge {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 10px;
  font-weight: 400;
  text-transform: none;
}

:root.metro .grid-name {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .grid-details {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
}

:root.metro .loading-spinner {
  border: 3px solid #333333;
  border-top: 3px solid #0078d4;
}

:root.metro .loading-state p {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

:root.metro .empty-state h4 {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 20px;
}

:root.metro .empty-state p {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .empty-icon {
  background: #333333;
  border-radius: 0;
}

:root.metro .empty-icon svg {
  color: rgba(255, 255, 255, 0.6);
  font-size: 32px;
}

/* Cupertino liquid glass theme */
:root.cupertino .mobile-followed-artists {
  background: linear-gradient(135deg, #e8f0ff 0%, #f8f9fb 40%, #ffe9f3 100%);
}

:root.cupertino .section-header {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 30px rgba(31, 38, 135, 0.12);
}

:root.cupertino .section-title {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .section-icon {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .section-icon svg {
  color: rgba(0, 0, 0, 0.6);
  width: 18px;
  height: 18px;
}

:root.cupertino .view-toggle-btn {
  background: rgba(255, 255, 255, 0.45);
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .view-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .view-toggle-btn svg {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .artist-item {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .artist-item:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px rgba(31, 38, 135, 0.16);
}

:root.cupertino .artist-item.selected {
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .artist-cover {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;
}

:root.cupertino .artist-name {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .artist-details {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .artist-genres {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .arrow-icon {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .artist-item:hover .arrow-icon {
  color: rgba(0, 0, 0, 0.8);
}

:root.cupertino .grid-item {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .grid-item:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px rgba(31, 38, 135, 0.16);
}

:root.cupertino .grid-cover {
  border-radius: 12px;
}

:root.cupertino .grid-overlay {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

:root.cupertino .artist-type-badge {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
  text-transform: none;
}

:root.cupertino .grid-name {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .grid-details {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .loading-spinner {
  border: 3px solid rgba(0, 0, 0, 0.05);
  border-top: 3px solid rgba(0, 0, 0, 0.4);
}

:root.cupertino .loading-state p {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .empty-state h4 {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .empty-state p {
  color: rgba(0, 0, 0, 0.6);
}

:root.cupertino .empty-icon {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .empty-icon svg {
  color: rgba(0, 0, 0, 0.4);
  font-size: 32px;
}

</style>
