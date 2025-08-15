<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref} from "vue";
import TrackCover from "./TrackCover.vue";

defineProps(['d', 'num', 'cover', 'index'])
const store = useDMStore()
const selected = ref()

function setActive(id) {
  selected.value = id
}
</script>

<template>
  <div v-if="d.type==='pl'" :key="index" :id="'d'+d.id" class="modern-playlist-item">
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
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
