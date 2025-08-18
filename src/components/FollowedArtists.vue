<script setup>
import { computed, ref } from 'vue'
import { useSpotifyStore } from '../stores/spotify-store'
import { useAudioStore } from '../stores/audio-store'
import { useDeeperStore } from '../stores/deeper-store'
import { useSorting } from '../composables/useSorting.js'
import { useSelection } from '../composables/useSelection.js'
import SortArtists from './SortArtists.vue'
import ArtistItem from './ArtistItem.vue'
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
const emit = defineEmits(['artist-click', 'artist-hover', 'artist-leave'])

// Stores
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const deeperStore = useDeeperStore()

// Composables
const { createArtistSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting
const selectedFASortOption = ref("")

// Computed sorted data
const sortedFAItems = createArtistSorter(
  computed(() => spotifyStore.getFollowedArtists || []),
  selectedFASortOption
)

// Event handlers
const handleArtistClick = async (artist, event) => {
  setSelectedItem('6' + artist.id)
  await deeperStore.getArtistDetails(artist, 'followedArtists')
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

const handleRefresh = () => {
  spotifyStore.fetchFollowedArtists()
}
</script>

<template>
  <div>
    <Loader v-if="spotifyStore.isLoading" />
    <teleport to="#option6" :disabled="!accordionActive">
      <div id="followedartist" class="display-flex flex-wrap" v-show="selectedTopMenu === 6">
        <div class="section-header">
          <button class="refresh-button" @click="handleRefresh">
            <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
          </button>
        </div>
        <SortArtists v-model="selectedFASortOption" />
        <div class="display-flex flex-wrap py-2 gap-8">
          <template v-for="(item, index) of sortedFAItems" :key="index">
            <ArtistItem
              :artist="item"
              :selected="selectedItem === '6' + item.id"
              :unplayable-tracks="audioStore.unplayableTracks"
              :artist-prefix="'6'"
              @click="handleArtistClick"
              @hover="handleArtistHover"
              @leave="handleArtistLeave"
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
