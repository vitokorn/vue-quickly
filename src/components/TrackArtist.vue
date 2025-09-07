<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed, onMounted, nextTick} from "vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import {useVisibilityManager} from "../composables/useVisibilityManager";
import {getSectionName} from "../utils/sectionUtils";

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

const artistData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    // Find the trackartist item in the data array
    const artistItem = props.d.data.find(item => item.type === 'trackartist')
    return artistItem || props.d
  }
  return props.d
})

const topTracksData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const topTracksItem = props.d.data.find(item => item.type === 'top_tracks')
    return topTracksItem?.tracks || []
  }
  return []
})

const albumsData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const albumsItem = props.d.data.find(item => item.type === 'albums')
    return albumsItem?.items || []
  }
  return []
})

const singlesData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const singlesItem = props.d.data.find(item => item.type === 'single')
    return singlesItem?.items || []
  }
  return []
})

const appearsOnData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const appearsOnItem = props.d.data.find(item => item.type === 'appears_on')
    return appearsOnItem?.items || []
  }
  return []
})

const relatedArtistsData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const relatedItem = props.d.data.find(item => item.type === 'related-artists')
    return relatedItem?.artists || []
  }
  return []
})

// Helper function to get media display for any item
function getMediaDisplay(item) {
  return useMediaDisplay(computed(() => item))
}


function setActive(id) {
  selected.value = id
}

onMounted(async () => {
  await nextTick()
  console.log('TrackArtist component mounted with props:', props.d)
  const artistKey = `trackartist_${props.d?.id || 'default'}${props.d?.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  console.log('Registering TrackArtist component with key:', artistKey)
  visibilityManager.registerComponent(artistKey, componentRef)
  console.log('Showing TrackArtist component after registration:', artistKey)
  visibilityManager.showComponent(artistKey)
})
</script>

<template>
  <div class="modern-track-artist" ref="componentRef">
    <!-- Artist Section -->
    <div v-if="artistData" class="artist-section">
      <div class="deeper-header">
        <!-- Artist Cover -->
        <div :class="['artist-cover', getMediaDisplay(artistData).displayClass.value]"
             :style="getMediaDisplay(artistData).backgroundStyle.value"
             @mouseover="getMediaDisplay(artistData).hasPreview.value && audioStore.handleAudioHover($event)"
             @mouseleave="getMediaDisplay(artistData).hasPreview.value && audioStore.handleAudioLeave($event)">
          <div class="cover-overlay">
            <div class="artist-name">{{ artistData.name }}</div>
          </div>
          <audio :preload="getMediaDisplay(artistData).audioPreload.value"
                 :src="getMediaDisplay(artistData).audioSrc.value"></audio>
        </div>

        <!-- Artist Info -->
        <div class="artist-info">
          <h2 class="artist-title">{{ artistData.name }}</h2>
          <div class="artist-stats">
            <span class="followers-count">{{ artistData.followers?.total?.toLocaleString() }} followers</span>
          </div>

          <!-- Genres -->
          <div class="genres-section" v-if="artistData.genres && artistData.genres.length > 0">
            <div class="gnr-list">
              <template v-for="(g, gIndex) in artistData.genres" :key="'genre-'+gIndex">
                <span v-if="artistData.genres.length > 1 && artistData.genres.length - 1 === gIndex"
                      class="separator">&</span>
                <span v-if="artistData.genres.length >= 2 && artistData.genres.length - 1 !== gIndex && gIndex !== 0"
                      class="separator">,</span>
                <button class="genre-tag"
                        @click="spotifyStore.getTheSoundOf({name:g,num:num,sib:'trackartist',child:false})">
                  {{ g }}
                </button>
              </template>
            </div>
          </div>
        </div>
        <!-- Actions -->
        <div class="artist-actions">
          <button class="action-button"
                  @click="deeperStore.getSeedArtistRecommendations(artistData, getSectionName(num), d.id)">
            <span class="btn-icon">🎵</span>
            Recommended artists songs based on this
          </button>

          <a class="spotify-link"
             :href="artistData.external_urls?.spotify"
             target="_blank"
             rel="noopener">
            <span class="link-icon">🎧</span>
            Open in Spotify
          </a>

          <div class="follow-section">
            <span class="follow-label">Follow</span>
            <label class="follow-checkbox">
              <input type="checkbox"
                     v-if="artistData.followed"
                     @click.once="spotifyStore.followArtist(artistData)"
                     checked
                     v-model="artistData.followed">
              <input type="checkbox"
                     v-else
                     @click.once="spotifyStore.followArtist(artistData)"
                     v-model="artistData.followed">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="info-section">
      <!-- Top Tracks Section -->
      <div v-if="topTracksData.length > 0" class="section-header py-2">
        <h3 class="section-title">Top tracks</h3>
      </div>

      <div v-if="topTracksData.length > 0" class="albums-grid">
        <template v-for="(tt, ttIndex) in topTracksData" :key="ttIndex">
          <div :class="['track-card', getMediaDisplay(tt).displayClass.value, selected === tt.id ? 'selected' : '']"
               :style="getMediaDisplay(tt).backgroundStyle.value"
               @mouseover="getMediaDisplay(tt).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getMediaDisplay(tt).hasPreview.value && audioStore.handleAudioLeave($event)"
               @click="setActive(tt.id);deeperStore.getTrackDetails(tt, getSectionName(num), d.id); queueStore.addToQueue(tt)">
            <div class="track-overlay">
              <div class="track-name">{{ tt.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(tt).audioPreload.value" :src="getMediaDisplay(tt).audioSrc.value"></audio>
          </div>
        </template>
      </div>

      <!-- Albums Section -->
      <div v-if="albumsData.length > 0" class="section-header py-2">
        <h3 class="section-title">Albums</h3>
      </div>

      <div v-if="albumsData.length > 0" class="albums-grid">
        <div v-for="(a, aIndex) in albumsData" :key="aIndex">
          <div :class="['track-card', getMediaDisplay(a).displayClass.value, selected === a.id ? 'selected' : '']"
               :style="getMediaDisplay(a).backgroundStyle.value"
               @click="setActive(a.id);deeperStore.getAlbumDetails(a, getSectionName(num), d.id)"
               @mouseover="getMediaDisplay(a).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getMediaDisplay(a).hasPreview.value && audioStore.handleAudioLeave($event)">
            <div class="track-overlay">
              <div class="track-name">{{ a.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(a).audioPreload.value" :src="getMediaDisplay(a).audioSrc.value"></audio>
          </div>
        </div>
      </div>

      <!-- Singles Section -->
      <div v-if="singlesData.length > 0" class="section-header py-2">
        <h3 class="section-title">Singles</h3>
      </div>

      <div v-if="singlesData.length > 0" class="albums-grid">
        <div v-for="(s, sIndex) in singlesData" :key="sIndex">
          <div :class="['track-card', getMediaDisplay(s).displayClass.value, selected === s.id ? 'selected' : '']"
               :style="getMediaDisplay(s).backgroundStyle.value"
               @click="setActive(s.id);deeperStore.getAlbumDetails(s, getSectionName(num), d.id)"
               @mouseover="getMediaDisplay(s).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getMediaDisplay(s).hasPreview.value && audioStore.handleAudioLeave($event)">
            <div class="track-overlay">
              <div class="track-name">{{ s.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(s).audioPreload.value" :src="getMediaDisplay(s).audioSrc.value"></audio>
          </div>
        </div>
      </div>

      <!-- Appears On Section -->
      <div v-if="appearsOnData.length > 0" class="section-header py-2">
        <h3 class="section-title">Appears on</h3>
      </div>

      <div v-if="appearsOnData.length > 0" class="albums-grid">
        <div v-for="(ao, aoIndex) in appearsOnData" :key="aoIndex">
          <div :class="['track-card', getMediaDisplay(ao).displayClass.value, selected === ao.id ? 'selected' : '']"
               :style="getMediaDisplay(ao).backgroundStyle.value"
               @click="setActive(ao.id);deeperStore.getAlbumDetails(ao, getSectionName(num), d.id)"
               @mouseover="getMediaDisplay(ao).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getMediaDisplay(ao).hasPreview.value && audioStore.handleAudioLeave($event)">
            <div class="track-overlay">
              <div class="track-name">{{ ao.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(ao).audioPreload.value" :src="getMediaDisplay(ao).audioSrc.value"></audio>
          </div>
        </div>
      </div>

      <!-- Related Artists Section -->
      <div v-if="relatedArtistsData.length > 0" class="section-header py-2">
        <h3 class="section-title">Related Artists</h3>
      </div>

      <div v-if="relatedArtistsData.length > 0" class="albums-grid">
        <template v-for="(r, rIndex) in relatedArtistsData" :key="rIndex">
          <div
              :class="['track-card', getMediaDisplay(r).displayClass.value, selected === r.id ? 'selected' : '']"
              :style="getMediaDisplay(r).backgroundStyle.value"
              @mouseover="getMediaDisplay(r).hasPreview.value && audioStore.handleAudioHover($event)"
              @mouseleave="getMediaDisplay(r).hasPreview.value && audioStore.handleAudioLeave($event)"
              @click="setActive(r.id);deeperStore.getArtistDetails(r, getSectionName(num), d.id)">
            <div class="track-overlay">
              <div class="track-name">{{ r.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(r).audioPreload.value" :src="getMediaDisplay(r).audioSrc.value"></audio>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
