<template>
    <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
      <album-cover-mob :d="d" :cover="d.images[0]"></album-cover-mob>
      <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
        <div>Released {{d.release_date}}</div>
        <div>By {{lists(d.artists)}}</div>
<!--        Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">-->
<!--        <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">-->
      </div>
      <div style="display: block;" class="trackList">Tracks
        <template v-if="d.tracks.items">
          <div v-for="(track,index) in d.tracks.items" class="playable-search" style="color: var(--con2-color)" v-on:click="this.$store.dispatch('parentClick',{event:$event})" v-bind:key="index">
            <album-track-list-mob :d="d" :track="track" :num="num" :item="item"></album-track-list-mob>
          </div>
        </template>
        <template v-else>
          <div v-for="(track,index) in d.tracks" class="playable-search" style="color: var(--con2-color)" v-on:click="this.$store.dispatch('parentClick',{event:$event})" v-bind:key="index">
            <album-track-list-mob :d="d" :track="track" :num="num" :item="item"></album-track-list-mob>
          </div>
        </template>
      </div>
    </div>
</template>

<script>
import {Lists} from "@/common/lists";
import AlbumTrackListMob from "./AlbumTrackListMob";
import AlbumCoverMob from "./AlbumCoverMob";
export default {
  name: "deeper-album",
  components: {AlbumCoverMob, AlbumTrackListMob},
  props: ['d','num','item'],
  methods:{
    lists(artists){
      return Lists.Ls(artists)
    }
  }
}
</script>

<style scoped>

</style>