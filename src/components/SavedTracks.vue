<script setup>
import { computed, ref } from 'vue'
import { useSpotifyStore } from '../stores/spotify-store'
import { useAudioStore } from '../stores/audio-store'
import { useQueueStore } from '../stores/queue-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import SortTracks from './SortTracks.vue'
import TrackItem from './TrackItem.vue'
import Loader from './Loader.vue'
import RefreshButton from "./RefreshButton.vue";
import PaginationContainer from './PaginationContainer.vue'

// Props
const props = defineProps({
  selectedTopMenu: {
    type: Number,
    required: true
  },
})

// Emits
const emit = defineEmits(['track-click', 'track-hover', 'track-leave'])

// Stores
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Composables
const { createTrackSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting and pagination
const selectedSTSortOption = ref("")
const currentPage = ref(1)
const itemsPerPage = 50
const loadingMore = ref(false)

// Computed sorted data
const sortedSTItems = createTrackSorter(
  computed(() => spotifyStore.getSavedTracks || []),
  selectedSTSortOption
)

// Computed pagination data
const totalItems = computed(() => spotifyStore.savedTracksTotal)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const displayedItems = computed(() => {
  // For API pagination, we show all loaded items up to current page
  const maxItems = currentPage.value * itemsPerPage
  return sortedSTItems.value.slice(0, maxItems)
})

// Event handlers
const handleTrackClick = async (track, event) => {
  setSelectedItem('5' + track.id)
  await deeperStore.getTrackDetails(track, 'savedTracks')
  queueStore.addToQueue(track)
  emit('track-click', track, event)
}

const handleTrackHover = (event) => {
  audioStore.handleAudioHover(event)
  emit('track-hover', event)
}

const handleTrackLeave = (event) => {
  audioStore.handleAudioLeave(event)
  emit('track-leave', event)
}

const handleRefresh = () => {
  spotifyStore.savedTracks = []
  spotifyStore.fetchSavedTracks(0)
  currentPage.value = 1 // Reset to first page
}

const handlePageChange = async (page) => {
  if (page > currentPage.value) {
    // Moving to next page - need to fetch more data
    const currentOffset = spotifyStore.savedTracks.length
    const targetOffset = (page - 1) * itemsPerPage

    if (targetOffset >= currentOffset) {
      // Need to fetch more data
      loadingMore.value = true
      try {
        await spotifyStore.fetchSavedTracks(currentOffset)
      } catch (error) {
        console.error('Failed to load more tracks:', error)
      } finally {
        loadingMore.value = false
      }
    }
  }

  currentPage.value = page
}
</script>

<template>
  <div>
    <div class="p-2 flex-between-center">
      <div class="grid-2-1">
        <h4>Saved Tracks</h4>
        <div class="ps-2">
          <RefreshButton :on-click="() => handleRefresh()"/>
        </div>
      </div>
      <SortTracks v-model="selectedSTSortOption" />
    </div>
    <Loader v-if="spotifyStore.isLoading" />
    <div v-if="loadingMore" class="loading-more">
      <div class="loading-spinner"></div>
      <span>Loading more tracks...</span>
    </div>
      <div id="savedtrack" class="display-flex flex-wrap" v-show="selectedTopMenu === 5">
        <div class="display-flex flex-wrap py-2 gap-8">
          <template v-for="(item, index) of displayedItems" :key="index">
            <TrackItem
              :track="item.track"
              :selected="selectedItem === '5' + item.track.id"
              :unplayable-tracks="audioStore.unplayableTracks"
              :track-prefix="'5'"
              @click="handleTrackClick"
              @hover="handleTrackHover"
              @leave="handleTrackLeave"
            />
          </template>
        </div>
      </div>
    <PaginationContainer
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        @page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #777;
  font-size: 0.9rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1db954;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
