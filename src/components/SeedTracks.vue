<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref, computed, onMounted, nextTick} from "vue";
import SortTracks from "./SortTracks.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";

const props = defineProps(['d', 'num'])
const store = useDMStore()
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

function setActive(id) {
  selected.value = id
}

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()
  
  // Register this component with the visibility manager
  const seedKey = `seed_tracks_${props.d.id}`
  visibilityManager.registerComponent(seedKey, componentRef)
})
</script>

<template>
  <div class="modern-seed-tracks" :id="d.id" ref="componentRef">
    <div class="seed-header">
      <div class="seed-title">
        <span class="title-icon">🎵</span>
        <span class="title-text">Recommended songs based on {{ d.name }}</span>
      </div>
      <div class="seed-actions">
        <button class="refresh-button" @click="store.reloadST({num:num,id:d.id,name:d.name })">
          <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
        </button>
        <sort-tracks v-model="selectedSTSortOption"/>
      </div>
    </div>

    <div class="tracks-grid">
      <div v-for="(track, index) in sortedSTItems" :key="index" class="track-card">
        <div :class="['track-item', getTrackMediaDisplay(track).displayClass.value, selected === track.id ? 'selected' : '']"
             :style="getTrackMediaDisplay(track).backgroundStyle.value"
             @mouseover="getTrackMediaDisplay(track).hasPreview.value && store.mouseOver($event)"
             @mouseleave="getTrackMediaDisplay(track).hasPreview.value && store.mouseLeave($event)"
             @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'seed_tracks',child:'st'+ d.id}); store.queuein(track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ track.name }}</div>
            </div>
          </div>
          <audio :preload="getTrackMediaDisplay(track).audioPreload.value" :src="getTrackMediaDisplay(track).audioSrc.value"></audio>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
