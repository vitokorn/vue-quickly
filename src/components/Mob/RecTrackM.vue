<script setup>
import PlaylistMob from "./PlaylistMob.vue";
import SeedTracksMob from "./SeedTracksMob.vue";
import TrackArtistMob from "./TrackArtistMob.vue";
import DeeperTracksMob from "./DeeperTracksMob.vue";
import DeeperTracks2Mob from "./DeeperTracks2Mob.vue";
import DeeperAlbumMob from "./DeeperAlbumMob.vue";
import SeedArtistsMob from "./SeedArtistsMob.vue";
import DeeperPlaylistMob from "./DeeperPlaylistMob.vue";
import {useDMStore} from "../../stores/dm-store";

const props = defineProps(['num'])
const store = useDMStore()
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
        <!--          <div>type {{d.type}}</div>-->
        <!--          <div>item.id {{item.id}}</div>-->
        <!--          <div>pid {{d.pid}}</div>-->
        <template v-if="d.type==='pl'">
          <template v-if="num===7">
            <PlaylistMob v-if="d.type==='pl'" :d=d :index="index" :num="num" :cover="d.images[0]"
                         >
            </PlaylistMob>
          </template>
          <template v-else-if="num===8">
            <PlaylistMob v-if="d.type==='pl'" :d=d.track :index="index" :num="num" :cover="d.track.album.images[0]">
            </PlaylistMob>
          </template>
          <template v-else>
            <PlaylistMob v-if="d.type==='pl'" :d=d :index="index" :num="num"
                         :cover="d.album.images[0]" >
            </PlaylistMob>
          </template>
        </template>
        <SeedTracksMob v-else-if="d.type==='seed_tracks'" v-bind:id="d.id" :d=d :num="num"
                       >
        </SeedTracksMob>

        <TrackArtistMob v-else-if="d.type==='trackartist'" :d=d :num="num" >
        </TrackArtistMob>
        <DeeperTracksMob v-else-if="d.type ==='deepertracks'" :d=d :num="num" >
        </DeeperTracksMob>
        <DeeperTracks2Mob v-else-if="d.type ==='deepertracks2'" :d=d :num="num" >
        </DeeperTracks2Mob>
        <DeeperAlbumMob v-else-if="d.type ==='deeperalbum'" :d=d :num="num" >
        </DeeperAlbumMob>
        <SeedArtistsMob v-else-if="d.type==='seed_artists'" v-bind:id="d.id" :d=d :num="num"
                        >
        </SeedArtistsMob>
        <DeeperPlaylistMob v-else-if="d.type==='deeperplaylist'" :d=d :num="num" >
        </DeeperPlaylistMob>
      </template>
    </div>
</template>


<style scoped>

</style>