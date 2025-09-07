<script setup>
import { ref, onMounted } from 'vue'
import { useMusicStore } from "../../stores/music-store"
import { usePreferencesStore } from "../../stores/preferences-store"
import { useAudioStore } from "../../stores/audio-store"
import { useQueueStore } from "../../stores/queue-store"
import { useDeeperStore } from "../../stores/deeper-store"
import { useSelection } from "../../composables/useSelection.js"
import MobileTrackItem from './MobileTrackItem.vue'

const props = defineProps({
  num: {
    type: Number,
    default: 3 // Default to topTracks section
  }
})

const musicStore = useMusicStore()
const preferencesStore = usePreferencesStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const { selectedItem, setSelectedItem } = useSelection()
const tracks = ref([])
const loading = ref(false)

onMounted(async () => {
  await loadSampleTracks()
})

const loadSampleTracks = async () => {
  if (musicStore.getTopTracksShort && musicStore.getTopTracksShort.length > 0) {
    console.log('Using cached top tracks data for sample tracks')
    tracks.value = musicStore.getTopTracksShort.slice(0, 10) // Show first 10 tracks
    return
  }

  loading.value = true
  try {
    // Load top tracks as sample data
    await musicStore.fetchTopTracks('short_term')
    tracks.value = musicStore.getTopTracksShort.slice(0, 10) // Show first 10 tracks
  } catch (error) {
    console.error('Failed to load tracks:', error)
  } finally {
    loading.value = false
  }
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

const handleTrackClick = async (track, event) => {
  console.log('Track clicked:', track.name)
  setSelectedItem(track.id)

  await deeperStore.getTrackDetails(track, 'topTracks')

  queueStore.addToQueue(track)

  // Also play audio preview if available
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    console.log('Playing audio preview for:', track.name)
    await audioStore.mobileToggleTrack(track.id, previewUrl)
  } else {
    console.log('No preview URL available for:', track.name)
  }
}

const handleCoverClick = async (track, event) => {
  console.log('Cover clicked for:', track.name)
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    console.log('Playing audio preview for:', track.name)
    await audioStore.mobileToggleTrack(track.id, previewUrl)
  } else {
    console.log('No preview URL available for:', track.name)
  }
}

const handleInfoClick = async (track, event) => {
  console.log('Info clicked for:', track.name)
  setSelectedItem(track.id)

  await deeperStore.getTrackDetails(track, 'topTracks')

  queueStore.addToQueue(track)
}
</script>

<template>
  <div class="mobile-tracks-list">
    <div class="list-header">
      <div class="header-content">
        <div class="header-text">
          <h3>Sample Tracks</h3>
          <p>Click tracks to add them to your queue</p>
        </div>
        <div class="header-actions">
          <button class="view-toggle-btn" @click="toggleViewMode" :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
            <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading tracks...</p>
    </div>

    <div v-else-if="tracks.length > 0" :class="['releases-container', preferencesStore.viewMode]">
      <MobileTrackItem
        v-for="track in tracks"
        :key="track.id"
        :track="track"
        :num="props.num"
        @click="handleTrackClick"
        @coverClick="handleCoverClick"
        @infoClick="handleInfoClick"
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
</style>
