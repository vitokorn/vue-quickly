<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref} from "vue";

defineProps(['d', 'num'])
const store = useDMStore()
const selected = ref()

function setActive(id) {
  selected.value = id
}
</script>

<template>
  <div class="modern-album-card" :id="'a'+d.id">
    <div class="album-header">
      <div class="album-info">
        <h2 class="album-title">{{ d.name }}</h2>
        <div class="album-meta">
          <div class="release-date">
            <span class="meta-icon">📅</span>
            <span>{{ d.release_date }}</span>
          </div>
          <div class="artist-info">
            <span class="meta-icon">👤</span>
            <span>{{ d.artists[0].name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tracks-section">
      <div class="tracks-header">
        <span class="tracks-icon">🎵</span>
        <h3 class="tracks-title">Tracks</h3>
      </div>
      <div class="tracks-list">
        <div v-for="(track, index) in d.tracks.items" :key="index" class="track-item">
          <div v-if="track.preview_url && track.album.images[0]"
               class="con3 playable"
               :class="selected === track.id ? 'selected' : ''"
               :style="{ 'background-image': 'url(' + track.album.images[0].url + ')' }"
               @mouseover="store.mouseOver($event)"
               @mouseleave="store.mouseLeave($event)"
               @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'deeperalbum',child:'a'+ d.id}); store.queuein(track)">
            {{ track.name }}
            <audio preload="auto" :src="track.preview_url"></audio>
          </div>
          
          <div v-else-if="!track.preview_url && track.album.images[0]"
               class="con3 unplayable"
               :class="selected === track.id ? 'selected' : ''"
               :style="{ 'background-image': 'url(' + track.album.images[0].url + ')' }"
               @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'deeperalbum',child:'a'+ d.id}); store.queuein(track)">
            {{ track.name }}
            <audio></audio>
          </div>
          
          <div v-else-if="track.preview_url && !track.album.images[0]"
               class="con3 playable no-image"
               :class="selected === track.id ? 'selected' : ''"
               @mouseover="store.mouseOver($event)"
               @mouseleave="store.mouseLeave($event)"
               @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'deeperalbum',child:'a'+ d.id}); store.queuein(track)">
            {{ track.name }}
            <audio preload="auto" :src="track.preview_url"></audio>
          </div>
          
          <div v-else
               class="con3 unplayable no-image"
               :class="selected === track.id ? 'selected' : ''"
               @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'deeperalbum',child:'a'+ d.id}); store.queuein(track)">
            {{ track.name }}
            <audio></audio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>