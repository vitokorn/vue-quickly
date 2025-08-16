<script setup>
import {useDMStore} from "../stores/dm-store";
import SeedTracks from "./SeedTracks.vue";
import TrackArtist from "./TrackArtist.vue";
import DeeperTracks from "./DeeperTracks.vue";
import DeeperAlbum from "./DeeperAlbum.vue";
import SeedArtists from "./SeedArtists.vue";
import DeeperPlaylist from "./DeeperPlaylist.vue";

const props = defineProps(['num'])
const store = useDMStore()

function dab() {
  console.log('RecTrack dab() called with num:', props.num)
  let result
  if (props.num === 1) {
    result = store.getDeeper1
  } else if (props.num === 2) {
    result = store.getDeeper2
  } else if (props.num === 3) {
    result = store.getDeeper3
  } else if (props.num === 4) {
    result = store.getDeeper4
  } else if (props.num === 5) {
    result = store.getDeeper5
  } else if (props.num === 6) {
    result = store.getDeeper6
  } else if (props.num === 7) {
    result = store.getDeeper7
  } else if (props.num === 8) {
    result = store.getDeeper8
  } else if (props.num === 9) {
    result = store.getDeeper9
  } else if (props.num === 10) {
    result = store.getDeepers
  } else if (props.num === 22) {
    result = store.getDeeper22
  } else if (props.num === 23) {
    result = store.getDeeper23
  } else if (props.num === 32) {
    result = store.getDeeper32
  } else if (props.num === 33) {
    result = store.getDeeper33
  }
  
  console.log('RecTrack dab() returning:', result)
  return result
}
</script>

<template>
  <div class="modern-recommendations">
    <div class="recommendations-container">
      <template v-for="(d, index) in dab()" :key="index">
        <div style="display: none;">Debug: {{ d.type }} - {{ d.id }}</div>

        <!-- Seed tracks recommendations -->
        <SeedTracks v-if="d.type==='seed_tracks'" :id="d.id" :d="d" :num="num"></SeedTracks>

        <!-- Track artist recommendations -->
        <TrackArtist v-else-if="d.type==='trackartist'" :d="d" :num="num"></TrackArtist>

        <!-- Deeper tracks recommendations (merged DeeperTracks and DeeperTracks2) -->
        <DeeperTracks v-else-if="d.type==='deepertracks'" :d="d" :num="num"></DeeperTracks>
        <DeeperTracks v-else-if="d.type==='deepertracks2'" :d="d" :num="num"></DeeperTracks>

        <!-- Deeper album recommendations -->
        <DeeperAlbum v-else-if="d.type==='deeperalbum'" :d="d" :num="num"></DeeperAlbum>

        <!-- Seed artists recommendations -->
        <SeedArtists v-else-if="d.type==='seed_artists'" :d="d" :num="num"></SeedArtists>

        <!-- Deeper playlist recommendations -->
        <DeeperPlaylist v-else-if="d.type==='deeper_playlist'" :d="d" :num="num"></DeeperPlaylist>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Styles moved to main styles.css */
</style>
