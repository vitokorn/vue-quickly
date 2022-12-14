<template>
  <div class="rectrack">
      <div class="hcontent">
        <template v-for="(d,index) in dab" :key="index">
<!--          <div>type {{d.type}}</div>-->
<!--          <div>item.id {{item.id}}</div>-->
<!--          <div>pid {{d.pid}}</div>-->
          <template v-if="d.type==='pl' && d.pid === item.id">
            <template v-if="num===7">
              <PlaylistMob v-if="d.type==='pl' && d.pid === item.id" :d=d :index="index" :num="num" :cover="d.images[0]" :item="item">
              </PlaylistMob>
            </template>
            <template v-else>
              <PlaylistMob v-if="d.type==='pl' && d.pid === item.id" :d=d :index="index" :num="num" :cover="d.album.images[0]" :item="item">
              </PlaylistMob>
            </template>
          </template>
          <SeedTracksMob v-else-if="d.type==='seed_tracks' && d.pid === item.id"  v-bind:id="d.id" :d=d :num="num" :item="item">
          </SeedTracksMob>

          <TrackArtistMob v-else-if="d.type==='trackartist' && d.pid === item.id" :d=d :num="num" :item="item">
          </TrackArtistMob>
          <DeeperTracksMob v-else-if="d.type ==='deepertracks' && d.pid === item.id"  :d=d :num="num" :item="item">
          </DeeperTracksMob>
          <DeeperTracks2Mob v-else-if="d.type ==='deepertracks2' && d.pid === item.id" :d=d :num="num" :item="item">
          </DeeperTracks2Mob>
          <DeeperAlbumMob v-else-if="d.type ==='deeperalbum' && d.pid === item.id" :d=d :num="num" :item="item">
          </DeeperAlbumMob>
          <SeedArtistsMob v-else-if="d.type==='seed_artists' && d.pid === item.id"  v-bind:id="d.id" :d=d :num="num" :item="item">
          </SeedArtistsMob>
          <DeeperPlaylistMob v-else-if="d.type==='deeperplaylist' && d.pid === item.id" :d=d :num="num" :item="item">
          </DeeperPlaylistMob>
        </template>
    </div>
  </div>
</template>
<script>
import PlaylistMob from "./PlaylistMob";
import SeedTracksMob from "./SeedTracksMob";
import TrackArtistMob from "./TrackArtistMob";
import DeeperTracksMob from "./DeeperTracksMob";
import DeeperTracks2Mob from "./DeeperTracks2Mob";
import DeeperAlbumMob from "./DeeperAlbumMob";
import SeedArtistsMob from "./SeedArtistsMob";
import DeeperPlaylistMob from "./DeeperPlaylistMob";
// import {toRaw} from 'vue'
export default {
  name: "rec-track-m",
  components: {DeeperPlaylistMob, SeedArtistsMob, DeeperAlbumMob, DeeperTracks2Mob, DeeperTracksMob, TrackArtistMob, PlaylistMob,SeedTracksMob},
  props:['item','num'],
  data(){
    return{
      dr:false
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