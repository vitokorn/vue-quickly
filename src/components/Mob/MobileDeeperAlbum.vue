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
    <!-- Modern Mobile Header -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="header-title">Album Details</h2>
      <div class="header-spacer"></div>
    </div>

    <!-- Modern Album Info Section -->
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
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010 1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010 1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
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
          <span v-if="d.release_date" class="release-date">
            <span class="meta-icon">📅</span>
            {{ formatReleaseDate(d.release_date) }}
          </span>
          <span v-if="tracks.length > 0" class="track-count">
            <span class="meta-icon">🎵</span>
            {{ tracks.length }} tracks
          </span>
        </div>
      </div>
    </div>

    <!-- Modern Tracks Section -->
    <div class="tracks-section">
      <div class="tracks-header">
        <span class="tracks-icon">🎵</span>
        <h3 class="tracks-title">Tracks</h3>
      </div>
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

/* Modern Mobile Header */
.mobile-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.back-button {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: var(--title-color);
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateX(-2px);
}

.back-button svg {
  width: 20px;
  height: 20px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--title-color);
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 44px;
}

/* Modern Album Info Section */
.album-info-section {
  padding: 32px 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  margin: 16px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.album-cover {
  width: 140px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
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
  background: rgba(0, 0, 0, 0.05);
}

.album-placeholder svg {
  width: 48px;
  height: 48px;
  color: rgba(0, 0, 0, 0.3);
}

.album-details {
  flex: 1;
  min-width: 0;
}

.album-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.artists-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.artists-label {
  font-size: 14px;
  color: var(--search-color);
  opacity: 0.8;
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
  color: var(--active-tab);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
}

.artist-link:hover {
  background: rgba(240, 55, 165, 0.1);
  transform: translateY(-1px);
}

.separator {
  color: var(--search-color);
  font-size: 14px;
  opacity: 0.6;
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
  color: var(--search-color);
  background: rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 14px;
  opacity: 0.8;
}

/* Modern Tracks Section */
.tracks-section {
  padding: 0 16px 32px 16px;
}

.tracks-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 8px;
}

.tracks-icon {
  font-size: 20px;
}

.tracks-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--title-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .album-info-section {
    padding: 24px 20px;
    gap: 20px;
    margin: 12px;
  }

  .album-cover {
    width: 120px;
    height: 120px;
  }

  .album-title {
    font-size: 24px;
  }

  .tracks-section {
    padding: 0 12px 24px 12px;
  }

  .mobile-header {
    padding: 16px 20px;
  }
}

/* Dark theme support */
:root.dark .mobile-deeper-album {
  background: linear-gradient(135deg, #0b1222 0%, #1a2332 100%);
}

:root.dark .mobile-header {
  background: rgba(42, 46, 47, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .album-info-section {
  background: rgba(42, 46, 47, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .back-button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark .back-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark .album-type,
:root.dark .release-date,
:root.dark .track-count {
  background: rgba(255, 255, 255, 0.1);
  color: var(--search-color);
}

/* Dark-blue theme support */
:root.dark-blue .mobile-deeper-album {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

:root.dark-blue .mobile-header {
  background: rgba(30, 41, 59, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .album-info-section {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .back-button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark-blue .back-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark-blue .album-type,
:root.dark-blue .release-date,
:root.dark-blue .track-count {
  background: rgba(255, 255, 255, 0.1);
  color: var(--search-color);
}

/* DQ theme support */
:root.dq .mobile-deeper-album {
  background: linear-gradient(135deg, #1C1A2D 0%, var(--main-color) 100%);
}

:root.dq .mobile-header {
  background: rgba(28, 26, 45, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .album-info-section {
  background: rgba(28, 26, 45, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .back-button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dq .back-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dq .album-type,
:root.dq .release-date,
:root.dq .track-count {
  background: rgba(255, 255, 255, 0.1);
  color: var(--search-color);
}

/* Windows Aero theme support */
:root.aero .mobile-deeper-album {
  background: linear-gradient(135deg, #2b579a 0%, #1e3a8a 50%, #1e40af 100%);
}

:root.aero .mobile-header {
  background: rgba(43, 87, 154, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

:root.aero .album-info-section {
  background: rgba(43, 87, 154, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

:root.aero .back-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:root.aero .back-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

:root.aero .album-type,
:root.aero .release-date,
:root.aero .track-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:root.metro .mobile-deeper-album {
  background: #000000;
  font-family: 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif;
}

:root.metro .mobile-header {
  background: #0078d4;
  border-bottom: none;
  box-shadow: none;
  padding: 16px 20px;
}

:root.metro .header-title {
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 18px;
  color: white;
}

:root.metro .back-button {
  background: transparent;
  color: white;
  border: none;
  border-radius: 0;
  width: 48px;
  height: 48px;
  padding: 12px;
}

:root.metro .back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .album-info-section {
  background: #1f1f1f;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 24px;
  margin: 16px;
}

:root.metro .album-cover {
  background: #333333;
  border: none;
  border-radius: 0;
  width: 140px;
  height: 140px;
}

:root.metro .album-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 28px;
}

:root.metro .artists-label {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .artist-link {
  color: #0078d4;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
  border-radius: 0;
  padding: 4px 8px;
}

:root.metro .artist-link:hover {
  background: rgba(0, 120, 212, 0.1);
  color: white;
}

:root.metro .separator {
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .album-type,
:root.metro .release-date,
:root.metro .track-count {
  background: #2d2d2d;
  color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
  padding: 6px 12px;
}

:root.metro .tracks-header {
  padding: 16px 20px 8px 20px;
}

:root.metro .tracks-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 18px;
  text-transform: none;
  letter-spacing: normal;
}

:root.metro .tracks-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
}

/* Material theme support */
:root.material .mobile-deeper-album {
  background: #fafafa;
}

:root.material .mobile-header {
  background: #2196f3;
  border-bottom: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:root.material .album-info-section {
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

:root.material .back-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

:root.material .back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

:root.material .album-type,
:root.material .release-date,
:root.material .track-count {
  background: #e3f2fd;
  color: #2196f3;
  border: 1px solid #bbdefb;
}
</style>
