<script setup>
import {useDMStore} from "../stores/dm-store";
import {onMounted, ref, computed} from "vue";
import TrackCover from "./TrackCover.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";

const props = defineProps(['d', 'num'])
const store = useDMStore()
const selected = ref()
const cover = ref(null)

// Helper function to get media display for an artist
function getArtistMediaDisplay(artist) {
  return useMediaDisplay(computed(() => artist))
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

onMounted(()=> {
  resolveCover()
})
</script>

<template>
  <div class="modern-track-card" :id="'d'+d.id">
    <div class="track-main">
      <track-cover :d="d" :cover="cover"></track-cover>

      <div class="track-info">
        <h3 class="track-title">{{ d.name }}</h3>

        <div class="artists-section">
          <span class="artists-label">By</span>
          <div class="artists-list">
            <div v-for="(art, index) in d.artists" :key="index" class="artist-item">
              <span v-if="d.artists.length > 1 && d.artists.length - 1 === index" class="separator">&</span>
              <span v-if="d.artists.length >= 2 && d.artists.length - 1 !== index && index !== 0" class="separator">,</span>
              <button class="artist-link" @click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">
                {{ art.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="track-actions">
          <button class="recommend-btn" @click="store.seedTracks({item:d,num:num,sib:'playlisttrack',child:'d'+ d.id})">
            <span class="btn-icon">🎵</span>
            Recommended songs based on this
          </button>
          <a class="spotify-link" :href="d['external_urls']['spotify']" target="_blank" rel="noopener">
            <span class="link-icon">🎧</span>
            Open in Spotify
          </a>
        </div>
      </div>
    </div>
<!--It requires an additional request to show this block, so I commented it out for now-->
<!--    <div class="artists-grid">-->
<!--      <div v-for="(art, index) in d.artists" :key="index">-->
<!--        <div :class="['artist-card', getArtistMediaDisplay(art).displayClass.value, selected === art.id ? 'selected' : '']"-->
<!--             :style="getArtistMediaDisplay(art).backgroundStyle.value"-->
<!--             @mouseover="getArtistMediaDisplay(art).hasPreview.value && store.mouseOver($event)"-->
<!--             @mouseleave="getArtistMediaDisplay(art).hasPreview.value && store.mouseLeave($event)"-->
<!--             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">-->
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
