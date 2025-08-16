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
