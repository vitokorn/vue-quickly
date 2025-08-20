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

    <!-- Audio Settings Section -->
    <div class="actions-section">
      <button class="action-button" @click="toggleAudioPreview">
        <span class="action-icon">🔊</span>
        <span class="action-text">Audio Preview</span>
        <span class="action-status" :class="{ active: audioStore.audioPreview }">
          {{ audioStore.audioPreview ? 'ON' : 'OFF' }}
        </span>
      </button>

      <button class="action-button" @click="toggleRestartSongOnClick">
        <span class="action-icon">🔄</span>
        <span class="action-text">Restart song on click</span>
        <span class="action-status" :class="{ active: audioStore.restartSongOnClick }">
          {{ audioStore.restartSongOnClick ? 'ON' : 'OFF' }}
        </span>
      </button>

      <button class="action-button" @click="toggleUnplayableTracks">
        <span class="action-icon">🎵</span>
        <span class="action-text">Show unplayable tracks</span>
        <span class="action-status" :class="{ active: audioStore.unplayableTracks }">
          {{ audioStore.unplayableTracks ? 'ON' : 'OFF' }}
        </span>
      </button>

      <button class="action-button" @click="toggleOpenLinks">
        <span class="action-icon">🔗</span>
        <span class="action-text">Open links in new tab</span>
        <span class="action-status" :class="{ active: audioStore.openLinks }">
          {{ audioStore.openLinks ? 'ON' : 'OFF' }}
        </span>
      </button>
    </div>

    <!-- Theme Section -->
    <div class="settings-header">
      <div class="header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>
        </svg>
      </div>
      <h1 class="header-title">Theme</h1>
    </div>
    <div class="actions-section">
      <button class="action-button" @click="changeTheme('light')">
        <span class="action-icon">☀️</span>
        <span class="action-text">Light Theme</span>
        <span class="action-status" :class="{ active: currentTheme === 'light' }">
          {{ currentTheme === 'light' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="action-button" @click="changeTheme('dark')">
        <span class="action-icon">🌙</span>
        <span class="action-text">Dark Theme</span>
        <span class="action-status" :class="{ active: currentTheme === 'dark' }">
          {{ currentTheme === 'dark' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="action-button" @click="changeTheme('dark-blue')">
        <span class="action-icon">🌊</span>
        <span class="action-text">Dark Blue Theme</span>
        <span class="action-status" :class="{ active: currentTheme === 'dark-blue' }">
          {{ currentTheme === 'dark-blue' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="action-button" @click="changeTheme('dq')">
        <span class="action-icon">🎨</span>
        <span class="action-text">DQ Theme</span>
        <span class="action-status" :class="{ active: currentTheme === 'dq' }">
          {{ currentTheme === 'dq' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="action-button" @click="changeTheme('aero')">
        <span class="action-icon">🪟</span>
        <span class="action-text">Windows Aero</span>
        <span class="action-status" :class="{ active: currentTheme === 'aero' }">
          {{ currentTheme === 'aero' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="action-button" @click="changeTheme('cupertino')">
        <span class="action-icon">🍎</span>
        <span class="action-text">Cupertino</span>
        <span class="action-status" :class="{ active: currentTheme === 'cupertino' }">
          {{ currentTheme === 'cupertino' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="action-button" @click="changeTheme('metro')">
        <span class="action-icon">📱</span>
        <span class="action-text">Metro UI</span>
        <span class="action-status" :class="{ active: currentTheme === 'metro' }">
          {{ currentTheme === 'metro' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="action-button" @click="changeTheme('material')">
        <span class="action-icon">🎯</span>
        <span class="action-text">Material Design</span>
        <span class="action-status" :class="{ active: currentTheme === 'material' }">
          {{ currentTheme === 'material' ? 'ACTIVE' : '' }}
        </span>
      </button>
    </div>

    <!-- Actions Section -->
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
import { ref, onMounted } from 'vue';

const audioStore = useAudioStore()
const currentTheme = ref('light')

const changeTheme = (theme) => {
  const root = document.documentElement

  // Remove all existing theme classes
  root.classList.remove('light', 'dark', 'dark-blue', 'dq', 'aero', 'cupertino', 'metro', 'material')

  // Add the new theme class (light theme has no class)
  if (theme !== 'light') {
    root.classList.add(theme)
  }

  localStorage.setItem('theme', theme)
  currentTheme.value = theme
}

const toggleAudioPreview = () => {
  audioStore.setAudioPreview(!audioStore.audioPreview)
}

const toggleRestartSongOnClick = () => {
  audioStore.setRestartSongOnClick(!audioStore.restartSongOnClick)
}

const toggleUnplayableTracks = () => {
  audioStore.setUnplayableTracks(!audioStore.unplayableTracks)
}

const toggleOpenLinks = () => {
  audioStore.setOpenLinks(!audioStore.openLinks)
}

const clearCache = () => {
  localStorage.clear()
  window.location.reload()
}

const showWelcomeModal = () => {
  localStorage.removeItem('welcome-modal-seen')
  window.location.reload()
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  currentTheme.value = savedTheme

  // Initialize theme properly
  const root = document.documentElement

  // Remove all existing theme classes
  root.classList.remove('light', 'dark', 'dark-blue', 'dq', 'aero', 'cupertino', 'metro', 'material')

  // Add the saved theme class (light theme has no class)
  if (savedTheme !== 'light') {
    root.classList.add(savedTheme)
  }
})
</script>

<style scoped>
.settings-display {
  /* Default styling - will be overridden by theme-specific styles */
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.header-icon {
  width: 32px;
  height: 32px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.actions-section {
  margin-bottom: 24px;
}

.action-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.action-text {
  flex: 1;
  text-align: left;
}

.action-status {
  background: rgba(255, 255, 255, 0.1);
  color: #a0a0a0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.action-status.active {
  background: #667eea;
  color: #ffffff;
}

.logout-section {
  margin-top: 24px;
}

:root.metro .settings-display {
  font-family: 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif;
}

:root.metro .settings-header {
  padding: 16px 20px 8px 20px;
}

:root.metro .header-title {
  color: white;
  font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: 24px;
  text-transform: none;
  letter-spacing: normal;
}

:root.metro .header-icon {
  background: transparent;
  border-radius: 0;
  width: 24px;
  height: 24px;
}

:root.metro .header-icon svg {
  color: rgba(255, 255, 255, 0.8);
  width: 18px;
  height: 18px;
}

:root.metro .actions-section {
  padding: 0 20px 16px 20px;
}

:root.metro .action-button {
  background: #1f1f1f;
  border: none;
  border-radius: 0;
  padding: 16px 20px;
  margin-bottom: 8px;
  color: white;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 4px solid transparent;
  width: 100%;
}

:root.metro .action-button:hover {
  background: #2d2d2d;
  border-left-color: #0078d4;
}

:root.metro .action-icon {
  font-size: 18px;
  flex-shrink: 0;
}

:root.metro .action-text {
  flex: 1;
  text-align: left;
}

:root.metro .action-status {
  background: #333333;
  color: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 400;
  text-transform: none;
}

:root.metro .action-status.active {
  background: #0078d4;
  color: white;
}

:root.metro .logout-section {
  padding: 0 20px 20px 20px;
}

/* Cupertino liquid glass theme */
:root.cupertino .settings-display {
  background: linear-gradient(135deg, #e8f0ff 0%, #f8f9fb 40%, #ffe9f3 100%);
}

:root.cupertino .settings-header {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 10px 30px rgba(31, 38, 135, 0.12);
}

:root.cupertino .header-title {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
}

:root.cupertino .header-icon {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

:root.cupertino .header-icon svg {
  color: rgba(0, 0, 0, 0.6);
  width: 18px;
  height: 18px;
}

:root.cupertino .actions-section {
  padding: 0 20px 16px 20px;
}

:root.cupertino .action-button {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.12);
}

:root.cupertino .action-button:hover {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px rgba(31, 38, 135, 0.16);
}

:root.cupertino .action-icon {
  font-size: 18px;
  flex-shrink: 0;
}

:root.cupertino .action-text {
  flex: 1;
  text-align: left;
  font-weight: 500;
}

:root.cupertino .action-status {
  background: rgba(255, 255, 255, 0.55);
  color: rgba(0, 0, 0, 0.6);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: none;
  border: 1px solid rgba(255, 255, 255, 0.7);
}

:root.cupertino .action-status.active {
  background: rgba(255, 255, 255, 0.75);
  color: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.8);
}

:root.cupertino .logout-section {
  padding: 0 20px 20px 20px;
}

/* Cupertino padding adjustments */
:root.cupertino .settings-display {
  padding: 16px 20px 24px 20px;
}

:root.cupertino .settings-header {
  padding: 12px 16px;
  border-radius: 12px;
  margin: 0 0 12px 0;
}

:root.cupertino .actions-section {
  padding: 0 0 12px 0;
}

:root.cupertino .logout-section {
  padding: 0;
  margin-top: 16px;
}
</style>


