<script setup>
import TrackCover from "./TrackCover.vue";
import {useDMStore} from "../stores/dm-store";

defineProps(['d', 'num'])
const store = useDMStore()
</script>
<template v-bind:key="'dt2'+index">
    <div class="playlisttrack card2 d-flex" v-bind:id="'d'+d.id" style="margin-top: 12px; margin-bottom: 6px;">
      <track-cover :d="d" :cover=d.images[0]></track-cover>
      <div class="text-left" style="width: 50%;margin-left: 10px;">
        <div>{{d.name}}</div>
        <div class="d-flex align-items-center"><p>By </p>
          <div v-for="(art,index) in d.artists" v-bind:key="index" class="d-flex align-items-center">
            <div class="mx-2 pointer" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">{{art.name}}</div>
          </div>
        </div>
        <span class="light-washed-rose" v-on:click="store.seedTracks({item:d,num:num,sib:'playlisttrack',child:'d'+ d.id})">Recommended songs based on this</span>
        <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
<!--          Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">-->
<!--          <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">-->
        </div>
      </div>
      <template v-for="(art,index) in d.artists">
        <div class="artist-cirle con3" v-if="d.preview_url && d.images[0]" v-bind:key="index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
          <audio preload="auto" v-bind:src="d.preview_url"></audio>
          <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
        </div>
        <div class="artist-cirle con3" v-else-if="!d.preview_url && d.images[0] && store.unplayable_tracks" v-bind:key="'2'+index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
          <audio preload="none"></audio>
          <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
        </div>
        <div class="artist-cirle con3" v-else-if="d.preview_url && !d.images[0]" v-bind:key="'3'+index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})">
          <audio preload="auto" v-bind:src="d.preview_url"></audio>
          <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
        </div>
        <div class="artist-cirle con3" v-else-if="store.unplayable_tracks" v-bind:key="'4'+index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'playlisttrack'})" style="opacity: .5">
          <audio preload="none"></audio>
          <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
        </div>
      </template>
    </div>
</template>

<style scoped>

</style>