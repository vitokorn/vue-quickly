<script setup>
import { computed, ref } from 'vue'
import { useSpotifyStore } from '../stores/spotify-store'
import { useAudioStore } from '../stores/audio-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import SortAlbums from './SortAlbums.vue'
import NewReleaseItem from './NewReleaseItem.vue'
import Loader from './Loader.vue'

// Props
const props = defineProps({
  selectedTopMenu: {
    type: Number,
    required: true
  },
})

// Emits
const emit = defineEmits(['album-click', 'album-hover', 'album-leave'])

// Stores
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const deeperStore = useDeeperStore()

// Composables
const { createAlbumSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting
const selectedNRSortOption = ref("")

// Computed sorted data
const sortedNRItems = createAlbumSorter(
  computed(() => spotifyStore.getNewReleases || []),
  selectedNRSortOption
)

// Event handlers
const handleAlbumClick = async (album, event) => {
  setSelectedItem('7' + album.id)
  await deeperStore.getAlbumDetails(album, 'newReleases')
  emit('album-click', album, event)
}

const handleAlbumHover = (event) => {
  audioStore.handleAudioHover(event)
  emit('album-hover', event)
}

const handleAlbumLeave = (event) => {
  audioStore.handleAudioLeave(event)
  emit('album-leave', event)
}

const handleRefresh = () => {
  spotifyStore.fetchNewReleases(0)
}
</script>

<template>
  <div>
    <Loader v-if="spotifyStore.isLoading" />
      <div id="newrelease" class="display-flex flex-wrap" v-show="selectedTopMenu === 7">
        <div class="section-header">
          <button class="refresh-button" @click="handleRefresh">
            <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
          </button>
        </div>
        <SortAlbums v-model="selectedNRSortOption" />
        <div class="display-flex flex-wrap py-2 gap-8">
          <template v-for="(item, index) of sortedNRItems" :key="index">
            <NewReleaseItem
              :album="item"
              :selected="selectedItem === '7' + item.id"
              :album-prefix="'7'"
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
