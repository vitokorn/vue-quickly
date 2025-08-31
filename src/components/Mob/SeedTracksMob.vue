<script setup>
import {useSpotifyStore} from "../../stores/spotify-store";
import {useAudioStore} from "../../stores/audio-store";
import {useQueueStore} from "../../stores/queue-store";
import {useDeeperStore} from "../../stores/deeper-store";
import {ref, computed, onMounted, nextTick} from "vue";
import {useMobileMediaDisplay} from "../../composables/useMobileMediaDisplay.js";
import { useVisibilityManager } from "../../composables/useVisibilityManager";
import MobileTrackItem from './MobileTrackItem.vue';

const props = defineProps(['d', 'num'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selected = ref()
const selectedSTSortOption = ref("")
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

const sortedSTItems = computed(() => {
  const items = props.d.tracks || []
  if (!selectedSTSortOption.value) return items

  return [...items].sort((a, b) => {
    switch (selectedSTSortOption.value) {
      case 'track':
        return a.name.localeCompare(b.name)
      case 'album':
        return a.album.name.localeCompare(b.album.name)
      case 'artist':
        return a.artists[0].name.localeCompare(b.artists[0].name)
      case 'popularity':
        return b.popularity - a.popularity
      case 'release_date':
        return new Date(b.album.release_date) - new Date(a.album.release_date)
      case 'duration':
        return a.duration_ms - b.duration_ms
      default:
        return 0
    }
  })
})

// Helper function to get section name from num
function getSectionName(num) {
  switch (num) {
    case 1: return 'yourPlaylists'
    case 2: return 'topArtists'
    case 3: return 'topTracks'
    case 4: return 'savedAlbums'
    case 5: return 'savedTracks'
    case 6: return 'followedArtists'
    case 7: return 'newReleases'
    case 8: return 'spotifyPlaylists'
    case 10: return 'search'
    case 22: return 'topArtists6'
    case 23: return 'topArtistsAll'
    case 32: return 'topTracks6'
    case 33: return 'topTracksAll'
    default: return 'search'
  }
}

const handleTrackClick = async (track, event) => {
  const sectionName = getSectionName(props.num)
  await deeperStore.getTrackDetails(track, sectionName, props.d.id)
  queueStore.addToQueue(track)
}

const handleRefresh = () => {
  spotifyStore.reloadST({num: props.num, id: props.d.id, name: props.d.name})
}

onMounted(async () => {
  // Wait for the next tick to ensure the ref is available
  await nextTick()

  // Register this component with the visibility manager
  const seedKey = `seed_tracks_${props.d.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  visibilityManager.registerComponent(seedKey, componentRef)

  // Show this component after registration
  console.log('Showing SeedTracksMob component after registration:', seedKey)
  visibilityManager.showComponent(seedKey)
})
</script>

<template>
  <div class="mobile-seed-tracks" ref="componentRef">
    <!-- Header Section -->
    <div class="seed-header">
      <div class="seed-title">
        <span class="title-icon">🎵</span>
        <span class="title-text">Recommended songs based on {{ d.name }}</span>
      </div>
      <div class="seed-actions">
        <button class="refresh-button" @click="handleRefresh">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="refresh-icon">
            <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
          </svg>
        </button>
        <select class="sort-select" v-model="selectedSTSortOption">
          <option value="">Initial</option>
          <option value="artist">Sort by artist</option>
          <option value="album">Sort by album</option>
          <option value="duration">Sort by duration</option>
          <option value="popularity">Sort by popularity</option>
          <option value="release_date">Sort by release date</option>
          <option value="track">Sort by track name</option>
        </select>
      </div>
    </div>

    <!-- Tracks List -->
    <div class="tracks-container">
      <div v-if="sortedSTItems.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>No recommended tracks</h3>
        <p>Try refreshing to get new recommendations</p>
      </div>

      <div v-else class="tracks-list">
        <MobileTrackItem
          v-for="track in sortedSTItems"
          :key="track.id"
          :track="track"
          view-mode="list"
          @click="handleTrackClick(track, $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-seed-tracks {
  padding: 20px;
  background: var(--theme-mobile-bg);
  min-height: 100vh;
}

.seed-header {
  margin-bottom: 24px;
}

.seed-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.title-icon {
  font-size: 24px;
}

.title-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--title-color);
  line-height: 1.3;
}

.seed-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.refresh-button {
  background: var(--action-btn-bg);
  border: none;
  color: var(--title-color);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.refresh-button:hover {
  background: var(--action-btn-hover-bg);
  transform: translateY(-1px);
}

.refresh-icon {
  width: 20px;
  height: 20px;
}

.sort-select {
  flex: 1;
  background: var(--action-btn-bg);
  border: 1px solid var(--item-border);
  color: var(--title-color);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:hover {
  background: var(--action-btn-hover-bg);
}

.sort-select:focus {
  outline: none;
  border-color: var(--active-tab);
  box-shadow: 0 0 0 2px rgba(240, 55, 165, 0.2);
}

.tracks-container {
  width: 100%;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--title-color);
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: var(--search-color);
  margin: 0;
  opacity: 0.8;
}

/* Responsive design */
@media (max-width: 480px) {
  .mobile-seed-tracks {
    padding: 16px;
  }

  .title-text {
    font-size: 18px;
  }

  .seed-actions {
    flex-direction: column;
    gap: 8px;
  }

  .refresh-button {
    width: 36px;
    height: 36px;
  }

  .refresh-icon {
    width: 18px;
    height: 18px;
  }

  .sort-select {
    font-size: 13px;
    padding: 8px 10px;
  }
}

@media (max-width: 360px) {
  .mobile-seed-tracks {
    padding: 12px;
  }

  .title-text {
    font-size: 16px;
  }

  .refresh-button {
    width: 32px;
    height: 32px;
  }

  .refresh-icon {
    width: 16px;
    height: 16px;
  }

  .sort-select {
    font-size: 12px;
    padding: 6px 8px;
  }
}
</style>
