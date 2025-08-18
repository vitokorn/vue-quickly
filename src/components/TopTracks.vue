<script setup>
import { computed, ref } from 'vue'
import { useSpotifyStore } from '../stores/spotify-store'
import { useAudioStore } from '../stores/audio-store'
import { useQueueStore } from '../stores/queue-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import TimeRangeSelector from './TimeRangeSelector.vue'
import TrackDisplaySection from './TrackDisplaySection.vue'
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
const selectedTTSortOption = ref("")
const selectedTTMSortOption = ref("")
const selectedTTLSortOption = ref("")

// Computed sorted data
const sortedTTItems = createTrackSorter(
  computed(() => spotifyStore.getTopTracksShort || []),
  selectedTTSortOption
)

const sortedTTMItems = createTrackSorter(
  computed(() => spotifyStore.getTopTracksMedium || []),
  selectedTTMSortOption
)

const sortedTTLItems = createTrackSorter(
  computed(() => spotifyStore.getTopTracksLong || []),
  selectedTTLSortOption
)

// Event handlers
const handleTrackClick = async (track, event) => {
  setSelectedItem(track.id)
  const sectionName = 'topTracks'
  await deeperStore.getTrackDetails(track, sectionName)
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

const handleRangeChange = async (rangeId, event) => {
  spotifyStore.setSelectedTracksRange(rangeId)
  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term'
  await spotifyStore.fetchTopTracks(timeRange)
}

const handleRefresh = async (rangeId, event) => {
  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term'
  await spotifyStore.fetchTopTracks(timeRange)
}
</script>

<template>
  <div>
    <Loader v-if="spotifyStore.isLoading" />
    <teleport to="#option3" :disabled="!accordionActive">
      <TimeRangeSelector
        v-show="selectedTopMenu === 3"
        :selected-range="spotifyStore.selectedTracksRange"
        :section-type="'tracks'"
        :ranges="[
          { id: 1, label: 'Last month', fetchMethod: 'fetchTopTracks', reloadMethod: 'fetchTopTracks' },
          { id: 2, label: 'Last 6 month', fetchMethod: 'fetchTopTracks', reloadMethod: 'fetchTopTracks' },
          { id: 3, label: 'All time', fetchMethod: 'fetchTopTracks', reloadMethod: 'fetchTopTracks' }
        ]"
        @range-change="handleRangeChange"
        @refresh="handleRefresh"
      />
      
      <!-- Track Display Sections -->
      <TrackDisplaySection
        :tracks="sortedTTItems"
        section-id="toptracks"
        :is-visible="spotifyStore.selectedTracksRange === 1"
        track-prefix="3"
        :selected-sort-option="selectedTTSortOption"
        @sort-change="selectedTTSortOption = $event"
        @track-click="handleTrackClick"
        @track-hover="handleTrackHover"
        @track-leave="handleTrackLeave"
      />
      
      <TrackDisplaySection
        :tracks="sortedTTMItems"
        section-id="toptracks6"
        :is-visible="spotifyStore.selectedTracksRange === 2"
        track-prefix="3"
        :selected-sort-option="selectedTTMSortOption"
        @sort-change="selectedTTMSortOption = $event"
        @track-click="handleTrackClick"
        @track-hover="handleTrackHover"
        @track-leave="handleTrackLeave"
      />
      
      <TrackDisplaySection
        :tracks="sortedTTLItems"
        section-id="toptracksall"
        :is-visible="spotifyStore.selectedTracksRange === 3"
        track-prefix="3"
        :selected-sort-option="selectedTTLSortOption"
        @sort-change="selectedTTLSortOption = $event"
        @track-click="handleTrackClick"
        @track-hover="handleTrackHover"
        @track-leave="handleTrackLeave"
      />
    </teleport>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
