<script setup>
import PlaylistMob from "./PlaylistMob.vue";
import SeedTracksMob from "./SeedTracksMob.vue";
import TrackArtistMob from "./TrackArtistMob.vue";
import DeeperTracksMob from "./DeeperTracksMob.vue";
import DeeperTracks2Mob from "./DeeperTracks2Mob.vue";
import DeeperAlbumMob from "./DeeperAlbumMob.vue";
import SeedArtistsMob from "./SeedArtistsMob.vue";
import DeeperPlaylistMob from "./DeeperPlaylistMob.vue";
import {useDeeperStore} from "../../stores/deeper-store";

const props = defineProps(['num'])
const deeperStore = useDeeperStore()

function dab() {
  console.log(props.num)
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
  <div class="rectrack">
    <template v-for="(item, index) in dab()" :key="index">
      <!-- Seed Tracks -->
      <SeedTracksMob
        v-if="item.type === 'seed_tracks'"
        :d="item"
        :num="num"
      />

      <!-- Track Artist -->
      <TrackArtistMob
        v-else-if="item.type === 'trackartist'"
        :d="item"
        :num="num"
      />

      <!-- Deeper Tracks -->
      <DeeperTracksMob
        v-else-if="item.type === 'deepertracks'"
        :d="item"
        :num="num"
      />

      <!-- Deeper Tracks 2 -->
      <DeeperTracks2Mob
        v-else-if="item.type === 'deepertracks2'"
        :d="item"
        :num="num"
      />

      <!-- Deeper Album -->
      <DeeperAlbumMob
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
      <DeeperPlaylistMob
        v-else-if="item.type === 'deeperplaylist'"
        :d="item"
        :num="num"
      />
    </template>
  </div>
</template>

<style scoped>
</style>
