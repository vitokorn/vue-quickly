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

// Computed class for the track item
const trackClass = computed(() => {
  const baseClass = 'mobile-track-item'
  const viewClass = props.viewMode === 'grid' ? 'grid' : 'list-view'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${viewClass} ${selectedClass}`.trim()
})
const getReleasePreviewUrl = (release) => {
  if (release.tracks && release.tracks.items && release.tracks.items.length > 0) {
    return release.tracks.items[0].preview_url
  }
  return null
}
const getDisplayClass = (release) => {
  const hasPreview = getReleasePreviewUrl(release)
  console.log('hasPreview', hasPreview)
  const hasImage = (release.images && release.images[0]) || (release.album?.images && release.album?.images[0])

  if (hasPreview && hasImage) {
    return 'playable'
  } else if (!hasPreview && hasImage) {
    return 'unplayable half-opacity'
  } else if (hasPreview && !hasImage) {
    return 'playable no-image'
  } else {
    return 'unplayable no-image half-opacity'
  }
}

</script>

<template>
  <div
       tabindex="0"
       :class="trackClass"
       @click.stop="handleClick"
       @mouseover="handleHover"
       @mouseleave="handleLeave">
    <!-- Grid View Structure -->
    <template v-if="viewMode === 'grid'">
      <div class="track-image">
          <img
              class="track-cover 2"
            v-if="track.album && track.album.images && track.album.images[0]"
            :src="track.album.images[0].url"
            :alt="track.name"
              :class="getDisplayClass(track)"
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
              class="track-cover 1"
            v-if="track.album && track.album.images && track.album.images[0]"
            :src="track.album.images[0].url"
            :alt="track.name"
              :class="getDisplayClass(track)"
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
