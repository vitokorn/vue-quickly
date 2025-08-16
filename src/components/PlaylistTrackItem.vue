<script setup>
import { computed } from 'vue'
import { useMediaDisplay } from '../composables/useMediaDisplay.js'
import { artistUtils } from '../utils/artistUtils.js'

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  trackItem: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  unplayableTracks: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'hover', 'leave'])

// Utility function for formatting artist names
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNames(artists)
}

// Media display composable for track
const {
  hasPreview,
  hasImage,
  displayClass,
  backgroundStyle,
  audioPreload,
  audioSrc
} = useMediaDisplay(computed(() => props.track))

// Event handlers
const handleClick = (event) => {
  emit('click', props.trackItem, event)
}

const handleHover = (event) => {
  emit('hover', event)
}

const handleLeave = (event) => {
  emit('leave', event)
}

// Determine if track should be displayed based on conditions
const shouldDisplay = computed(() => {
  // If track has preview URL and image, always show
  if (hasPreview.value && hasImage.value) {
    return true
  }

  // If track has image but no preview URL, show only if unplayable tracks are enabled
  if (hasImage.value && !hasPreview.value) {
    return props.unplayableTracks
  }

  // If track has preview URL but no image, always show
  if (hasPreview.value && !hasImage.value) {
    return true
  }

  // If track has neither preview URL nor image, show only if unplayable tracks are enabled
  return props.unplayableTracks
})

// Computed class for the track item
const trackClass = computed(() => {
  const baseClass = 'con3'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${displayClass.value} ${selectedClass}`.trim()
})
</script>

<template>
  <div v-if="shouldDisplay"
       tabindex="0"
       :class="trackClass"
       :style="backgroundStyle"
       @click.stop="handleClick"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    <div class="track-overlay">
      <div class="track-info">
        <div class="track-artists">{{ formatArtistNames(track.artists) }}</div>
        <div class="track-name">{{ track.name }}</div>
      </div>
    </div>
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>

