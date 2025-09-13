<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDeeperStore } from '../../stores/deeper-store'

// Reactive data
const deeperStore = useDeeperStore()
const categories = ref([])
const categoryPlaylists = ref([])
const selectedCategory = ref(null)
const loading = ref(false)
const playlistsLoading = ref(false)
const currentOffset = ref(0)
const pagination = ref({
  total: 0,
  limit: 50,
  next: null,
  previous: null
})

// Computed
const sectionName = computed(() => 'categories')

// Methods
const loadCategories = async (offset = 0) => {
  loading.value = true
  try {
    // Clear existing categories when loading new page
    if (offset === 0) {
      deeperStore.clearSection(sectionName.value)
      categories.value = []
    }

    const response = await deeperStore.getCategories(sectionName.value, offset, pagination.value.limit)

    // Update pagination info
    pagination.value = {
      total: response.total,
      limit: pagination.value.limit,
      next: response.next,
      previous: response.previous
    }

    currentOffset.value = offset

    // Get categories from store
    const sectionData = deeperStore.getSectionData(sectionName.value)
    categories.value = sectionData.filter(item => item.type === 'category')

  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    loading.value = false
  }
}

const loadNextPage = () => {
  if (pagination.value.next && !loading.value) {
    loadCategories(currentOffset.value + pagination.value.limit)
  }
}

const loadPreviousPage = () => {
  if (pagination.value.previous && !loading.value) {
    const newOffset = Math.max(0, currentOffset.value - pagination.value.limit)
    loadCategories(newOffset)
  }
}

const selectCategory = async (category) => {
  selectedCategory.value = category
  playlistsLoading.value = true
  categoryPlaylists.value = []

  try {
    const response = await deeperStore.getCategoryPlaylists(
      category.id,
      'categoryPlaylists',
      category.id
    )

    // Get playlists from store
    const sectionData = deeperStore.getSectionData('categoryPlaylists')
    categoryPlaylists.value = sectionData.filter(item =>
      item.type === 'category-playlist' && item.parentKey === category.id
    )

  } catch (error) {
    console.error('Failed to load category playlists:', error)
  } finally {
    playlistsLoading.value = false
  }
}

const selectPlaylist = (playlist) => {
  // Add deeper playlist into the current Categories section, scoped by category parentKey
  deeperStore.getPlaylistDetails(playlist, 'categories', selectedCategory.value.id)
}

const closeCategoryPlaylists = () => {
  selectedCategory.value = null
  categoryPlaylists.value = []
  // Clear category playlists section
  deeperStore.clearSection('categoryPlaylists')
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// Load content on mount
onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="categories-page">
    <div class="categories-header">
      <h2>Browse Categories</h2>
      <div class="pagination-controls" v-if="pagination.total > pagination.limit">
        <button
          @click="loadPreviousPage"
          :disabled="!pagination.previous || loading"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="pagination-info">
          {{ currentOffset + 1 }}-{{ Math.min(currentOffset + pagination.limit, pagination.total) }} of {{ pagination.total }}
        </span>
        <button
          @click="loadNextPage"
          :disabled="!pagination.next || loading"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading categories...</p>
    </div>

    <div v-else-if="categories.length === 0" class="empty-state">
      <p>No categories found.</p>
    </div>

    <div v-else class="categories-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        @click="selectCategory(category)"
      >
        <div class="category-image">
          <img
            v-if="category.icons && category.icons.length > 0"
            :src="category.icons[0].url"
            :alt="category.name"
            @error="handleImageError"
          />
          <div v-else class="category-placeholder">
            <span>{{ category.name.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
        </div>
      </div>
    </div>

    <!-- Category Playlists Section -->
    <div v-if="selectedCategory" class="category-playlists-section">
      <div class="category-playlists-header">
        <h3>{{ selectedCategory.name }} Playlists</h3>
        <button @click="closeCategoryPlaylists" class="close-btn">×</button>
      </div>

      <div v-if="playlistsLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading playlists...</p>
      </div>

      <div v-else-if="categoryPlaylists.length === 0" class="empty-state">
        <p>No playlists found for this category.</p>
      </div>

      <div v-else class="playlists-grid">
        <div
          v-for="playlist in categoryPlaylists"
          :key="playlist.id"
          class="playlist-card"
          @click="selectPlaylist(playlist)"
        >
          <div class="playlist-image">
            <img
              v-if="playlist.images && playlist.images.length > 0"
              :src="playlist.images[0].url"
              :alt="playlist.name"
              @error="handleImageError"
            />
            <div v-else class="playlist-placeholder">
              <span>{{ playlist.name.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <div class="playlist-info">
            <h4 class="playlist-name">{{ playlist.name }}</h4>
            <p v-if="playlist.description" class="playlist-description">
              {{ playlist.description }}
            </p>
            <p class="playlist-tracks">{{ playlist.totalTracks }} tracks</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.categories-page {
  padding: 15px;
  max-width: 100%;
  margin: 0 auto;
}

.categories-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.categories-header h2 {
  color: #fff;
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pagination-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 2px solid #1db954;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
}

.category-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.category-image {
  width: 100%;
  height: 80px;
  overflow: hidden;
  position: relative;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1db954, #1ed760);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

.category-info {
  padding: 10px;
}

.category-name {
  color: #fff;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}

/* Category Playlists Section */
.category-playlists-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.category-playlists-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.category-playlists-header h3 {
  color: #fff;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.playlists-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.playlist-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.playlist-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.playlist-image {
  width: 60px;
  height: 60px;
  overflow: hidden;
  position: relative;
  border-radius: 6px;
  flex-shrink: 0;
}

.playlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1db954, #1ed760);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.playlist-info {
  flex: 1;
  min-width: 0;
}

.playlist-name {
  color: #fff;
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-description {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 4px 0;
  font-size: 0.8rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-tracks {
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-size: 0.75rem;
}
</style>
