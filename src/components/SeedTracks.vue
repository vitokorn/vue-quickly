<script setup>
import {useMusicStore} from "../stores/music-store";
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed, onMounted, nextTick} from "vue";
import SortTracks from "./SortTracks.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";
import { getSectionName } from '../utils/sectionUtils';

const props = defineProps(['d', 'num'])
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const selectedSTSortOption = ref("")
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedSTItems = computed(() => {
  const items = props.d.tracks || []
  if (!selectedSTSortOption.value) return items

  return [...items].sort((a, b) => {
    switch (selectedSTSortOption.value) {
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

// Helper function to get section name from num

function setActive(id) {
  selected.value = id
}

async function refreshSeedTracks() {
  try {
    console.log('Refreshing seed tracks for:', props.d.id)
    // Call the deeper store to refresh the seed tracks data
    await deeperStore.getSeedTrackRecommendations(props.d, getSectionName(props.num), props.d.parentKey)
  } catch (error) {
    console.error('Failed to refresh seed tracks:', error)
  }
}

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const seedKey = `seed_tracks_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(seedKey, componentRef)

  // Show this component after registration
  console.log('Showing SeedTracks component after registration:', seedKey)
  visibilityManager.showComponent(seedKey)
})
</script>

<template>
  <div class="modern-seed-tracks" ref="componentRef">
    <div class="seed-header">
      <div class="seed-title">
        <span class="title-icon">🎵</span>
        <span class="title-text">Recommended songs based on {{ d.name }}</span>
      </div>
      <div class="seed-actions">
        <button class="refresh-button" @click="refreshSeedTracks">
          <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
        </button>
        <sort-tracks v-model="selectedSTSortOption"/>
      </div>
    </div>

    <div class="tracks-container">
      <template v-for="(track, index) in sortedSTItems" :key="index">
        <div :class="['media-card', getTrackMediaDisplay(track).displayClass.value, selected === track.id ? 'selected' : '']"
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
          <audio :preload="getTrackMediaDisplay(track).audioPreload.value" :src="getTrackMediaDisplay(track).audioSrc.value"></audio>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
