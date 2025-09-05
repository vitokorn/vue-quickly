<script setup>
import {ref, computed, onMounted} from 'vue'
import {useSpotifyStore} from '../../stores/spotify-store'
import {useAudioStore} from '../../stores/audio-store'
import {useQueueStore} from '../../stores/queue-store'
import {useDeeperStore} from '../../stores/deeper-store'
import {usePreferencesStore} from '../../stores/preferences-store'
import {useSelection} from '../../composables/useSelection.js'
import MobileTrackItem from './MobileTrackItem.vue'

const props = defineProps({
  num: {
    type: Number,
    default: 5 // Default to savedTracks section
  }
})

const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const preferencesStore = usePreferencesStore()

// Composables
const {selectedItem, setSelectedItem} = useSelection()

// Local state
const loading = ref(false)
const savedTracks = ref([])

// Methods
const loadSavedTracks = async () => {
  if (spotifyStore.getSavedTracks && spotifyStore.getSavedTracks.length > 0) {
    console.log('Using cached saved tracks data')
    savedTracks.value = spotifyStore.getSavedTracks.map(item => item.track)
    return
  }

  loading.value = true
  try {
    // Load saved tracks from Spotify API
    await spotifyStore.fetchSavedTracks(0)
    // Spotify returns saved tracks in format: { added_at: "...", track: {...} }
    savedTracks.value = (spotifyStore.getSavedTracks || []).map(item => item.track)
  } catch (error) {
    console.error('Failed to load saved tracks:', error)
  } finally {
    loading.value = false
  }
}

const handleTrackClick = async (track, event) => {
  setSelectedItem(track.id)

  await deeperStore.getTrackDetails(track, 'savedTracks')

  queueStore.addToQueue(track)
}

const handleRefresh = async () => {
  // Clear existing data and fetch fresh
  spotifyStore.savedTracks = []
  await loadSavedTracks()
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

// Load initial data
onMounted(async () => {
  await loadSavedTracks()
})
</script>

<template>
  <div class="mobile-top-tracks">
    <!-- Modern Header -->
    <div class="section-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="section-title">Saved Tracks</h2>
        </div>
        <div class="header-actions">
          <button class="refresh-btn" @click="handleRefresh" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                    clip-rule="evenodd"/>
            </svg>
          </button>
          <button class="view-toggle-btn" @click="toggleViewMode"
                  :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z"
                    clip-rule="evenodd"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading saved tracks...</p>
    </div>

    <!-- Tracks List -->
    <div v-else-if="savedTracks.length > 0" :class="['releases-container', preferencesStore.viewMode]">
      <MobileTrackItem
        v-for="track in savedTracks.slice(0, 10)"
        :key="track.id"
        :track="track"
        :num="props.num"
        @click="handleTrackClick"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clip-rule="evenodd"/>
        </svg>
      </div>
      <h4>No saved tracks</h4>
      <p>Start saving your favorite tracks to see them here</p>
    </div>
  </div>
</template>

<style scoped>
</style>
