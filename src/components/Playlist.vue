<script setup>
import {computed, ref} from 'vue'
import {useMediaDisplay} from '../composables/useMediaDisplay.js'
import {artistUtils} from '../utils/artistUtils.js'
import TrackCover from './TrackCover.vue'
import SortTracks from './SortTracks.vue'
import PlaylistTrackItem from './PlaylistTrackItem.vue'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  },
  sortedTracks: {
    type: Array,
    default: () => []
  },
  selectedItem: {
    type: String,
    default: ''
  },
  unplayableTracks: {
    type: Boolean,
    default: false
  },
  trackPrefix: {
    type: String,
    default: '1'
  }
})

const selectedSortOption = ref('')
const mobileClass = ref(false)

const emit = defineEmits([
  'refresh',
  'track-click',
  'track-hover',
  'track-leave',
  'sort-change'
])

// Utility function for formatting artist names
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNamesSimple(artists)
}

// Media display composable for playlist cover
const {image: coverImage, hasImage: hasCover} = useMediaDisplay(
    computed(() => props.playlist),
    props.playlist?.images?.[0]
)

// Event handlers
const handleRefresh = (event) => {
  emit('refresh', event)
}

const handleTrackClick = (track, event) => {
  emit('track-click', track, event)
}

const handleTrackHover = (event) => {
  emit('track-hover', event)
}

const handleTrackLeave = (event) => {
  emit('track-leave', event)
}

const handleSortChange = (value) => {
  emit('sort-change', value)
}
mobileClass.value = window.innerWidth < 768;
window.addEventListener('resize', () => {
  mobileClass.value = window.innerWidth < 768;
})
</script>

<template>
  <div class="playlist" :id="'p' + playlist.id">
    <!-- Playlist Header -->
    <div class="modern-playlist-header row">
      <div class="col-sm-6 col-3 col-md-3 col-lg-3" :class="{'col-6': mobileClass}">
        <TrackCover
            :d="playlist"
            :cover="coverImage"
            v-if="hasCover"
        />
      </div>
      <div class="playlist-info col-sm-6 col-md-6 col-lg-6" :class="{'col-6': mobileClass}">
        <div class="playlist-title-section">
          <h2 class="playlist-title">{{ playlist.name }}</h2>
          <button class="refresh-button" @click="handleRefresh">
            <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
          </button>
        </div>
        <div class="playlist-description" v-html="playlist.description"></div>
      </div>
      <div class="col-sm-12 col-md-3 col-lg-3" :class="{'col-12': mobileClass}">
        <a class="spotify-link"
           :href="playlist.external_urls?.spotify"
           target="_blank"
           rel="noopener">
          <span class="link-icon">🎧</span>
          Open in Spotify
        </a>
        <SortTracks v-model="selectedSortOption" @update:model-value="handleSortChange"/>
      </div>
    </div>

    <!-- Tracks List -->
    <div class="tracks-container" v-if="playlist.tracks">
      <template v-for="(trackItem, index) of sortedTracks" :key="index">
        <template v-if="trackItem.track">
          <PlaylistTrackItem
              :track="trackItem.track"
              :track-item="trackItem"
              :selected="selectedItem === trackPrefix + trackItem.track.id"
              :unplayable-tracks="unplayableTracks"
              @click="handleTrackClick"
              @hover="handleTrackHover"
              @leave="handleTrackLeave"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
