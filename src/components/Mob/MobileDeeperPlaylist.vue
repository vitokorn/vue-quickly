<script setup>
import { useSpotifyStore } from "../../stores/spotify-store"
import { useAudioStore } from "../../stores/audio-store"
import { useQueueStore } from "../../stores/queue-store"
import { useDeeperStore } from "../../stores/deeper-store"
import { ref, computed, onMounted, nextTick } from "vue"
import { useVisibilityManager } from "../../composables/useVisibilityManager"
import { useMobileMediaDisplay } from "../../composables/useMobileMediaDisplay.js"
import MobileTrackItem from './MobileTrackItem.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const selectedDeeperPlaylistSortOption = ref("")
const componentRef = ref(null)

// Get mobile media display for playlist
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => props.d))

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedDeeperPlaylistItems = computed(() => {
  const items = props.d.tracks?.items || []
  if (!selectedDeeperPlaylistSortOption.value) return items

  return [...items].sort((a, b) => {
    const trackA = a.track
    const trackB = b.track

    switch (selectedDeeperPlaylistSortOption.value) {
      case 'track':
        return trackA.name.localeCompare(trackB.name)
      case 'album':
        return trackA.album.name.localeCompare(trackB.album.name)
      case 'artist':
        return trackA.artists[0].name.localeCompare(trackB.artists[0].name)
      case 'popularity':
        return trackB.popularity - trackA.popularity
      case 'release_date':
        return new Date(trackB.album.release_date) - new Date(trackA.album.release_date)
      case 'duration':
        return trackA.duration_ms - trackB.duration_ms
      default:
        return 0
    }
  })
})

// Helper function to get section name from num
function getSectionName(num) {
  switch (num) {
    case 1: return 'yourPlaylists'
    case 2: return 'topArtists'
    case 3: return 'topTracks'
    case 4: return 'savedAlbums'
    case 5: return 'savedTracks'
    case 6: return 'followedArtists'
    case 7: return 'newReleases'
    case 8: return 'spotifyPlaylists'
    case 10: return 'search'
    case 22: return 'topArtists6'
    case 23: return 'topArtistsAll'
    case 32: return 'topTracks6'
    case 33: return 'topTracksAll'
    default: return 'search'
  }
}

function setActive(id) {
  selected.value = id
}

const handleBackClick = () => {
  // Hide this component and show the parent
  const playlistKey = `deeperplaylist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(playlistKey)
  
  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const handleTrackClick = async (track, event) => {
  setActive(track.id)
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
}

const handleSortChange = (option) => {
  selectedDeeperPlaylistSortOption.value = option
}

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()
  
  // Register this component with the visibility manager
  const playlistKey = `deeperplaylist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(playlistKey, componentRef)

  // Initially hide the component
  if (componentRef.value) {
    componentRef.value.style.display = 'none'
  }
  
  console.log('MobileDeeperPlaylist registered with key:', playlistKey)
})
</script>

<template>
  <div class="mobile-deeper-playlist" ref="componentRef">
    <!-- Mobile Header with Back Button -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="header-title">Playlist</h2>
      <div class="header-spacer"></div>
    </div>

    <!-- Playlist Info Section -->
    <div class="playlist-info-section">
      <div class="playlist-cover">
        <img 
          v-if="d.images && d.images[0]" 
          :src="d.images[0].url" 
          :alt="d.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else class="playlist-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
      </div>
      
      <div class="playlist-details">
        <h1 class="playlist-title">{{ d.name }}</h1>
        
        <div class="playlist-meta">
          <span v-if="d.owner" class="playlist-owner">By {{ d.owner.display_name }}</span>
          <span v-if="d.tracks && d.tracks.items" class="track-count">{{ d.tracks.items.length }} tracks</span>
          <span v-if="d.public !== undefined" class="playlist-visibility">
            {{ d.public ? 'Public' : 'Private' }}
          </span>
        </div>

        <div v-if="d.description" class="playlist-description" v-html="d.description"></div>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="sort-section">
      <div class="sort-options">
        <button 
          v-for="option in ['track', 'album', 'artist', 'popularity', 'release_date', 'duration']"
          :key="option"
          :class="['sort-button', { 'active': selectedDeeperPlaylistSortOption === option }]"
          @click="handleSortChange(option)"
        >
          {{ option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ') }}
        </button>
      </div>
    </div>

    <!-- Tracks Section -->
    <div class="tracks-section">
      <h3 class="section-title">Tracks</h3>
      <div class="tracks-list">
        <MobileTrackItem
          v-for="item in sortedDeeperPlaylistItems"
          :key="item.track.id"
          :track="item.track"
          :section-name="getSectionName(num)"
          :parent-id="d.id"
          view-mode="list"
          @click="handleTrackClick"
        />
      </div>
    </div>

    <!-- Mobile Deeper Tracks Components -->
    <MobileDeeperTracks
      v-for="track in deeperStore.getSectionData('playlistTracks')"
      :key="track.id"
      :d="track"
      :num="8"
    />
  </div>
</template>

<style scoped>
.mobile-deeper-playlist {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  z-index: 1000;
  overflow-y: auto;
  display: none;
}

/* Mobile Header */
.mobile-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  color: #ffffff;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.back-button svg {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 40px;
}

/* Playlist Info Section */
.playlist-info-section {
  padding: 24px 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.playlist-cover {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.playlist-placeholder svg {
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.5);
}

.playlist-details {
  flex: 1;
  min-width: 0;
}

.playlist-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.playlist-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.playlist-owner,
.track-count,
.playlist-visibility {
  font-size: 12px;
  color: #a0a0a0;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 500;
}

.playlist-description {
  font-size: 14px;
  color: #a0a0a0;
  line-height: 1.4;
  margin-top: 8px;
}

/* Sort Section */
.sort-section {
  padding: 0 20px 16px 20px;
}

.sort-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.sort-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #a0a0a0;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.sort-button:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.sort-button.active {
  background: #667eea;
  border-color: #667eea;
  color: #ffffff;
}

/* Tracks Section */
.tracks-section {
  padding: 0 20px 24px 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .playlist-info-section {
    padding: 20px 16px;
    gap: 16px;
  }

  .playlist-cover {
    width: 100px;
    height: 100px;
  }

  .playlist-title {
    font-size: 20px;
  }

  .sort-section {
    padding: 0 16px 12px 16px;
  }

  .tracks-section {
    padding: 0 16px 20px 16px;
  }

  .mobile-header {
    padding: 12px 16px;
  }

  .sort-options {
    gap: 6px;
  }

  .sort-button {
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>
