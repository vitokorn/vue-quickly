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
  <div class="mobile-track-item" @click="handleTrackClick">
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
</template>

<style scoped>
.mobile-track-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  margin-bottom: 8px;
}

.mobile-track-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.98);
}

.track-image {
  flex-shrink: 0;
}

.track-cover {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.track-cover:hover {
  transform: scale(1.05);
}

.track-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
}

.no-image-icon {
  font-size: 24px;
  opacity: 0.6;
}

.playing-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.5s ease-in-out infinite;
}

.playing-icon {
  font-size: 14px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.track-details {
  flex: 1;
  min-width: 0;
}

.track-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--title-color);
  margin-bottom: 4px;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 8px;
}

.track-name .playing-indicator {
  position: static;
  transform: none;
  width: 20px;
  height: 20px;
  background: var(--active-tab);
  animation: none;
}

.track-artists {
  font-size: 14px;
  color: var(--search-color);
  opacity: 0.8;
  line-height: 1.2;
}

.track-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.deeper-btn,
.queue-btn,
.remove-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: var(--title-color);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.deeper-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.queue-btn {
  background: rgba(240, 55, 165, 0.1);
  color: var(--active-tab);
}

.queue-btn:hover {
  background: rgba(240, 55, 165, 0.2);
  transform: translateY(-1px);
}

.queue-btn.in-queue {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.queue-btn.in-queue:hover {
  background: rgba(76, 175, 80, 0.2);
}

.remove-btn {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.remove-btn:hover {
  background: rgba(255, 71, 87, 0.2);
  transform: translateY(-1px);
}

.deeper-btn svg,
.queue-btn svg,
.remove-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .mobile-track-item {
    padding: 12px 16px;
    gap: 12px;
  }

  .track-cover {
    width: 50px;
    height: 50px;
  }

  .track-name {
    font-size: 14px;
  }

  .track-artists {
    font-size: 12px;
  }

  .track-actions {
    gap: 6px;
  }

  .deeper-btn,
  .queue-btn,
  .remove-btn {
    width: 32px;
    height: 32px;
    padding: 6px;
  }

  .deeper-btn svg,
  .queue-btn svg,
  .remove-btn svg {
    width: 14px;
    height: 14px;
  }
}

/* Dark theme support */
:root.dark .mobile-track-item {
  background: rgba(42, 46, 47, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

:root.dark .mobile-track-item:hover {
  background: rgba(42, 46, 47, 0.98);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:root.dark .track-cover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .no-image {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .deeper-btn,
:root.dark .queue-btn,
:root.dark .remove-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark .deeper-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark .queue-btn {
  background: rgba(240, 55, 165, 0.2);
  color: var(--active-tab);
}

:root.dark .queue-btn:hover {
  background: rgba(240, 55, 165, 0.3);
}

:root.dark .queue-btn.in-queue {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

:root.dark .queue-btn.in-queue:hover {
  background: rgba(76, 175, 80, 0.3);
}

:root.dark .remove-btn {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

:root.dark .remove-btn:hover {
  background: rgba(255, 71, 87, 0.3);
}

/* Dark-blue theme support */
:root.dark-blue .mobile-track-item {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

:root.dark-blue .mobile-track-item:hover {
  background: rgba(30, 41, 59, 0.98);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:root.dark-blue .track-cover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-blue .no-image {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-blue .deeper-btn,
:root.dark-blue .queue-btn,
:root.dark-blue .remove-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark-blue .deeper-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark-blue .queue-btn {
  background: rgba(240, 55, 165, 0.2);
  color: var(--active-tab);
}

:root.dark-blue .queue-btn:hover {
  background: rgba(240, 55, 165, 0.3);
}

:root.dark-blue .queue-btn.in-queue {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

:root.dark-blue .queue-btn.in-queue:hover {
  background: rgba(76, 175, 80, 0.3);
}

:root.dark-blue .remove-btn {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

:root.dark-blue .remove-btn:hover {
  background: rgba(255, 71, 87, 0.3);
}

/* DQ theme support */
:root.dq .mobile-track-item {
  background: rgba(28, 26, 45, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

:root.dq .mobile-track-item:hover {
  background: rgba(28, 26, 45, 0.98);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:root.dq .track-cover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dq .no-image {
  background: rgba(255, 255, 255, 0.1);
}

:root.dq .deeper-btn,
:root.dq .queue-btn,
:root.dq .remove-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dq .deeper-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dq .queue-btn {
  background: rgba(240, 55, 165, 0.2);
  color: var(--active-tab);
}

:root.dq .queue-btn:hover {
  background: rgba(240, 55, 165, 0.3);
}

:root.dq .queue-btn.in-queue {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

:root.dq .queue-btn.in-queue:hover {
  background: rgba(76, 175, 80, 0.3);
}

:root.dq .remove-btn {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

:root.dq .remove-btn:hover {
  background: rgba(255, 71, 87, 0.3);
}

:root.aero .mobile-track-item {
  background: rgba(43, 87, 154, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

:root.aero .mobile-track-item:hover {
  background: rgba(43, 87, 154, 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

:root.aero .track-cover {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:root.aero .no-image {
  background: rgba(255, 255, 255, 0.2);
}

:root.aero .deeper-btn,
:root.aero .queue-btn,
:root.aero .remove-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:root.aero .deeper-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

:root.aero .queue-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

:root.aero .queue-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

:root.aero .queue-btn.in-queue {
  background: rgba(76, 175, 80, 0.3);
  color: #4caf50;
}

:root.aero .queue-btn.in-queue:hover {
  background: rgba(76, 175, 80, 0.4);
}

:root.aero .remove-btn {
  background: rgba(255, 71, 87, 0.3);
  color: #ff4757;
}

:root.aero .remove-btn:hover {
  background: rgba(255, 71, 87, 0.4);
}

:root.cupertino .mobile-track-item {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .mobile-track-item:hover {
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 12px 32px rgba(31, 38, 135, 0.16);
  border-color: rgba(255, 255, 255, 0.75);
}

:root.cupertino .track-cover {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

:root.cupertino .no-image {
  background: rgba(255, 255, 255, 0.55);
}

:root.cupertino .deeper-btn,
:root.cupertino .queue-btn,
:root.cupertino .remove-btn {
  background: rgba(255, 255, 255, 0.45);
  color: var(--title-color);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

:root.cupertino .deeper-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .queue-btn {
  background: rgba(255, 255, 255, 0.5);
  color: var(--title-color);
}

:root.cupertino .queue-btn:hover {
  background: rgba(255, 255, 255, 0.6);
}

:root.cupertino .queue-btn.in-queue {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
}

:root.cupertino .queue-btn.in-queue:hover {
  background: rgba(76, 175, 80, 0.25);
}

:root.cupertino .remove-btn {
  background: rgba(255, 71, 87, 0.12);
  color: #b71c1c;
}

:root.cupertino .remove-btn:hover {
  background: rgba(255, 71, 87, 0.2);
}

:root.metro .mobile-track-item {
  background: #1f1f1f;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 16px 20px;
  margin-bottom: 8px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

:root.metro .mobile-track-item:hover {
  background: #2d2d2d;
  box-shadow: none;
  border-left-color: #0078d4;
}

:root.metro .track-cover {
  background: #333333;
  border: none;
  border-radius: 0;
  width: 60px;
  height: 60px;
}

:root.metro .no-image {
  background: #333333;
}

:root.metro .no-image-icon {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
}

:root.metro .track-name {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

:root.metro .track-artists {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .deeper-btn,
:root.metro .queue-btn,
:root.metro .remove-btn {
  background: transparent;
  color: #cccccc;
  border: none;
  border-radius: 0;
  width: 40px;
  height: 40px;
  padding: 8px;
}

:root.metro .deeper-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .queue-btn {
  background: transparent;
  color: #cccccc;
}

:root.metro .queue-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .queue-btn.in-queue {
  background: #0078d4;
  color: white;
}

:root.metro .queue-btn.in-queue:hover {
  background: #106ebe;
}

:root.metro .remove-btn {
  background: transparent;
  color: #ff4757;
}

:root.metro .remove-btn:hover {
  background: rgba(255, 71, 87, 0.2);
}

:root.metro .playing-indicator {
  background: #0078d4;
  border-radius: 0;
  width: 32px;
  height: 32px;
}

:root.metro .playing-icon {
  color: white;
  font-size: 14px;
}

/* Material theme support */
:root.material .mobile-track-item {
  background: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:root.material .mobile-track-item:hover {
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

:root.material .track-cover {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

:root.material .no-image {
  background: #f5f5f5;
}

:root.material .deeper-btn,
:root.material .queue-btn,
:root.material .remove-btn {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
  border: none;
}

:root.material .deeper-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}

:root.material .queue-btn {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

:root.material .queue-btn:hover {
  background: rgba(33, 150, 243, 0.2);
}

:root.material .queue-btn.in-queue {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

:root.material .queue-btn.in-queue:hover {
  background: rgba(76, 175, 80, 0.2);
}

:root.material .remove-btn {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

:root.material .remove-btn:hover {
  background: rgba(255, 71, 87, 0.2);
}
</style>
