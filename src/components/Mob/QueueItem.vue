<script setup>
import {computed} from 'vue'
import {useMobileMediaDisplay} from '../../composables/useMobileMediaDisplay.js'
import {artistUtils} from '../../utils/artistUtils.js'
import {useAudioStore} from '../../stores/audio-store.js'

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

const audioStore = useAudioStore()

// Media display composable for track
const {
  hasPreview,
  audioPreload,
  audioSrc
} = useMobileMediaDisplay(computed(() => props.track))

// Event handlers
const handleClick = async (event) => {
  emit('click', props.trackItem || props.track, event)

  // Play/pause audio on click
  const previewUrl = props.track.preview_url || props.track.previewUrl
  if (previewUrl) {
    await audioStore.mobileToggleTrack(props.track.id, previewUrl)
  }
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
const resolveCover = computed(() => {
  const track = props.track
  if (track.image) {
    return track.image.url
  } else if (track.album?.image) {
    return track.album.image.url
  }
})

const resolveArtist = computed(() => {
  const track = props.track
  return track.artists
})

// Check if this track is currently playing
const isPlaying = computed(() => {
  return audioStore.mobileIsTrackPlaying(props.track.id)
})

</script>

<template>
  <div
      class="song-item"
      @click="handleClick"
  >
    <div class="item-cover" style="position: relative">
      <img
          :src="resolveCover"
          :alt="track.name"
          :class="getDisplayClass(track)"
      />
      <div v-if="hasPreview && isPlaying" class="playing-indicator">
        <span class="playing-icon">▶️</span>
      </div>
    </div>
    <div class="item-info">
      <div class="item-name">
        {{ track.name }}

      </div>
      <div class="item-artist">
        {{ resolveArtist }}
      </div>
    </div>
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>

<style scoped>

</style>
