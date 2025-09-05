<script setup>
import { useSpotifyStore } from "../../stores/spotify-store"
import { useAudioStore } from "../../stores/audio-store"
import { useQueueStore } from "../../stores/queue-store"
import { useDeeperStore } from "../../stores/deeper-store"
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue"
import { useVisibilityManager } from "../../composables/useVisibilityManager"
import { useMobileMediaDisplay } from "../../composables/useMobileMediaDisplay.js"
import MobileTrackItem from './MobileTrackItem.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const tracks = ref([])
const componentRef = ref(null)

// Get mobile media display for album
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => props.d))

// Get visibility manager
const visibilityManager = useVisibilityManager()

function setActive(id) {
  selected.value = id
}

function resolveTracks() {
  if (props.d.tracks && props.d.tracks.items) {
    tracks.value = props.d.tracks.items
  } else if (props.d.tracks) {
    tracks.value = props.d.tracks
  } else if (props.d.items) {
    tracks.value = props.d.items
  }
}

const handleBackClick = () => {
  // Hide this component and show the parent
  const albumKey = `deeperalbum_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(albumKey)

  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const handleTrackClick = async (track, event) => {
  if (deeperStore.getIsGloballyLoading) return
  setActive(track.id)

  await deeperStore.getTrackDetails(track, 'albumTracks')

  queueStore.addToQueue(track)

  // Also play audio preview if available
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    await audioStore.mobileToggleTrack(track.id, previewUrl)
  }
}

const handleArtistClick = async (artist, event) => {
  if (deeperStore.getIsGloballyLoading) return
  await deeperStore.getArtistDetails(artist, getSectionName(props.num), props.d.id)
}

const handleAlbumCoverClick = async () => {
  // Play audio preview if available
  if (hasPreview.value && previewUrl.value) {
    await audioStore.mobileToggleTrack(trackId.value, previewUrl.value)
  }
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

onMounted(async () => {
  resolveTracks()

  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const albumKey = `deeperalbum_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(albumKey, componentRef)

  // Show this component after registration
  console.log('Showing MobileDeeperAlbum component after registration:', albumKey)
  visibilityManager.showComponent(albumKey)
})

// Unregister component when unmounted
onUnmounted(() => {
  const albumKey = `deeperalbum_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.unregisterComponent(albumKey)
  console.log('MobileDeeperAlbum unregistered:', albumKey)
})
</script>

<template>
  <div class="mobile-deeper-album" ref="componentRef">
    <!-- Modern Mobile Header -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24">>
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="header-title">Album Details</h2>
      <div class="header-spacer"></div>
    </div>

    <!-- Modern Album Info Section -->
    <div class="album-info-section">
      <div class="album-cover"
           :class="displayClass"
           :style="backgroundStyle"
           @click="handleAlbumCoverClick">
        <img
          v-if="d.images && d.images[0]"
          :src="d.images[0].url"
          :alt="d.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else class="album-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010 1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010 1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
        <audio v-if="hasPreview" :preload="'metadata'" :src="previewUrl"></audio>
      </div>

      <div class="album-details">
        <h1 class="album-title">{{ d.name }}</h1>

        <div class="artists-section">
          <span class="artists-label">By</span>
          <div class="artists-list">
            <div v-for="(art, index) in d.artists" :key="index" class="artist-item">
              <span v-if="d.artists.length > 1 && d.artists.length - 1 === index" class="separator">&</span>
              <span v-if="d.artists.length >= 2 && d.artists.length - 1 !== index && index !== 0" class="separator">,</span>
              <button class="artist-link" @click="handleArtistClick(art, $event)">
                {{ art.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="album-meta">
        <span v-if="d.release_date" class="release-date">
            <span class="meta-icon">📅</span>
            {{ formatReleaseDate(d.release_date) }}
          </span>
        <span v-if="tracks.length > 0" class="track-count">
            <span class="meta-icon">🎵</span>
            {{ tracks.length }} tracks
          </span>
      </div>
    </div>

    <!-- Modern Tracks Section -->
    <div class="tracks-section">
      <div class="tracks-header">
        <span class="tracks-icon">🎵</span>
        <h3 class="tracks-title">Tracks</h3>
      </div>
      <div class="releases-container">
        <MobileTrackItem
          v-for="track in tracks"
          :key="track.id"
          :track="track"
          :num="num"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
</style>
