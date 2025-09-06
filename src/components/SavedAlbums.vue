<script setup>
import { computed, ref } from 'vue'
import { useSpotifyStore } from '../stores/spotify-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import SortAlbums from './SortAlbums.vue'
import AlbumItem from './AlbumItem.vue'
import Loader from './Loader.vue'
import RefreshButton from "./RefreshButton.vue";
import SortArtists from "./SortArtists.vue";
import {useAudioStore} from "../stores/audio-store.js";

// Props
const props = defineProps({
  selectedTopMenu: {
    type: Number,
    required: true
  },
})

// Emits
const emit = defineEmits(['album-click'])

// Stores
const audioStore = useAudioStore()
const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Composables
const { createAlbumSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting
const selectedSASortOption = ref("")

// Computed sorted data
const sortedSAItems = createAlbumSorter(
  computed(() => spotifyStore.getSavedAlbums || []),
  selectedSASortOption
)

// Event handlers
const handleAlbumClick = async (album, event) => {
  setSelectedItem('4' + album.id)
  await deeperStore.getAlbumDetails(album, 'savedAlbums')
  emit('album-click', album, event)
}

const handleRefresh = () => {
  spotifyStore.savedAlbums = []
  spotifyStore.fetchSavedAlbums(0)
}

const handleAlbumHover = (event) => {
  audioStore.handleAudioHover(event)
}

const handleAlbumLeave = (event) => {
  audioStore.handleAudioLeave(event)
}
</script>

<template>
  <div>
    <div class="p-2 flex-between-center">
      <div class="grid-2-1">
        <h4>Saved Albums</h4>
        <div class="ps-2">
          <RefreshButton :on-click="() => handleRefresh()"/>
        </div>
      </div>
      <SortAlbums v-model="selectedSASortOption" />
    </div>
    <Loader v-if="spotifyStore.isLoading" />
      <div id="savedalbum" class="display-flex flex-wrap" v-show="selectedTopMenu === 4">
        <div class="display-flex flex-wrap py-2 gap-8">
          <template v-for="(item, index) of sortedSAItems" :key="index">
            <AlbumItem
              :album="item.album"
              :selected="selectedItem === '4' + item.album.id"
              :album-prefix="'4'"
              @click="handleAlbumClick"
              @hover="handleAlbumHover"
              @leave="handleAlbumLeave"
            />
          </template>
        </div>
      </div>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
