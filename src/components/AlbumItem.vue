<script setup>
import {computed} from 'vue'
import {useMediaDisplay} from '../composables/useMediaDisplay.js'
import {artistUtils} from '../utils/artistUtils.js'

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

// Media display composable for album
const {
  hasImage,
  displayClass,
  backgroundStyle,
  audioPreload,
  audioSrc
} = useMediaDisplay(computed(() => props.album))

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

// Computed class for the album item
const albumClass = computed(() => {
  const baseClass = 'media-card'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${displayClass.value} ${selectedClass}`.trim()
})
</script>

<template>
  <div tabindex="0"
       :class="albumClass"
       :style="backgroundStyle"
       @click.stop="handleClick"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    <div class="track-overlay">
      <div class="track-info">
        <div class="track-artists">{{ formatArtistNames(album.artists) }}</div>
        <div class="track-name">{{ album.name }}</div>
      </div>
    </div>
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>
