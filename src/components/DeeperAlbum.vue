<template>
    <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
      <album-cover :d="d" :cover="d.images[0]"></album-cover>
      <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
        <div>Released {{d.release_date}}</div>
        <div>By {{lists(d.artists)}}</div>
<!--        Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">-->
<!--        <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">-->
      </div>
      <div style="display: block;" class="trackList">Tracks
        <template v-if="d.tracks.items">
          <div v-for="(track,index) in d.tracks.items" class="playable-search" style="color: var(--con2-color)" v-on:mouseover="this.$store.dispatch('parentmouseOver',$event)" v-on:mouseleave="this.$store.dispatch('parentmouseLeave',$event)" v-bind:key="index">
            <album-track-list :d="d" :track="track" :num="num"></album-track-list>
          </div>
        </template>
        <template v-else>
          <div v-for="(track,index) in d.tracks" class="playable-search" style="color: var(--con2-color)" v-on:mouseover="this.$store.dispatch('parentmouseOver',$event)" v-on:mouseleave="this.$store.dispatch('parentmouseLeave',$event)" v-bind:key="index">
            <album-track-list :d="d" :track="track" :num="num"></album-track-list>
          </div>
        </template>
      </div>
    </div>
</template>

<script>
import {Lists} from "../common/lists";
import AlbumTrackList from "./AlbumTrackList";
import AlbumCover from "./AlbumCover";
export default {
  name: "deeper-album",
  components: {AlbumCover, AlbumTrackList},
  props: ['d','num'],
  methods:{
    lists(artists){
      return Lists.Ls(artists)
    }
  }
}
</script>

<style scoped>

</style>