<script setup>
import {useDeeperStore} from "../stores/deeper-store";
import { getSectionName } from '../utils/sectionUtils';
import SeedTracks from "./SeedTracks.vue";
import TrackArtist from "./TrackArtist.vue";
import DeeperTracks from "./DeeperTracks.vue";
import DeeperAlbum from "./DeeperAlbum.vue";
import SeedArtists from "./SeedArtists.vue";
import DeeperPlaylist from "./DeeperPlaylist.vue";
import UserPlaylists from "./UserPlaylists.vue";

const props = defineProps(['num'])
const deeperStore = useDeeperStore()

function dab() {
  const sectionName = getSectionName(props.num)
  const data = deeperStore.getSectionData(sectionName)
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
  <div class="modern-recommendations">
    <div class="rec_track">
      <template v-for="(item, index) in dab()" :key="`${item.type}_${item.id}${item.parentKey ? `__p:${item.parentKey}__` : ''}`">
        <!-- Seed Tracks -->
        <SeedTracks
          v-if="item.type === 'seed_tracks'"
          :d="item"
          :num="num"
        />

        <!-- Track Artist -->
        <TrackArtist
          v-else-if="item.type === 'trackartist'"
          :d="item"
          :num="num"
        />

        <!-- Deeper Tracks -->
        <DeeperTracks
          v-else-if="item.type === 'deepertracks'"
          :d="item"
          :num="num"
        />

        <!-- Deeper Album -->
        <DeeperAlbum
          v-else-if="item.type === 'deeperalbum'"
          :d="item"
          :num="num"
        />

        <!-- Seed Artists -->
        <SeedArtists
          v-else-if="item.type === 'seed_artists'"
          :d="item"
          :num="num"
        />

        <!-- Deeper Playlist -->
        <DeeperPlaylist
          v-else-if="item.type === 'deeperplaylist'"
          :d="item"
          :num="num"
        />

        <!-- User Playlists -->
        <UserPlaylists
          v-else-if="item.type === 'user-playlists'"
          :d="item"
          :num="num"
        />

        <!-- Category Playlists -->
        <DeeperPlaylist
          v-else-if="item.type === 'category-playlist'"
          :d="item"
          :num="num"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
