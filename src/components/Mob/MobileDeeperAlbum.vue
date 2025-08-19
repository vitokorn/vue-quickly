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
const tracks = ref([])
const componentRef = ref(null)

// Get mobile media display for album
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => props.d))

// Get visibility manager
const visibilityManager = useVisibilityManager()

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

function resolveTracks() {
  if (props.d.tracks && props.d.tracks.items) {
    tracks.value = props.d.tracks.items
  } else if (props.d.tracks) {
    tracks.value = props.d.tracks
  } else if (props.d.items) {
    tracks.value = props.d.items
  }
}

const handleBackClick = () => {
  // Hide this component and show the parent
  const albumKey = `deeperalbum_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(albumKey)
  
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

const handleArtistClick = async (artist, event) => {
  await deeperStore.getArtistDetails(artist, getSectionName(props.num), props.d.id)
}

const formatReleaseDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  resolveTracks()

  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const albumKey = `deeperalbum_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(albumKey, componentRef)

  // Show this component after registration
  console.log('Showing MobileDeeperAlbum component after registration:', albumKey)
  visibilityManager.showComponent(albumKey)
})
</script>

<template>
  <div class="mobile-deeper-album" ref="componentRef">
    <!-- Mobile Header with Back Button -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="header-title">Album</h2>
      <div class="header-spacer"></div>
    </div>

    <!-- Album Info Section -->
    <div class="album-info-section">
      <div class="album-cover">
        <img 
          v-if="d.images && d.images[0]" 
          :src="d.images[0].url" 
          :alt="d.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else class="album-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
      </div>
      
      <div class="album-details">
        <h1 class="album-title">{{ d.name }}</h1>
        
        <div class="artists-section">
          <span class="artists-label">By</span>
          <div class="artists-list">
            <div v-for="(art, index) in d.artists" :key="index" class="artist-item">
              <span v-if="d.artists.length > 1 && d.artists.length - 1 === index" class="separator">&</span>
              <span v-if="d.artists.length >= 2 && d.artists.length - 1 !== index && index !== 0" class="separator">,</span>
              <button class="artist-link" @click="handleArtistClick(art, $event)">
                {{ art.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="album-meta">
          <span class="album-type">{{ d.album_type || 'Album' }}</span>
          <span v-if="d.release_date" class="release-date">{{ formatReleaseDate(d.release_date) }}</span>
          <span v-if="tracks.length > 0" class="track-count">{{ tracks.length }} tracks</span>
        </div>
      </div>
    </div>

    <!-- Tracks Section -->
    <div class="tracks-section">
      <h3 class="section-title">Tracks</h3>
      <div class="tracks-list">
        <MobileTrackItem
          v-for="track in tracks"
          :key="track.id"
          :track="track"
          :section-name="getSectionName(num)"
          :parent-id="d.id"
          @click="handleTrackClick"
        />
      </div>
    </div>

    <!-- Mobile Deeper Tracks Components -->
    <MobileDeeperTracks
      v-for="track in deeperStore.getSectionData('albumTracks')"
      :key="track.id"
      :d="track"
      :num="7"
    />
  </div>
</template>

<style scoped>
.mobile-deeper-album {
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

/* Album Info Section */
.album-info-section {
  padding: 24px 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.album-cover {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
}

.album-placeholder svg {
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.5);
}

.album-details {
  flex: 1;
  min-width: 0;
}

.album-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.artists-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.artists-label {
  font-size: 14px;
  color: #a0a0a0;
  font-weight: 500;
}

.artists-list {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.artist-item {
  display: flex;
  align-items: center;
}

.artist-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0;
}

.artist-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

.separator {
  color: #a0a0a0;
  font-size: 14px;
  margin: 0 4px;
}

.album-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.album-type,
.release-date,
.track-count {
  font-size: 12px;
  color: #a0a0a0;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 500;
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
  .album-info-section {
    padding: 20px 16px;
    gap: 16px;
  }

  .album-cover {
    width: 100px;
    height: 100px;
  }

  .album-title {
    font-size: 20px;
  }

  .tracks-section {
    padding: 0 16px 20px 16px;
  }

  .mobile-header {
    padding: 12px 16px;
  }
}

</style>
