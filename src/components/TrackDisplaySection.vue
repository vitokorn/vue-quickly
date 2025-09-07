<script setup>
import {computed} from 'vue'
import {useAudioStore} from '../stores/audio-store'
import {useSelection} from '../composables/useSelection.js'
import TrackItem from './TrackItem.vue'
import Loader from "./Loader.vue";
import {useMusicStore} from "../stores/music-store.js";

// Props
const props = defineProps({
  tracks: {
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
  trackPrefix: {
    type: String,
    default: '3'
  },
})

// Emits
const emit = defineEmits(['track-click', 'track-hover', 'track-leave'])

// Stores
const audioStore = useAudioStore()
const musicStore = useMusicStore()

// Composables
const {selectedItem} = useSelection()

// Computed
const displayClass = computed(() => {
  return props.isVisible ? '' : 'd-none'
})

// Event handlers


const handleTrackClick = (track, event) => {
  emit('track-click', track, event)
}

const handleTrackHover = (event) => {
  emit('track-hover', event)
}

const handleTrackLeave = (event) => {
  emit('track-leave', event)
}
</script>

<template>
  <Loader v-if="musicStore.isLoading"/>
  <div
      :id="sectionId"
      class="display-flex flex-wrap"
      style="color: black;width: auto;"
      :class="displayClass"
  >
    <div class="display-flex flex-wrap py-2 gap-8">
      <template v-for="(item, index) of tracks" :key="index">
        <TrackItem
            :track="item"
            :selected="selectedItem === trackPrefix + item.id"
            :unplayable-tracks="audioStore.unplayableTracks"
            :track-prefix="trackPrefix"
            @click="handleTrackClick"
            @hover="handleTrackHover"
            @leave="handleTrackLeave"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
