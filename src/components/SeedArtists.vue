<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref, computed} from "vue";
import SortTracks from "./SortTracks.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";

const props = defineProps(['d', 'num'])
const store = useDMStore()
const selected = ref()
const selectedSASortOption = ref("")

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

function setActive(id) {
  selected.value = id
}
</script>

<template>
  <div class="modern-seed-artists" :id="d.id">
    <div class="seed-header">
      <div class="seed-title">
        <span class="title-icon">🎵</span>
        <span class="title-text">Recommended songs based on {{ d.name }}</span>
      </div>
      <div class="seed-actions">
        <button class="refresh-button" @click="store.reloadSA({num:num,id:d.id,name:d.name })">
          <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
        </button>
        <sort-tracks v-model="selectedSASortOption"/>
      </div>
    </div>

    <div class="tracks-grid">
      <div v-for="(track, index) in sortedSAItems" :key="index" class="track-card">
        <div
            :class="['track-item', getTrackMediaDisplay(track).displayClass.value, selected === track.id ? 'selected' : '']"
            :style="getTrackMediaDisplay(track).backgroundStyle.value"
            @mouseover="getTrackMediaDisplay(track).hasPreview.value && store.mouseOver($event)"
            @mouseleave="getTrackMediaDisplay(track).hasPreview.value && store.mouseLeave($event)"
            @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'seed_artists',child:'sa'+ d.id}); store.queuein(track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ track.name }}</div>
            </div>
          </div>
          <audio :preload="getTrackMediaDisplay(track).audioPreload.value"
                 :src="getTrackMediaDisplay(track).audioSrc.value"></audio>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
