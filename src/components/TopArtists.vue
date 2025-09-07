<script setup>
import {computed, ref} from 'vue'
import {useMusicStore} from '../stores/music-store'
import {useAudioStore} from '../stores/audio-store'
import {useDeeperStore} from '../stores/deeper-store'
import {useSorting} from '../composables/useSorting.js'
import {useSelection} from '../composables/useSelection.js'
import TimeRangeSelector from './TimeRangeSelector.vue'
import ArtistDisplaySection from './ArtistDisplaySection.vue'
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
const emit = defineEmits(['artist-click', 'artist-hover', 'artist-leave'])

// Stores
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const deeperStore = useDeeperStore()

// Composables
const {createArtistSorter} = useSorting()
const {selectedItem, setSelectedItem} = useSelection()

// Local state for sorting
const selectedTASortOption = ref("")
const selectedTA6SortOption = ref("")
const selectedTALLSortOption = ref("")

// Computed sorted data
const sortedTAItems = createArtistSorter(
    computed(() => musicStore.getTopArtistsShort || []),
    selectedTASortOption
)

const sortedTA6Items = createArtistSorter(
    computed(() => musicStore.getTopArtistsMedium || []),
    selectedTA6SortOption
)

const sortedTALLItems = createArtistSorter(
    computed(() => musicStore.getTopArtistsLong || []),
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
  musicStore.setSelectedArtistsRange(rangeId)
  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term'
  if ((rangeId === 1 && !musicStore.getTopArtistsShort.length) || (rangeId === 2 && !musicStore.getTopArtistsMedium.length) || (rangeId === 3 && !musicStore.getTopArtistsLong.length)) {
    await musicStore.fetchTopArtists(timeRange)
  }
}

const handleRefresh = async (rangeId, event) => {
  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term'
  await musicStore.fetchTopArtists(timeRange)
}
</script>

<template>
  <div>
    <div class="p-2 flex-between-center">
      <div class="grid-2-1">
        <h4>Top Artists</h4>
        <div class="ps-2">
          <RefreshButton :on-click="() => handleRefresh(musicStore.selectedArtistsRange)"/>
        </div>
      </div>
      <SortArtists
          v-if="musicStore.selectedArtistsRange === 1"
          :model-value="selectedTASortOption"
          @update:model-value="selectedTASortOption = $event"
      />
      <SortArtists
          v-if="musicStore.selectedArtistsRange === 2"
          :model-value="selectedTA6SortOption"
          @update:model-value="selectedTA6SortOption = $event"
      />
      <SortArtists
          v-if="musicStore.selectedArtistsRange === 3"
          :model-value="selectedTALLSortOption"
          @update:model-value="selectedTALLSortOption = $event"
      />
    </div>
    <TimeRangeSelector
        v-show="selectedTopMenu === 2"
        :selected-range="musicStore.selectedArtistsRange"
        :section-type="'artists'"
        :ranges="[
          { id: 1, label: 'Last month', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' },
          { id: 2, label: 'Last 6 month', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' },
          { id: 3, label: 'All time', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' }
        ]"
        @range-change="handleRangeChange"
    />

    <!-- Artist Display Sections -->
    <ArtistDisplaySection
        v-if="musicStore.selectedArtistsRange === 1"
        :artists="sortedTAItems"
        section-id="topartist"
        :is-visible="musicStore.selectedArtistsRange === 1"
        artist-prefix="2"
        :selected-sort-option="selectedTASortOption"
        @artist-click="handleArtistClick"
        @artist-hover="handleArtistHover"
        @artist-leave="handleArtistLeave"
    />

    <ArtistDisplaySection
        v-if="musicStore.selectedArtistsRange === 2"
        :artists="sortedTA6Items"
        section-id="topartist6"
        :is-visible="musicStore.selectedArtistsRange === 2"
        artist-prefix="2"
        :selected-sort-option="selectedTA6SortOption"
        @artist-click="handleArtistClick"
        @artist-hover="handleArtistHover"
        @artist-leave="handleArtistLeave"
    />

    <ArtistDisplaySection
        v-if="musicStore.selectedArtistsRange === 3"
        :artists="sortedTALLItems"
        section-id="topartista"
        :is-visible="musicStore.selectedArtistsRange === 3"
        artist-prefix="2"
        :selected-sort-option="selectedTALLSortOption"
        @artist-click="handleArtistClick"
        @artist-hover="handleArtistHover"
        @artist-leave="handleArtistLeave"
    />
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
