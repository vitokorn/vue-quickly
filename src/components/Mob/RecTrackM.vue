<script setup>
import MobileDeeperArtist from "./MobileDeeperArtist.vue";
import MobileDeeperTracks from "./MobileDeeperTracks.vue";
import MobileDeeperAlbum from "./MobileDeeperAlbum.vue";
import SeedArtistsMob from "./SeedArtistsMob.vue";
import SeedTracksMob from "./SeedTracksMob.vue";
import MobileDeeperPlaylist from "./MobileDeeperPlaylist.vue";
import {useDeeperStore} from "../../stores/deeper-store";

const props = defineProps(['num'])
const deeperStore = useDeeperStore()

function dab() {
  const sectionName = getSectionName(props.num)
  return deeperStore.getSectionData(sectionName)
}

function getSectionName(num) {
  switch (num) {
    case 1: return 'yourPlaylists'
    case 2: return 'topArtists'
    case 3: return 'topTracks'
    case 4: return 'savedAlbums'
    case 5: return 'savedTracks'
    case 6: return 'followedArtists'
    case 7: return 'newReleases'
    case 8: return 'spotifyPlaylists'
    case 10: return 'search'
    case 22: return 'topArtists6'
    case 23: return 'topArtistsAll'
    case 32: return 'topTracks6'
    case 33: return 'topTracksAll'
    default: return 'search'
  }
}
</script>

<template>
  <div class="rec_track">
    <template v-for="(item, index) in dab()" :key="`${item.type}_${item.id}${item.parentKey ? `__p:${item.parentKey}__` : ''}`">
      <!-- Seed Tracks -->
      <SeedTracksMob
        v-if="item.type === 'seed_tracks'"
        :d="item"
        :num="num"
      />

      <!-- Track Artist -->
      <MobileDeeperArtist
        v-else-if="item.type === 'trackartist'"
        :d="item"
        :num="num"
      />

      <!-- Deeper Tracks -->
      <MobileDeeperTracks
        v-else-if="item.type === 'deepertracks' || item.type === 'track'"
        :d="item"
        :num="num"
      />

      <!-- Deeper Album -->
      <MobileDeeperAlbum
        v-else-if="item.type === 'deeperalbum'"
        :d="item"
        :num="num"
      />

      <!-- Seed Artists -->
      <SeedArtistsMob
        v-else-if="item.type === 'seed_artists'"
        :d="item"
        :num="num"
      />

      <!-- Deeper Playlist -->
      <MobileDeeperPlaylist
        v-else-if="item.type === 'deeperplaylist'"
        :d="item"
        :num="num"
      />
    </template>
  </div>
</template>

<style scoped>
</style>
