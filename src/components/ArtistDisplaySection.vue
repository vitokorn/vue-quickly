<script setup>
import { computed } from 'vue'
import { useAudioStore } from '../stores/audio-store'
import { useSelection } from '../composables/useSelection.js'
import ArtistItem from './ArtistItem.vue'
import Loader from "./Loader.vue";
import {useSpotifyStore} from "../stores/spotify-store.js";

// Props
const props = defineProps({
  artists: {
    type: Array,
    required: true
  },
  sectionId: {
    type: String,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  artistPrefix: {
    type: String,
    default: '2'
  },
  selectedSortOption: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['sort-change', 'artist-click', 'artist-hover', 'artist-leave'])

// Stores
const audioStore = useAudioStore()
const spotifyStore = useSpotifyStore()

// Composables
const { selectedItem } = useSelection()

// Computed
const displayClass = computed(() => {
  return props.isVisible ? '' : 'd-none'
})

// Event handlers
const handleArtistClick = (artist, event) => {
  emit('artist-click', artist, event)
}

const handleArtistHover = (event) => {
  emit('artist-hover', event)
}

const handleArtistLeave = (event) => {
  emit('artist-leave', event)
}
</script>

<template>
  <Loader v-if="spotifyStore.isLoading" />
  <div
    :id="sectionId"
    class="display-flex flex-wrap"
    style="width: auto;"
    :class="displayClass"
  >
    <div class="display-flex flex-wrap py-2 gap-8">
      <template v-for="(item, index) of artists" :key="index">
        <ArtistItem
          :artist="item"
          :selected="selectedItem === artistPrefix + item.id"
          :unplayable-tracks="audioStore.unplayableTracks"
          :artist-prefix="artistPrefix"
          @click="handleArtistClick"
          @hover="handleArtistHover"
          @leave="handleArtistLeave"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
