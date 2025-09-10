<template>
  <div class="categories-container">
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

    <!-- Category Playlists Inline Section -->
    <div v-if="selectedCategory" class="category-playlists-section">
      <div class="category-playlists-header">
        <h3>{{ selectedCategory.name }} Playlists</h3>
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

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDeeperStore } from '../stores/deeper-store'
import { musicServiceManager } from '../services/MusicServiceManager'

const deeperStore = useDeeperStore()

// Reactive data
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

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.categories-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.categories-header h2 {
  color: #fff;
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
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
  font-size: 0.9rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #1db954;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.category-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
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
  height: 120px;
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
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.category-info {
  padding: 15px;
}

.category-name {
  color: #fff;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}

/* Category Playlists Modal */

.category-playlists-section {
  margin-top: 30px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.category-playlists-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.category-playlists-header h3 {
  color: #fff;
  margin: 0;
  font-size: 1.4rem;
}

.playlists-grid {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.playlist-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.playlist-image {
  width: 100%;
  height: 100px;
  overflow: hidden;
  position: relative;
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
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

.playlist-info {
  padding: 12px;
}

.playlist-name {
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
}

.playlist-description {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 8px 0;
  font-size: 0.8rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.playlist-tracks {
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  font-size: 0.75rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .categories-container {
    padding: 15px;
  }

  .categories-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .category-image {
    height: 100px;
  }

  .playlists-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .category-playlists-section {
    margin-top: 20px;
  }
}
</style>
