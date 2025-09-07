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
import RefreshButton from "./RefreshButton.vue";

// Props
const props = defineProps({
  selectedTopMenu: {
    type: Number,
    required: true
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
  spotifyStore.followedArtists = []
  spotifyStore.fetchFollowedArtists()
}

</script>

<template>
  <div>
    <div class="p-2 flex-between-center">
      <div class="grid-2-1">
        <h4>Followed Artists</h4>
        <div class="ps-2">
          <RefreshButton :on-click="() => handleRefresh()"/>
        </div>
      </div>
      <SortArtists v-model="selectedFASortOption" />
    </div>
    <Loader v-if="spotifyStore.isLoading" />
      <div id="followedartist" class="display-flex flex-wrap" v-show="selectedTopMenu === 6">
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
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
