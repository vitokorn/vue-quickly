<script setup>
import Logout from "./Logout.vue";
import {ref} from "vue";
import {useDMStore} from "../stores/dm-store";

const showMenu = ref(false)
const store = useDMStore()

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const clearCache = () => {
  localStorage.clear()
  window.location.reload()
}
</script>

<template>
  <div class="settings-dropdown">
    <button class="settings-button" @click="toggleMenu" :class="{ active: showMenu }">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
      </svg>
    </button>

    <div v-if="showMenu" class="settings-menu">
      <div class="menu-header">
        <h3 class="menu-title">Settings</h3>
      </div>

      <div class="menu-content">
        <div class="setting-item">
          <label class="setting-label">
            <input type="checkbox" id="unplayable" v-model="store.unplayable_tracks" class="setting-checkbox">
            <span class="checkmark"></span>
            <span class="setting-text">Show unplayable tracks</span>
          </label>
        </div>

        <div class="setting-item">
          <label class="setting-label">
            <input type="checkbox" id="preview" v-model="store.audio_preview" class="setting-checkbox">
            <span class="checkmark"></span>
            <span class="setting-text">Audio preview</span>
          </label>
        </div>

        <div class="setting-item">
          <label class="setting-label">
            <input type="checkbox" id="open" v-model="store.open_links" class="setting-checkbox">
            <span class="checkmark"></span>
            <span class="setting-text">Open Spotify links in browser</span>
          </label>
        </div>

        <div class="setting-item">
          <label class="setting-label">
            <input type="checkbox" id="restart" v-model="store.restart_song_on_hover" class="setting-checkbox">
            <span class="checkmark"></span>
            <span class="setting-text">Restart song on hover</span>
          </label>
        </div>
      </div>

      <div class="menu-actions">
        <button class="action-button clear-cache" @click="clearCache">
          <span class="action-icon">🗑️</span>
          <span class="action-text">Clear cache & restart</span>
        </button>
        <Logout />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-dropdown {
  position: relative;
}

.settings-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 10px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.settings-button:hover {
  background: rgba(240, 55, 165, 0.1);
  color: var(--active-tab);
  transform: translateY(-1px);
}

.settings-button.active {
  background: var(--active-tab);
  color: white;
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}

.settings-button svg {
  width: 20px;
  height: 20px;
}

.settings-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--main-color);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
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

.menu-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.menu-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--pl-background-color);
  margin: 0;
}

.menu-content {
  padding: 12px 20px;
}

.setting-item {
  margin-bottom: 12px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.2s ease;
}

.setting-label:hover {
  background: rgba(240, 55, 165, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0 -12px;
}

.setting-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkmark {
  position: relative;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.setting-checkbox:checked + .checkmark {
  background: var(--active-tab);
  border-color: var(--active-tab);
}

.setting-checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.setting-text {
  font-size: 14px;
  color: var(--pl-background-color);
  font-weight: 500;
  flex: 1;
}

.menu-actions {
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.action-button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
}

.action-button:hover {
  background: rgba(240, 55, 165, 0.1);
  color: var(--active-tab);
}

.clear-cache:hover {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.action-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.action-text {
  color: var(--pl-background-color);
  flex: 1;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .settings-menu {
    right: -10px;
    min-width: 260px;
  }

  .menu-header,
  .menu-content,
  .menu-actions {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 480px) {
  .settings-menu {
    right: -20px;
    min-width: 240px;
  }

  .setting-text,
  .action-text {
    font-size: 13px;
  }
}

/* Dark mode support */
:root.dark .settings-menu {
  background: rgba(42, 46, 47, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .menu-header,
:root.dark .menu-actions {
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .checkmark {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

:root.dark .setting-label:hover {
  background: rgba(240, 55, 165, 0.2);
}

:root.dark .action-button:hover {
  background: rgba(240, 55, 165, 0.2);
}
</style>
