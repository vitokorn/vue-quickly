<script setup>
import Logout from "./Logout.vue";
import {ref} from "vue";
import {useAudioStore} from "../stores/audio-store";

const showMenu = ref(false)
const audioStore = useAudioStore()

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const clearCache = () => {
  localStorage.clear()
  window.location.reload()
}
</script>

<template>
  <div class="settings-container">
    <button class="settings-toggle" @click="toggleMenu">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd"/>
      </svg>
    </button>

    <div v-if="showMenu" class="settings-menu">
      <div class="settings-section">
        <h3>Audio Settings</h3>
        
        <div class="setting-item">
          <label class="setting-label">
            <input 
              type="checkbox" 
              v-model="audioStore.audioPreview"
              @change="audioStore.setAudioPreview($event.target.checked)"
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
            >
            <span class="setting-text">Open links in new tab</span>
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h3>Actions</h3>
        
        <button class="action-button" @click="clearCache">
          <span class="action-icon">🗑️</span>
          <span class="action-text">Clear Cache</span>
        </button>
      </div>

      <div class="settings-section">
        <Logout />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  position: relative;
}

.settings-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-toggle:hover {
  background: rgba(240, 55, 165, 0.1);
  color: var(--active-tab);
}

.settings-toggle svg {
  width: 20px;
  height: 20px;
}

.settings-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-section {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--title-color);
  margin: 0 0 12px 0;
}

.setting-item {
  margin-bottom: 8px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--search-color);
}

.setting-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--active-tab);
}

.setting-text {
  flex: 1;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.action-button:hover {
  background: rgba(240, 55, 165, 0.1);
  color: var(--active-tab);
}

.action-icon {
  font-size: 16px;
}

.action-text {
  flex: 1;
  text-align: left;
}

/* Dark mode support */
:root.dark .settings-menu {
  background: rgba(42, 46, 47, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .settings-section {
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .settings-toggle,
:root.dark .action-button {
  background: rgba(255, 255, 255, 0.1);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .settings-menu {
    right: -8px;
    min-width: 260px;
  }
}
</style>
