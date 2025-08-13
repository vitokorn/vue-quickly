<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref} from "vue";
import TrackCover from "./TrackCover.vue";

defineProps(['d', 'num'])
const store = useDMStore()
const selected = ref()

function setActive(id) {
  selected.value = id
}
</script>

<template>
  <div class="modern-track-card" :id="'d'+d.id">
    <div class="track-main">
      <track-cover :d="d" :cover="d.album.images[0]"></track-cover>
      
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
    
    <div class="artists-grid">
      <div v-for="(art, index) in d.artists" :key="index">
        <div v-if="art.preview_url && art.images[0]" 
             class="artist-card playable"
             :class="selected === art.id ? 'selected' : ''"
             :style="{ 'background-image': 'url(' + art.images[0].url + ')' }"
             @mouseover="store.mouseOver($event)"
             @mouseleave="store.mouseLeave($event)"
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">
          <div class="artist-overlay">
            <div class="artist-name">{{ art.name }}</div>
          </div>
          <audio preload="auto" :src="art.preview_url"></audio>
        </div>
        
        <div v-else-if="!art.preview_url && art.images[0]" 
             class="artist-card unplayable"
             :class="selected === art.id ? 'selected' : ''"
             :style="{ 'background-image': 'url(' + art.images[0].url + ')' }"
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">
          <div class="artist-overlay">
            <div class="artist-name">{{ art.name }}</div>
          </div>
          <audio></audio>
        </div>
        
        <div v-else-if="art.preview_url && !art.images[0]" 
             class="artist-card playable no-image"
             :class="selected === art.id ? 'selected' : ''"
             @mouseover="store.mouseOver($event)" 
             @mouseleave="store.mouseLeave($event)"
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">
          <div class="artist-overlay">
            <div class="artist-name">{{ art.name }}</div>
          </div>
          <audio preload="auto" :src="art.preview_url"></audio>
        </div>
        
        <div v-else 
             class="artist-card unplayable no-image"
             :class="selected === art.id ? 'selected' : ''"
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">
          <div class="artist-overlay">
            <div class="artist-name">{{ art.name }}</div>
          </div>
          <audio></audio>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>