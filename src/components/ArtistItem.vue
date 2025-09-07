<script setup>
import { computed } from 'vue'
import { useMediaDisplay } from '../composables/useMediaDisplay.js'

const props = defineProps({
  artist: {
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
  },
  artistPrefix: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click', 'hover', 'leave'])

// Media display composable for artist
const {
  hasPreview,
  hasImage,
  displayClass,
  backgroundStyle,
  audioPreload,
  audioSrc
} = useMediaDisplay(computed(() => props.artist))

// Event handlers
const handleClick = (event) => {
  emit('click', props.artist, event)
}

const handleHover = (event) => {
  emit('hover', event)
}

const handleLeave = (event) => {
  emit('leave', event)
}

// Determine if artist should be displayed based on conditions
const shouldDisplay = computed(() => {
  // If artist has preview URL and image, always show
  if (hasPreview.value && hasImage.value) {
    return true
  }

  // If artist has image but no preview URL, show only if unplayable tracks are enabled
  if (hasImage.value && !hasPreview.value) {
    return props.unplayableTracks
  }

  // If artist has preview URL but no image, always show
  if (hasPreview.value && !hasImage.value) {
    return true
  }

  // If artist has neither preview URL nor image, show only if unplayable tracks are enabled
  return props.unplayableTracks
})

// Computed class for the artist item
const artistClass = computed(() => {
  const baseClass = 'media-card'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${displayClass.value} ${selectedClass}`.trim()
})
</script>

<template>
  <div v-if="shouldDisplay"
       tabindex="0"
       :class="artistClass"
       :style="backgroundStyle"
       @click.stop="handleClick"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    {{ artist.name }}
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>
