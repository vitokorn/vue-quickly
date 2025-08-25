<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed, onMounted} from "vue";
import SortTracks from "./SortTracks.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";
import TrackCover from "./TrackCover.vue";

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const selectedDeeperPlaylistSortOption = ref("")
const componentRef = ref(null)
const mobileClass = ref(false)

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedDeeperPlaylistItems = computed(() => {
  const items = props.d.tracks?.items || []
  if (!selectedDeeperPlaylistSortOption.value) return items

  return [...items].sort((a, b) => {
    const trackA = a.track
    const trackB = b.track

    switch (selectedDeeperPlaylistSortOption.value) {
      case 'track':
        return trackA.name.localeCompare(trackB.name)
      case 'album':
        return trackA.album.name.localeCompare(trackB.album.name)
      case 'artist':
        return trackA.artists[0].name.localeCompare(trackB.artists[0].name)
      case 'popularity':
        return trackB.popularity - trackA.popularity
      case 'release_date':
        return new Date(trackB.album.release_date) - new Date(trackA.album.release_date)
      case 'duration':
        return trackA.duration_ms - trackB.duration_ms
      default:
        return 0
    }
  })
})

// Helper function to get media display for a track
function getTrackMediaDisplay(track) {
  return useMediaDisplay(computed(() => track))
}

const {image: coverImage, hasImage: hasCover} = useMediaDisplay(
    computed(() => props.d),
    props.images?.[0]
)

// Helper function to get section name from num
function getSectionName(num) {
  switch (num) {
    case 1: return 'yourPlaylists'
    case 2: return 'topArtists'
    case 3: return 'topTracks'
    case 4: return 'savedAlbums'
    case 5: return 'savedTracks'
    case 6: return 'followedArtists'
    case 7: return 'newReleases'
    case 8: return 'spotifyPlaylists'
    case 10: return 'search'
    case 22: return 'topArtists6'
    case 23: return 'topArtistsAll'
    case 32: return 'topTracks6'
    case 33: return 'topTracksAll'
    default: return 'search'
  }
}

function setActive(id) {
  selected.value = id
}

const handleRefresh = (event) => {
  emit('refresh', event)
}

const handleSortChange = (value) => {
  emit('sort-change', value)
}

mobileClass.value = window.innerWidth < 768;
window.addEventListener('resize', () => {
  mobileClass.value = window.innerWidth < 768;
})

onMounted(() => {
  // Register this component with the visibility manager
  const playlistKey = `deeperplaylist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(playlistKey, componentRef)

  // Initially hide the component
  if (componentRef.value) {
    componentRef.value.style.display = 'none'
  }
})
</script>

<template>
  <div class="modern-playlist-header row" ref="componentRef">
    <div class="col-sm-6 col-md-6 col-lg-3" :class="{'col-6': mobileClass}">
      <TrackCover
          :d="d"
          :cover="coverImage"
          v-if="hasCover"
      />
    </div>
    <div class="playlist-info col-sm-6 col-md-6 col-lg-6" :class="{'col-6': mobileClass}">
      <div class="playlist-title-section">
        <h2 class="playlist-title">{{ d.name }}</h2>
        <button class="refresh-button" @click="handleRefresh">
          <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
        </button>
      </div>
      <div class="playlist-description" v-html="d.description"></div>
      <div class="follow-section">
        <span class="follow-label">Follow</span>
        <label class="follow-checkbox">
          <!-- Follow functionality will be implemented later -->
          <input type="checkbox" v-model="d.followed" disabled>
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <div class="col-sm-12 col-md-12 col-lg-3" :class="{'col-12': mobileClass}">
      <a class="spotify-link"
         :href="d['external_urls']['spotify']"
         target="_blank"
         rel="noopener">
        <span class="link-icon">🎧</span>
        Open in Spotify
      </a>
      <SortTracks v-model="selectedDeeperPlaylistSortOption"  :full_width="true"/>
    </div>
  </div>

    <div class="tracks-container">
      <template v-for="(item, index) in sortedDeeperPlaylistItems" :key="index">
        <div :class="['media-card', getTrackMediaDisplay(item.track).displayClass.value, selected === item.track.id ? 'selected' : '']"
             :style="getTrackMediaDisplay(item.track).backgroundStyle.value"
             @mouseover="getTrackMediaDisplay(item.track).hasPreview.value && audioStore.handleAudioHover($event)"
             @mouseleave="getTrackMediaDisplay(item.track).hasPreview.value && audioStore.handleAudioLeave($event)"
             @click="setActive(item.track.id);deeperStore.getTrackDetails(item, getSectionName(num), d.id); queueStore.addToQueue(item.track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ item.track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ item.track.name }}</div>
            </div>
          </div>
          <audio :preload="getTrackMediaDisplay(item.track).audioPreload.value" :src="getTrackMediaDisplay(item.track).audioSrc.value"></audio>
        </div>
      </template>
    </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
