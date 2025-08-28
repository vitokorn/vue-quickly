<template>
  <div class="library-page">
    <!-- Library Sections -->
    <div class="library-sections">
      <!-- Personal Playlists Section -->
      <div class="discover-section">
        <PlaylistSelector
          :playlists="spotifyStore.getPlaylists"
          :selected-playlist="selectedPersonalPlaylist"
          title="Your Playlists"
          placeholder="Search personal playlists..."
          :items-per-page="5"
          @playlist-select="handlePersonalPlaylistSelect"
          @playlist-arrow-click="handlePersonalPlaylistArrowClick"
          @load-more="handleLoadMorePersonalPlaylists"
        />
      </div>

      <!-- Saved Tracks Section -->
      <div class="discover-section">
        <MobileSavedTracks />
      </div>

      <!-- Saved Albums Section -->
      <div class="discover-section">
        <MobileSavedAlbums />
      </div>

      <!-- Followed Artists Section -->
      <div class="discover-section">
        <MobileFollowedArtists />
      </div>
    </div>

    <!-- Loading States -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your library...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button class="retry-button" @click="loadLibraryContent">Try Again</button>
    </div>

    <!-- Mobile Deeper Components -->
    <MobileDeeperAlbum
      v-for="album in deeperStore.getSectionData('savedAlbums')"
      :key="album.id"
      :d="album"
      :num="4"
    />

    <MobileDeeperPlaylist
      v-for="playlist in deeperStore.getSectionData('yourPlaylists')"
      :key="playlist.id"
      :d="playlist"
      :num="1"
    />

    <MobileDeeperTracks
      v-for="track in deeperStore.getSectionData('savedTracks')"
      :key="track.id"
      :d="track"
      :num="5"
    />

    <MobileDeeperArtist
      v-for="artist in deeperStore.getSectionData('followedArtists')"
      :key="artist.id"
      :d="artist"
      :num="6"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import PlaylistSelector from "../Mob/PlaylistSelector.vue"
import MobileSavedTracks from "./MobileSavedTracks.vue"
import MobileSavedAlbums from "./MobileSavedAlbums.vue"
import MobileFollowedArtists from "./MobileFollowedArtists.vue"
import MobileDeeperAlbum from './MobileDeeperAlbum.vue'
import MobileDeeperPlaylist from './MobileDeeperPlaylist.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'
import MobileDeeperArtist from './MobileDeeperArtist.vue'
import { useSelection } from "../../composables/useSelection.js"

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)
const error = ref(null)

const {
  selectedPersonalPlaylist,
  setSelectedPersonalPlaylist
} = useSelection()

// Methods
const loadLibraryContent = async () => {
  loading.value = true
  error.value = null

  try {
    // Load user playlists
    await spotifyStore.fetchPlaylists(0)
  } catch (err) {
    error.value = 'Failed to load library content'
    console.error('Error loading library content:', err)
  } finally {
    loading.value = false
  }
}

const handleLoadMorePersonalPlaylists = async () => {
  try {
    // Load the next batch of 50 playlists
    const currentCount = spotifyStore.getPlaylists.length
    await spotifyStore.fetchPlaylists(currentCount)
  } catch (error) {
    console.error('Failed to load more personal playlists:', error)
  }
}

const handlePersonalPlaylistSelect = async (playlistId, event) => {
  setSelectedPersonalPlaylist(playlistId)
  const playlist = spotifyStore.getPlaylists.find(p => p.id === playlistId)
  console.log('Personal playlist selected:', playlist)

  if (playlist) {
    // Add playlist to deeper store for yourPlaylists section
    const playlistData = {
      ...playlist,
      type: 'playlist',
      parentKey: 'libraryPage'
    }

    deeperStore.addToSection('yourPlaylists', playlistData)
    deeperStore.setCurrentSection('yourPlaylists')

    // Show the deeper playlist component
    console.log('Showing deeper playlist for:', playlist.name)
  }
}

const handlePersonalPlaylistArrowClick = async (playlist) => {
  console.log('Personal playlist arrow clicked:', playlist)

  if (playlist) {
    try {
      // Fetch playlist details including tracks
      const playlistDetails = await spotifyStore.fetchPlaylist(playlist.id)
      console.log('Fetched playlist details:', playlistDetails)

      // Add playlist to deeper store for yourPlaylists section
      const playlistData = {
        ...playlistDetails,
        type: 'playlist',
        parentKey: 'libraryPage'
      }

      deeperStore.addToSection('yourPlaylists', playlistData)
      deeperStore.setCurrentSection('yourPlaylists')

      // Show the deeper playlist component using visibility manager
      const { useVisibilityManager } = await import('../../composables/useVisibilityManager')
      const visibilityManager = useVisibilityManager()
      const playlistKey = `deeperplaylist_${playlistDetails.id}__p:libraryPage__`
      visibilityManager.showComponent(playlistKey)

      console.log('Showing deeper playlist for:', playlist.name, 'with key:', playlistKey)
    } catch (error) {
      console.error('Error fetching playlist details:', error)
    }
  }
}

// Load content on mount
onMounted(() => {
  loadLibraryContent()
})
</script>

<style scoped>
</style>
