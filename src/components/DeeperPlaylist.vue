<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
import { getSectionName } from '../utils/sectionUtils';
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed, onMounted} from "vue";
import SortTracks from "./SortTracks.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";
import TrackCover from "./TrackCover.vue";
import PlaylistTrackItem from "./PlaylistTrackItem.vue";

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const selectedDeeperPlaylistSortOption = ref("")
const componentRef = ref(null)

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

const {image: coverImage, hasImage: hasCover} = useMediaDisplay(
    computed(() => props.d),
    props.images?.[0]
)

// Helper function to get section name from num

function setActive(id) {
  selected.value = id
}

const handleRefresh = (event) => {
  emit('refresh', event)
}

const handleSortChange = (value) => {
  emit('sort-change', value)
}

function handleTrackClick(item, event) {
  setActive(item.track.id);
  deeperStore.getTrackDetails(item, getSectionName(props.num), props.d.id);
  queueStore.addToQueue(item.track)
}

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
  <div class="deeper-header" ref="componentRef">
    <div >
      <TrackCover
          :d="d"
          :cover="coverImage"
          v-if="hasCover"
      />
    </div>
    <div class="playlist-info">
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
    <div>
      <a class="spotify-link"
         :href="d.external_urls?.spotify"
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
        <template v-if="item.track">
          <PlaylistTrackItem
              :track="item.track"
              :track-item="item"
              @click="handleTrackClick"
              @hover="audioStore.handleAudioHover($event)"
              @leave="audioStore.handleAudioLeave($event)"
          />
        </template>
      </template>
    </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
