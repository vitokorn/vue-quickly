<template>
  <div class="discover-page">
    <!-- Discover Header -->
    <div class="discover-header">
      <h2 class="discover-title">Discover</h2>
      <p class="discover-subtitle">Find new music and artists</p>
    </div>

    <!-- Spotify Playlists Section -->
    <div class="home-sections">

      <!-- Using PlaylistSelector component -->
      <div class="home-section">
        <PlaylistSelector
            :playlists="spotifyStore.getSpotifyPlaylists"
            :selected-playlist="selectedPlaylist"
            title="Your Spotify Playlists"
            placeholder="Search your playlists..."
            :items-per-page="5"
            @playlist-select="handlePlaylistSelect"
            @playlist-arrow-click="handlePlaylistArrowClick"
            @search="handlePlaylistSearch"
            @load-more="handleLoadMorePlaylists"
        />
      </div>

      <!-- New Releases Section -->
      <div class="home-section">

      <ReleaseSelector
          :releases="newReleases"
          :selected-release="selectedRelease"
          title="Latest Releases"
          placeholder="Search releases..."
          :items-per-page="10"
          @release-select="handleReleaseSelect"
          @search="handleReleaseSearch"
          @load-more="handleLoadMoreReleases"
          @refresh="handleRefreshReleases"
      />
      </div>
    </div>


    <!-- Mobile Deeper Components -->
    <MobileDeeperAlbum
        v-for="album in deeperStore.getSectionData('savedAlbums')"
        :key="album.id"
        :d="album"
        :num="4"
    />

    <MobileDeeperAlbum
        v-for="album in deeperStore.getSectionData('newReleases')"
        :key="album.id"
        :d="album"
        :num="7"
    />

    <MobileDeeperPlaylist
        v-for="playlist in spotifyPlaylistsData"
        :key="playlist.id"
        :d="playlist"
        :num="8"
    />

    <MobileDeeperTracks
        v-for="track in deeperStore.getSectionData('playlistTracks')"
        :key="track.id"
        :d="track"
        :num="8"
    />

    <MobileDeeperTracks
        v-for="track in deeperStore.getSectionData('albumTracks')"
        :key="track.id"
        :d="track"
        :num="7"
    />

    <MobileDeeperArtist
        v-for="artist in deeperStore.getSectionData('topArtists')"
        :key="artist.id"
        :d="artist"
        :num="2"
    />

  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useSpotifyStore} from '../../stores/spotify-store'
import {useDeeperStore} from '../../stores/deeper-store'
import PlaylistSelector from './PlaylistSelector.vue'
import ReleaseSelector from './ReleaseSelector.vue'

import MobileDeeperAlbum from './MobileDeeperAlbum.vue'
import MobileDeeperPlaylist from './MobileDeeperPlaylist.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'
import MobileDeeperArtist from './MobileDeeperArtist.vue'


const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)
const error = ref(null)
const selectedPlaylist = ref(null)
const selectedRelease = ref(null)

// Computed properties
const newReleases = computed(() => spotifyStore.getNewReleases || [])


// Debug computed properties
const spotifyPlaylistsData = computed(() => {
  const data = deeperStore.getSectionData('spotifyPlaylists')
  console.log('spotifyPlaylists data:', data)
  return data
})

// Methods
const loadDiscoverContent = async () => {
  loading.value = true
  error.value = null

  try {
    // Load Spotify playlists
    await spotifyStore.fetchSpotifyPlaylists(0)

    // Load new releases
    await spotifyStore.fetchNewReleases(0)
  } catch (err) {
    error.value = 'Failed to load discover content'
    console.error('Error loading discover content:', err)
  } finally {
    loading.value = false
  }
}

const handlePlaylistSelect = async (playlistId, event) => {
  selectedPlaylist.value = playlistId
  const playlist = spotifyStore.getSpotifyPlaylists.find(p => p.id === playlistId)
  console.log('Playlist selected:', playlist)

  if (playlist) {
    // Add playlist to deeper store for spotifyPlaylists section
    const playlistData = {
      ...playlist,
      type: 'playlist',
      parentKey: 'discoverPage'
    }

    deeperStore.addToSection('spotifyPlaylists', playlistData)
    deeperStore.setCurrentSection('spotifyPlaylists')

    // Show the deeper playlist component
    console.log('Showing deeper playlist for:', playlist.name)
  }
}

const handlePlaylistArrowClick = async (playlist) => {
  console.log('Playlist arrow clicked:', playlist)

  if (playlist) {
    try {
      // Fetch playlist details including tracks
      const playlistDetails = await spotifyStore.fetchPlaylist(playlist.id)
      console.log('Fetched playlist details:', playlistDetails)

      // Add playlist to deeper store for spotifyPlaylists section
      const playlistData = {
        ...playlistDetails,
        type: 'playlist',
        parentKey: 'discoverPage'
      }

      deeperStore.addToSection('spotifyPlaylists', playlistData)
      deeperStore.setCurrentSection('spotifyPlaylists')

      // Show the deeper playlist component using visibility manager
      const {useVisibilityManager} = await import('../../composables/useVisibilityManager')
      const visibilityManager = useVisibilityManager()
      const playlistKey = `deeperplaylist_${playlistDetails.id}__p:discoverPage__`
      visibilityManager.showComponent(playlistKey)

      console.log('Showing deeper playlist for:', playlist.name, 'with key:', playlistKey)
    } catch (error) {
      console.error('Error fetching playlist details:', error)
    }
  }
}

const handlePlaylistSearch = (event) => {
  console.log('Searching for playlists:', event.target.value)
  // The PlaylistSelector component handles the filtering internally
}

const handleLoadMorePlaylists = async () => {
  try {
    // For pagination, we need to ensure we have enough playlists loaded
    // If we don't have enough playlists for the current page, load more
    const currentCount = spotifyStore.getSpotifyPlaylists.length
    const itemsPerPage = 5
    const targetCount = currentCount + itemsPerPage
    console.log(itemsPerPage)
    console.log(currentCount)
    // Load more playlists if needed
    if (currentCount < targetCount) {
      await spotifyStore.fetchSpotifyPlaylists(currentCount)
    }
  } catch (error) {
    console.error('Failed to load more playlists:', error)
  }
}

const handleReleaseSelect = async (releaseId, event) => {
  selectedRelease.value = releaseId
  const release = newReleases.value.find(r => r.id === releaseId)
  console.log('Release selected:', release)

  if (release) {
    // Add album to deeper store for newReleases section
    const albumData = {
      ...release,
      type: 'album',
      parentKey: 'discoverPage'
    }

    deeperStore.addToSection('newReleases', albumData)
    deeperStore.setCurrentSection('newReleases')

    // Show the deeper album component
    console.log('Showing deeper album for:', release.name)
  }
}

const handleReleaseSearch = (event) => {
  console.log('Searching for releases:', event.target.value)
  // The ReleaseSelector component handles the filtering internally
}

const handleLoadMoreReleases = async () => {
  try {
    // Load more releases using the current count as offset
    const currentCount = newReleases.value.length
    await spotifyStore.fetchNewReleases(currentCount)
  } catch (error) {
    console.error('Failed to load more releases:', error)
  }
}

const handleRefreshReleases = () => {
  spotifyStore.fetchNewReleases(0)
}

const formatArtistNames = (artists) => {
  if (!artists || !Array.isArray(artists)) return 'Unknown Artist'
  return artists.map(artist => artist.name).join(', ')
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

// Load content on mount
onMounted(() => {
  loadDiscoverContent()
})
</script>

<style scoped>
.discover-page {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.discover-header {
  text-align: center;
  margin-bottom: 30px;
}

.discover-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.discover-subtitle {
  font-size: 16px;
  color: #a0a0a0;
  margin: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  width: 32px;
  height: 32px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

/* PlaylistSelector and ReleaseSelector components are now used for their respective sections */

/* Loading State */
.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #a0a0a0;
  margin: 0;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 40px 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state p {
  color: #ef4444;
  margin: 0 0 16px 0;
}

.retry-button {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: rgba(102, 126, 234, 0.2);
}

@media (max-width: 480px) {
  .discover-title {
    font-size: 24px;
  }

  .discover-subtitle {
    font-size: 14px;
  }

  .section-title {
    font-size: 18px;
  }
}


</style>
