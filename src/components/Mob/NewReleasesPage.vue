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
import { useMusicStore } from '../../stores/music-store'
import { useDeeperStore } from '../../stores/deeper-store'
import ReleaseSelector from './ReleaseSelector.vue'

const musicStore = useMusicStore()
const deeperStore = useDeeperStore()

// Reactive state
const loading = ref(false)
const selectedRelease = ref(null)
const loadingMoreReleases = ref(false)

// Computed properties
const newReleases = computed(() => musicStore.getNewReleases || [])

// Methods
const loadNewReleasesContent = async () => {
  // Check if data already exists in store
  if (musicStore.getNewReleases && musicStore.getNewReleases.length > 0) {
    console.log('Using cached new releases data')
    return
  }

  loading.value = true
  try {
    await musicStore.fetchNewReleases(0)
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
    await musicStore.fetchNewReleases(currentCount)
  } catch (error) {
    console.error('Failed to load more releases:', error)
  } finally {
    loadingMoreReleases.value = false
  }
}

const handleRefreshReleases = () => {
  // Clear existing data and fetch fresh
  musicStore.newReleases = []
  musicStore.fetchNewReleases(0)
}

// Load content on mount
onMounted(() => {
  loadNewReleasesContent()
})
</script>

<style scoped>

</style>
