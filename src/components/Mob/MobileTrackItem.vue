<script setup>
import { computed } from 'vue'
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
  }
})

const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const audioStore = useAudioStore()
const visibilityManager = useVisibilityManager()

// Get mobile media display for track
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => props.track))

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
  
  deeperStore.addToSection(sectionName, trackData)
  deeperStore.setCurrentSection(sectionName)
  
  // Show the MobileDeeperTracks component with a small delay to ensure proper rendering
  const trackKey = `track_${props.track.id}__p:${props.sectionName}__`
  
  // Use setTimeout to ensure the component is shown after the current event cycle
  setTimeout(() => {
    visibilityManager.showComponent(trackKey)
    console.log('Showing deeper track for:', props.track.name, 'with key:', trackKey)
  }, 100)
}

const handleAudioPreview = async (event) => {
  event.stopPropagation()
  if (hasPreview.value && previewUrl.value) {
    await audioStore.mobileToggleTrack(trackId.value, previewUrl.value)
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
  <div class="mobile-track-item" @click="handleTrackClick">
    <div class="track-image">
      <div class="track-cover"
           :class="displayClass"
           :style="backgroundStyle"
           @click="handleAudioPreview">
        <div v-if="!hasImage" class="no-image">
          <span class="no-image-icon">🎵</span>
        </div>
        <div v-if="hasPreview && audioStore.mobileIsTrackPlaying(trackId)" class="playing-indicator">
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
</template>

<style scoped>
.mobile-track-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.mobile-track-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(2px);
}

.track-image {
  flex-shrink: 0;
  min-width: 48px;
}

.track-cover {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-cover:hover {
  transform: scale(1.05);
}

/* Display classes for mobile */
.mobile-playable {
  cursor: pointer;
}

.mobile-playable:hover {
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.mobile-unplayable {
  cursor: default;
}

.mobile-half-opacity {
  opacity: 0.6;
}

.mobile-no-image {
  background: rgba(255, 255, 255, 0.1);
}

.no-image {
  background: rgba(255, 255, 255, 0.1);
}

.no-image-icon {
  font-size: 20px;
  color: #a0a0a0;
}

.playing-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.5s ease-in-out infinite;
}

.playing-icon {
  font-size: 12px;
  color: #ffffff;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.track-details {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  max-width: calc(100% - 160px); /* Account for image and two buttons */
}

.track-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.playing-indicator {
  font-size: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.track-artists {
  font-size: 12px;
  color: #a0a0a0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.deeper-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #a0a0a0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 32px;
}

.deeper-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: scale(1.1);
}

.deeper-btn svg {
  width: 16px;
  height: 16px;
}

.queue-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 32px;
}

.queue-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.queue-btn.in-queue {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.queue-btn.in-queue:hover {
  background: rgba(34, 197, 94, 0.2);
}

.queue-btn svg {
  width: 16px;
  height: 16px;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 32px;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .mobile-track-item {
    padding: 8px;
    gap: 8px;
  }

  .track-cover {
    width: 36px;
    height: 36px;
  }

  .track-image {
    min-width: 36px;
  }

  .track-details {
    max-width: calc(100% - 140px); /* Account for image and two buttons on mobile */
  }

  .track-name {
    font-size: 13px;
  }

  .track-artists {
    font-size: 11px;
  }

  .deeper-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
  }

  .deeper-btn svg {
    width: 14px;
    height: 14px;
  }

  .queue-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
  }

  .queue-btn svg {
    width: 14px;
    height: 14px;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
  }

  .remove-btn svg {
    width: 14px;
    height: 14px;
  }
}
</style>
