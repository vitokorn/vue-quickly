<script setup>
import { computed } from 'vue'
import { useMobileMediaDisplay } from '../../composables/useMobileMediaDisplay.js'
import { artistUtils } from '../../utils/artistUtils.js'

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  trackItem: {
    type: Object,
    required: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  unplayableTracks: {
    type: Boolean,
    default: false
  },
  num: {
    type: Number,
    required: true
  },
  viewMode: {
    type: String,
    default: 'list'
  }
})

const emit = defineEmits(['click', 'hover', 'leave'])

// Utility function for formatting artist names
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNamesSimple(artists)
}

// Media display composable for track
const {
  hasPreview,
  hasImage,
  displayClass,
  backgroundStyle,
  audioPreload,
  audioSrc
} = useMobileMediaDisplay(computed(() => props.track))

// Event handlers
const handleClick = (event) => {
  emit('click', props.trackItem || props.track, event)
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
  const baseClass = 'mobile-track-item'
  const viewClass = props.viewMode === 'grid' ? 'grid' : 'list-view'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${viewClass} ${selectedClass}`.trim()
})
</script>

<template>
  <div v-if="shouldDisplay"
       tabindex="0"
       :class="trackClass"
       @click.stop="handleClick"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    <!-- Grid View Structure -->
    <template v-if="viewMode === 'grid'">
      <div class="track-image">
          <img
              class="track-cover"
            v-if="track.album && track.album.images && track.album.images[0]"
            :src="track.album.images[0].url"
            :alt="track.name"
            @error="$event.target.style.display = 'none'"
          />
          <div v-else class="no-image">
            <span class="no-image-icon">🎵</span>
          </div>
        </div>

      <div class="track-details">
        <div class="track-name">{{ track.name }}</div>
        <div class="track-artists">{{ formatArtistNames(track.artists) }}</div>
      </div>

      <div class="track-actions">
        <!-- Action buttons can be added here if needed -->
      </div>
    </template>

    <!-- List View Structure -->
    <template v-else>
      <div class="mobile-track-overlay">
        <!-- Track Cover Image -->
        <div >
          <img
              class="track-cover"
            v-if="track.album && track.album.images && track.album.images[0]"
            :src="track.album.images[0].url"
            :alt="track.name"
            @error="$event.target.style.display = 'none'"
          />
          <div v-else class="no-image">
            <span>🎵</span>
          </div>
        </div>

        <!-- Track Info -->
        <div class="track-info">
          <div class="track-artists">{{ formatArtistNames(track.artists) }}</div>
          <div class="track-name">{{ track.name }}</div>
        </div>
      </div>
    </template>
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>

<style scoped>

</style>
