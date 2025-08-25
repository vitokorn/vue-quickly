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
  return artistUtils.formatArtistNamesSimple(artists)
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
  const baseClass = 'search-result-item'
  const selectedClass = props.selected ? 'search-result-item--selected' : ''
  const opacityClass = (!hasPreview.value && props.unplayableTracks) ? 'search-result-item--disabled' : ''
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
    <div v-if="hasPreview"
         tabindex="0"
         :class="itemClass"
         :id="itemId"
         @click="handleClick"
    >
      <div class="search-result-content" @mouseenter="handleHover" @mouseleave="handleLeave">
        <div class="search-result-image" :style="backgroundStyle"></div>
        <div class="search-result-text">{{ displayText }}</div>
      </div>
      <audio preload="auto" :src="audioSrc"></audio>
    </div>
    <div v-else-if="hasImage && unplayableTracks"
         tabindex="0"
         :class="itemClass"
         :id="itemId"
         @click="handleClick">
      <div class="search-result-content" @mouseenter="handleHover" @mouseleave="handleLeave">
        <div class="search-result-image" :style="backgroundStyle"  style="opacity: 0.5;"
        ></div>
        <div class="search-result-text">{{ displayText }}</div>
      </div>
      <audio preload="auto"></audio>
    </div>
    <div v-else
         tabindex="0"
         :class="itemClass"
         :id="itemId"
         @click="handleClick">
      <div class="search-result-content" @mouseenter="handleHover" @mouseleave="handleLeave">
        <div class="search-result-image search-result-image--placeholder"></div>
        <div class="search-result-text">{{ displayText }}</div>
      </div>
    </div>
</template>

<style scoped>
</style>
