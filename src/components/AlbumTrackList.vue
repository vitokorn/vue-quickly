<script setup>
import {useDMStore} from "../stores/dm-store";

defineProps(['d', 'track', 'num'])
const store = useDMStore()

</script>

<template>
  <div v-if="track.preview_url && d.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
       v-on:mouseover="store.mouseOver($event)"
       v-on:mouseleave="store.mouseLeave($event)"
       v-on:click="store.deeperTracks2({item:track,d:d,num:num,sib:'deep_albums'}); store.queuein(track)"
       v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
    <audio preload="auto" v-bind:src="track.preview_url"></audio>
  </div>
  <div v-else-if="!track.preview_url && d.images[0] && store.unplayable_tracks" tabindex="0" class="itemImg itemImg-xs itemImg-search half-opacity"
       v-on:click="store.deeperTracks2({item:track,d:d,num:num,sib:'deep_albums'}); store.queuein(track)"
       v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
    <audio preload="none"></audio>
  </div>
  <div v-else-if="track.preview_url && !d.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
       v-on:mouseover="store.mouseOver($event)"
       v-on:mouseleave="store.mouseLeave($event)"
       v-on:click="store.deeperTracks2({item:track,d:d,num:num,sib:'deep_albums'}); store.queuein(track)">
    <audio preload="auto" v-bind:src="track.preview_url"></audio>
  </div>
  <div v-else-if="store.unplayable_tracks" tabindex="0" class="itemImg itemImg-xs itemImg-search half-opacity"
       v-on:click="store.deeperTracks2({item:track,d:d,num:num,sib:'deep_albums'}); store.queuein(track)">
    <audio preload="none"></audio>
  </div>
  <div class="title"
       v-on:click="store.deeperTracks2({item:track,d:d,num:num,sib:'deep_albums'}); store.queuein(track)">
    <div>{{ track.name }}</div>
  </div>

</template>


<style scoped>

</style>