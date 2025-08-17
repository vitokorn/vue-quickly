<script setup>
import {useSpotifyStore} from "../stores/spotify-store";
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed, onMounted, nextTick, watch} from "vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

// Helper function to get media display for any item
function getMediaDisplay(item) {
  return useMediaDisplay(computed(() => item))
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
    <template v-for="(item, index) in d.data || d" :key="index">
      <!-- Artist Section -->
      <div v-if="item.type==='trackartist'" class="artist-section">
        <div class="artist-header">
          <!-- Artist Cover -->
          <div :class="['artist-cover', getMediaDisplay(item).displayClass.value]"
               :style="getMediaDisplay(item).backgroundStyle.value"
               @mouseover="getMediaDisplay(item).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getMediaDisplay(item).hasPreview.value && audioStore.handleAudioLeave($event)">
            <div class="cover-overlay">
              <div class="artist-name">{{ item.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(item).audioPreload.value" :src="getMediaDisplay(item).audioSrc.value"></audio>
          </div>

          <!-- Artist Info -->
          <div class="artist-info">
            <h2 class="artist-title">{{ item.name }}</h2>
            <div class="artist-stats">
              <span class="followers-count">{{ item['followers']['total'].toLocaleString() }} followers</span>
            </div>

            <!-- Genres -->
            <div class="genres-section">
              <div class="genres-list">
                <template v-for="(g, gIndex) in item['genres']" :key="'genre-'+gIndex">
                  <span v-if="item['genres'].length > 1 && item['genres'].length - 1 === gIndex" class="separator">&</span>
                  <span v-if="item['genres'].length >= 2 && item['genres'].length - 1 !== gIndex && gIndex !== 0" class="separator">,</span>
                  <button class="genre-tag"
                          @click="spotifyStore.getTheSoundOf({name:g,num:num,sib:'trackartist',child:false})">
                    {{ g }}
                  </button>
                </template>
              </div>
            </div>

            <!-- Actions -->
            <div class="artist-actions">
              <button class="recommend-btn"
                      @click="deeperStore.getSeedArtistRecommendations(item, getSectionName(num), d.id)">
                <span class="btn-icon">🎵</span>
                Recommended artists songs based on this
              </button>

              <a class="spotify-link"
                 :href="item['external_urls']['spotify']"
                 target="_blank"
                 rel="noopener">
                <span class="link-icon">🎧</span>
                Open in Spotify
              </a>

              <div class="follow-section">
                <span class="follow-label">Follow</span>
                <label class="follow-checkbox">
                  <input type="checkbox"
                         v-if="item.followed"
                         @click.once="spotifyStore.followArtist(item)"
                         checked
                         v-model="item.followed">
                  <input type="checkbox"
                         v-else
                         @click.once="spotifyStore.followArtist(item)"
                         v-model="item.followed">
                  <span class="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Tracks Section -->
      <div v-if="item.type==='top_tracks'" class="section-header">
        <h3 class="section-title">Top tracks</h3>
      </div>

      <div v-if="item.type==='top_tracks'" class="tracks-grid">
        <div v-for="(tt, ttIndex) in item.tracks" :key="ttIndex">
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
        </div>
      </div>

      <!-- Albums Section -->
      <div v-if="item.type==='albums' && item.items && item.items.length > 0" class="section-header">
        <h3 class="section-title">Albums</h3>
      </div>

      <div v-if="item.type==='single' && item.items && item.items.length > 0" class="section-header">
        <h3 class="section-title">Singles</h3>
      </div>

      <div v-if="item.type==='appears_on' && item.items && item.items.length > 0" class="section-header">
        <h3 class="section-title">Appears on</h3>
      </div>

      <div v-if="(item.type==='albums' || item.type==='single' || item.type==='appears_on') && item.items && item.items.length > 0"
           class="albums-grid">
        <div v-for="(a, aIndex) in item.items" :key="aIndex">
          <div :class="['album-card', getMediaDisplay(a).displayClass.value, selected === a.id ? 'selected' : '']"
               :style="getMediaDisplay(a).backgroundStyle.value"
               @click="setActive(a.id);deeperStore.getAlbumDetails(a, getSectionName(num), d.id)"
               @mouseover="getMediaDisplay(a).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getMediaDisplay(a).hasPreview.value && audioStore.handleAudioLeave($event)">
            <div class="album-overlay">
              <div class="album-name">{{ a.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(a).audioPreload.value" :src="getMediaDisplay(a).audioSrc.value"></audio>
          </div>
        </div>
      </div>

      <!-- Related Artists Section -->
      <div v-if="item.type==='related-artists' && item.artists && item.artists.length > 0" class="section-header">
        <h3 class="section-title">Related Artists</h3>
      </div>

      <div v-if="item.type==='related-artists' && item.artists && item.artists.length > 0" class="related-artists-grid">
        <div v-for="(r, rIndex) in item.artists" :key="rIndex">
          <div :class="['related-artist-card', getMediaDisplay(r).displayClass.value, selected === r.id ? 'selected' : '']"
               :style="getMediaDisplay(r).backgroundStyle.value"
               @mouseover="getMediaDisplay(r).hasPreview.value && audioStore.handleAudioHover($event)"
               @mouseleave="getMediaDisplay(r).hasPreview.value && audioStore.handleAudioLeave($event)"
               @click="setActive(r.id);deeperStore.getArtistDetails(r, getSectionName(num), d.id)">
            <div class="artist-overlay">
              <div class="artist-name">{{ r.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(r).audioPreload.value" :src="getMediaDisplay(r).audioSrc.value"></audio>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
