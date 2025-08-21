<script setup>
import { computed, ref } from 'vue'
import { useSpotifyStore } from '../stores/spotify-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import SortAlbums from './SortAlbums.vue'
import AlbumItem from './AlbumItem.vue'
import Loader from './Loader.vue'

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
  spotifyStore.fetchSavedAlbums(0)
}
</script>

<template>
  <div>
    <Loader v-if="spotifyStore.isLoading" />
      <div id="savedalbum" class="display-flex flex-wrap" v-show="selectedTopMenu === 4">
        <div class="section-header">
          <button class="refresh-button" @click="handleRefresh">
            <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
          </button>
        </div>
        <SortAlbums v-model="selectedSASortOption" />
        <div class="display-flex flex-wrap py-2 gap-8">
          <template v-for="(item, index) of sortedSAItems" :key="index">
            <AlbumItem
              :album="item.album"
              :selected="selectedItem === '4' + item.album.id"
              :album-prefix="'4'"
              @click="handleAlbumClick"
            />
          </template>
        </div>
      </div>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
