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

const showWelcomeModal = () => {
  localStorage.removeItem('welcome-modal-seen')
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
        
        <button class="action-button" @click="showWelcomeModal">
          <span class="action-icon">👋</span>
          <span class="action-text">Show Welcome Modal</span>
        </button>
      </div>

      <div class="settings-section">
        <Logout />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
