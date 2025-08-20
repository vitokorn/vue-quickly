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
    <!-- Modern Mobile Header -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="header-title">Track Details</h2>
      <div class="header-spacer"></div>
    </div>

    <!-- Modern Track Info Section -->
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
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010 1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
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
          <span v-if="d.album" class="album-name">
            <span class="meta-icon">💿</span>
            {{ d.album.name }}
          </span>
          <span v-if="d.duration_ms" class="duration">
            <span class="meta-icon">⏱️</span>
            {{ formatDuration(d.duration_ms) }}
          </span>
          <span v-if="d.popularity" class="popularity">
            <span class="meta-icon">📊</span>
            {{ d.popularity }}% popular
          </span>
        </div>

        <div v-if="d.album && d.album.release_date" class="release-info">
          <span class="release-date">
            <span class="meta-icon">📅</span>
            Released {{ formatReleaseDate(d.album.release_date) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modern Track Actions -->
    <div class="track-actions">
      <button class="play-btn" @click="audioStore.playTrack(d)">
        <span class="btn-icon">▶️</span>
        Play Track
      </button>

      <button class="queue-btn" @click="queueStore.addToQueue(d)">
        <span class="btn-icon">➕</span>
        Add to Queue
      </button>
    </div>

    <!-- Related Tracks Section -->
    <div class="related-tracks-section">
      <div class="section-header">
        <span class="section-icon">🎵</span>
        <h3 class="section-title">Related Tracks</h3>
      </div>
      <div class="related-tracks-list">
        <MobileTrackItem
          v-for="track in deeperStore.getSectionData('relatedTracks')"
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

/* Modern Track Info Section */
.track-info-section {
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

.track-cover {
  width: 140px;
  height: 140px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-cover:hover {
  transform: scale(1.05);
}

.track-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.track-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
}

.track-placeholder svg {
  width: 48px;
  height: 48px;
  color: rgba(0, 0, 0, 0.3);
}

.playing-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playing-icon {
  font-size: 20px;
}

.track-details {
  flex: 1;
  min-width: 0;
}

.track-title {
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

.track-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.album-name,
.duration,
.popularity {
  font-size: 14px;
  color: var(--search-color);
  background: rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.meta-icon {
  font-size: 16px;
  opacity: 0.8;
}

.release-info {
  margin-top: 8px;
}

.release-date {
  font-size: 12px;
  color: var(--search-color);
  background: rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

/* Modern Track Actions */
.track-actions {
  padding: 0 16px 24px 16px;
  display: flex;
  gap: 12px;
}

.play-btn,
.queue-btn {
  flex: 1;
  background: var(--active-tab);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(240, 55, 165, 0.3);
}

.play-btn:hover,
.queue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(240, 55, 165, 0.4);
}

.queue-btn {
  background: rgba(0, 0, 0, 0.1);
  color: var(--title-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.queue-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 18px;
}

/* Related Tracks Section */
.related-tracks-section {
  padding: 0 16px 32px 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 8px;
}

.section-icon {
  font-size: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--title-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.related-tracks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .track-info-section {
    padding: 24px 20px;
    gap: 20px;
    margin: 12px;
  }

  .track-cover {
    width: 120px;
    height: 120px;
  }

  .track-title {
    font-size: 24px;
  }

  .track-actions {
    padding: 0 12px 20px 12px;
    flex-direction: column;
  }

  .mobile-header {
    padding: 16px 20px;
  }
}

/* Dark theme support */
:root.dark .mobile-deeper-track {
  background: linear-gradient(135deg, #0b1222 0%, #1a2332 100%);
}

:root.dark .mobile-header {
  background: rgba(42, 46, 47, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .track-info-section {
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

:root.dark .album-name,
:root.dark .duration,
:root.dark .popularity,
:root.dark .release-date {
  background: rgba(255, 255, 255, 0.1);
  color: var(--search-color);
}

:root.dark .queue-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark .queue-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Dark-blue theme support */
:root.dark-blue .mobile-deeper-track {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

:root.dark-blue .mobile-header {
  background: rgba(30, 41, 59, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .track-info-section {
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

:root.dark-blue .album-name,
:root.dark-blue .duration,
:root.dark-blue .popularity,
:root.dark-blue .release-date {
  background: rgba(255, 255, 255, 0.1);
  color: var(--search-color);
}

:root.dark-blue .queue-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark-blue .queue-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* DQ theme support */
:root.dq .mobile-deeper-track {
  background: linear-gradient(135deg, #1C1A2D 0%, var(--main-color) 100%);
}

:root.dq .mobile-header {
  background: rgba(28, 26, 45, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .track-info-section {
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

:root.dq .album-name,
:root.dq .duration,
:root.dq .popularity,
:root.dq .release-date {
  background: rgba(255, 255, 255, 0.1);
  color: var(--search-color);
}

:root.dq .queue-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dq .queue-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.aero .mobile-deeper-track {
  background: linear-gradient(135deg, #2b579a 0%, #1e3a8a 50%, #1e40af 100%);
}

:root.aero .mobile-header {
  background: rgba(43, 87, 154, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

:root.aero .track-info-section {
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

:root.aero .album-name,
:root.aero .duration,
:root.aero .popularity,
:root.aero .release-date {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:root.aero .queue-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:root.aero .queue-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

:root.cupertino .mobile-deeper-track {
  background: linear-gradient(135deg, #e8f0ff 0%, #f8f9fb 40%, #ffe9f3 100%);
}

:root.cupertino .mobile-header {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 30px rgba(31, 38, 135, 0.12);
}

:root.cupertino .track-info-section {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 20px 40px rgba(31, 38, 135, 0.14);
}

:root.cupertino .back-button {
  background: rgba(255, 255, 255, 0.45);
  color: var(--title-color);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

:root.cupertino .back-button:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .album-name,
:root.cupertino .duration,
:root.cupertino .popularity,
:root.cupertino .release-date {
  background: rgba(255, 255, 255, 0.55);
  color: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

:root.cupertino .queue-btn {
  background: rgba(255, 255, 255, 0.45);
  color: var(--title-color);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

:root.cupertino .queue-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.metro .mobile-deeper-track {
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

:root.metro .track-info-section {
  background: #1f1f1f;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 24px;
  margin: 16px;
}

:root.metro .track-cover {
  background: #333333;
  border: none;
  border-radius: 0;
  width: 140px;
  height: 140px;
}

:root.metro .track-title {
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

:root.metro .album-name,
:root.metro .duration,
:root.metro .popularity,
:root.metro .release-date {
  background: #2d2d2d;
  color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
  padding: 6px 12px;
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

:root.metro .queue-btn {
  background: transparent;
  color: white;
  border: none;
  border-radius: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 16px 24px;
}

:root.metro .queue-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.metro .play-btn {
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 16px 24px;
}

:root.metro .play-btn:hover {
  background: #106ebe;
}

:root.metro .section-header {
  padding: 16px 20px 8px 20px;
}

:root.metro .section-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 18px;
  text-transform: none;
  letter-spacing: normal;
}

:root.metro .section-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
}

/* Material theme support */
:root.material .mobile-deeper-track {
  background: #fafafa;
}

:root.material .mobile-header {
  background: #2196f3;
  border-bottom: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:root.material .track-info-section {
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

:root.material .album-name,
:root.material .duration,
:root.material .popularity,
:root.material .release-date {
  background: #e3f2fd;
  color: #2196f3;
  border: 1px solid #bbdefb;
}

:root.material .queue-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
}

:root.material .queue-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
