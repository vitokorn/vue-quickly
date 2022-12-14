<template>
  <div class="rectrack">
    <template v-for="(d,index) in dab" :key="index">
<!--      <div>{{d.type}}</div>-->
      <template v-if="d.type==='pl'">
        <template v-if="num===7">
          <Playlist v-if="d.type==='pl'" :d=d :index="index" :num="num" :cover="d.images[0]">
          </Playlist>
        </template>
        <template v-else>
          <Playlist v-if="d.type==='pl'" :d=d :index="index" :num="num" :cover="d.album.images[0]">
          </Playlist>
        </template>
      </template>
      <SeedTracks v-else-if="d.type==='seed_tracks'"  v-bind:id="d.id" :d=d :num="num">
      </SeedTracks>
      <TrackArtist v-else-if="d.type==='trackartist'" :d=d :num="num">
      </TrackArtist>
      <DeeperTracks v-else-if="d.type ==='deepertracks'"  :d=d :num="num">
      </DeeperTracks>
      <DeeperTracks2 v-else-if="d.type ==='deepertracks2'" :d=d :num="num">
      </DeeperTracks2>
      <DeeperAlbum v-else-if="d.type ==='deeperalbum'" :d=d :num="num">
      </DeeperAlbum>
      <SeedArtists v-else-if="d.type==='seed_artists'"  v-bind:id="d.id" :d=d :num="num">
      </SeedArtists>
      <DeeperPlaylist v-else-if="d.type==='deeperplaylist'" :d=d :num="num">
      </DeeperPlaylist>
    </template>
  </div>
</template>
<script>
import Playlist from "./Playlist";
import SeedTracks from "./SeedTracks";
import TrackArtist from "./TrackArtist";
import DeeperTracks from "./DeeperTracks";
import DeeperTracks2 from "./DeeperTracks2";
import DeeperAlbum from "./DeeperAlbum";
import SeedArtists from "./SeedArtists";
import DeeperPlaylist from "./DeeperPlaylist";
// import {toRaw} from 'vue'
export default {
  name: "rec-track",
  components: {DeeperPlaylist, SeedArtists, DeeperAlbum, DeeperTracks2, DeeperTracks, TrackArtist, Playlist,SeedTracks},
  props:['num'],
  data(){
    return{

    }

  },
  methods: {

  },
  computed:{
    // eslint-disable-next-line vue/return-in-computed-property
    dab() {
      if (this.num === 1){
        return this.$store.state.deeper1
      } else if (this.num === 2){
        return this.$store.state.deeper2
      } else if (this.num === 3){
        return this.$store.state.deeper3
      } else if (this.num === 4){
        return this.$store.state.deeper4
      }else if (this.num === 5){
        return this.$store.state.deeper5
      }else if (this.num === 6){
        return this.$store.state.deeper6
      }else if (this.num === 7){
        return this.$store.state.deeper7
      }else if (this.num === 8){
        return this.$store.state.deeper8
      }else if (this.num === 9){
        return this.$store.state.deeper9
      }else if (this.num === 10){
        return this.$store.state.deepers
      }else if (this.num === 22){
        return this.$store.state.deeper22
      }else if (this.num === 23){
        return this.$store.state.deeper23
      } else if (this.num === 32){
        return this.$store.state.deeper32
      }else if (this.num === 33){
        return this.$store.state.deeper33
      }
    },
  }

}
</script>

<style scoped>

</style>