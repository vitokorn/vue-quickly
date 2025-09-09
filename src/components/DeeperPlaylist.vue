<script setup>
import {useMusicStore} from "../stores/music-store";
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
import {getCurrentServiceType} from "../utils/initializeMusicStore.js";
import {musicServiceManager} from "../services/MusicServiceManager.js";

const props = defineProps(['d', 'num'])
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const selectedDeeperPlaylistSortOption = ref("")
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedDeeperPlaylistItems = computed(() => {
  // Handle both old structure (tracks.items) and new structure (tracks)
  const items = props.d.tracks?.items || props.d.tracks || []
  console.log('DeeperPlaylist items:', items, 'props.d:', props.d)
  if (!selectedDeeperPlaylistSortOption.value) return items

  return [...items].sort((a, b) => {
    // Handle both old structure (item.track) and new structure (item directly)
    const trackA = a.track || a
    const trackB = b.track || b

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
  const track = item.track || item
  setActive(track.id);
  deeperStore.getTrackDetails(item, getSectionName(props.num), props.d.id);
  queueStore.addToQueue(track)
}

function handleOwnerClick() {
  if (props.d.owner && props.d.owner.id) {
    deeperStore.getUserPlaylists(props.d.owner, getSectionName(props.num), props.d.id)
  }
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
      <div class="playlist-meta" v-if="d.owner">
        <span class="playlist-owner clickable-owner" @click="handleOwnerClick">
          By {{ d.owner.display_name }}
        </span>
      </div>
      <div v-if="d.tracks && d.tracks.total" class="playlist-meta" >
        {{ d.tracks.total }} tracks
      </div>
      <div v-if="d.public !== undefined" class="playlist-meta" >
          {{ d.public ? 'Public' : 'Private' }}
      </div>
      <div class="follow-section" v-if="musicServiceManager.currentServiceType !== 'deezer'">
        <span class="follow-label">Follow</span>
        <label class="follow-checkbox">
          <!-- Follow functionality will be implemented later -->
          <input type="checkbox" v-model="d.followed" disabled>
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <div>
      <a  :class="getCurrentServiceType() + '-link'"
         :href="d.external_urls?.spotify"
         target="_blank"
         rel="noopener">
        <span class="link-icon">🎧</span>
        Open in {{getCurrentServiceType().charAt(0).toUpperCase() + getCurrentServiceType().slice(1)}}
      </a>
      <SortTracks v-model="selectedDeeperPlaylistSortOption"  :full_width="true"/>
    </div>
  </div>

    <div class="tracks-container">
      <template v-for="(item, index) in sortedDeeperPlaylistItems" :key="index">
        <template v-if="item.track || item.id">
          <PlaylistTrackItem
              :track="item.track || item"
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
