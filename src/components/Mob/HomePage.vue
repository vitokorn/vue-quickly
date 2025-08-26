<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useAudioStore } from '../../stores/audio-store'
import { useQueueStore } from '../../stores/queue-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'
import MobileTopTracks from './MobileTopTracks.vue'
import MobileTopArtists from './MobileTopArtists.vue'
import MobileDeeperTracks from './MobileDeeperTracks.vue'
import MobileDeeperArtist from './MobileDeeperArtist.vue'

const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Composables
const { selectedItem, setSelectedItem } = useSelection()

// Local state
const loading = ref(false)

// Methods

const loadHomeContent = async () => {
  loading.value = true
  try {
    // Load initial data for homepage
    await Promise.all([
      spotifyStore.fetchTopTracks('short_term'),
      spotifyStore.fetchTopArtists('short_term')
    ])
  } catch (error) {
    console.error('Failed to load home content:', error)
  } finally {
    loading.value = false
  }
}

// Load content on mount
onMounted(() => {
  loadHomeContent()
})
</script>

<template>
  <div class="home-page">

    <!-- Modern Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your music...</p>
    </div>

    <!-- Modern Content Sections -->
    <div v-else class="home-sections">
      <!-- Top Tracks Section -->
      <div class="home-section">
        <MobileTopTracks />
      </div>

      <!-- Top Artists Section -->
      <div class="home-section">
        <MobileTopArtists />
      </div>
    </div>

    <!-- Mobile Deeper Tracks Component -->
    <MobileDeeperTracks
      v-for="track in deeperStore.getSectionData('topTracks')"
      :key="track.id"
      :d="track"
      :num="3"
    />

    <!-- Mobile Deeper Artist Component -->
    <MobileDeeperArtist
      v-for="artist in deeperStore.getSectionData('topArtists')"
      :key="artist.id"
      :d="artist"
      :num="2"
    />
  </div>
</template>

<style scoped>

</style>
