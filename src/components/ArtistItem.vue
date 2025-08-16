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
  const baseClass = 'con3'
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

.con3.no-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.con3.no-image::before {
  display: none;
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
