<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {onMounted, ref, computed, nextTick, watch} from "vue";
import TrackCover from "./TrackCover.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import {useVisibilityManager} from "../composables/useVisibilityManager";
import {useLoading} from "../composables/useLoading";
import { getSectionName } from '../utils/sectionUtils';
import LoadingState from "./common/LoadingState.vue";
const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const cover = ref(null)
const componentRef = ref(null)
const mobileClass = ref(false)

// Loading state management
const { isLoading, loadingMessage, withLoading } = useLoading({
  message: 'Loading track details...'
})

// Get visibility manager
const visibilityManager = useVisibilityManager()

// Helper function to get media display for an artist
function getArtistMediaDisplay(artist) {
  return useMediaDisplay(computed(() => artist))
}

const handleRecommendClick = async () => {
  try {
  deeperStore.setGlobalLoading(true)
    const sectionName = getSectionName(props.num)
    await deeperStore.getSeedTrackRecommendations(props.d, sectionName, props.d.id)
  } catch (error) {
    console.error('Failed to get recommendations:', error)
    alert('Failed to load recommendations. Please try again.')
  } finally {
    deeperStore.setGlobalLoading(false)
  }
}


function setActive(id) {
  selected.value = id
}

function resolveCover() {
  console.log(props.d)
  if (props.d.album && props.d.album.images) {
    cover.value = props.d.album.images[0]
  } else if (props.d.images) {
    cover.value = props.d.images[0]
  } else if (props.d.track && props.d.track.album && props.d.track.album.images && props.d.track.album.images[0]) {
    cover.value = props.d.track.album.images[0]
  }
  console.log(cover.value)
}

onMounted(async () => {
  await withLoading(async () => {
    resolveCover()

    // Wait for the next tick to ensure the ref is available
    await nextTick()

    // Register this component with the visibility manager
    const trackKey = `${props.d.type}_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
    console.log('Registering component with ref:', componentRef.value)
    console.log('Ref element:', componentRef.value?.tagName, componentRef.value?.className)
    console.log('Registering with key:', trackKey)
    visibilityManager.registerComponent(trackKey, componentRef)

    // Show this component after registration
    console.log('Showing component after registration:', trackKey)
    visibilityManager.showComponent(trackKey)
  }, { message: 'Initializing track view...' })
})
mobileClass.value = window.innerWidth < 768;
window.addEventListener('resize', () => {
  mobileClass.value = window.innerWidth < 768;
})
</script>

<template>
  <div class="modern-track-card" ref="componentRef">
    <!-- Loading State -->
    <LoadingState
      v-if="isLoading"
      :message="loadingMessage"
      variant="default"
    />

    <div v-else class="deeper-header p-4">
      <track-cover :d="d" :cover="cover"></track-cover>
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
      </div>
      <div class="artist-actions" :class="{'grid-column-2': mobileClass}">
        <button class="recommend-btn"
                @click="handleRecommendClick">
          <span class="btn-icon">🎵</span>
          Recommended songs based on this
        </button>
        <a class="spotify-link" :href="d.external_urls?.spotify" target="_blank" rel="noopener">
          <span class="link-icon">🎧</span>
          Open in Spotify
        </a>
      </div>
    </div>
    <!--It requires an additional request to show this block, so I commented it out for now-->
    <!--    <div class="artists-grid">-->
    <!--      <div v-for="(art, index) in d.artists" :key="index">-->
    <!--        <div :class="['artist-card', getArtistMediaDisplay(art).displayClass.value, selected === art.id ? 'selected' : '']"-->
    <!--             :style="getArtistMediaDisplay(art).backgroundStyle.value"-->
    <!--             @mouseover="getArtistMediaDisplay(art).hasPreview.value && audioStore.handleAudioHover($event)"-->
    <!--             @mouseleave="getArtistMediaDisplay(art).hasPreview.value && audioStore.handleAudioLeave($event)"-->
    <!--             @click="setActive(art.id);deeperStore.getArtistDetails(art, 'playlisttrack')">-->
    <!--          <div class="artist-overlay">-->
    <!--            <div class="artist-name">{{ art.name }}</div>-->
    <!--          </div>-->
    <!--          <audio :preload="getArtistMediaDisplay(art).audioPreload.value" :src="getArtistMediaDisplay(art).audioSrc.value"></audio>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
