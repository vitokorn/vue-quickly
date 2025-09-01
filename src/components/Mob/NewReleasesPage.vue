<template>
  <div class="new-releases-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading new releases...</p>
    </div>

    <!-- Content -->
    <div v-else class="new-releases-content">
      <div class="releases-section">
        <ReleaseSelector
          :releases="newReleases"
          :selected-release="selectedRelease"
          title="New Releases"
          placeholder="Search releases..."
          :items-per-page="20"
          @release-select="handleReleaseSelect"
          @refresh="handleRefreshReleases"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSpotifyStore } from '../../stores/spotify-store'
import { useDeeperStore } from '../../stores/deeper-store'
import ReleaseSelector from './ReleaseSelector.vue'

const spotifyStore = useSpotifyStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)
const selectedRelease = ref(null)
const loadingMoreReleases = ref(false)

// Computed properties
const newReleases = computed(() => spotifyStore.getNewReleases || [])

// Methods
const loadNewReleasesContent = async () => {
  // Check if data already exists in store
  if (spotifyStore.getNewReleases && spotifyStore.getNewReleases.length > 0) {
    console.log('Using cached new releases data')
    return
  }

  loading.value = true
  try {
    await spotifyStore.fetchNewReleases(0)
  } catch (error) {
    console.error('Failed to load new releases:', error)
  } finally {
    loading.value = false
  }
}

const handleReleaseSelect = async (releaseId, event) => {
  selectedRelease.value = releaseId
  const release = newReleases.value.find(r => r.id === releaseId)
  console.log('Release selected:', release)

  if (release) {
    await deeperStore.getAlbumDetails(release, 'newReleases')
  }
}

const handleReleaseSearch = (event) => {
  console.log('Searching for releases:', event.target.value)
}

const handleLoadMoreReleases = async () => {
  if (loadingMoreReleases.value) return

  try {
    loadingMoreReleases.value = true
    const currentCount = newReleases.value.length
    await spotifyStore.fetchNewReleases(currentCount)
  } catch (error) {
    console.error('Failed to load more releases:', error)
  } finally {
    loadingMoreReleases.value = false
  }
}

const handleRefreshReleases = () => {
  // Clear existing data and fetch fresh
  spotifyStore.newReleases = []
  spotifyStore.fetchNewReleases(0)
}

// Load content on mount
onMounted(() => {
  loadNewReleasesContent()
})
</script>

<style scoped>

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--search-color);
  border-top: 3px solid var(--active-tab);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.new-releases-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.releases-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0;
  padding: 0 4px;
}

@media (max-width: 480px) {
  .new-releases-page {
    padding: 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .new-releases-content {
    gap: 24px;
  }
}
</style>
