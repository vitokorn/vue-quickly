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
  return artistUtils.formatArtistNames(artists)
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
  const baseClass = 'con3'
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

<style scoped>
.con3 {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 16px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.con3::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.con3:hover::before {
  opacity: 1;
}

.con3:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.con3.selected {
  border: 3px solid var(--active-tab);
  box-shadow: 0 0 20px rgba(240, 55, 165, 0.4);
}

.con3.half-opacity {
  opacity: 0.6;
}

.con3.half-opacity:hover {
  opacity: 0.8;
}

/* Audio element styling */
audio {
  display: none;
}

/* Focus styles for accessibility */
.con3:focus {
  outline: 2px solid var(--active-tab);
  outline-offset: 2px;
}

/* Dark mode support */
:root.dark .con3 {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root.dark .con3:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}
</style>
