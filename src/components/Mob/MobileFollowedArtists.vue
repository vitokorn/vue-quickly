<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import { useSelection } from '../../composables/useSelection.js'
import MobileArtistDisplaySection from "./MobileArtistDisplaySection.vue";
import {useSorting} from "../../composables/useSorting.js";

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Composables
const { createArtistSorter } = useSorting()
const { selectedItem, setSelectedItem } = useSelection()

// Local state for sorting
const selectedFASortOption = ref("")

// Local state
const loading = ref(false)
const viewMode = ref('grid') // 'list' or 'grid'
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

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
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
    <!-- Debug Info -->
    <div class="debug-info">
      <p>Local followedArtists: {{ followedArtists.length }}</p>
      <p>Store getFollowedArtists: {{ (spotifyStore.getFollowedArtists || []).length }}</p>
      <p>Sorted items: {{ sortedFAItems.length }}</p>
      <p>Loading: {{ loading }}</p>
    </div>

    <MobileArtistDisplaySection
        title="Followed Artists"
        :artists="sortedFAItems"
        :view-mode="viewMode"
        @artist-click="handleArtistClick"
    />
  </div>
</template>

<style scoped>
.mobile-followed-artists {
  padding: 20px;
  background: var(--theme-mobile-bg);
  min-height: 100vh;
}


/* Debug Info */
.debug-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--search-color);
}

.debug-info p {
  margin: 4px 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .mobile-followed-artists {
    padding: 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .header-actions {
    gap: 6px;
  }

  .refresh-btn,
  .view-toggle-btn {
    width: 32px;
    height: 32px;
    padding: 6px;
  }

  .refresh-btn svg,
  .view-toggle-btn svg {
    width: 14px;
    height: 14px;
  }

  .loading-state {
    padding: 40px 16px;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    margin-bottom: 12px;
  }

  .loading-state p {
    font-size: 14px;
  }

  .empty-state {
    padding: 40px 16px;
  }

  .empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .empty-state h3 {
    font-size: 16px;
  }

  .empty-state p {
    font-size: 13px;
  }
}

@media (max-width: 360px) {
  .mobile-followed-artists {
    padding: 12px;
  }

  .refresh-btn svg,
  .view-toggle-btn svg {
    width: 12px;
    height: 12px;
  }

  .loading-state {
    padding: 30px 12px;
  }

  .loading-spinner {
    width: 28px;
    height: 28px;
    margin-bottom: 10px;
  }

  .loading-state p {
    font-size: 13px;
  }

  .empty-state {
    padding: 30px 12px;
  }

  .empty-icon {
    font-size: 36px;
    margin-bottom: 10px;
  }

  .empty-state h3 {
    font-size: 15px;
  }

  .empty-state p {
    font-size: 12px;
  }
}
</style>
