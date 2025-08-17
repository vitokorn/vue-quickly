<script setup>
import { onMounted } from 'vue'
import { useQueueStore } from "../../stores/queue-store"
import { useSpotifyStore } from "../../stores/spotify-store"
import MobileTrackItem from './MobileTrackItem.vue'

const queueStore = useQueueStore()
const spotifyStore = useSpotifyStore()

onMounted(() => {
  // Load queue from localStorage when component mounts
  queueStore.loadQueue()
  
  // Load playlists if not already loaded
  if (spotifyStore.getPlaylists.length === 0) {
    spotifyStore.fetchPlaylists(0)
  }
})

const handleSaveQueue = async () => {
  try {
    await queueStore.saveQueue()
  } catch (error) {
    console.error('Failed to save queue:', error)
  }
}

const handleSaveToPlaylist = async (playlistId) => {
  if (playlistId === 'new') {
    const name = prompt('Name for your playlist:', 'Discovered')
    if (name) {
      try {
        await spotifyStore.createPlaylist(name)
        await spotifyStore.fetchPlaylists(0)
      } catch (error) {
        console.error('Failed to create playlist:', error)
      }
    }
  } else if (playlistId !== 'default') {
    try {
      await queueStore.saveQueueToPlaylist(playlistId)
    } catch (error) {
      console.error('Failed to save queue to playlist:', error)
    }
  }
}
</script>

<template>
  <div class="queue-display">
    <!-- Queue Header -->
    <div class="queue-header">
      <div class="queue-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="queue-icon">
          <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
          <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
        </svg>
        <h3>Queue ({{ queueStore.getQueueCount() }})</h3>
      </div>
    </div>

    <!-- Queue Actions -->
    <div v-if="queueStore.getQueueCount() > 0" class="queue-actions">
      <button class="action-btn save-btn" @click="handleSaveQueue">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="action-icon">
          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
        </svg>
        Save All
      </button>

      <div class="playlist-selector">
        <select class="playlist-select" @change="handleSaveToPlaylist($event.target.value)">
          <option value="default" selected disabled>Add to Playlist</option>
          <option value="new">New Playlist</option>
          <template v-for="(playlist, index) of spotifyStore.getPlaylists" :key="index">
            <option :value="playlist.id">{{ playlist.name }}</option>
          </template>
        </select>
      </div>

      <button class="action-btn clear-btn" @click="queueStore.clearQueue()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="action-icon">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
        </svg>
        Clear
      </button>
    </div>

    <!-- Queue List -->
    <div class="queue-list" v-if="queueStore.getQueueCount()">
      <MobileTrackItem
        v-for="(track, index) in queueStore.getQueueArr"
        :key="index"
        :track="track"
        section-name="queue"
        parent-id="queue"
        :show-remove="true"
        @remove="queueStore.removeFromQueue(track.id)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-queue">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
        </svg>
      </div>
      <h4>Your queue is empty</h4>
      <p>Add tracks from your discoveries to build your queue</p>
    </div>

    <!-- Premium Notice -->
    <div v-if="queueStore.getQueueCount() > 0" class="premium-notice">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="notice-icon">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
      </svg>
      <span>Spotify Premium required to play full songs. Save tracks to listen in the main Spotify app.</span>
    </div>
  </div>
</template>

<style scoped>
.queue-display {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-sizing: border-box;
}

.queue-header {
  margin-bottom: 16px;
}

.queue-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.queue-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
}

.queue-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.queue-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.clear-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-1px);
}

.action-icon {
  width: 16px;
  height: 16px;
}

.playlist-selector {
  width: 100%;
}

.playlist-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.playlist-select:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
}

.playlist-select option {
  background: #1a1a2e;
  color: #ffffff;
}

.queue-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.empty-queue {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: #a0a0a0;
}

.empty-queue h4 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.empty-queue p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
  line-height: 1.4;
}

.premium-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.notice-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 2px;
}

.premium-notice span {
  font-size: 12px;
  color: #a0a0a0;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 480px) {
  .queue-display {
    padding: 12px;
    margin-bottom: 16px;
  }

  .queue-title h3 {
    font-size: 16px;
  }

  .action-btn {
    padding: 10px 12px;
    font-size: 13px;
  }

  .playlist-select {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
