<script setup>
import { computed, ref } from 'vue'
import { useSpotifyStore } from '../stores/spotify-store'
import { useAudioStore } from '../stores/audio-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import TimeRangeSelector from './TimeRangeSelector.vue'
import ArtistDisplaySection from './ArtistDisplaySection.vue'
import Loader from './Loader.vue'

// Props
const props = defineProps({
  selectedTopMenu: {
    type: Number,
    required: true
  },

})

// Emits
const emit = defineEmits(['artist-click', 'artist-hover', 'artist-leave'])

// Stores
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const deeperStore = useDeeperStore()

// Composables
const { createArtistSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting
const selectedTASortOption = ref("")
const selectedTA6SortOption = ref("")
const selectedTALLSortOption = ref("")

// Computed sorted data
const sortedTAItems = createArtistSorter(
  computed(() => spotifyStore.getTopArtistsShort || []),
  selectedTASortOption
)

const sortedTA6Items = createArtistSorter(
  computed(() => spotifyStore.getTopArtistsMedium || []),
  selectedTA6SortOption
)

const sortedTALLItems = createArtistSorter(
  computed(() => spotifyStore.getTopArtistsLong || []),
  selectedTALLSortOption
)

// Event handlers
const handleArtistClick = async (artist, event) => {
  setSelectedItem(artist.id)
  const sectionName = 'topArtists'
  await deeperStore.getArtistDetails(artist, sectionName)
  emit('artist-click', artist, event)
}

const handleArtistHover = (event) => {
  audioStore.handleAudioHover(event)
  emit('artist-hover', event)
}

const handleArtistLeave = (event) => {
  audioStore.handleAudioLeave(event)
  emit('artist-leave', event)
}

const handleRangeChange = async (rangeId, event) => {
  spotifyStore.setSelectedArtistsRange(rangeId)
  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term'
  await spotifyStore.fetchTopArtists(timeRange)
}

const handleRefresh = async (rangeId, event) => {
  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term'
  await spotifyStore.fetchTopArtists(timeRange)
}
</script>

<template>
  <div>
    <Loader v-if="spotifyStore.isLoading" />
      <TimeRangeSelector
        v-show="selectedTopMenu === 2"
        :selected-range="spotifyStore.selectedArtistsRange"
        :section-type="'artists'"
        :ranges="[
          { id: 1, label: 'Last month', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' },
          { id: 2, label: 'Last 6 month', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' },
          { id: 3, label: 'All time', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' }
        ]"
        @range-change="handleRangeChange"
        @refresh="handleRefresh"
      />

      <!-- Artist Display Sections -->
      <ArtistDisplaySection
        :artists="sortedTAItems"
        section-id="topartist"
        :is-visible="spotifyStore.selectedArtistsRange === 1"
        artist-prefix="2"
        :selected-sort-option="selectedTASortOption"
        @sort-change="selectedTASortOption = $event"
        @artist-click="handleArtistClick"
        @artist-hover="handleArtistHover"
        @artist-leave="handleArtistLeave"
      />

      <ArtistDisplaySection
        :artists="sortedTA6Items"
        section-id="topartist6"
        :is-visible="spotifyStore.selectedArtistsRange === 2"
        artist-prefix="2"
        :selected-sort-option="selectedTA6SortOption"
        @sort-change="selectedTA6SortOption = $event"
        @artist-click="handleArtistClick"
        @artist-hover="handleArtistHover"
        @artist-leave="handleArtistLeave"
      />

      <ArtistDisplaySection
        :artists="sortedTALLItems"
        section-id="topartista"
        :is-visible="spotifyStore.selectedArtistsRange === 3"
        artist-prefix="2"
        :selected-sort-option="selectedTALLSortOption"
        @sort-change="selectedTALLSortOption = $event"
        @artist-click="handleArtistClick"
        @artist-hover="handleArtistHover"
        @artist-leave="handleArtistLeave"
      />
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
