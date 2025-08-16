<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
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
    <div class="track-main">
      <track-cover :d="d" :cover="d.images[0]"></track-cover>

      <div class="track-info">
        <h3 class="track-title">{{ d.name }}</h3>

        <div class="artists-section">
          <span class="artists-label">By</span>
          <div class="artists-list">
            <div v-for="(art, index) in d.artists" :key="index" class="artist-item">
              <span v-if="d.artists.length > 1 && d.artists.length - 1 === index" class="separator">&</span>
              <span v-if="d.artists.length >= 2 && d.artists.length - 1 !== index && index !== 0"
                    class="separator">,</span>
              <button class="artist-link"
                      @click="deeperStore.getArtistDetails(art, getSectionName(num), d.parentKey || d.id)">
                {{ art.name }}
              </button>
            </div>
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
      <div class="tracks-list">
        <template v-for="(track, index) in tracks" :key="index" class="">
          <div :class="['con3', getTrackMediaDisplay(track).displayClass.value, selected === track.id ? 'selected' : '']"
               :style="getTrackMediaDisplay(track).backgroundStyle.value"
               @mouseover="getTrackMediaDisplay(track).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getTrackMediaDisplay(track).hasPreview.value && audioStore.handleAudioLeave($event)"
               @click="setActive(track.id);deeperStore.getTrackDetails(track, getSectionName(num), d.parentKey || d.id); queueStore.addToQueue(track)">
            {{ track.name }}
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
