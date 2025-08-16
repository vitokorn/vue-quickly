<script setup>
import { computed } from 'vue'
import { artistUtils } from '../utils/artistUtils.js'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['song', 'artist', 'album', 'playlist'].includes(value)
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

// Event handlers
const handleClick = (event) => {
  emit('click', props.item, event)
}

const handleHover = (event) => {
  emit('hover', event)
}

const handleLeave = (event) => {
  emit('leave', event)
}

// Computed properties for different item types
const hasPreview = computed(() => {
  if (props.type === 'song') {
    return props.item.preview_url
  }
  if (props.type === 'artist') {
    return props.item.preview_url
  }
  return false
})

const hasImage = computed(() => {
  if (props.type === 'song') {
    return props.item.album && props.item.album.images && props.item.album.images[0]
  }
  if (props.type === 'artist') {
    return props.item.images && props.item.images[1]
  }
  if (props.type === 'album') {
    return props.item.images && props.item.images[0]
  }
  if (props.type === 'playlist') {
    return props.item.images && props.item.images[0]
  }
  return false
})

const imageUrl = computed(() => {
  if (props.type === 'song' && hasImage.value) {
    return props.item.album.images[0].url
  }
  if (props.type === 'artist' && hasImage.value) {
    return props.item.images[1].url
  }
  if ((props.type === 'album' || props.type === 'playlist') && hasImage.value) {
    return props.item.images[0].url
  }
  return ''
})

const displayText = computed(() => {
  if (props.type === 'song') {
    return `${formatArtistNames(props.item.artists)} - ${props.item.name}`
  }
  if (props.type === 'artist') {
    return props.item.name
  }
  if (props.type === 'album') {
    return `${formatArtistNames(props.item.artists)} - ${props.item.name}`
  }
  if (props.type === 'playlist') {
    return props.item.name
  }
  return ''
})

const itemId = computed(() => {
  return `${props.type}${props.item.id}`
})

// Computed class for the item
const itemClass = computed(() => {
  const baseClass = 'itemImg itemImg-xs itemImg-search'
  const selectedClass = props.selected ? 'selected' : ''
  const opacityClass = (!hasPreview.value && props.unplayableTracks) ? 'half-opacity' : ''
  return `${baseClass} ${selectedClass} ${opacityClass}`.trim()
})

// Background style
const backgroundStyle = computed(() => {
  if (hasImage.value) {
    return { 'background-image': `url(${imageUrl.value})` }
  }
  return {}
})

// Audio source
const audioSrc = computed(() => {
  if (hasPreview.value) {
    return props.item.preview_url
  }
  return ''
})

// Determine if item should be displayed
const shouldDisplay = computed(() => {
  if (hasPreview.value) {
    return true
  }
  if (hasImage.value && !hasPreview.value) {
    return props.unplayableTracks
  }
  return true
})
</script>

<template>
  <div v-if="shouldDisplay"
       class="playable-search"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    <div v-if="hasPreview"
         tabindex="0"
         :class="itemClass"
         :id="itemId"
         :style="backgroundStyle"
         @click="handleClick"
         @mouseover="handleHover"
         @mouseleave="handleLeave">
      {{ displayText }}
      <audio preload="auto" :src="audioSrc"></audio>
    </div>
    <div v-else-if="hasImage && unplayableTracks"
         tabindex="0"
         :class="itemClass"
         :id="itemId"
         :style="backgroundStyle"
         @click="handleClick">
      {{ displayText }}
      <audio preload="auto"></audio>
    </div>
    <div v-else
         tabindex="0"
         :class="itemClass"
         :id="itemId"
         @click="handleClick">
      {{ displayText }}
    </div>
  </div>
</template>

<style scoped>
.playable-search {
  margin-bottom: 8px;
}

.itemImg {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 12px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-weight: 500;
  font-size: 14px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.itemImg::before {
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

.itemImg:hover::before {
  opacity: 1;
}

.itemImg:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.itemImg.selected {
  border: 2px solid var(--active-tab);
  box-shadow: 0 0 15px rgba(240, 55, 165, 0.4);
}

.itemImg.half-opacity {
  opacity: 0.6;
}

.itemImg.half-opacity:hover {
  opacity: 0.8;
}

.itemImg-xs {
  min-width: 120px;
  max-width: 200px;
}

.itemImg-search {
  margin: 4px;
}

/* Audio element styling */
audio {
  display: none;
}

/* Focus styles for accessibility */
.itemImg:focus {
  outline: 2px solid var(--active-tab);
  outline-offset: 2px;
}

/* Dark mode support */
:root.dark .itemImg {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:root.dark .itemImg:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
</style>
