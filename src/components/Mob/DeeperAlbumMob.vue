<script setup>
import {Lists} from "../../common/lists";
import AlbumTrackListMob from "./AlbumTrackListMob.vue";
import AlbumCoverMob from "./AlbumCoverMob.vue";
import {useDMStore} from "../../stores/dm-store";

const props = defineProps(['d', 'num', 'item'])
const store = useDMStore()

function lists(artists) {
  return Lists.Ls(artists)
}
</script>
<template>
  <div class="deep_albums card2" v-bind:id="'alb'+d.id">
    <album-cover-mob :d="d" :cover="d.images[0]"></album-cover-mob>
    <div class="mx-2">
      <div class="mb-2 font-bold">{{d.name}}</div>
      <div>Released {{d.release_date}}</div>
      <div>By {{lists(d.artists)}}</div>
      <!--        Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">-->
      <!--        <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">-->
      <div @click="store.backToTop(d.parentId)">Back to top</div>
    </div>
    <div class="trackList">Tracks
      <template v-if="d.tracks.items">
        <div v-for="(track,index) in d.tracks.items" class="playable-search" style="color: var(--reset-color)"
             v-on:click="store.specialClick($event)" v-bind:key="index">
          <album-track-list-mob :d="d" :track="track" :num="num" :item="item"></album-track-list-mob>
        </div>
      </template>
      <template v-else>
        <div v-for="(track,index) in d.tracks" class="playable-search" style="color: var(--reset-color)"
             v-on:click="store.specialClick($event)" v-bind:key="index">
          <album-track-list-mob :d="d" :track="track" :num="num" :item="item"></album-track-list-mob>
        </div>
      </template>
    </div>
  </div>
</template>


<style scoped>

</style>