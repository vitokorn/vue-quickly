<script setup>
import {computed} from 'vue'
import {useAudioStore} from '../../stores/audio-store'
import {useSelection} from '../../composables/useSelection.js'
import MobileTrackItem from './MobileTrackItem.vue'
import Loader from "../Loader.vue";
import {useSpotifyStore} from "../../stores/spotify-store.js";

// Props
const props = defineProps({
  tracks: {
    type: Array,
    required: true
  },
  sectionId: {
    type: String,
    required: false
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  trackPrefix: {
    type: String,
    default: '3'
  },
  num: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  viewMode: {
    type: String,
    default: 'list'
  },
  sortOptions: {
    type: Array,
    default: () => ['track', 'album', 'artist', 'popularity', 'release_date', 'duration']
  },
  selectedSortOption: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['track-click', 'track-hover', 'track-leave', 'sort-change'])

// Stores
const audioStore = useAudioStore()
const spotifyStore = useSpotifyStore()

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

const handleSortChange = (option) => {
  emit('sort-change', option)
}
</script>

<template>
  <Loader v-if="spotifyStore.isLoading"/>
  <div
      :id="sectionId"
      class="mobile-track-display-section"
      :class="displayClass"
  >
    <!-- Section Header with Sort Options -->
    <div v-if="title || sortOptions.length > 0" class="section-header">
      <div v-if="title" class="section-title">
        <h3>{{ title }}</h3>
      </div>
      <div v-if="sortOptions.length > 0" class="sort-options">
        <button
          v-for="option in sortOptions"
          :key="option"
          :class="['sort-button', { 'active': selectedSortOption === option }]"
          @click="handleSortChange(option)"
        >
          {{ option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ') }}
        </button>
      </div>
    </div>

    <!-- Tracks Grid -->
    <div class="tracks-grid" :class="viewMode">
      <template v-for="(item, index) of tracks" :key="index">
        <MobileTrackItem
            :track="item"
            :selected="selectedItem === trackPrefix + item.id"
            :unplayable-tracks="audioStore.unplayableTracks"
            :num="num"
            @click="handleTrackClick"
            @hover="handleTrackHover"
            @leave="handleTrackLeave"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.mobile-track-display-section {
  padding: 20px;
  background: var(--theme-mobile-bg);
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--title-color);
}

.sort-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-button {
  background: var(--action-btn-bg);
  border: 1px solid var(--item-border);
  color: var(--title-color);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-button:hover {
  background: var(--action-btn-hover-bg);
}

.sort-button.active {
  background: var(--active-tab);
  color: white;
  border-color: var(--active-tab);
}

.tracks-grid {
  display: grid;
  gap: 16px;
  padding: 16px 0;
}

.tracks-grid.list {
  grid-template-columns: 1fr;
}

.tracks-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

@media (max-width: 768px) {
  .tracks-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sort-options {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
