<script setup>
import {computed, ref} from 'vue'
import {useSpotifyStore} from '../stores/spotify-store'
import {useAudioStore} from '../stores/audio-store'
import {useQueueStore} from '../stores/queue-store'
import {useDeeperStore} from '../stores/deeper-store'
import {useSorting} from '../composables/useSorting.js'
import {useSelection} from '../composables/useSelection.js'
import TimeRangeSelector from './TimeRangeSelector.vue'
import TrackDisplaySection from './TrackDisplaySection.vue'
import RefreshButton from "./RefreshButton.vue";
import SortTracks from "./SortTracks.vue";

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
const {createTrackSorter} = useSorting()
const {selectedItem, setSelectedItem} = useSelection()

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
  if ((rangeId === 1 && !spotifyStore.getTopTracksShort.length) || (rangeId === 2 && !spotifyStore.getTopTracksMedium.length) || (rangeId === 3 && !spotifyStore.getTopTracksLong.length)) {
    await spotifyStore.fetchTopTracks(timeRange)
  }
}

const handleRefresh = async (rangeId, event) => {
  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term'
  await spotifyStore.fetchTopTracks(timeRange)
}
</script>

<template>
  <div>
    <div class="p-2 flex-between-center">
      <div class="grid-2-1">
        <h4>Top Tracks</h4>
        <div class="ps-2">
          <RefreshButton :on-click="() => handleRefresh(spotifyStore.selectedTracksRange)"/>
        </div>
      </div>
      <SortTracks
          v-if="spotifyStore.selectedTracksRange === 1"
          :model-value="selectedTTSortOption"
          @update:model-value="selectedTTSortOption = $event"
      />
      <SortTracks
          v-if="spotifyStore.selectedTracksRange === 2"
          :model-value="selectedTTMSortOption"
          @update:model-value="selectedTTMSortOption = $event"
      />
      <SortTracks
          v-if="spotifyStore.selectedTracksRange === 3"
          :model-value="selectedTTLSortOption"
          @update:model-value="selectedTTLSortOption = $event"
      />
    </div>
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
        v-if="spotifyStore.selectedTracksRange === 1"
        :tracks="sortedTTItems"
        section-id="toptracks"
        :is-visible="spotifyStore.selectedTracksRange === 1"
        track-prefix="3"
        :selected-sort-option="selectedTTSortOption"
        @track-click="handleTrackClick"
        @track-hover="handleTrackHover"
        @track-leave="handleTrackLeave"
    />

    <TrackDisplaySection
        v-if="spotifyStore.selectedTracksRange === 2"
        :tracks="sortedTTMItems"
        section-id="toptracks6"
        :is-visible="spotifyStore.selectedTracksRange === 2"
        track-prefix="3"
        :selected-sort-option="selectedTTMSortOption"
        @track-click="handleTrackClick"
        @track-hover="handleTrackHover"
        @track-leave="handleTrackLeave"
    />

    <TrackDisplaySection
        v-if="spotifyStore.selectedTracksRange === 3"
        :tracks="sortedTTLItems"
        section-id="toptracksall"
        :is-visible="spotifyStore.selectedTracksRange === 3"
        track-prefix="3"
        :selected-sort-option="selectedTTLSortOption"
        @track-click="handleTrackClick"
        @track-hover="handleTrackHover"
        @track-leave="handleTrackLeave"
    />
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
