<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed, onMounted, nextTick} from "vue";
import SortTracks from "./SortTracks.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const selectedSASortOption = ref("")
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedSAItems = computed(() => {
  const items = props.d.tracks || []
  if (!selectedSASortOption.value) return items

  return [...items].sort((a, b) => {
    switch (selectedSASortOption.value) {
      case 'track':
        return a.name.localeCompare(b.name)
      case 'album':
        return a.album.name.localeCompare(b.album.name)
      case 'artist':
        return a.artists[0].name.localeCompare(b.artists[0].name)
      case 'popularity':
        return b.popularity - a.popularity
      case 'release_date':
        return new Date(b.album.release_date) - new Date(a.album.release_date)
      case 'duration':
        return a.duration_ms - b.duration_ms
      default:
        return 0
    }
  })
})

// Helper function to get media display for a track
function getTrackMediaDisplay(track) {
  return useMediaDisplay(computed(() => track))
}

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

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const seedKey = `seed_artists_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(seedKey, componentRef)

  // Show this component after registration
  console.log('Showing SeedArtists component after registration:', seedKey)
  visibilityManager.showComponent(seedKey)
})
</script>

<template>
  <div class="modern-seed-artists" ref="componentRef">
    <div class="seed-header">
      <div class="seed-title">
        <span class="title-icon">🎵</span>
        <span class="title-text">Recommended songs based on {{ d.name }}</span>
      </div>
      <div class="seed-actions">
        <button class="refresh-button" @click="spotifyStore.reloadSA({num:num,id:d.id,name:d.name })">
          <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
        </button>
        <sort-tracks v-model="selectedSASortOption"/>
      </div>
    </div>

    <div class="mobile-tracks-container">
      <template v-for="(track, index) in sortedSAItems" :key="index">
        <div
            :class="['media-card', getTrackMediaDisplay(track).displayClass.value, selected === track.id ? 'selected' : '']"
            :style="getTrackMediaDisplay(track).backgroundStyle.value"
            @mouseover="getTrackMediaDisplay(track).hasPreview.value && audioStore.handleAudioHover($event)"
            @mouseleave="getTrackMediaDisplay(track).hasPreview.value && audioStore.handleAudioLeave($event)"
            @click="setActive(track.id);deeperStore.getTrackDetails(track, getSectionName(num), d.id); queueStore.addToQueue(track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ track.name }}</div>
            </div>
          </div>
          <audio :preload="getTrackMediaDisplay(track).audioPreload.value"
                 :src="getTrackMediaDisplay(track).audioSrc.value"></audio>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
