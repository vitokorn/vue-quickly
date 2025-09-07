<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useMusicStore } from '../../stores/music-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useQueueStore } from '../../stores/queue-store'
import { useAudioStore } from '../../stores/audio-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useVisibilityManager } from '../../composables/useVisibilityManager'
import { useMobileMediaDisplay } from '../../composables/useMobileMediaDisplay.js'
import { getSectionName } from '../../utils/sectionUtils';
import MobileTrackItem from './MobileTrackItem.vue';

const props = defineProps(['d', 'num'])

// Stores
const musicStore = useMusicStore()

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
    console.log('topTracksItem', topTracksItem)
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
const preferencesStore = usePreferencesStore()
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
  console.log(props.d.parentKey)
  // If there's a parent key, show the parent component
  if (props.d.parentKey) {
    visibilityManager.showComponent(props.d.parentKey)
  }
}

const handleTrackClick = async (track, event) => {
  if (deeperStore.getIsGloballyLoading) return
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
}

const handleCoverClick = async (track, event) => {
  console.log('Cover clicked for:', track.name)
  const previewUrl = track.preview_url || track.previewUrl
  if (previewUrl) {
    console.log('Playing audio preview for:', track.name)
    await audioStore.mobileToggleTrack(track.id, previewUrl)
  } else {
    console.log('No preview URL available for:', track.name)
  }
}

const handleInfoClick = async (track, event) => {
  console.log('Info clicked for:', track.name)
  if (deeperStore.getIsGloballyLoading) return
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
}

const handleAlbumClick = async (album, event) => {
  if (deeperStore.getIsGloballyLoading) return
  const sectionName = getSectionName(props.num)
  await deeperStore.getAlbumDetails(album, sectionName, props.d.id)
}

const handleRelatedArtistClick = async (artist, event) => {
  if (deeperStore.getIsGloballyLoading) return
  const sectionName = getSectionName(props.num)
  await deeperStore.getArtistDetails(artist, sectionName, props.d.id)

  // Show the MobileDeeperArtist component using visibility manager
  const relatedArtistKey = `trackartist_${artist.id}__p:${props.d.id}__`
  visibilityManager.showComponent(relatedArtistKey)

  console.log('Showing MobileDeeperArtist for related artist:', artist.name, 'with key:', relatedArtistKey)
}

const handleGenreClick = async (genre) => {
  try {
    console.log('Getting the sound of:', genre)
    // Call the deeper store to get genre-based recommendations
    await deeperStore.getGenreRecommendations(genre, getSectionName(props.num))
  } catch (error) {
    console.error('Failed to get genre recommendations:', error)
  }
}

async function followArtist(artist) {
  try {
    console.log('Following/unfollowing artist:', artist.name)
    // Call the deeper store to handle the follow/unfollow action
    await deeperStore.followArtist(artist.id, !artist.followed)
    // Update the local state
    artist.followed = !artist.followed
  } catch (error) {
    console.error('Failed to follow/unfollow artist:', error)
  }
}

const handleRecommendClick = () => {
  deeperStore.getSeedArtistRecommendations(artistData.value, getSectionName(props.num), props.d.id)
}

const handleArtistCoverClick = (event) => {
  event.stopPropagation()
  // Artists don't have preview URLs, so we don't play audio
  // This could be used for other artist-specific actions in the future
  console.log('Artist cover clicked for:', artistData.value.name)
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

// Fetch artist details including top tracks, albums, singles, appears on, and related artists
const fetchArtistDetails = async () => {
  try {
    // Use the deeper store to get artist details
    await deeperStore.getArtistDetails(props.d, getSectionName(props.num), props.d.id)

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
  <div class="mobile-deeper-item" ref="componentRef">
    <!-- Mobile Header with Back Button -->
    <div class="mobile-header">
      <button class="back-button" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24">>
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clip-rule="evenodd" />
        </svg>
      </button>
      <h2 class="mobile-deeper-header">Artist</h2>
      <div class="header-actions">
        <button class="view-toggle-btn" @click="toggleViewMode" :title="preferencesStore.viewMode === 'list' ? 'Grid view' : 'List view'">
          <svg v-if="preferencesStore.viewMode === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Artist Info Section -->
    <div class="artist-info-section">
      <div>
        <img
          v-if="hasImage"
          class="artist-cover"
          :class="displayClass"
          :style="backgroundStyle"
          @click="handleArtistCoverClick"
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
        <button class="action-button" @click="handleRecommendClick">
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
            <input type="checkbox" v-model="d.followed" @click="followArtist(d)">
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
      <div :class="['releases-container', preferencesStore.viewMode]">
        <MobileTrackItem
          v-for="track in topTracksData"
          :key="track.id"
          :track="track"
          :num="num"
          :view-mode="preferencesStore.viewMode"
          @click="handleTrackClick"
          @coverClick="handleCoverClick"
          @infoClick="handleInfoClick"
        />
      </div>
    </div>

    <!-- Albums Section -->
    <div v-if="albumsData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Albums</h3>
      </div>
      <div :class="['releases-container', preferencesStore.viewMode]">
        <div
          v-for="album in albumsData"
          :key="album.id"
          class="song-item"
          @click="handleAlbumClick(album, $event)"
        >
          <div class="item-cover">
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
          <div class="item-info">
            <div class="item-name">{{ album.name }}</div>
            <div class="item-artist">{{ album.album_type || 'Album' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Singles Section -->
    <div v-if="singlesData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Singles</h3>
      </div>
      <div :class="['releases-container', preferencesStore.viewMode]">
        <div
          v-for="single in singlesData"
          :key="single.id"
          class="song-item"
          @click="handleAlbumClick(single, $event)"
        >
          <div class="item-cover">
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
          <div class="item-info">
            <div class="item-name">{{ single.name }}</div>
            <div class="item-artist">{{ single.album_type || 'Single' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appears On Section -->
    <div v-if="appearsOnData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Appears On</h3>
      </div>
      <div :class="['releases-container', preferencesStore.viewMode]">
        <div
          v-for="appearsOn in appearsOnData"
          :key="appearsOn.id"
          class="song-item"
          @click="handleAlbumClick(appearsOn, $event)"
        >
          <div class="item-cover">
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
          <div class="item-info">
            <div class="item-name">{{ appearsOn.name }}</div>
            <div class="item-artist">{{ appearsOn.album_type || 'Compilation' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Artists Section -->
    <div v-if="relatedArtistsData.length > 0" class="section">
      <div class="section-header">
        <h3 class="section-title">Related Artists</h3>
      </div>
      <div :class="['releases-container', preferencesStore.viewMode]">
        <div
          v-for="artist in relatedArtistsData"
          :key="artist.id"
          class="song-item"
          @click="handleRelatedArtistClick(artist, $event)"
        >
          <div class="item-cover">
            <img
              v-if="artist.images && artist.images.length > 0"
              :src="artist.images[0].url"
              :alt="artist.name"
              @error="$event.target.style.display = 'none'"
            />
            <div v-else class="artist-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
              </svg>
            </div>
          </div>
          <div class="item-info">
            <div class="item-name">{{ artist.name }}</div>
            <div class="item-artist" v-if="artist.followers">
              {{ formatFollowers(artist.followers.total) }} followers
            </div>
            <div class="item-artist" v-if="artist.genres && artist.genres.length > 0">
              {{ formatGenres(artist.genres) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
  </div>
</template>

<style scoped>
</style>
