<script setup>
import Playlist from "./Playlist.vue";
import SeedTracks from "./SeedTracks.vue";
import TrackArtist from "./TrackArtist.vue";
import DeeperTracks from "./DeeperTracks.vue";
import DeeperTracks2 from "./DeeperTracks2.vue";
import DeeperAlbum from "./DeeperAlbum.vue";
import SeedArtists from "./SeedArtists.vue";
import DeeperPlaylist from "./DeeperPlaylist.vue";
import {useDMStore} from "../stores/dm-store";
// import {toRaw} from 'vue'
const props = defineProps(['num'])
const store = useDMStore()

// eslint-disable-next-line vue/return-in-computed-property
function dab() {
  console.log(props.num)
  if (props.num === 1) {
    return store.getDeeper1
  } else if (props.num === 2) {
    return store.getDeeper2
  } else if (props.num === 3) {
    return store.getDeeper3
  } else if (props.num === 4) {
    return store.getDeeper4
  } else if (props.num === 5) {
    return store.getDeeper5
  } else if (props.num === 6) {
    return store.getDeeper6
  } else if (props.num === 7) {
    return store.getDeeper7
  } else if (props.num === 8) {
    return store.getDeeper8
  } else if (props.num === 9) {
    return store.getDeeper9
  } else if (props.num === 10) {
    return store.getDeepers
  } else if (props.num === 22) {
    return store.getDeeper22
  } else if (props.num === 23) {
    return store.getDeeper23
  } else if (props.num === 32) {
    return store.getDeeper32
  } else if (props.num === 33) {
    return store.getDeeper33
  }
}
</script>

<template>
  <div class="rectrack">
    <template v-for="(d,index) in dab()" :key="index">
      <!--      <div>{{d.type}}</div>-->
      <template v-if="d.type==='pl'">
        <template v-if="num===7">
          <Playlist v-if="d.type==='pl'" :d=d :index="index" :num="num" :cover="d.images[0]">
          </Playlist>
        </template>
        <template v-else-if="num===8">
          <Playlist v-if="d.type==='pl'" :d=d.track :index="index" :num="num" :cover="d.track.album.images[0]">
          </Playlist>
        </template>
        <template v-else>
          <Playlist v-if="d.type==='pl'" :d=d :index="index" :num="num" :cover="d.album.images[0]">
          </Playlist>
        </template>
      </template>
      <SeedTracks v-else-if="d.type==='seed_tracks'" v-bind:id="d.id" :d=d :num="num">
      </SeedTracks>
      <TrackArtist v-else-if="d.type==='trackartist'" :d=d :num="num">
      </TrackArtist>
      <DeeperTracks v-else-if="d.type ==='deepertracks'" :d=d :num="num">
      </DeeperTracks>
      <DeeperTracks2 v-else-if="d.type ==='deepertracks2'" :d=d :num="num">
      </DeeperTracks2>
      <DeeperAlbum v-else-if="d.type ==='deeperalbum'" :d=d :num="num">
      </DeeperAlbum>
      <SeedArtists v-else-if="d.type==='seed_artists'" v-bind:id="d.id" :d=d :num="num">
      </SeedArtists>
      <DeeperPlaylist v-else-if="d.type==='deeperplaylist'" :d=d :num="num">
      </DeeperPlaylist>
    </template>
  </div>
</template>


<style scoped>

</style>