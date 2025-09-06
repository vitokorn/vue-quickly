<script setup>
import {useSpotifyStore} from "../../stores/spotify-store";
import { getSectionName } from '../../utils/sectionUtils';
import {useAudioStore} from "../../stores/audio-store";
import {useQueueStore} from "../../stores/queue-store";
import {useDeeperStore} from "../../stores/deeper-store";
import {usePreferencesStore} from "../../stores/preferences-store";
import {ref, computed, onMounted, onUnmounted, nextTick} from "vue";
import { useVisibilityManager } from "../../composables/useVisibilityManager";
import MobileTrackItem from './MobileTrackItem.vue';

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const preferencesStore = usePreferencesStore()
const selected = ref()
const selectedSASortOption = ref("")
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedSAItems = computed(() => {
  const items = props.d.tracks || []
  if (!selectedSASortOption.value) return items

  return [...items].sort((a, b) => {
    switch (selectedSASortOption.value) {
      case 'track':
        return a.name.localeCompare(b.name)
      case 'album':
        return a.album.name.localeCompare(b.album.name)
      case 'artist':
        return a.artists[0].name.localeCompare(b.artists[0].name)
      case 'popularity':
        return b.popularity - a.popularity
      case 'release_date':
        return new Date(b.album.release_date) - new Date(a.album.release_date)
      case 'duration':
        return a.duration_ms - b.duration_ms
      default:
        return 0
    }
  })
})

// Helper function to get section name from num

const handleTrackClick = async (track, event) => {
  if (deeperStore.getIsGloballyLoading) return
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName, props.d.id)
  queueStore.addToQueue(track)
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
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName, props.d.id)
  queueStore.addToQueue(track)
}

const handleRefresh = () => {
  spotifyStore.reloadSA({num: props.num, id: props.d.id, name: props.d.name})
}

const handleBackClick = () => {
  // Hide this component and show the parent
  const seedKey = `seed_artists_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(seedKey)

  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const seedKey = `seed_artists_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(seedKey, componentRef)

  // Show this component after registration
  console.log('Showing SeedArtistsMob component after registration:', seedKey)
  visibilityManager.showComponent(seedKey)
})

// Unregister component when unmounted to prevent stale registrations
onUnmounted(() => {
  const seedKey = `seed_artists_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.unregisterComponent(seedKey)
  console.log('SeedArtistsMob component unregistered:', seedKey)
})
</script>

<template>
  <div class="mobile-seed-artists" ref="componentRef">
    <div class="seed-content">
    <!-- Content Section -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <div class="seed-title">
        <span class="title-icon">🎵</span>
        <span class="title-text">Recommended songs based on {{ d.name }}</span>
      </div>
      <div class="seed-actions">
        <button class="refresh-button" @click="handleRefresh">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="refresh-icon">
            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
          </svg>
        </button>
        <button class="view-toggle-btn" @click="toggleViewMode" :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
          <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
                  clip-rule="evenodd"/>
          </svg>
        </button>
        <select class="sort-select" v-model="selectedSASortOption">
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

      <!-- Tracks Container -->
      <div class="mobile-tracks-container">
        <div v-if="sortedSAItems.length === 0" class="empty-state">
          <div class="empty-icon">🎤</div>
          <h3>No recommended tracks</h3>
          <p>Try refreshing to get new recommendations</p>
        </div>

        <div v-else :class="['releases-container', preferencesStore.viewMode]">
          <MobileTrackItem
            v-for="track in sortedSAItems"
            :key="track.id"
            :track="track"
            :num="num"
            :view-mode="preferencesStore.viewMode"
            @click="handleTrackClick(track, $event)"
            @coverClick="handleCoverClick(track, $event)"
            @infoClick="handleInfoClick(track, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
