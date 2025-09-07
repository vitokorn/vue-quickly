<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'
import MobileArtistDisplaySection from "./MobileArtistDisplaySection.vue";
import {useSorting} from "../../composables/useSorting.js";

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()
const preferencesStore = usePreferencesStore()

// Composables
const { createArtistSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting
const selectedFASortOption = ref("")

// Local state
const loading = ref(false)
const followedArtists = ref([])

// Methods
const loadFollowedArtists = async () => {
  if (spotifyStore.getFollowedArtists && spotifyStore.getFollowedArtists.length > 0) {
    console.log('Using cached followed artists data')
    followedArtists.value = spotifyStore.getFollowedArtists
    return
  }

  loading.value = true
  try {
    // Load followed artists from Spotify API
    await spotifyStore.fetchFollowedArtists()
    followedArtists.value = spotifyStore.getFollowedArtists || []
  } catch (error) {
    console.error('Failed to load followed artists:', error)
  } finally {
    loading.value = false
  }
}

const handleArtistClick = async (artist, event) => {
  console.log('Artist clicked:', artist.name, artist)
  setSelectedItem(artist.id)

  try {
    // Get artist details from deeper store
    console.log('Getting artist details for followedArtists section...')
    await deeperStore.getArtistDetails(artist, 'followedArtists')
    console.log('Artist details loaded successfully')

    // RecTrackM will automatically render the deeper artist component
    // No need to manually show/hide components
  } catch (error) {
    console.error('Failed to load artist details:', error)
  }
}

const handleArtistCoverClick = async (artist, event) => {
  console.log('Artist cover clicked for:', artist.name)
  // The cover click is handled in MobileArtistDisplaySection for audio preview
  // This handler can be used for additional cover-specific actions if needed
}

const handleArtistInfoClick = async (artist, event) => {
  console.log('Artist info clicked for:', artist.name)
  // Info click should show artist details (same as regular click)
  await handleArtistClick(artist, event)
}

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

const handleRefresh = async () => {
  // Clear existing data and fetch fresh
  spotifyStore.followedArtists = []
  await loadFollowedArtists()
}

// Helper functions
const formatFollowers = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

const formatGenres = (genres) => {
  if (!genres || genres.length === 0) return ''
  // Take first 2 genres and capitalize first letter
  return genres.slice(0, 2).map(genre =>
    genre.charAt(0).toUpperCase() + genre.slice(1)
  ).join(', ')
}
const sortedFAItems = createArtistSorter(
    computed(() => {
      const artists = spotifyStore.getFollowedArtists || []
      console.log('Creating sorted items from:', artists.length, 'artists')
      return artists
    }),
    selectedFASortOption
)

onMounted(async () => {
  console.log('MobileFollowedArtists mounted, loading data...')
  await loadFollowedArtists()
})
</script>

<template>
  <div class="mobile-followed-artists">
    <MobileArtistDisplaySection
        title="Followed Artists"
        :artists="sortedFAItems"
        :view-mode="preferencesStore.viewMode"
        @artist-click="handleArtistClick"
        @artist-cover-click="handleArtistCoverClick"
        @artist-info-click="handleArtistInfoClick"
    />
  </div>
</template>

<style scoped>

</style>
