<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useQueueStore } from '../../stores/queue-store'
import { useAudioStore } from '../../stores/audio-store'
import { useVisibilityManager } from '../../composables/useVisibilityManager'
import { useMobileMediaDisplay } from '../../composables/useMobileMediaDisplay.js'
import MobileTrackItem from './MobileTrackItem.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'
import {spotifyApi} from "../../services/spotifyApi.js";

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()
const queueStore = useQueueStore()
const audioStore = useAudioStore()
const visibilityManager = useVisibilityManager()
const componentRef = ref(null)
const loading = ref(true)

// Get mobile media display for artist
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => props.d))

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

const handleBackClick = () => {
  // Hide this component and show the parent
  const artistKey = `deeperartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(artistKey)

  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const handleTrackClick = async (track, event) => {
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
}

const handleAlbumClick = async (album, event) => {
  const sectionName = getSectionName(props.num)
  await deeperStore.getAlbumDetails(album, sectionName, props.d.id)
}

const handleRelatedArtistClick = async (artist, event) => {
  const sectionName = getSectionName(props.num)

  // Add artist to deeper store for the current section
  const artistData = {
    ...artist,
    type: 'artist',
    parentKey: `deeperartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  }

  deeperStore.addToSection(sectionName, artistData)
  deeperStore.setCurrentSection(sectionName)

  // Show the MobileDeeperArtist component using visibility manager
  const { useVisibilityManager } = await import('../../composables/useVisibilityManager')
  const visibilityManager = useVisibilityManager()
  const relatedArtistKey = `deeperartist_${artist.id}__p:deeperartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}__`
  visibilityManager.showComponent(relatedArtistKey)

  console.log('Showing MobileDeeperArtist for related artist:', artist.name, 'with key:', relatedArtistKey)
}

const handleGenreClick = (genre) => {
  spotifyStore.getTheSoundOf({ name: genre, num: props.num, sib: 'trackartist', child: false })
}

const handleRecommendClick = () => {
  deeperStore.getSeedArtistRecommendations(props.d, getSectionName(props.num), props.d.id)
}

const handleAudioPreview = (event) => {
  event.stopPropagation()
  if (hasPreview.value && previewUrl.value) {
    audioStore.mobileToggleTrack(trackId.value, previewUrl.value)
  }
}

// Fetch artist details including top tracks, albums, singles, appears on, and related artists
const fetchArtistDetails = async () => {
  try {
    // Fetch top tracks
    const topTracksResponse = await spotifyApi.getArtistTopTracks(props.d.id)
    const topTracks = topTracksResponse.data.tracks || []

    // Fetch albums
    const albumsResponse = await spotifyApi.getArtistAlbums(props.d.id, 'album', 20)
    const albums = albumsResponse.data.items || []

    // Fetch singles
    const singlesResponse = await spotifyApi.getArtistAlbums(props.d.id, 'single', 20)
    const singles = singlesResponse.data.items || []

    // Fetch appears on
    const appearsOnResponse = await spotifyApi.getArtistAlbums(props.d.id, 'appears_on', 20)
    const appearsOn = appearsOnResponse.data.items || []

    // Fetch related artists
    const relatedArtistsResponse = await spotifyApi.getRelatedArtists(props.d.id)
    const relatedArtists = relatedArtistsResponse.data.artists || []

    // Update the artist data with all the fetched content
    const updatedArtistData = {
      ...props.d,
      top_tracks: topTracks,
      albums: albums,
      singles: singles,
      appears_on: appearsOn,
      related_artists: relatedArtists
    }

    // Update the deeper store with the complete artist data
    deeperStore.addToSection(getSectionName(props.num), updatedArtistData)

    console.log('Artist details fetched:', {
      topTracks: topTracks.length,
      albums: albums.length,
      singles: singles.length,
      appearsOn: appearsOn.length,
      relatedArtists: relatedArtists.length
    })

  } catch (error) {
    console.error('Error fetching artist details:', error)
  } finally {
    loading.value = false
  }
}

const formatFollowers = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

const formatGenres = (genres) => {
  if (!genres || genres.length === 0) return 'No genres'
  return genres.slice(0, 3).join(', ')
}

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const artistKey = `deeperartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(artistKey, componentRef)

  // Initially hide this component
  if (componentRef.value) {
    componentRef.value.style.display = 'none'
  }

  console.log('MobileDeeperArtist registered with key:', artistKey)

  // Fetch all artist details
  await fetchArtistDetails()
})
</script>

<template>
  <div class="mobile-deeper-artist" ref="componentRef">
    <!-- Mobile Header with Back Button -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="header-title">Artist</h2>
      <div class="header-spacer"></div>
    </div>

    <!-- Artist Info Section -->
    <div class="artist-info-section">
      <div class="artist-cover"
           :class="displayClass"
           :style="backgroundStyle"
           @click="handleAudioPreview">
        <img
          v-if="d.images && d.images[0] && !hasImage"
          :src="d.images[0].url"
          :alt="d.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else-if="!hasImage" class="artist-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
          </svg>
        </div>
        <div v-if="hasPreview && audioStore.mobileIsTrackPlaying(trackId)" class="playing-indicator">
          <span class="playing-icon">▶️</span>
        </div>
      </div>

      <div class="artist-details">
        <h1 class="artist-title">{{ d.name }}</h1>

        <div class="artist-stats">
          <span class="followers-count">{{ formatFollowers(d.followers?.total || 0) }} followers</span>
        </div>

        <!-- Genres -->
        <div class="genres-section" v-if="d.genres && d.genres.length > 0">
          <div class="genres-list">
            <span v-for="(genre, index) in d.genres.slice(0, 3)" :key="index" class="genre-tag" @click="handleGenreClick(genre)">
              {{ genre }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="artist-actions">
          <button class="recommend-btn" @click="handleRecommendClick">
            <span class="btn-icon">🎵</span>
            Get Recommendations
          </button>

          <a class="spotify-link" :href="d.external_urls?.spotify" target="_blank" rel="noopener">
            <span class="link-icon">🎧</span>
            Open in Spotify
          </a>

          <div class="follow-section">
            <span class="follow-label">Follow</span>
            <label class="follow-checkbox">
              <input type="checkbox" v-model="d.followed" @click="spotifyStore.followArtist(d)">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading artist details...</p>
    </div>

    <!-- Content Sections -->
    <div v-else>
      <!-- Top Tracks Section -->
    <div v-if="d.top_tracks && d.top_tracks.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Top Tracks</h3>
      </div>
      <div class="tracks-list">
        <MobileTrackItem
          v-for="track in d.top_tracks"
          :key="track.id"
          :track="track"
          @click="handleTrackClick(track, $event)"
        />
      </div>
    </div>

    <!-- Albums Section -->
    <div v-if="d.albums && d.albums.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Albums</h3>
      </div>
      <div class="albums-grid">
        <div
          v-for="album in d.albums"
          :key="album.id"
          class="album-item"
          @click="handleAlbumClick(album, $event)"
        >
          <div class="album-cover">
            <img
              v-if="album.images && album.images[0]"
              :src="album.images[0].url"
              :alt="album.name"
              @error="$event.target.style.display = 'none'"
            />
            <div v-else class="album-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
              </svg>
            </div>
          </div>
          <div class="album-info">
            <div class="album-name">{{ album.name }}</div>
            <div class="album-type">{{ album.album_type || 'Album' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Singles Section -->
    <div v-if="d.singles && d.singles.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Singles</h3>
      </div>
      <div class="albums-grid">
        <div
          v-for="single in d.singles"
          :key="single.id"
          class="album-item"
          @click="handleAlbumClick(single, $event)"
        >
          <div class="album-cover">
            <img
              v-if="single.images && single.images[0]"
              :src="single.images[0].url"
              :alt="single.name"
              @error="$event.target.style.display = 'none'"
            />
            <div v-else class="album-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
              </svg>
            </div>
          </div>
          <div class="album-info">
            <div class="album-name">{{ single.name }}</div>
            <div class="album-type">{{ single.album_type || 'Single' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appears On Section -->
    <div v-if="d.appears_on && d.appears_on.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Appears On</h3>
      </div>
      <div class="albums-grid">
        <div
          v-for="appearsOn in d.appears_on"
          :key="appearsOn.id"
          class="album-item"
          @click="handleAlbumClick(appearsOn, $event)"
        >
          <div class="album-cover">
            <img
              v-if="appearsOn.images && appearsOn.images[0]"
              :src="appearsOn.images[0].url"
              :alt="appearsOn.name"
              @error="$event.target.style.display = 'none'"
            />
            <div v-else class="album-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
              </svg>
            </div>
          </div>
          <div class="album-info">
            <div class="album-name">{{ appearsOn.name }}</div>
            <div class="album-type">{{ appearsOn.album_type || 'Compilation' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Artists Section -->
    <div v-if="d.related_artists && d.related_artists.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Related Artists</h3>
      </div>
      <div class="artists-grid">
        <div
          v-for="artist in d.related_artists"
          :key="artist.id"
          class="artist-item"
          @click="handleRelatedArtistClick(artist, $event)"
        >
          <div class="artist-cover">
            <img
              v-if="artist.images && artist.images[0]"
              :src="artist.images[0].url"
              :alt="artist.name"
              @error="$event.target.style.display = 'none'"
            />
            <div v-else class="artist-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
              </svg>
            </div>
          </div>
          <div class="artist-info">
            <div class="artist-name">{{ artist.name }}</div>
            <div class="artist-followers">{{ formatFollowers(artist.followers?.total || 0) }} followers</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Deeper Tracks Components -->
    <MobileDeeperTracks
      v-for="track in deeperStore.getSectionData('topTracks')"
      :key="track.id"
      :d="track"
      :num="3"
    />
    </div>
  </div>
</template>

<style scoped>
.mobile-deeper-artist {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1a1a1a;
  z-index: 1000;
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

.artist-info-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.artist-cover {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.artist-cover:hover {
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

.artist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artist-placeholder {
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

.artist-details {
  width: 100%;
  max-width: 400px;
}

.artist-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

.artist-stats {
  margin-bottom: 16px;
}

.followers-count {
  font-size: 14px;
  color: #a0a0a0;
}

.genres-section {
  margin-bottom: 20px;
}

.genres-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.genre-tag {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.genre-tag:hover {
  background: rgba(102, 126, 234, 0.3);
}

.artist-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend-btn, .spotify-link {
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

.recommend-btn {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.recommend-btn:hover {
  background: rgba(102, 126, 234, 0.3);
}

.spotify-link {
  background: rgba(30, 215, 96, 0.2);
  color: #1ed760;
  border: 1px solid rgba(30, 215, 96, 0.3);
}

.spotify-link:hover {
  background: rgba(30, 215, 96, 0.3);
}

.follow-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
}

.follow-label {
  font-size: 14px;
  color: #a0a0a0;
}

.follow-checkbox {
  position: relative;
  cursor: pointer;
}

.follow-checkbox input {
  opacity: 0;
  position: absolute;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #667eea;
  border-radius: 4px;
  background: transparent;
  display: block;
  position: relative;
  transition: all 0.2s ease;
}

.follow-checkbox input:checked + .checkmark {
  background: #667eea;
}

.follow-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.section {
  margin-top: 24px;
  padding: 0 20px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.albums-grid, .artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.album-item, .artist-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.album-item:hover, .artist-item:hover {
  transform: translateY(-2px);
}

.album-cover, .artist-cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-cover img, .artist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-info, .artist-info {
  text-align: center;
}

.album-name, .artist-name {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.album-type, .artist-followers {
  font-size: 10px;
  color: #a0a0a0;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .albums-grid, .artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }

  .artist-cover {
    width: 100px;
    height: 100px;
  }

  .artist-title {
    font-size: 20px;
  }
}

:root.metro .mobile-deeper-artist {
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

:root.metro .artist-info-section {
  background: #1f1f1f;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 24px;
  margin: 16px;
}

:root.metro .artist-cover {
  background: #333333;
  border: none;
  border-radius: 0;
  width: 140px;
  height: 140px;
}

:root.metro .artist-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 28px;
}

:root.metro .artist-followers {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .artist-genres {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

:root.metro .artist-popularity {
  background: #2d2d2d;
  color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
  padding: 6px 12px;
}

:root.metro .section {
  margin-top: 24px;
  padding: 0 20px;
}

:root.metro .section-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 18px;
  text-transform: none;
  letter-spacing: normal;
}

:root.metro .album-item,
:root.metro .artist-item {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 12px;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

:root.metro .album-item:hover,
:root.metro .artist-item:hover {
  background: #2d2d2d;
  border-left-color: #0078d4;
  transform: none;
}

:root.metro .album-cover,
:root.metro .artist-cover {
  background: #333333;
  border: none;
  border-radius: 0;
}

:root.metro .album-name,
:root.metro .artist-name {
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
}

:root.metro .album-type,
:root.metro .artist-followers {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Segoe UI', sans-serif;
  font-size: 10px;
  font-weight: 400;
}
</style>
