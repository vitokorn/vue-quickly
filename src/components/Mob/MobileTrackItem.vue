<script setup>
import { computed, nextTick } from 'vue'
import { useQueueStore } from "../../stores/queue-store"
import { useDeeperStore } from "../../stores/deeper-store"
import { useAudioStore } from "../../stores/audio-store"
import { useVisibilityManager } from "../../composables/useVisibilityManager"
import { useMobileMediaDisplay } from "../../composables/useMobileMediaDisplay.js"
import { artistUtils } from "../../utils/artistUtils.js"

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  sectionName: {
    type: String,
    default: 'search'
  },
  parentId: {
    type: String,
    default: ''
  },
  showRemove: {
    type: Boolean,
    default: false
  },
  viewMode: {
    type: String,
    default: 'list' // 'list' or 'grid'
  }
})

const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const audioStore = useAudioStore()
const visibilityManager = useVisibilityManager()

// Get mobile media display for track
const { displayClass, backgroundStyle, hasImage, trackId } = useMobileMediaDisplay(computed(() => props.track))

const emit = defineEmits(['remove'])

// Computed property to check if this track is playing
const isPlaying = computed(() => audioStore.mobileIsTrackPlaying(props.track.id))

// Utility function for formatting artist names
const formatArtistNames = (artists) => {
  // Handle both string and array formats for backward compatibility
  if (typeof artists === 'string') {
    return artists
  }
  if (!artists || !Array.isArray(artists)) {
    return 'Unknown Artist'
  }
  return artistUtils.formatArtistNamesSimple(artists)
}

const handleTrackClick = async () => {
  if (props.showRemove) {
    // For queue items, handle audio playback
    handleAudioPlayback()
  } else {
    // For regular tracks, add to queue and get track details
    queueStore.addToQueue(props.track)
    deeperStore.getTrackDetails(props.track, props.sectionName, props.parentId)

    // Also play audio preview if available
    const previewUrl = props.track.preview_url || props.track.previewUrl
    if (previewUrl) {
      await audioStore.mobileToggleTrack(props.track.id, previewUrl)
    }
  }
}

const handleAudioPlayback = () => {
  // Get preview URL from track
  const previewUrl = props.track.preview_url || props.track.previewUrl
  console.log(59)
  // Use global audio store to toggle track
  console.log(props.track)
  audioStore.mobileToggleTrack(props.track?.id, previewUrl)
}

const handleAddToQueue = (event) => {
  event.stopPropagation()
  queueStore.addToQueue(props.track)
}

const handleDeeperTrack = async (event) => {
  event.stopPropagation()

  // Add track data to deeper store
  const trackData = {
    ...props.track,
    type: 'track',
    parentKey: props.sectionName
  }

  // Add to appropriate section based on context
  let sectionName = 'topTracks'
  if (props.sectionName === 'yourPlaylists' || props.sectionName === 'spotifyPlaylists') {
    sectionName = 'playlistTracks'
  } else if (props.sectionName === 'savedTracks') {
    sectionName = 'savedTracks'
  } else if (props.sectionName === 'newReleases') {
    sectionName = 'albumTracks'
  }

  await deeperStore.getTrackDetails(props.track, sectionName)

  // Show the MobileDeeperTracks component after ensuring proper rendering
  const trackKey = `${props.track.type || 'track'}_${props.track.id}__p:${props.sectionName}__`

  // Use nextTick to ensure the component is rendered before trying to show it
  await nextTick()
  visibilityManager.showComponent(trackKey)
  console.log('Showing deeper track for:', props.track.name, 'with key:', trackKey)
}

const handleAudioPreview = async (event) => {
  event.stopPropagation()
  if (hasImage.value) {
    await audioStore.mobileToggleTrack(trackId.value, props.track.preview_url || props.track.previewUrl)
  }
}

const handleRemove = (event) => {
  event.stopPropagation()
  // Stop audio if this track is playing
  if (audioStore.mobileIsTrackPlaying(props.track.id)) {
    audioStore.mobileStopCurrentAudio()
  }
  emit('remove')
}

const isInQueue = () => {
  return queueStore.isInQueue(props.track.id)
}
</script>

<template>
  <!-- List View -->
  <div v-if="viewMode === 'list'" class="mobile-track-item list-view" @click="handleTrackClick">
    <div class="track-image">
      <div class="track-cover"
           :class="displayClass"
           :style="backgroundStyle"
           @click="handleAudioPreview">
        <div v-if="!hasImage" class="no-image">
          <span class="no-image-icon">🎵</span>
        </div>
        <div v-if="hasImage && audioStore.mobileIsTrackPlaying(trackId)" class="playing-indicator">
          <span class="playing-icon">▶️</span>
        </div>
      </div>
    </div>

    <div class="track-details">
      <div class="track-name">
        {{ track.name }}
        <span v-if="showRemove && isPlaying" class="playing-indicator">▶️</span>
      </div>
      <div class="track-artists">{{ formatArtistNames(track.artists) }}</div>
    </div>

    <div class="track-actions">
      <button
        v-if="!showRemove"
        class="deeper-btn"
        @click="handleDeeperTrack"
        title="View track details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <button
        v-if="!showRemove"
        class="queue-btn"
        :class="{ 'in-queue': isInQueue() }"
        @click="handleAddToQueue"
        :title="isInQueue() ? 'Remove from queue' : 'Add to queue'"
      >
        <svg v-if="!isInQueue()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
        </svg>
      </button>

      <button
        v-else
        class="remove-btn"
        @click="handleRemove"
        title="Remove from queue"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Grid View -->
  <div v-else class="mobile-track-item grid-view" @click="handleTrackClick">
    <div class="grid-cover"
         :class="displayClass"
         :style="backgroundStyle"
         @click="handleAudioPreview">
      <div v-if="!hasImage" class="no-image">
        <span class="no-image-icon">🎵</span>
      </div>
      <div v-if="hasImage && audioStore.mobileIsTrackPlaying(trackId)" class="playing-indicator">
        <span class="playing-icon">▶️</span>
      </div>
      <div class="grid-overlay">
        <div class="grid-actions">
          <button
            v-if="!showRemove"
            class="grid-deeper-btn"
            @click="handleDeeperTrack"
            title="View track details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <button
            v-if="!showRemove"
            class="grid-queue-btn"
            :class="{ 'in-queue': isInQueue() }"
            @click="handleAddToQueue"
            :title="isInQueue() ? 'Remove from queue' : 'Add to queue'"
          >
            <svg v-if="!isInQueue()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
          </button>

          <button
            v-else
            class="grid-remove-btn"
            @click="handleRemove"
            title="Remove from queue"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="grid-info">
      <div class="grid-name">{{ track.name }}</div>
      <div class="grid-artists">{{ formatArtistNames(track.artists) }}</div>
    </div>
  </div>
</template>

<style scoped>
</style>
