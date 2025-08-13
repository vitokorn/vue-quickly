<script setup>
import { computed } from 'vue'
import { artistUtils } from '../../utils/artistUtils'

const props = defineProps({
  tracks: {
    type: Array,
    required: true
  },
  selectedItem: {
    type: String,
    default: null
  },
  showUnplayable: {
    type: Boolean,
    default: true
  },
  onTrackClick: {
    type: Function,
    required: true
  },
  onTrackHover: {
    type: Function,
    default: null
  },
  onTrackLeave: {
    type: Function,
    default: null
  },
  queueTrack: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['track-click', 'track-hover', 'track-leave'])

const handleTrackClick = (track, event) => {
  if (props.onTrackClick) {
    props.onTrackClick(track, event)
  }
  emit('track-click', track, event)
  
  if (props.queueTrack) {
    props.queueTrack(track)
  }
}

const handleTrackHover = (event) => {
  if (props.onTrackHover) {
    props.onTrackHover(event)
  }
  emit('track-hover', event)
}

const handleTrackLeave = (event) => {
  if (props.onTrackLeave) {
    props.onTrackLeave(event)
  }
  emit('track-leave', event)
}

const hasPreview = (track) => {
  return !!track.preview_url
}

const hasImage = (track) => {
  return !!(track.album && track.album.images && track.album.images[0])
}

const getTrackImage = (track) => {
  return track.album?.images?.[0]?.url
}
</script>

<template>
  <div class="track-list">
    <template v-for="(track, index) in tracks" :key="track.id || index">
      <!-- Track with preview and image -->
      <div 
        v-if="hasPreview(track) && hasImage(track)"
        :id="track.id"
        tabindex="0"
        class="con3 track-item"
        :class="{ selected: selectedItem === track.id }"
        :style="{ backgroundImage: `url(${getTrackImage(track)})` }"
        @click="handleTrackClick(track, $event)"
        @mouseover="handleTrackHover"
        @mouseleave="handleTrackLeave"
      >
        {{ artistUtils.formatArtistNames(track.artists) }} - {{ track.name }}
        <audio preload="auto" :src="track.preview_url"></audio>
      </div>

      <!-- Track without preview but with image -->
      <div 
        v-else-if="!hasPreview(track) && hasImage(track) && showUnplayable"
        :id="track.id"
        tabindex="0"
        class="con3 track-item half-opacity"
        :class="{ selected: selectedItem === track.id }"
        :style="{ backgroundImage: `url(${getTrackImage(track)})` }"
        @click="handleTrackClick(track, $event)"
      >
        {{ artistUtils.formatArtistNames(track.artists) }} - {{ track.name }}
        <audio preload="auto"></audio>
      </div>

      <!-- Track with preview but without image -->
      <div 
        v-else-if="hasPreview(track) && !hasImage(track)"
        :id="track.id"
        tabindex="0"
        class="con3 track-item"
        :class="{ selected: selectedItem === track.id }"
        @click="handleTrackClick(track, $event)"
        @mouseover="handleTrackHover"
        @mouseleave="handleTrackLeave"
      >
        {{ artistUtils.formatArtistNames(track.artists) }} - {{ track.name }}
        <audio preload="auto" :src="track.preview_url"></audio>
      </div>

      <!-- Track without preview and without image -->
      <div 
        v-else
        :id="track.id"
        tabindex="0"
        class="con3 track-item half-opacity"
        :class="{ selected: selectedItem === track.id }"
        @click="handleTrackClick(track, $event)"
      >
        {{ artistUtils.formatArtistNames(track.artists) }} - {{ track.name }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.track-list {
  display: flex;
  flex-wrap: wrap;
}

.track-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.track-item:hover {
  transform: scale(1.02);
}

.track-item.selected {
  border: 2px solid var(--active-tab);
}

.half-opacity {
  opacity: 0.7;
}
</style>

