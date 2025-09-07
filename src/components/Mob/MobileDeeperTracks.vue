<script setup>
import { useMusicStore } from "../../stores/music-store"
import { getSectionName } from '../../utils/sectionUtils';
import { useAudioStore } from "../../stores/audio-store"
import { useQueueStore } from "../../stores/queue-store"
import { useDeeperStore } from "../../stores/deeper-store"
import { onMounted, onUnmounted, ref, computed, nextTick, watch } from "vue"
import { useVisibilityManager } from "../../composables/useVisibilityManager"
import { useMobileMediaDisplay } from "../../composables/useMobileMediaDisplay.js"

const props = defineProps(['d', 'num'])
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const cover = ref(null)
const componentRef = ref(null)
const seedTracksData = ref(null)
const loadingRecommendations = ref(false)

// Get mobile media display for track
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => props.d))

// Get visibility manager
const visibilityManager = useVisibilityManager()

// Helper function to get section name from num

function setActive(id) {
  selected.value = id
}

function resolveCover() {
  console.log(props.d)
  if (props.d.album && props.d.album.images) {
    cover.value = props.d.album.images[0]
  } else if (props.d.images) {
    cover.value = props.d.images[0]
  } else if (props.d.track && props.d.track.album && props.d.track.album.images && props.d.track.album.images[0]) {
    cover.value = props.d.track.album.images[0]
  }
  console.log(cover.value)
}

const handleBackClick = () => {
  // Hide this component and show the parent
  const trackKey = `${props.d.type}_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(trackKey)

  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const handleTrackClick = async (track, event) => {
  if (deeperStore.getIsGloballyLoading) return
  setActive(track.id)
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
}

const handleArtistClick = async (artist, event) => {
  if (deeperStore.getIsGloballyLoading) return
  await deeperStore.getArtistDetails(artist, getSectionName(props.num), props.d.parentKey || props.d.id)
}

const handleAudioPreview = (event) => {
  event.stopPropagation()
  if (hasPreview.value && previewUrl.value) {
    audioStore.mobileToggleTrack(trackId.value, previewUrl.value)
  }
}

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
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

const handleRecommendClick = async () => {
  try {
    loadingRecommendations.value = true
    const sectionName = getSectionName(props.num)
    await deeperStore.getSeedTrackRecommendations(props.d, sectionName, props.d.id)
  } catch (error) {
    console.error('Failed to get recommendations:', error)
    alert('Failed to load recommendations. Please try again.')
  } finally {
    loadingRecommendations.value = false
  }
}

onMounted(async () => {
  resolveCover()

  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const trackKey = `${props.d.type}_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  console.log('Registering component with ref:', componentRef.value)
  console.log('Ref element:', componentRef.value?.tagName, componentRef.value?.className)
  console.log('Registering with key:', trackKey)
  visibilityManager.registerComponent(trackKey, componentRef)

  // Show this component after registration
  console.log('Showing component after registration:', trackKey)
  visibilityManager.showComponent(trackKey)
})

// Unregister component when unmounted
onUnmounted(() => {
  const trackKey = `${props.d.type}_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.unregisterComponent(trackKey)
  console.log('MobileDeeperTracks unregistered:', trackKey)
})
</script>

<template>
  <div class="mobile-deeper-track" ref="componentRef">
    <!-- Modern Mobile Header -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24">>
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="mobile-deeper-header">Track Details</h2>
    </div>

    <!-- Modern Track Info Section -->
    <div class="track-info-section">
      <div style="position: relative">
        <img
          v-if="cover"
          class="track-cover"
          :class="displayClass"
          :style="backgroundStyle"
          @click="handleAudioPreview"
          :src="cover.url"
          :alt="d.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else-if="!cover" class="track-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010 1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
        <div v-if="hasPreview && audioStore.mobileIsTrackPlaying(trackId)" class="playing-indicator">
          <span class="playing-icon">▶️</span>
        </div>
      </div>

      <div class="track-details">
        <h1 class="track-title">{{ d.name }}</h1>

        <div class="artists-section">
          <span class="meta-icon">💿</span>
          <span class="artists-label">By</span>
          <template v-for="(art, index) in d.artists" :key="index">
            <div v-if="d.artists.length > 1 && d.artists.length - 1 === index" class="separator">&</div>
            <div v-if="d.artists.length >= 2 && d.artists.length - 1 !== index && index !== 0"
                 class="separator">,</div>
            <div class="artist-item">
              <button class="artist-link" @click="handleArtistClick(art, $event)">
                {{ art.name }}
              </button>
            </div>
          </template>
        </div>


      </div>
      <div class="track-meta">
        <div v-if="d.duration_ms" class="duration">
            <span class="meta-icon">⏱️</span>
            {{ formatDuration(d.duration_ms) }}
          </div>
        <div v-if="d.popularity" class="popularity">
            <span class="meta-icon">📊</span>
            {{ d.popularity }}% popular
          </div>
        <div v-if="d.album && d.album.release_date" class="release-info">
          <span class="release-date">
            <span class="meta-icon">📅</span>
            Released {{ formatReleaseDate(d.album.release_date) }}
          </span>
        </div>
      </div>

    </div>

    <!-- Modern Track Actions -->
    <div class="track-actions px-4">
      <button class="play-btn" @click="handleAudioPreview">
        <span class="btn-icon">▶️</span>
        Play Track
      </button>

      <button class="action-button" @click="handleRecommendClick">
        <span class="btn-icon">🎵</span>
        Get Recommendations
      </button>

      <button class="queue-btn" @click="queueStore.addToQueue(d)">
        <span class="btn-icon">➕</span>
        Add to Queue
      </button>
    </div>

    <!-- Loading State for Recommendations -->
    <div v-if="loadingRecommendations" class="loading-section">
      <div class="loading-spinner"></div>
      <p>Loading recommendations...</p>
    </div>
  </div>
</template>

<style scoped>

</style>
