<script setup>
import { useMusicStore } from "../../stores/music-store";
import { useAudioStore } from "../../stores/audio-store";
import { useQueueStore } from "../../stores/queue-store";
import { useDeeperStore } from "../../stores/deeper-store";
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMediaDisplay } from "../../composables/useMediaDisplay";
import { useVisibilityManager } from "../../composables/useVisibilityManager";
import { getSectionName } from '../../utils/sectionUtils';
import { getCurrentServiceType } from "../../utils/initializeMusicStore.js";

const props = defineProps(['d', 'num'])
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Get current service type
const { currentServiceType } = storeToRefs(musicStore)

const selected = ref()
const componentRef = ref(null)

// Get visibility manager
const visibilityManager = useVisibilityManager()

// Helper function to get media display for any item
function getMediaDisplay(item) {
  return useMediaDisplay(computed(() => item))
}

function setActive(id) {
  selected.value = id
}

function handlePlaylistClick(playlist) {
  setActive(playlist.id)
  deeperStore.getPlaylistDetails(playlist, getSectionName(props.num), props.d.id)
}

onMounted(() => {
  // Register this component with the visibility manager
  const userPlaylistsKey = `user-playlists_${props.d.user.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  console.log('Registering MobileUserPlaylists component with key:', userPlaylistsKey)
  visibilityManager.registerComponent(userPlaylistsKey, componentRef)
  console.log('Showing MobileUserPlaylists component after registration:', userPlaylistsKey)
  visibilityManager.showComponent(userPlaylistsKey)
})
</script>

<template>
  <div class="mobile-user-playlists" ref="componentRef">
    <!-- User Playlists Header -->
    <div class="user-playlists-header">
      <div class="user-info">
        <h2 class="user-playlists-title">{{ d.name }}</h2>
        <div class="user-meta">
          <span class="playlist-count">{{ d.playlists.length }} playlists</span>
        </div>
      </div>
    </div>

    <!-- Playlists Grid -->
    <div class="playlists-grid">
      <div v-for="(playlist, index) in d.playlists" :key="index"
           :class="['playlist-card', getMediaDisplay(playlist).displayClass.value, selected === playlist.id ? 'selected' : '']"
           :style="getMediaDisplay(playlist).backgroundStyle.value"
           @click="handlePlaylistClick(playlist)"
           @mouseover="getMediaDisplay(playlist).hasPreview.value && audioStore.handleAudioHover($event)"
           @mouseleave="getMediaDisplay(playlist).hasPreview.value && audioStore.handleAudioLeave($event)">
        
        <div class="playlist-overlay">
          <div class="playlist-name">{{ playlist.name }}</div>
          <div class="playlist-meta">
            <span v-if="playlist.tracks && playlist.tracks.total" class="track-count">
              {{ playlist.tracks.total }} tracks
            </span>
            <span v-if="playlist.public !== undefined" class="playlist-visibility">
              {{ playlist.public ? 'Public' : 'Private' }}
            </span>
          </div>
        </div>
        
        <audio :preload="getMediaDisplay(playlist).audioPreload.value" 
               :src="getMediaDisplay(playlist).audioSrc.value"></audio>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="d.playlists.length === 0" class="empty-state">
      <div class="empty-icon">🎵</div>
      <h3>No playlists found</h3>
      <p>This user doesn't have any public playlists.</p>
    </div>
  </div>
</template>

<style scoped>
.mobile-user-playlists {
  padding: 15px;
  max-width: 100%;
  margin: 0 auto;
}

.user-playlists-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-playlists-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.playlist-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.playlist-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.playlist-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.playlist-card.selected {
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
}

.playlist-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 15px 10px 10px;
  color: white;
}

.playlist-name {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.7rem;
  opacity: 0.8;
}

.track-count {
  color: rgba(255, 255, 255, 0.9);
}

.playlist-visibility {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.65rem;
}

.empty-state {
  text-align: center;
  padding: 40px 15px;
  color: rgba(255, 255, 255, 0.7);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #ffffff;
}

.empty-state p {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
