<script setup>
import MobileDeeperArtist from "./MobileDeeperArtist.vue";
import { getSectionName } from '../../utils/sectionUtils';
import MobileDeeperTracks from "./MobileDeeperTracks.vue";
import MobileDeeperAlbum from "./MobileDeeperAlbum.vue";
import SeedArtistsMob from "./SeedArtistsMob.vue";
import SeedTracksMob from "./SeedTracksMob.vue";
import MobileDeeperPlaylist from "./MobileDeeperPlaylist.vue";
import MobileUserPlaylists from "./MobileUserPlaylists.vue";
import {useDeeperStore} from "../../stores/deeper-store";

const props = defineProps(['num'])
const deeperStore = useDeeperStore()

function dab() {
  const sectionName = getSectionName(props.num)
  console.log(14, sectionName)
  let data = deeperStore.getSectionData(sectionName)
  console.log('RecTrack - Num:', props.num, 'Section name:', sectionName, 'Data length:', data.length, 'Data:', data)

  // Set the current section so other components know what section is being displayed
  deeperStore.setCurrentSection(sectionName)

  // Debug: Log what components will be rendered
  const componentTypes = data.map(item => item.type)
  console.log('RecTrack: Will render components of types:', componentTypes)

  return data
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

      <!-- User Playlists -->
      <MobileUserPlaylists
        v-else-if="item.type === 'user-playlists'"
        :d="item"
        :num="num"
      />
    </template>
  </div>
</template>

<style scoped>
</style>
