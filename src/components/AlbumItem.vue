<script setup>
import { computed } from 'vue'
import { useMediaDisplay } from '../composables/useMediaDisplay.js'
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

const emit = defineEmits(['click'])

// Utility function for formatting artist names
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNames(artists)
}

// Media display composable for album
const { 
  hasImage, 
  displayClass, 
  backgroundStyle 
} = useMediaDisplay(computed(() => props.album))

// Event handlers
const handleClick = (event) => {
  emit('click', props.album, event)
}

// Computed class for the album item
const albumClass = computed(() => {
  const baseClass = 'con3'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${displayClass.value} ${selectedClass}`.trim()
})
</script>

<template>
  <div tabindex="0"
       :class="albumClass"
       :style="backgroundStyle"
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

.con3.no-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.con3.no-image::before {
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
