<script setup>
import { useMusicStore } from "../stores/music-store";
import { useAudioStore } from "../stores/audio-store";
import { useQueueStore } from "../stores/queue-store";
import { useDeeperStore } from "../stores/deeper-store";
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMediaDisplay } from "../composables/useMediaDisplay";
import { useVisibilityManager } from "../composables/useVisibilityManager";
import { getSectionName } from '../utils/sectionUtils';
import { getCurrentServiceType } from "../utils/initializeMusicStore.js";
import TrackCover from "./TrackCover.vue";
import PlaylistPreview from "./PlaylistPreview.vue";

const props = defineProps(['d', 'num'])
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Get current service type
const { currentServiceType } = storeToRefs(musicStore)

const selected = ref()
const componentRef = ref(null)

const {
  hasPreview,
  hasImage,
  displayClass,
  backgroundStyle,
  audioPreload,
  audioSrc
} = useMediaDisplay(computed(() => props.d))

function getMediaDisplay(item) {
  return useMediaDisplay(item)
}

// Get visibility manager
const visibilityManager = useVisibilityManager()

function setActive(id) {
  selected.value = id
}

function handlePlaylistClick(playlist) {
  setActive(playlist.id)
  deeperStore.getPlaylistDetails(playlist, getSectionName(props.num), props.d.id)
}

const trackClass = computed(() => {
  const baseClass = 'media-card'
  const selectedClass = props.selected ? 'selected' : ''
  return `${baseClass} ${displayClass.value} ${selectedClass}`.trim()
})

onMounted(() => {
  // Register this component with the visibility manager
  const userPlaylistsKey = `user-playlists_${props.d.owner.id}${props.d.parentKey ? `__p:${props.d.parentKey}__` : ''}`
  console.log('Registering UserPlaylists component with key:', userPlaylistsKey)
  visibilityManager.registerComponent(userPlaylistsKey, componentRef)
  console.log('Showing UserPlaylists component after registration:', userPlaylistsKey)
  visibilityManager.showComponent(userPlaylistsKey)
})
</script>

<template>
  <div class="modern-track-card" ref="componentRef">
      <div class="deeper-header">
        <track-cover :d="d" :cover="d.owner.picture_medium"></track-cover>
        <div class="track-info">
          <h3 class="track-title">{{ d.name }}</h3>
          <div class="release-date">
            {{ d.playlists.length }} playlists
          </div>
          <div class="album-actions">
            <!-- Refresh functionality will be implemented later -->
          </div>
        </div>
      </div>

    <!-- Playlists Grid -->
    <div class="releases-container grid">
      <template v-for="(playlist, index) in d.playlists" :key="index">
        <PlaylistPreview 
          :playlist="playlist" 
          @click="handlePlaylistClick" 
        />
      </template>
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
.modern-user-playlists {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.user-playlists-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  flex: 1;
}

.user-playlists-title {
  font-size: 2rem;
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

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.back-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.playlist-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background-size: contain;
}

.playlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.playlist-card.selected {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.playlist-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px 15px 15px;
  color: white;
}

.playlist-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.playlist-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.track-count {
  color: rgba(255, 255, 255, 0.9);
}

.playlist-visibility {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #ffffff;
}

.empty-state p {
  font-size: 1rem;
  opacity: 0.8;
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-user-playlists {
    padding: 15px;
  }

  .user-playlists-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .user-playlists-title {
    font-size: 1.5rem;
  }

  .playlists-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .playlist-overlay {
    padding: 15px 12px 12px;
  }

  .playlist-name {
    font-size: 0.9rem;
  }
}
</style>
