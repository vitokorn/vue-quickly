<script setup>
import { useSpotifyStore } from "../../stores/spotify-store"
import { getSectionName } from '../../utils/sectionUtils';
import { useAudioStore } from "../../stores/audio-store"
import { useQueueStore } from "../../stores/queue-store"
import { useDeeperStore } from "../../stores/deeper-store"
import { usePreferencesStore } from "../../stores/preferences-store"
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue"
import { useVisibilityManager } from "../../composables/useVisibilityManager"
import { useMobileMediaDisplay } from "../../composables/useMobileMediaDisplay.js"
import MobileTrackItem from './MobileTrackItem.vue'

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const preferencesStore = usePreferencesStore()
const selected = ref()
const selectedDeeperPlaylistSortOption = ref("")
const componentRef = ref(null)

// Get mobile media display for playlist
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => props.d))

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedDeeperPlaylistItems = computed(() => {
  const items = props.d.tracks?.items || []
  if (!selectedDeeperPlaylistSortOption.value) return items

  return [...items].sort((a, b) => {
    const trackA = a.track
    const trackB = b.track

    switch (selectedDeeperPlaylistSortOption.value) {
      case 'track':
        return trackA.name.localeCompare(trackB.name)
      case 'album':
        return trackA.album.name.localeCompare(trackB.album.name)
      case 'artist':
        return trackA.artists[0].name.localeCompare(trackB.artists[0].name)
      case 'popularity':
        return trackB.popularity - trackA.popularity
      case 'release_date':
        return new Date(trackB.album.release_date) - new Date(trackA.album.release_date)
      case 'duration':
        return trackA.duration_ms - trackB.duration_ms
      default:
        return 0
    }
  })
})

// Helper function to get section name from num

function setActive(id) {
  selected.value = id
}

const handleBackClick = () => {
  // Hide this component and show the parent
  const playlistKey = `deeperplaylist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(playlistKey)

  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const handleTrackClick = async (track, event) => {
  if (deeperStore.getIsGloballyLoading) return
  setActive(track.id)

  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName, props.d.id)

  queueStore.addToQueue(track)

  // Also play audio preview if available
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    await audioStore.mobileToggleTrack(track.id, previewUrl)
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
  if (deeperStore.getIsGloballyLoading) return
  setActive(track.id)

  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName, props.d.id)

  queueStore.addToQueue(track)
}

const handleSortChange = (option) => {
  selectedDeeperPlaylistSortOption.value = option
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

const handleRefresh = () => {
  // For playlist refresh, we could reload the playlist data
  // Since this is a deeper playlist view, we might need to reload the parent data
  // For now, we'll just re-trigger the sort to refresh the display
  const currentSort = selectedDeeperPlaylistSortOption.value
  selectedDeeperPlaylistSortOption.value = ''
  setTimeout(() => {
    selectedDeeperPlaylistSortOption.value = currentSort
  }, 100)
}

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const playlistKey = `deeperplaylist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(playlistKey, componentRef)

  // Initially hide the component
  if (componentRef.value) {
    componentRef.value.style.display = 'none'
  }

  console.log('MobileDeeperPlaylist registered with key:', playlistKey)
})

// Unregister component when unmounted
onUnmounted(() => {
  const playlistKey = `deeperplaylist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.unregisterComponent(playlistKey)
  console.log('MobileDeeperPlaylist unregistered:', playlistKey)
})
</script>

<template>
  <div class="mobile-deeper-playlist" ref="componentRef">
    <!-- Mobile Header with Back Button -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24">>
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="mobile-deeper-header">Playlist</h2>
      <div class="header-actions">
        <button class="refresh-btn" @click="handleRefresh" title="Refresh">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
          </svg>
        </button>
        <button class="view-toggle-btn" @click="toggleViewMode" :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
          <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>
        <select class="sort-select" v-model="selectedDeeperPlaylistSortOption">
          <option value="">Initial</option>
          <option value="artist">Sort by artist</option>
          <option value="album">Sort by album</option>
          <option value="duration">Sort by duration</option>
          <option value="popularity">Sort by popularity</option>
          <option value="release_date">Sort by release date</option>
          <option value="track">Sort by track name</option>
        </select>
      </div>
    </div>

    <!-- Playlist Info Section -->
    <div class="playlist-info-section">
      <div class="playlist-cover">
        <img
          v-if="d.images && d.images[0]"
          :src="d.images[0].url"
          :alt="d.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else class="playlist-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
      </div>

      <div class="playlist-details">
        <h1 class="playlist-title">{{ d.name }}</h1>

        <div class="playlist-meta">
          <span v-if="d.owner" class="playlist-owner">By {{ d.owner.display_name }}</span>
          <span v-if="d.tracks && d.tracks.items" class="track-count">{{ d.tracks.items.length }} tracks</span>
          <span v-if="d.public !== undefined" class="playlist-visibility">
            {{ d.public ? 'Public' : 'Private' }}
          </span>
        </div>

        <div v-if="d.description" class="playlist-description" v-html="d.description"></div>
      </div>
    </div>

    <!-- Tracks Section -->
    <div class="tracks-section">
      <h3 class="section-title">Tracks</h3>
      <div :class="['releases-container', preferencesStore.viewMode]">
        <MobileTrackItem
          v-for="item in sortedDeeperPlaylistItems"
          :key="item.track.id"
          :track="item.track"
          :num="num"
          :view-mode="preferencesStore.viewMode"
          @click="handleTrackClick"
          @coverClick="handleCoverClick"
          @infoClick="handleInfoClick"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
</style>
