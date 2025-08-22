<script setup>
import { computed } from 'vue'
import { artistUtils } from '../utils/artistUtils.js'

const props = defineProps({
  album: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  albumPrefix: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click', 'hover', 'leave'])

// Utility function for formatting artist names
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNamesSimple(artists)
}

// Event handlers
const handleClick = (event) => {
  emit('click', props.album, event)
}

const handleHover = (event) => {
  emit('hover', event)
}

const handleLeave = (event) => {
  emit('leave', event)
}

// Computed properties for display logic
const hasImage = computed(() => props.album.images && props.album.images[0])
const hasTracks = computed(() => props.album.tracks && props.album.tracks.items && props.album.tracks.items.length > 0)
const hasPreview = computed(() => hasTracks.value && props.album.tracks.items[0].preview_url)

// Determine display conditions
const shouldShowWithPreview = computed(() => hasImage.value && hasPreview.value)
const shouldShowWithoutPreview = computed(() => hasImage.value && hasTracks.value && !hasPreview.value)
const shouldShowNoImageWithPreview = computed(() => !hasImage.value && hasPreview.value)
const shouldShowBasic = computed(() => !hasImage.value && !hasPreview.value)

// Computed class for the album item
const albumClass = computed(() => {
  const baseClass = 'media-card'
  const selectedClass = props.selected ? 'selected' : ''
  const opacityClass = (shouldShowWithoutPreview.value || shouldShowBasic.value) ? 'half-opacity' : ''
  return `${baseClass} ${selectedClass} ${opacityClass}`.trim()
})

// Background style
const backgroundStyle = computed(() => {
  if (hasImage.value) {
    return { 'background-image': `url(${props.album.images[0].url})` }
  }
  return {}
})

// Audio source
const audioSrc = computed(() => {
  if (hasPreview.value) {
    return props.album.tracks.items[0].preview_url
  }
  return ''
})
</script>

<template>
  <div v-if="shouldShowWithPreview"
       tabindex="0"
       :class="albumClass"
       :style="backgroundStyle"
       @click.stop="handleClick"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    {{ formatArtistNames(album.artists) }} - {{ album.name }}
    <audio preload="auto" :src="audioSrc"></audio>
  </div>

  <div v-else-if="shouldShowWithoutPreview"
       tabindex="0"
       :class="albumClass"
       :style="backgroundStyle"
       @click.stop="handleClick">
    {{ formatArtistNames(album.artists) }} - {{ album.name }}
    <audio preload="auto"></audio>
  </div>

  <div v-else-if="shouldShowNoImageWithPreview"
       :class="albumClass"
       @click.stop="handleClick"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    {{ formatArtistNames(album.artists) }} - {{ album.name }}
    <audio preload="auto" :src="audioSrc"></audio>
  </div>

  <div v-else-if="shouldShowBasic"
       tabindex="0"
       :class="albumClass"
       @click.stop="handleClick">
    {{ formatArtistNames(album.artists) }} - {{ album.name }}
  </div>
</template>
