<script setup>
import {Lists} from "../common/lists";
import AlbumTrackList from "./AlbumTrackList.vue";
import AlbumCover from "./AlbumCover.vue";
import {useDMStore} from "../stores/dm-store";
import {ref} from "vue";
function lists(artists){
  return Lists.Ls(artists)
}
const props = defineProps(['d','num'])
const store = useDMStore()
const selected = ref()
function setActive(id) {
  selected.value = id
}
</script>
<template>
    <div class="deep_albums card2" v-bind:id="'alb'+d.id">
      <album-cover :d="d" :cover="d.images[0]"></album-cover>
      <div class="mx-2">
        <div class="mb-2 font-bold">{{d.name}}</div>
        <div>Released {{d.release_date}}</div>
        <div>By {{lists(d.artists)}}</div>
<!--        Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">-->
<!--        <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">-->
      </div>
      <div class="trackList">TRACKS
        <template v-if="d.tracks.items">
          <div v-for="(track,index) in d.tracks.items" class="playable-search" style="color: var(--reset-color)" v-on:mouseover="store.parentmouseOver($event)" v-on:mouseleave="store.parentmouseLeave($event)" v-bind:key="index">
            <album-track-list :d="d"  :track="track" :num="num" :selected="selected" @set-active="setActive"></album-track-list>
          </div>
        </template>
        <template v-else>
          <div v-for="(track,index) in d.tracks" class="playable-search" style="color: var(--reset-color)" v-on:mouseover="store.parentmouseOver($event)" v-on:mouseleave="store.parentmouseLeave($event)" v-bind:key="index">
            <album-track-list :d="d" :track="track" :num="num" :selected="selected" @set-active="setActive"></album-track-list>
          </div>
        </template>
      </div>
    </div>
</template>



<style scoped>

</style>