<script setup>
import {useDeeperStore} from "../stores/deeper-store";
import SeedTracks from "./SeedTracks.vue";
import TrackArtist from "./TrackArtist.vue";
import DeeperTracks from "./DeeperTracks.vue";
import DeeperAlbum from "./DeeperAlbum.vue";
import SeedArtists from "./SeedArtists.vue";
import DeeperPlaylist from "./DeeperPlaylist.vue";

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
  <div class="modern-recommendations">
    <div class="rectrack">
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
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
