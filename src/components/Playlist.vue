<script setup>
import { computed } from 'vue'
import { useMediaDisplay } from '../composables/useMediaDisplay.js'
import { artistUtils } from '../utils/artistUtils.js'
import TrackCover from './TrackCover.vue'
import SortTracks from './SortTracks.vue'
import PlaylistTrackItem from './PlaylistTrackItem.vue'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  },
  sortedTracks: {
    type: Array,
    default: () => []
  },
  selectedItem: {
    type: String,
    default: ''
  },
  selectedSortOption: {
    type: String,
    default: ''
  },
  unplayableTracks: {
    type: Boolean,
    default: false
  },
  // Optional props for Spotify playlists
  showSearch: {
    type: Boolean,
    default: false
  },
  availablePlaylists: {
    type: Array,
    default: () => []
  },
  selectedPlaylistId: {
    type: String,
    default: ''
  },
  trackPrefix: {
    type: String,
    default: '1'
  }
})

const emit = defineEmits([
  'refresh',
  'track-click',
  'track-hover',
  'track-leave',
  'sort-change',
  'playlist-select',
  'search'
])

// Utility function for formatting artist names
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNames(artists)
}

// Media display composable for playlist cover
const { image: coverImage, hasImage: hasCover } = useMediaDisplay(
  computed(() => props.playlist),
  props.playlist?.images?.[0]
)

// Event handlers
const handleRefresh = (event) => {
  emit('refresh', event)
}

const handleTrackClick = (track, event) => {
  emit('track-click', track, event)
}

const handleTrackHover = (event) => {
  emit('track-hover', event)
}

const handleTrackLeave = (event) => {
  emit('track-leave', event)
}

const handleSortChange = (value) => {
  emit('sort-change', value)
}

const handlePlaylistSelect = (playlistId, event) => {
  emit('playlist-select', playlistId, event)
}

const handleSearch = (event) => {
  emit('search', event)
}
</script>

<template>
  <div class="playlist-container">
    <!-- Search Header (only for Spotify playlists) -->
    <div v-if="showSearch" class="head">
      <input class="inp"
             type="text"
             @keyup="handleSearch"
             placeholder="Please enter a search term.."
             title="Type in a name">
    </div>

    <!-- Playlist Selection (only for Spotify playlists) -->
    <div v-if="showSearch" class="sp">
      <div class="pl justify-content-center">
        <template v-for="item of availablePlaylists" :key="item.id">
          <div :id="item.id"
               @click="handlePlaylistSelect(item.id, $event)"
               class="hr-line-dashed"
               :class="selectedPlaylistId === item.id ? 'activetab' : ''">
            {{ item.name }}
          </div>
        </template>
      </div>
    </div>

    <!-- Playlist Display -->
    <div class="playlist" :id="'p' + playlist.id">
      <!-- Playlist Header -->
      <div class="modern-playlist-header">
        <TrackCover 
          :d="playlist" 
          :cover="coverImage"
          v-if="hasCover"
        />
        <div class="playlist-info">
          <div class="playlist-title-section">
            <h2 class="playlist-title">{{ playlist.name }}</h2>
            <button class="refresh-button" @click="handleRefresh">
              <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
            </button>
          </div>
          <div class="playlist-description" v-html="playlist.description"></div>
          <a class="spotify-link"
             :href="playlist.external_urls?.spotify"
             target="_blank"
             rel="noopener">
            <span class="link-icon">🎧</span>
            Open in Spotify
          </a>
        </div>
        <div class="playlist-actions">
          <SortTracks :model-value="selectedSortOption" @update:model-value="handleSortChange"/>
        </div>
      </div>

      <!-- Tracks List -->
      <div class="tracks-container" v-if="playlist.tracks">
        <template v-for="(trackItem, index) of sortedTracks" :key="index">
          <template v-if="trackItem">
            <PlaylistTrackItem
              :track="trackItem.track"
              :track-item="trackItem"
              :selected="selectedItem === trackPrefix + trackItem.track.id"
              :unplayable-tracks="unplayableTracks"
              @click="handleTrackClick"
              @hover="handleTrackHover"
              @leave="handleTrackLeave"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlist-container {
  width: 100%;
}

.head {
  margin-bottom: 16px;
}

.inp {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.inp:focus {
  outline: none;
  border-color: var(--active-tab);
  box-shadow: 0 0 0 3px rgba(240, 55, 165, 0.1);
}

.sp {
  margin-bottom: 24px;
}

.pl {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hr-line-dashed {
  padding: 8px 16px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.hr-line-dashed:hover {
  background: rgba(240, 55, 165, 0.1);
  border-color: var(--active-tab);
  transform: translateY(-2px);
}

.hr-line-dashed.activetab {
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}

.playlist {
  width: 100%;
}

.modern-playlist-header {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 24px;
}

.playlist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.playlist-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0;
  line-height: 1.2;
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-button:hover {
  background: rgba(240, 55, 165, 0.1);
  transform: rotate(180deg);
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

.playlist-description {
  font-size: 14px;
  color: var(--search-color);
  opacity: 0.8;
  line-height: 1.4;
}

.playlist-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 200px;
}

.spotify-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
}

.spotify-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
}

.link-icon {
  font-size: 16px;
}

.tracks-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: black;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modern-playlist-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .playlist-title {
    font-size: 20px;
  }

  .playlist-actions {
    min-width: auto;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .spotify-link {
    width: 100%;
    justify-content: center;
  }

  .pl {
    flex-direction: column;
  }

  .hr-line-dashed {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .modern-playlist-header {
    padding: 16px;
  }

  .playlist-title {
    font-size: 18px;
  }

  .inp {
    padding: 10px 12px;
    font-size: 13px;
  }
}

/* Dark mode support */
:root.dark .modern-playlist-header {
  background: rgba(42, 46, 47, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .refresh-button {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:root.dark .refresh-button:hover {
  background: rgba(240, 55, 165, 0.2);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}

:root.dark .inp {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark .inp:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--active-tab);
}

:root.dark .hr-line-dashed {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark .hr-line-dashed:hover {
  background: rgba(240, 55, 165, 0.2);
  border-color: var(--active-tab);
}
</style>
