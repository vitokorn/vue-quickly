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
      </div>
    </div>

    <div class="tracks-section">
      <div class="tracks-header">
        <span class="tracks-icon">🎵</span>
        <h3 class="tracks-title">Tracks</h3>
      </div>
      <div class="tracks-list">
        <div v-for="(track, index) in d.tracks.items" :key="index" class="">
          <div v-if="track.preview_url && d.images && d.images[0]"
               class="con3 playable"
               :class="selected === track.id ? 'selected' : ''"
               :style="{ 'background-image': 'url(' + d.images[0].url + ')' }"
               @mouseover="store.mouseOver($event)"
               @mouseleave="store.mouseLeave($event)"
               @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'deeperalbum',child:'a'+ d.id}); store.queuein(track)">
            {{ track.name }}
            <audio preload="auto" :src="track.preview_url"></audio>
          </div>

          <div v-else-if="!track.preview_url && d.images && d.images[0]"
               class="con3 unplayable"
               :class="selected === track.id ? 'selected' : ''"
               :style="{ 'background-image': 'url(' + d.images[0].url + ')' }"
               @click="setActive(track.id);store.deeperTracks({item:track,num:num,flag:false,sib:'deeperalbum',child:'a'+ d.id}); store.queuein(track)">
            {{ track.name }}
            <audio></audio>
          </div>

          <div v-else-if="track.preview_url && !d.images[0]"
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
