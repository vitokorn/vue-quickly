<template>
  <div class="settings-display">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z"/>
        </svg>
      </div>
      <h1 class="header-title">Audio Settings</h1>
    </div>

    <!-- Audio Settings Card -->
    <div class="settings-card">
      <div class="setting-item">
        <label class="setting-label">
          <input
              type="checkbox"
              v-model="audioStore.audioPreview"
              @change="audioStore.setAudioPreview($event.target.checked)"
              class="setting-checkbox"
          >
          <span class="setting-text">Audio Preview</span>
        </label>
      </div>

      <div class="setting-item">
        <label class="setting-label">
          <input
              type="checkbox"
              v-model="audioStore.restartSongOnHover"
              @change="audioStore.setRestartSongOnHover($event.target.checked)"
              class="setting-checkbox"
          >
          <span class="setting-text">Restart song on hover</span>
        </label>
      </div>

      <div class="setting-item">
        <label class="setting-label">
          <input
              type="checkbox"
              v-model="audioStore.unplayableTracks"
              @change="audioStore.setUnplayableTracks($event.target.checked)"
              class="setting-checkbox"
          >
          <span class="setting-text">Show unplayable tracks</span>
        </label>
      </div>

      <div class="setting-item">
        <label class="setting-label">
          <input
              type="checkbox"
              v-model="audioStore.openLinks"
              @change="audioStore.setOpenLinks($event.target.checked)"
              class="setting-checkbox"
          >
          <span class="setting-text">Open links in new tab</span>
        </label>
      </div>
    </div>
    <div class="settings-header">
      <div class="header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z"/>
        </svg>
      </div>
      <h1 class="header-title">Actions</h1>
    </div>
    <!-- Actions Section -->
    <div class="actions-section">

      <button class="action-button" @click="clearCache">
        <span class="action-icon">🗑️</span>
        <span class="action-text">Clear Cache</span>
      </button>

      <button class="action-button" @click="showWelcomeModal">
        <span class="action-icon">👋</span>
        <span class="action-text">Show Welcome Modal</span>
      </button>
    </div>

    <!-- Logout Section -->
    <div class="logout-section">
      <Logout />
    </div>
  </div>
</template>

<script setup>
import Logout from "../Logout.vue";
import { useAudioStore } from "../../stores/audio-store.js";

const audioStore = useAudioStore()

const clearCache = () => {
  localStorage.clear()
  window.location.reload()
}

const showWelcomeModal = () => {
  localStorage.removeItem('welcome-modal-seen')
  window.location.reload()
}
</script>

<style scoped>
.settings-display {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
}

/* Header Styles */
.settings-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 0;
  width: 100%;
}

.header-icon {
  width: 28px;
  height: 28px;
  margin-right: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.header-icon svg {
  width: 100%;
  height: 100%;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* Settings Card */
.settings-card {
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.8), rgba(103, 58, 183, 0.8));
  border-radius: 16px;
  padding: 0;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  width: 100%;
}

.setting-item {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.setting-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.setting-checkbox {
  margin-right: 16px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.setting-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  flex: 1;
  line-height: 1.4;
}

/* Actions Section */
.actions-section {
  margin-bottom: 40px;
  width: 100%;
}

.actions-title {
  font-size: 20px;
  font-weight: 700;
  color: #f037a5;
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.action-button:last-child {
  margin-bottom: 0;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.action-button:active {
  transform: translateY(0);
}

.action-icon {
  margin-right: 16px;
  font-size: 22px;
}

.action-text {
  flex: 1;
  text-align: left;
}

.logout-section {
  margin-bottom: 40px;
  width: 100%;
}

/* Responsive design */
@media (max-width: 480px) {
  .settings-header {
    margin-bottom: 20px;
    padding: 16px 0;
  }

  .header-title {
    font-size: 22px;
  }

  .settings-card {
    margin-bottom: 24px;
  }

  .setting-item {
    padding: 18px 20px;
  }

  .setting-text {
    font-size: 15px;
  }

  .actions-title {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .action-button {
    padding: 18px 20px;
    font-size: 15px;
    margin-bottom: 12px;
  }

  .action-icon {
    font-size: 20px;
  }
}
</style>
