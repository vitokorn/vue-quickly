<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref, computed} from "vue";
import SortTracks from "./SortTracks.vue";

defineProps(['d', 'num'])
const store = useDMStore()
const selected = ref()
const selectedDeeperPlaylistSortOption = ref("")

const sortedDeeperPlaylistItems = computed(() => {
  const items = d.tracks?.items || []
  if (!selectedDeeperPlaylistSortOption.value) return items
  
  return [...items].sort((a, b) => {
    const trackA = a.track
    const trackB = b.track
    
    switch (selectedDeeperPlaylistSortOption.value) {
      case 'track':
        return trackA.name.localeCompare(trackB.name)
      case 'album':
        return trackA.album.name.localeCompare(trackB.album.name)
      case 'artist':
        return trackA.artists[0].name.localeCompare(trackB.artists[0].name)
      case 'popularity':
        return trackB.popularity - trackA.popularity
      case 'release_date':
        return new Date(trackB.album.release_date) - new Date(trackA.album.release_date)
      case 'duration':
        return trackA.duration_ms - trackB.duration_ms
      default:
        return 0
    }
  })
})

function setActive(id) {
  selected.value = id
}
</script>

<template>
  <div class="modern-playlist-card" :id="'p' + d.id">
    <div class="playlist-header">
      <div class="playlist-info">
        <div class="playlist-title-section">
          <h2 class="playlist-title">{{ d.name }}</h2>
          <button class="refresh-button" @click="store.reloader({num:1,event:$event})">
            <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
          </button>
        </div>
        <div class="playlist-description" v-html="d.description"></div>
      </div>
      
      <div class="playlist-cover" v-if="d.images[0]">
        <img :src="d.images[0].url" alt="Playlist cover">
      </div>
      
      <div class="playlist-actions">
        <div class="follow-section">
          <span class="follow-label">Follow</span>
          <label class="follow-checkbox">
            <input type="checkbox" v-if="d.followed" @click.once="store.followPlaylist($event)" checked v-model="d.followed">
            <input type="checkbox" v-else @click.once="store.followPlaylist($event)" v-model="d.followed">
            <span class="checkmark"></span>
          </label>
        </div>
        <a class="spotify-link" :href="d['external_urls']['spotify']" target="_blank" rel="noopener">
          <span class="link-icon">🎧</span>
          Open in Spotify
        </a>
        <div class="sort-section">
          <sort-tracks v-model="selectedDeeperPlaylistSortOption"/>
        </div>
      </div>
    </div>
    
    <div class="tracks-grid">
      <div v-for="(item, index) in sortedDeeperPlaylistItems" :key="index" class="track-card">
        <div v-if="item.track.preview_url && item.track.album.images[0]"
             class="track-item playable"
             :class="selected === item.track.id ? 'selected' : ''"
             :style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }"
             @mouseover="store.mouseOver($event)"
             @mouseleave="store.mouseLeave($event)"
             @click="setActive(item.track.id);store.deeperTracks({item:item.track,num:num,flag:false,sib:'deeperplaylist',child:'p'+ d.id}); store.queuein(item.track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ item.track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ item.track.name }}</div>
            </div>
          </div>
          <audio preload="auto" :src="item.track.preview_url"></audio>
        </div>
        
        <div v-else-if="!item.track.preview_url && item.track.album.images[0]"
             class="track-item unplayable"
             :class="selected === item.track.id ? 'selected' : ''"
             :style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }"
             @click="setActive(item.track.id);store.deeperTracks({item:item.track,num:num,flag:false,sib:'deeperplaylist',child:'p'+ d.id}); store.queuein(item.track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ item.track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ item.track.name }}</div>
            </div>
          </div>
          <audio></audio>
        </div>
        
        <div v-else-if="item.track.preview_url && !item.track.album.images[0]"
             class="track-item playable no-image"
             :class="selected === item.track.id ? 'selected' : ''"
             @mouseover="store.mouseOver($event)"
             @mouseleave="store.mouseLeave($event)"
             @click="setActive(item.track.id);store.deeperTracks({item:item.track,num:num,flag:false,sib:'deeperplaylist',child:'p'+ d.id}); store.queuein(item.track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ item.track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ item.track.name }}</div>
            </div>
          </div>
          <audio preload="auto" :src="item.track.preview_url"></audio>
        </div>
        
        <div v-else
             class="track-item unplayable no-image"
             :class="selected === item.track.id ? 'selected' : ''"
             @click="setActive(item.track.id);store.deeperTracks({item:item.track,num:num,flag:false,sib:'deeperplaylist',child:'p'+ d.id}); store.queuein(item.track)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ item.track.artists.map(a => a.name).join(', ') }}</div>
              <div class="track-name">{{ item.track.name }}</div>
            </div>
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