<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref} from "vue";

defineProps(['d', 'num', 'cover'])
const store = useDMStore()
const selected = ref()

function setActive(id) {
  selected.value = id
}
</script>

<template>
  <div v-if="d.type==='pl'" :key="index" :id="'d'+d.id" class="modern-playlist-item">
    <div class="playlist-cover-section">
      <div v-if="d.preview_url && cover" 
           class="playlist-cover playable" 
           :style="{ 'background-image': 'url(' + cover.url + ')' }" 
           @mouseover="store.mouseOver($event)" 
           @mouseleave="store.mouseLeave($event)">
        <div class="cover-overlay">
          <div class="playlist-name">{{ d.name }}</div>
        </div>
        <audio preload="auto" :src="d.preview_url"></audio>
      </div>
      
      <div v-else-if="!d.preview_url && cover" 
           class="playlist-cover unplayable" 
           :style="{ 'background-image': 'url(' + cover.url + ')' }">
        <div class="cover-overlay">
          <div class="playlist-name">{{ d.name }}</div>
        </div>
        <audio></audio>
      </div>
      
      <div v-else-if="d.preview_url && !cover" 
           class="playlist-cover playable no-image" 
           @mouseover="store.mouseOver($event)" 
           @mouseleave="store.mouseLeave($event)">
        <div class="cover-overlay">
          <div class="playlist-name">{{ d.name }}</div>
        </div>
        <audio preload="auto" :src="d.preview_url"></audio>
      </div>
      
      <div v-else 
           class="playlist-cover unplayable no-image">
        <div class="cover-overlay">
          <div class="playlist-name">{{ d.name }}</div>
        </div>
        <audio></audio>
      </div>
    </div>
    
    <div class="playlist-info">
      <h3 class="playlist-title">{{ d.name }}</h3>
      
      <div class="artists-section">
        <span class="artists-label">By</span>
        <div class="artists-list">
          <div v-for="(art, index) in d.artists" :key="index" class="artist-item">
            <span v-if="d.artists.length > 1 && d.artists.length - 1 === index" class="separator">&</span>
            <span v-if="d.artists.length >= 2 && d.artists.length - 1 !== index && index !== 0" class="separator">,</span>
            <button class="artist-link" @click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})">
              {{ art.name }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="playlist-actions">
        <button v-if="num !== 7" class="recommend-btn" @click="store.seedTracks({item:d,num:num,sib:'pl',child:'d'+ d.id})">
          <span class="btn-icon">🎵</span>
          Recommended songs based on this
        </button>
        <a class="spotify-link" :href="d['external_urls']['spotify']" target="_blank" rel="noopener">
          <span class="link-icon">🎧</span>
          Open in Spotify
        </a>
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
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})">
          <div class="artist-overlay">
            <div class="artist-name">{{ art.name }}</div>
          </div>
          <audio preload="auto" :src="art.preview_url"></audio>
        </div>
        
        <div v-else-if="!art.preview_url && art.images[0]" 
             class="artist-card unplayable"
             :class="selected === art.id ? 'selected' : ''"
             :style="{ 'background-image': 'url(' + art.images[0].url + ')' }"
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})">
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
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})">
          <div class="artist-overlay">
            <div class="artist-name">{{ art.name }}</div>
          </div>
          <audio preload="auto" :src="art.preview_url"></audio>
        </div>
        
        <div v-else 
             class="artist-card unplayable no-image"
             :class="selected === art.id ? 'selected' : ''"
             @click="setActive(art.id);store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})">
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