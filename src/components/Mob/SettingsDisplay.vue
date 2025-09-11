<template>
  <div class="mobile-settings-display">
    <!-- Header -->
    <div class="text-center">
      <div class="profile-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="avatar-icon">
          <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
        </svg>
      </div>
      <h2 class="profile-title">Profile</h2>
      <p class="profile-description">Your profile settings and preferences</p>

    </div>
    <div class="mobile-settings-header">
      <div class="mobile-header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z"/>
        </svg>
      </div>
      <h1 class="mobile-header-title">Audio Settings</h1>
    </div>

    <!-- Audio Settings Section -->
    <div class="mobile-actions-section">
      <button class="mobile-action-button" @click="toggleAudioPreview">
        <span class="mobile-action-icon">🔊</span>
        <span class="mobile-action-text">Audio Preview</span>
        <span class="mobile-action-status" :class="{ active: audioStore.audioPreview }">
          {{ audioStore.audioPreview ? 'ON' : 'OFF' }}
        </span>
      </button>

      <button class="mobile-action-button" @click="toggleRestartSongOnClick">
        <span class="mobile-action-icon">🔄</span>
        <span class="mobile-action-text">Restart song on click</span>
        <span class="mobile-action-status" :class="{ active: audioStore.restartSongOnClick }">
          {{ audioStore.restartSongOnClick ? 'ON' : 'OFF' }}
        </span>
      </button>

      <button class="mobile-action-button" @click="toggleUnplayableTracks">
        <span class="mobile-action-icon">🎵</span>
        <span class="mobile-action-text">Show unplayable tracks</span>
        <span class="mobile-action-status" :class="{ active: audioStore.unplayableTracks }">
          {{ audioStore.unplayableTracks ? 'ON' : 'OFF' }}
        </span>
      </button>

      <button class="mobile-action-button" @click="toggleOpenLinks">
        <span class="mobile-action-icon">🔗</span>
        <span class="mobile-action-text">Open links in new tab</span>
        <span class="mobile-action-status" :class="{ active: audioStore.openLinks }">
          {{ audioStore.openLinks ? 'ON' : 'OFF' }}
        </span>
      </button>
    </div>

    <!-- Theme Section -->
    <div class="mobile-settings-header">
      <div class="mobile-header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>
        </svg>
      </div>
      <h1 class="mobile-header-title">Theme</h1>
    </div>
    <div class="mobile-actions-section">
      <button class="mobile-action-button" @click="changeTheme('light')">
        <span class="mobile-action-icon">☀️</span>
        <span class="mobile-action-text">Light Theme</span>
        <span class="mobile-action-status" :class="{ active: currentTheme === 'light' }">
          {{ currentTheme === 'light' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="mobile-action-button" @click="changeTheme('dark')">
        <span class="mobile-action-icon">🌙</span>
        <span class="mobile-action-text">Dark Theme</span>
        <span class="mobile-action-status" :class="{ active: currentTheme === 'dark' }">
          {{ currentTheme === 'dark' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="mobile-action-button" @click="changeTheme('dark-blue')">
        <span class="mobile-action-icon">🌊</span>
        <span class="mobile-action-text">Dark Blue Theme</span>
        <span class="mobile-action-status" :class="{ active: currentTheme === 'dark-blue' }">
          {{ currentTheme === 'dark-blue' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="mobile-action-button" @click="changeTheme('dq')">
        <span class="mobile-action-icon">🎨</span>
        <span class="mobile-action-text">DQ Theme</span>
        <span class="mobile-action-status" :class="{ active: currentTheme === 'dq' }">
          {{ currentTheme === 'dq' ? 'ACTIVE' : '' }}
        </span>
      </button>
    </div>

    <!-- Display Settings Section -->
    <div class="mobile-settings-header">
      <div class="mobile-header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
        </svg>
      </div>
      <h1 class="mobile-header-title">Display Settings</h1>
    </div>
    <div class="mobile-actions-section">
      <button class="mobile-action-button" @click="toggleViewMode">
        <span class="mobile-action-icon">📱</span>
        <span class="mobile-action-text">View Mode</span>
        <span class="mobile-action-status" :class="{ active: preferencesStore.viewMode === 'grid' }">
          {{ preferencesStore.viewMode === 'list' ? 'LIST' : 'GRID' }}
        </span>
      </button>
    </div>

    <!-- Service Selection Section -->
    <div class="mobile-settings-header">
      <div class="mobile-header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 3.75a8.25 8.25 0 110 16.5 8.25 8.25 0 010-16.5z"/>
        </svg>
      </div>
      <h1 class="mobile-header-title">Music Service</h1>
    </div>
    <div class="mobile-actions-section">
      <button class="mobile-action-button" @click="switchToService('spotify')">
        <span class="mobile-action-icon">🎵</span>
        <span class="mobile-action-text">Spotify</span>
        <span class="mobile-action-status" :class="{ active: currentServiceType === 'spotify' }">
          {{ currentServiceType === 'spotify' ? 'ACTIVE' : '' }}
        </span>
      </button>

      <button class="mobile-action-button" @click="switchToService('deezer')">
        <span class="mobile-action-icon">🎧</span>
        <span class="mobile-action-text">Deezer</span>
        <span class="mobile-action-status" :class="{ active: currentServiceType === 'deezer' }">
          {{ currentServiceType === 'deezer' ? 'ACTIVE' : '' }}
        </span>
      </button>
    </div>

    <!-- Actions Section -->
    <div class="mobile-settings-header">
      <div class="mobile-header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z"/>
        </svg>
      </div>
      <h1 class="mobile-header-title">Actions</h1>
    </div>
    <!-- Actions Section -->
    <div class="mobile-actions-section">

      <button class="mobile-action-button" @click="clearCache">
        <span class="mobile-action-icon">🗑️</span>
        <span class="mobile-action-text">Clear Cache</span>
      </button>

      <button class="mobile-action-button" @click="showWelcomeModal">
        <span class="mobile-action-icon">👋</span>
        <span class="mobile-action-text">Show Welcome Modal</span>
      </button>
    </div>

    <!-- Logout Section -->
    <div class="mobile-logout-section">
      <Logout />
    </div>
  </div>
</template>

<script setup>
import Logout from "../Logout.vue";
import { useAudioStore } from "../../stores/audio-store.js";
import { usePreferencesStore } from "../../stores/preferences-store.js";
import { useMusicStore } from "../../stores/music-store.js";
import { ref, onMounted } from 'vue';
import { storeToRefs } from "pinia";

const audioStore = useAudioStore()
const preferencesStore = usePreferencesStore()
const musicStore = useMusicStore()
const currentTheme = ref('light')

// Get current service type
const { currentServiceType } = storeToRefs(musicStore)

const changeTheme = (theme) => {
  const root = document.documentElement
  root.className = theme === 'light' ? '' : theme
  localStorage.setItem('user-theme', theme)
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

const toggleViewMode = () => {
  preferencesStore.toggleViewMode()
}

const clearCache = () => {
  localStorage.clear()
  window.location.reload()
}

const showWelcomeModal = () => {
  localStorage.removeItem('welcome-modal-seen')
  window.location.reload()
}

const switchToService = async (serviceType) => {
  try {
    await musicStore.switchService(serviceType)
    console.log(`Switched to ${serviceType}`)
  } catch (error) {
    console.error('Failed to switch service:', error)
    alert('Failed to switch service. Please try again.')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('user-theme') || 'light'
  currentTheme.value = savedTheme
  changeTheme(savedTheme)
})
</script>


