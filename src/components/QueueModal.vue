<script setup>
import {useDMStore} from "../stores/dm-store";

const store = useDMStore()
</script>

<template>
  <div v-if="store.queueModal" class="modal-overlay" @click="store.queueModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Queue</h2>
        <button class="modal-close" @click="store.queueModal = false">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"/>
          </svg>
        </button>
      </div>

      <div class="modal-actions">
        <button class="action-btn save-btn" @click="store.savequeue()">
          <span class="btn-icon">💾</span>
          <span class="btn-text">Save all tracks</span>
        </button>

        <div class="playlist-selector">
          <select class="playlist-select">
            <option selected disabled>Add all to playlist</option>
            <option @click="store.createplaylist()">New playlist</option>
            <template v-for="(playlist, index) of store.listplaylists" :key="index">
              <option :id="playlist.id">{{ playlist.name }}</option>
            </template>
          </select>
        </div>

        <button class="action-btn clear-btn" @click="store.removequeue()">
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">Clear queue</span>
        </button>
      </div>

      <div class="queue-list">
        <div v-for="(q, index) in store.queuearr" :key="index" class="queue-item">
          <div class="track-info">
            <div class="track-image">
              <div v-if="q.image"
                   class="track-cover"
                   :style="{ 'background-image': 'url(' + q.image.url + ')' }">
              </div>
              <div v-else-if="store.unplayable_tracks"
                   class="track-cover no-image">
                <span class="no-image-icon">🎵</span>
              </div>
            </div>

            <div class="track-details">
              <div class="track-name">{{ q.name }}</div>
              <div class="track-artists">{{ q.artists }}</div>
            </div>
          </div>

          <button class="remove-btn" @click="store.removequeueitem(q.id)">
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--title-color);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(240, 55, 165, 0.1);
  color: var(--active-tab);
}

.modal-close svg {
  width: 16px;
  height: 16px;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.action-btn:hover {
  background: rgba(240, 55, 165, 0.1);
  color: var(--active-tab);
  transform: translateY(-1px);
}

.save-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.clear-btn:hover {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  white-space: nowrap;
}

.playlist-selector {
  flex: 1;
}

.playlist-select {
  width: 100%;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: var(--search-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.playlist-select:focus {
  outline: none;
  border-color: var(--active-tab);
  box-shadow: 0 0 0 3px rgba(240, 55, 165, 0.1);
}

.queue-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  max-height: 300px;
}

.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.queue-item:hover {
  background: rgba(240, 55, 165, 0.05);
}

.queue-item:last-child {
  margin-bottom: 0;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.track-image {
  flex-shrink: 0;
}

.track-cover {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.track-cover.no-image {
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image-icon {
  font-size: 20px;
  opacity: 0.6;
}

.track-details {
  flex: 1;
  min-width: 0;
}

.track-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--title-color);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artists {
  font-size: 12px;
  color: var(--search-color);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  transform: scale(1.1);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.modal-footer {
  padding: 16px 24px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.premium-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--search-color);
  opacity: 0.8;
  margin: 0;
  line-height: 1.4;
}

.notice-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Scrollbar styling */
.queue-list::-webkit-scrollbar {
  width: 6px;
}

.queue-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.queue-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.queue-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }

  .modal-header,
  .modal-actions,
  .queue-list,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .modal-actions {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .playlist-selector {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 16px;
  }

  .modal-title {
    font-size: 18px;
  }

  .track-cover {
    width: 40px;
    height: 40px;
  }

  .track-name {
    font-size: 13px;
  }

  .track-artists {
    font-size: 11px;
  }
}

/* Dark mode support */
:root.dark .modal-content {
  background: rgba(42, 46, 47, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .modal-header,
:root.dark .modal-actions,
:root.dark .modal-footer {
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .modal-close,
:root.dark .action-btn,
:root.dark .playlist-select,
:root.dark .remove-btn {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .track-cover.no-image {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .queue-item:hover {
  background: rgba(240, 55, 165, 0.2);
}
</style>
