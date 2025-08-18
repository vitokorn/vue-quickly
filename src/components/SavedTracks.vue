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

// Props
const props = defineProps({
  selectedTopMenu: {
    type: Number,
    required: true
  },
  accordionActive: {
    type: Boolean,
    default: false
  }
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

// Local state for sorting
const selectedSTSortOption = ref("")

// Computed sorted data
const sortedSTItems = createTrackSorter(
  computed(() => spotifyStore.getSavedTracks || []),
  selectedSTSortOption
)

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
  spotifyStore.fetchSavedTracks(0)
}
</script>

<template>
  <div>
    <Loader v-if="spotifyStore.isLoading" />
    <teleport to="#option5" :disabled="!accordionActive">
      <div id="savedtrack" class="display-flex flex-wrap" v-show="selectedTopMenu === 5">
        <div class="section-header">
          <button class="refresh-button" @click="handleRefresh">
            <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
          </button>
        </div>
        <SortTracks v-model="selectedSTSortOption" />
        <div class="display-flex flex-wrap py-2 gap-8">
          <template v-for="(item, index) of sortedSTItems" :key="index">
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
    </teleport>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
