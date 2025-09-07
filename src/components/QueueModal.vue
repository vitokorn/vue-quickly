<script setup>
import {useQueueStore} from "../stores/queue-store";
import {useSpotifyStore} from "../stores/spotify-store";

const queueStore = useQueueStore()
const spotifyStore = useSpotifyStore()

const handleSaveQueue = async () => {
  try {
    await queueStore.saveQueue()
  } catch (error) {
    console.error('Failed to save queue:', error)
  }
}

const handleSaveToPlaylist = async (playlistId) => {
  try {
    await queueStore.saveQueueToPlaylist(playlistId)
  } catch (error) {
    console.error('Failed to save queue to playlist:', error)
  }
}

const handleCreatePlaylist = async () => {
  const name = prompt('Name for your playlist:', 'Discovered')
  if (name) {
    try {
      await spotifyStore.createPlaylist(name)
      // Refresh playlists
      await spotifyStore.fetchPlaylists(0)
    } catch (error) {
      console.error('Failed to create playlist:', error)
    }
  }
}
</script>

<template>
  <div v-if="queueStore.isQueueModalOpen" class="modal-overlay" @click="queueStore.setQueueModal(false)">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Queue</h2>
        <button class="modal-close" @click="queueStore.setQueueModal(false)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"/>
          </svg>
        </button>
      </div>

      <div class="modal-actions">
        <button class="action-btn save-btn" @click="handleSaveQueue">
          <span class="btn-icon">💾</span>
          <span class="btn-text">Save all tracks</span>
        </button>

        <div class="playlist-selector">
          <select class="playlist-select" @change="handleSaveToPlaylist($event.target.value)">
            <option selected disabled>Add all to playlist</option>
            <option value="new" @click="handleCreatePlaylist">New playlist</option>
            <template v-for="(playlist, index) of spotifyStore.getPlaylists" :key="index">
              <option :value="playlist.id">{{ playlist.name }}</option>
            </template>
          </select>
        </div>

        <button class="action-btn clear-btn" @click="queueStore.clearQueue()">
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">Clear queue</span>
        </button>
      </div>

      <div class="queue-list">
        <div v-for="(q, index) in queueStore.getQueueArr" :key="index" class="queue-item">
          <div class="track-info">
            <div class="track-image">
              <div v-if="q.image"
                   class="track-cover"
                   :style="{ 'background-image': 'url(' + q.image.url + ')' }">
              </div>
              <div v-else
                   class="track-cover no-image">
                <span class="no-image-icon">🎵</span>
              </div>
            </div>

            <div class="track-details">
              <div class="track-name">{{ q.name }}</div>
              <div class="track-artists">{{ q.artists }}</div>
            </div>
          </div>

          <button class="remove-btn" @click="queueStore.removeFromQueue(q.id)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <p class="premium-notice">
          <span class="notice-icon">ℹ️</span>
          Spotify Premium required to play the full song in Discover Mobily. Save these tracks above to listen in the main Spotify app.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
