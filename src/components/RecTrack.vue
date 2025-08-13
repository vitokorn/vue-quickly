<script setup>
import {useDMStore} from "../stores/dm-store";
import Playlist from "./Playlist.vue";
import SeedTracks from "./SeedTracks.vue";
import TrackArtist from "./TrackArtist.vue";
import DeeperTracks from "./DeeperTracks.vue";
import DeeperTracks2 from "./DeeperTracks2.vue";
import DeeperAlbum from "./DeeperAlbum.vue";
import SeedArtists from "./SeedArtists.vue";
import DeeperPlaylist from "./DeeperPlaylist.vue";

defineProps(['num'])
const store = useDMStore()

function dab() {
  return store.recommendations
}
</script>

<template>
  <div class="modern-recommendations">
    <div class="recommendations-container">
      <template v-for="(d, index) in dab()" :key="index">
        <!-- Playlist recommendations -->
        <template v-if="d.type==='pl'">
          <Playlist :d="d" :num="num" :cover="d.images[0]"></Playlist>
        </template>
        
        <!-- Seed tracks recommendations -->
        <SeedTracks v-else-if="d.type==='seed_tracks'" :id="d.id" :d="d" :num="num"></SeedTracks>
        
        <!-- Track artist recommendations -->
        <TrackArtist v-else-if="d.type==='track_artist'" :d="d" :num="num"></TrackArtist>
        
        <!-- Deeper tracks recommendations -->
        <DeeperTracks v-else-if="d.type==='deeper_tracks'" :d="d" :num="num"></DeeperTracks>
        
        <!-- Deeper tracks 2 recommendations -->
        <DeeperTracks2 v-else-if="d.type==='deeper_tracks2'" :d="d" :num="num"></DeeperTracks2>
        
        <!-- Deeper album recommendations -->
        <DeeperAlbum v-else-if="d.type==='deeper_album'" :d="d" :num="num"></DeeperAlbum>
        
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