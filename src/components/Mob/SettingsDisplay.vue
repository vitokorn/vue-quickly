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
  root.className = theme === 'light' ? '' : theme
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
  changeTheme(savedTheme)
})
</script>


