<script setup>
import { useSpotifyStore } from "../../stores/spotify-store"
import { useAudioStore } from "../../stores/audio-store"
import { useQueueStore } from "../../stores/queue-store"
import { useDeeperStore } from "../../stores/deeper-store"
import { onMounted, ref, computed, nextTick, watch } from "vue"
import { useVisibilityManager } from "../../composables/useVisibilityManager"
import { useMobileMediaDisplay } from "../../composables/useMobileMediaDisplay.js"
import MobileTrackItem from './MobileTrackItem.vue'

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const cover = ref(null)
const componentRef = ref(null)

// Get mobile media display for track
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
    case 7: return 'albumTracks'
    case 8: return 'playlistTracks'
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

function resolveCover() {
  console.log(props.d)
  if (props.d.album && props.d.album.images) {
    cover.value = props.d.album.images[0]
  } else if (props.d.images) {
    cover.value = props.d.images[0]
  } else if (props.d.track && props.d.track.album && props.d.track.album.images && props.d.track.album.images[0]) {
    cover.value = props.d.track.album.images[0]
  }
  console.log(cover.value)
}

const handleBackClick = () => {
  // Hide this component and show the parent
  const trackKey = `track_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(trackKey)
  
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
  await deeperStore.getArtistDetails(artist, getSectionName(props.num), props.d.parentKey || props.d.id)
}

const handleAudioPreview = (event) => {
  event.stopPropagation()
  if (hasPreview.value && previewUrl.value) {
    audioStore.mobileToggleTrack(trackId.value, previewUrl.value)
  }
}

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
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
  resolveCover()

  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const trackKey = `track_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  console.log('Registering component with ref:', componentRef.value)
  console.log('Ref element:', componentRef.value?.tagName, componentRef.value?.className)
  console.log('Registering with key:', trackKey)
  visibilityManager.registerComponent(trackKey, componentRef)
  
  // Initially hide the component
  if (componentRef.value) {
    componentRef.value.style.display = 'none'
  }
  
  console.log('MobileDeeperTracks registered with key:', trackKey)
})
</script>

<template>
  <div class="mobile-deeper-track" ref="componentRef">
    <!-- Mobile Header with Back Button -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="header-title">Track</h2>
      <div class="header-spacer"></div>
    </div>

    <!-- Track Info Section -->
    <div class="track-info-section">
      <div class="track-cover"
           :class="displayClass"
           :style="backgroundStyle"
           @click="handleAudioPreview">
        <img 
          v-if="cover && !hasImage" 
          :src="cover.url" 
          :alt="d.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else-if="!hasImage" class="track-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
        <div v-if="hasPreview && audioStore.mobileIsTrackPlaying(trackId)" class="playing-indicator">
          <span class="playing-icon">▶️</span>
        </div>
      </div>
      
      <div class="track-details">
        <h1 class="track-title">{{ d.name }}</h1>
        
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

        <div class="track-meta">
          <span v-if="d.album" class="album-name">{{ d.album.name }}</span>
          <span v-if="d.duration_ms" class="duration">{{ formatDuration(d.duration_ms) }}</span>
          <span v-if="d.popularity" class="popularity">Popularity: {{ d.popularity }}</span>
        </div>

        <div v-if="d.album && d.album.release_date" class="release-info">
          <span class="release-date">Released: {{ formatReleaseDate(d.album.release_date) }}</span>
        </div>
      </div>
    </div>

    <!-- Track Actions -->
    <div class="track-actions">
      <button class="play-btn" @click="audioStore.playTrack(d)">
        <span class="btn-icon">▶️</span>
        Play Track
      </button>

      <button class="queue-btn" @click="queueStore.addToQueue(d)">
        <span class="btn-icon">➕</span>
        Add to Queue
      </button>

      <a v-if="d.external_urls?.spotify" class="spotify-link" :href="d.external_urls.spotify" target="_blank" rel="noopener">
        <span class="link-icon">🎧</span>
        Open in Spotify
      </a>
    </div>

    <!-- Related Tracks Section -->
    <div v-if="d.album && d.album.tracks" class="related-tracks-section">
      <h3 class="section-title">From Album</h3>
      <div class="tracks-list">
        <MobileTrackItem
          v-for="track in d.album.tracks.items"
          :key="track.id"
          :track="track"
          :section-name="getSectionName(num)"
          :parent-id="d.id"
          @click="handleTrackClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-deeper-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1a1a1a;
  z-index: 2000;
  overflow-y: auto;
  display: none;
}

.mobile-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.8);
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
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
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
}

.header-spacer {
  width: 40px;
}

.track-info-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.track-cover {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-cover:hover {
  transform: scale(1.02);
}

/* Display classes for mobile */
.mobile-playable {
  cursor: pointer;
}

.mobile-playable:hover {
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
}

.mobile-unplayable {
  cursor: default;
}

.mobile-half-opacity {
  opacity: 0.6;
}

.mobile-no-image {
  background: rgba(255, 255, 255, 0.1);
}

.track-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-placeholder {
  width: 60px;
  height: 60px;
  color: #666;
}

.playing-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.5s ease-in-out infinite;
}

.playing-icon {
  font-size: 16px;
  color: #ffffff;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.track-details {
  width: 100%;
  max-width: 400px;
}

.track-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.artists-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.artists-label {
  font-size: 14px;
  color: #a0a0a0;
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
  transition: color 0.2s ease;
  padding: 0;
}

.artist-link:hover {
  color: #ffffff;
}

.separator {
  color: #a0a0a0;
  font-size: 14px;
  margin: 0 4px;
}

.track-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}

.album-name,
.duration,
.popularity {
  font-size: 12px;
  color: #a0a0a0;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.release-info {
  margin-bottom: 16px;
}

.release-date {
  font-size: 12px;
  color: #a0a0a0;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.track-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
}

.play-btn, .queue-btn, .spotify-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
  width: 100%;
  justify-content: center;
}

.play-btn {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.play-btn:hover {
  background: rgba(102, 126, 234, 0.3);
}

.queue-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.queue-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.spotify-link {
  background: rgba(30, 215, 96, 0.2);
  color: #1ed760;
  border: 1px solid rgba(30, 215, 96, 0.3);
}

.spotify-link:hover {
  background: rgba(30, 215, 96, 0.3);
}

.btn-icon, .link-icon {
  font-size: 16px;
}

.related-tracks-section {
  margin-top: 24px;
  padding: 0 20px;
}

.section-title {
  font-size: 18px;
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
  .track-cover {
    width: 100px;
    height: 100px;
  }
  
  .track-title {
    font-size: 20px;
  }
  
  .track-info-section {
    padding: 16px;
  }
  
  .related-tracks-section {
    padding: 0 16px;
  }
}
</style>
