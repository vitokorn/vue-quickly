<script setup>
import { computed, ref } from 'vue'
import { useMusicStore } from '../stores/music-store'
import { useAudioStore } from '../stores/audio-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import SortAlbums from './SortAlbums.vue'
import AlbumItem from './AlbumItem.vue'
import Loader from './Loader.vue'
import RefreshButton from "./RefreshButton.vue";
import SortArtists from "./SortArtists.vue";

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
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const deeperStore = useDeeperStore()

// Composables
const { createNewReleaseSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting
const selectedNRSortOption = ref("")

// Computed sorted data
const sortedNRItems = createNewReleaseSorter(
  computed(() => musicStore.getNewReleases || []),
  selectedNRSortOption
)

// Event handlers
const handleAlbumClick = async (album, event) => {
  setSelectedItem('9' + album.id)
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
  musicStore.newReleases = []
  musicStore.fetchNewReleases(0)
}
</script>

<template>
  <div>
    <div class="p-2 flex-between-center">
      <div class="grid-2-1">
        <h4>New Releases</h4>
        <div class="ps-2">
          <RefreshButton :on-click="() => handleRefresh()"/>
        </div>
      </div>
      <SortAlbums v-model="selectedNRSortOption" />
    </div>
    <Loader v-if="musicStore.isLoading" />
      <div id="newrelease" class="display-flex flex-wrap" v-show="selectedTopMenu === 9">
        <div class="display-flex flex-wrap py-2 gap-8">
          <template v-for="(item, index) of sortedNRItems" :key="index">
            <AlbumItem
              :album="item"
              :selected="selectedItem === '9' + item.id"
              :album-prefix="'9'"
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
