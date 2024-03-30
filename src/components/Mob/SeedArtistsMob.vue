<script setup>
import {useDMStore} from "../../stores/dm-store";

const props = defineProps(['d', 'num', 'item'])
const store = useDMStore()
</script>

<template>
  <div class="seed_artists card2" v-bind:key="'sa'+index" v-bind:id="d.id">
    <div>Recommended songs based on {{ d.name }}
      <button class="btn" v-on:click="store.reloadSA({num:num,id:d.id,name:d.name })"><img
          class="refresh-end" src="../../assets/refresh-icon.png" alt=""></button>
    </div>
    <div class="card2">
      <template v-for="(s,index) in d.tracks">
        <div v-if="s.preview_url && s.album.images[0]" class="con3" v-bind:key="index"
             v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }"
             v-on:click="store.click({event:$event}),store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_artists',parent:item}); store.queuein(s)">
          {{ s.name }}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else-if="!s.preview_url && s.album.images[0]" tabindex="0" class="con3" v-bind:key="'2'+index"
             v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5"
             v-on:click="store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_artists',parent:item}); store.queuein(s)">
          {{ s.name }}
          <audio preload="none"></audio>
        </div>
        <div v-else-if="s.preview_url && !s.album.images[0]" class="con3" v-bind:key="'3'+index"
             v-on:click="store.click({event:$event}),store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_artists',parent:item}); store.queuein(s)">
          {{ s.name }}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:key="'4'+index" style="opacity: .5"
             v-on:click="store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_artists',parent:item}); store.queuein(s)">
          {{ s.name }}
          <audio preload="none"></audio>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>