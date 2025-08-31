<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useQueueStore } from '../../stores/queue-store'
import { useAudioStore } from '../../stores/audio-store'
import { useVisibilityManager } from '../../composables/useVisibilityManager'
import { useMobileMediaDisplay } from '../../composables/useMobileMediaDisplay.js'
import MobileTrackItem from './MobileTrackItem.vue'
import {spotifyApi} from "../../services/spotifyApi.js";

const props = defineProps(['d', 'num'])

// Extract artist data from trackartist structure
const artistData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    // Find the trackartist item in the data array
    const artistItem = props.d.data.find(item => item.type === 'trackartist')
    return artistItem || props.d
  }
  return props.d
})

// Extract other data from trackartist structure
const topTracksData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const topTracksItem = props.d.data.find(item => item.type === 'top_tracks')
    return topTracksItem?.tracks || []
  }
  return props.d.top_tracks || []
})

const albumsData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const albumsItem = props.d.data.find(item => item.type === 'albums')
    return albumsItem?.items || []
  }
  return props.d.albums || []
})

const singlesData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const singlesItem = props.d.data.find(item => item.type === 'single')
    return singlesItem?.items || []
  }
  return props.d.singles || []
})

const appearsOnData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const appearsOnItem = props.d.data.find(item => item.type === 'appears_on')
    return appearsOnItem?.items || []
  }
  return props.d.appears_on || []
})

const relatedArtistsData = computed(() => {
  if (props.d.data && Array.isArray(props.d.data)) {
    const relatedItem = props.d.data.find(item => item.type === 'related-artists')
    return relatedItem?.artists || []
  }
  return props.d.related_artists || []
})
const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()
const queueStore = useQueueStore()
const audioStore = useAudioStore()
const visibilityManager = useVisibilityManager()
const componentRef = ref(null)
const loading = ref(true)

// Get mobile media display for artist
const { displayClass, backgroundStyle, hasPreview, previewUrl, trackId } = useMobileMediaDisplay(computed(() => artistData.value))

// Check if artist has an image
const hasImage = computed(() => {
  return artistData.value.images && artistData.value.images.length > 0 && artistData.value.images[0] && artistData.value.images[0].url
})

const handleBackClick = () => {
  // Hide this component and show the parent
  const artistKey = `trackartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.hideComponent(artistKey)

  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const handleTrackClick = async (track, event) => {
  await deeperStore.getTrackDetails(track, props.sectionName)
  queueStore.addToQueue(track)
}

const handleAlbumClick = async (album, event) => {
  await deeperStore.getAlbumDetails(album, props.sectionName, props.d.id)
}

const handleRelatedArtistClick = async (artist, event) => {

  await deeperStore.getArtistDetails(artist, props.sectionName)

  // Show the MobileDeeperArtist component using visibility manager
  const relatedArtistKey = `trackartist_${artist.id}__p:trackartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}__`
  visibilityManager.showComponent(relatedArtistKey)

  console.log('Showing MobileDeeperArtist for related artist:', artist.name, 'with key:', relatedArtistKey)
}

const handleGenreClick = (genre) => {
  spotifyStore.getTheSoundOf({ name: genre, num: props.num, sib: 'trackartist', child: false })
}

const handleRecommendClick = () => {
  deeperStore.getSeedArtistRecommendations(artistData.value, getSectionName(props.num), props.d.id)
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
    await deeperStore.getArtistDetails(props.d, getSectionName(props.num))

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
  const artistKey = `trackartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(artistKey, componentRef)

  // Initially hide this component
  if (componentRef.value) {
    componentRef.value.style.display = 'none'
  }

  console.log('MobileDeeperArtist registered with key:', artistKey)

  // If we have trackartist data structure, we don't need to fetch details
  if (props.d.data && Array.isArray(props.d.data)) {
    console.log('Using existing trackartist data structure')
    loading.value = false
  } else {
    // Fetch all artist details
    await fetchArtistDetails()
  }
})

// Unregister component when unmounted
onUnmounted(() => {
  const artistKey = `trackartist_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.unregisterComponent(artistKey)
  console.log('MobileDeeperArtist unregistered:', artistKey)
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
      <div>
        <img
          v-if="hasImage"
          class="artist-cover"
          :class="displayClass"
          :style="backgroundStyle"
          @click="handleAudioPreview"
          :src="artistData.images[0].url"
          :alt="artistData.name"
          @error="$event.target.style.display = 'none'"
        />
        <div v-else class="artist-placeholder">
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
        <h1 class="artist-title">{{ artistData.name }}</h1>

        <div class="artist-stats">
          <span class="followers-count">{{ formatFollowers(artistData.followers?.total || 0) }} followers</span>
        </div>

        <!-- Genres -->
        <div class="genres-section" v-if="artistData.genres && artistData.genres.length > 0">
          <div class="genres-list">
            <span v-for="(genre, index) in artistData.genres.slice(0, 3)" :key="index" class="genre-tag" @click="handleGenreClick(genre)">
              {{ genre }}
            </span>
          </div>
        </div>
    </div>
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

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading artist details...</p>
    </div>

    <!-- Content Sections -->
    <div v-else>
      <!-- Top Tracks Section -->
    <div v-if="topTracksData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Top Tracks</h3>
      </div>
      <div class="tracks-list">
        <MobileTrackItem
          v-for="track in topTracksData"
          :key="track.id"
          :track="track"
          view-mode="list"
          @click="handleTrackClick(track, $event)"
        />
      </div>
    </div>

    <!-- Albums Section -->
    <div v-if="albumsData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Albums</h3>
      </div>
      <div class="albums-grid">
        <div
          v-for="album in albumsData"
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
    <div v-if="singlesData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Singles</h3>
      </div>
      <div class="albums-grid">
        <div
          v-for="single in singlesData"
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
    <div v-if="appearsOnData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Appears On</h3>
      </div>
      <div class="albums-grid">
        <div
          v-for="appearsOn in appearsOnData"
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
    <div v-if="relatedArtistsData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Related Artists</h3>
      </div>
      <div class="artists-grid">
        <div
          v-for="artist in relatedArtistsData"
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

    </div>
  </div>
</template>

<style scoped>
</style>
