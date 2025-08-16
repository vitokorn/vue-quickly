<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref, computed, onMounted} from "vue";
import TrackCover from "./TrackCover.vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";

const props = defineProps(['d', 'num'])
const store = useDMStore()
const selected = ref()
const tracks = ref([])

// Helper function to get media display for a track with album cover
function getTrackMediaDisplay(track) {
  return useMediaDisplay(computed(() => track), props.d.images?.[0])
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
onMounted(()=> {
  resolveTracks()
})
</script>

<template>

  <div class="modern-album-card" :id="'a'+d.id">
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
                      @click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">
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
          <button class="refresh-button" @click="store.reloader({num:num,event:$event})">
            <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
          </button>
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
               @mouseover="getTrackMediaDisplay(track).hasPreview.value && store.mouseOver($event)"
               @mouseleave="getTrackMediaDisplay(track).hasPreview.value && store.mouseLeave($event)"
               @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'deeperalbum',child:'a'+ d.id}); store.queuein(track)">
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
