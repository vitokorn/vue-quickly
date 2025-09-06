<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
import { getSectionName } from '../utils/sectionUtils';
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed, onMounted, nextTick} from "vue";
import TrackCover from "./TrackCover.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const tracks = ref([])
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

// Helper function to get media display for a track with album cover
function getTrackMediaDisplay(track) {
  return useMediaDisplay(computed(() => track), props.d.images?.[0])
}

// Helper function to get section name from num

function setActive(id) {
  selected.value = id
}

function resolveTracks() {
  if (props.d.tracks && props.d.tracks.items) {
    tracks.value = props.d.tracks.items
  } else if (props.d.tracks) {
    tracks.value = props.d.tracks;
  } else if (props.d.items) {
    tracks.value = props.d.items;
  }
}

onMounted(async ()=> {
  resolveTracks()

  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const albumKey = `deeperalbum_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(albumKey, componentRef)

  // Show this component after registration
  console.log('Showing DeeperAlbum component after registration:', albumKey)
  visibilityManager.showComponent(albumKey)
})
</script>

<template>

  <div class="modern-album-card" ref="componentRef">
    <div class="deeper-header">
      <track-cover :d="d" :cover="d.images[0]"></track-cover>

      <div class="track-info">
        <h3 class="track-title">{{ d.name }}</h3>

        <div class="artists-section">
          <span class="artists-label">By</span>
          <div class="artists-list">
            <template v-for="(art, index) in d.artists" :key="index">
              <div v-if="d.artists.length > 1 && d.artists.length - 1 === index" class="separator">&</div>
              <div v-if="d.artists.length >= 2 && d.artists.length - 1 !== index && index !== 0"
                   class="separator">,</div>
              <div class="artist-item">
                <button class="artist-link"
                        @click="deeperStore.getArtistDetails(art, getSectionName(num), d.id)">
                  {{ art.name }}
                </button>
              </div>
            </template>
          </div>
        </div>
        <div class="release-date">
          <span class="meta-icon">📅</span>
          <span>{{ d.release_date }}</span>
        </div>
        <div class="album-actions">
          <!-- Refresh functionality will be implemented later -->
        </div>
      </div>
    </div>

    <div class="tracks-section">
      <div class="tracks-header">
        <span class="tracks-icon">🎵</span>
        <h3 class="tracks-title">Tracks</h3>
      </div>
      <div class="tracks-container">
        <template v-for="(track, index) in tracks" :key="index" class="">
          <div :class="['media-card', getTrackMediaDisplay(track).displayClass.value, selected === track.id ? 'selected' : '']"
               :style="getTrackMediaDisplay(track).backgroundStyle.value"
               @mouseover="getTrackMediaDisplay(track).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getTrackMediaDisplay(track).hasPreview.value && audioStore.handleAudioLeave($event)"
               @click="setActive(track.id);deeperStore.getTrackDetails(track, getSectionName(num), d.id); queueStore.addToQueue(track)">
            <div class="album-overlay">
              <div class="album-name">{{ track.name }}</div>
            </div>
            <audio :preload="getTrackMediaDisplay(track).audioPreload.value" :src="getTrackMediaDisplay(track).audioSrc.value"></audio>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
