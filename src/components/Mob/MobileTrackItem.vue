<script setup>
import {computed} from 'vue'
import {useMobileMediaDisplay} from '../../composables/useMobileMediaDisplay.js'
import {artistUtils} from '../../utils/artistUtils.js'
import {useAudioStore} from "../../stores/audio-store.js";

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

const emit = defineEmits(['click', 'coverClick', 'infoClick', 'hover', 'leave'])

const audioStore = useAudioStore()

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

const handleCoverClick = (event) => {
  event.stopPropagation()
  emit('coverClick', props.trackItem || props.track, event)
}

const handleInfoClick = (event) => {
  event.stopPropagation()
  emit('infoClick', props.trackItem || props.track, event)
}

const handleHover = (event) => {
  emit('hover', event)
}

const handleLeave = (event) => {
  emit('leave', event)
}

const getReleasePreviewUrl = (release) => {
  console.log(release)
  if (release.tracks && release.tracks.items && release.tracks.items.length > 0) {
    return release.tracks.items[0].preview_url || release.tracks.items[0].previewUrl
  } else if (release.preview_url || release.previewUrl) {
    return release.preview_url || release.previewUrl
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
      class="song-item"
      @click="handleClick"
  >
    <div class="item-cover" @click="handleCoverClick" style="position: relative;">
      <img
          v-if="track.album && track.album.images && track.album.images[0]"
          :src="track.album.images[0].url"
          :alt="track.name"
          :class="getDisplayClass(track)"
      />
      <div v-else class="no-image">
        <span class="no-image-icon">🎵</span>
      </div>
      <!-- Playing indicator for artists with previews -->
      <div v-if="hasPreview && audioStore.mobileIsTrackPlaying(track.id)" class="playing-indicator">
        <span class="playing-icon">▶️</span>
      </div>
    </div>
    <div class="item-info" @click="handleInfoClick">
      <div class="item-name">{{ track.name }}</div>
      <div class="item-artist" v-if="track.artists">
        {{ formatArtistNames(track.artists) }}
      </div>
    </div>
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>

<style scoped>

</style>
