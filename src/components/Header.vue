<script setup>
import Logout from "./Logout.vue";
import Auth from "./Auth.vue";
import {isAuth} from '../mixins/authMixin'
import {preferred} from "../mixins/prefMixin";
import {ref} from "vue";
import {useQueueStore} from "../stores/queue-store";
import Settings from "./Settings.vue";
import {isMobile} from "../mixins/detectingMobileMixin";

const queueStore = useQueueStore()
const initUserTheme = preferred();
let username = document.cookie.replace(/(?:(?:^|.*;\s*)nickname\s*\=\s*([^;]*).*$)|^.*$/, "$1")
let userTheme = ref(localStorage.getItem('user-theme'))
const mobileVersion = ref(false)
setTheme(initUserTheme)

function setTheme(theme) {
  localStorage.setItem("user-theme", theme);
  userTheme.value = theme;
  document.documentElement.className = theme;
}

window.addEventListener('resize', () => {
  mobileVersion.value = window.innerWidth < 1076;
})
</script>

<template>
  <header class="modern-header">
    <div class="header-container">
      <!-- Logo and Brand -->
      <div class="brand-section">
        <div class="logo-container">
          <img class="logo" src="../assets/logo-small.png" alt="Discover Mobily">
        </div>
        <h1 class="brand-title">Discover Mobily</h1>
      </div>

      <!-- Theme Switcher -->
      <div class="theme-section" :class="mobileVersion || isMobile() ? 'mobile-themes' : 'desktop-themes'">
        <div class="theme-switcher">
          <div class="theme-option">
            <input id="light" type="radio" v-model="userTheme" value="light" @click="setTheme('light')">
            <label for="light" class="theme-label">
              <div class="theme-preview light-theme"></div>
              <span class="theme-name">Light</span>
            </label>
          </div>

          <div class="theme-option">
            <input id="dark" type="radio" v-model="userTheme" value="dark" @click="setTheme('dark')">
            <label for="dark" class="theme-label">
              <div class="theme-preview dark-theme"></div>
              <span class="theme-name">Dark</span>
            </label>
          </div>

          <div class="theme-option">
            <input id="dark-blue" type="radio" v-model="userTheme" value="dark-blue" @click="setTheme('dark-blue')">
            <label for="dark-blue" class="theme-label">
              <div class="theme-preview dark-blue-theme"></div>
              <span class="theme-name">Blue</span>
            </label>
          </div>

          <div class="theme-option">
            <input id="dq" type="radio" v-model="userTheme" value="dq" @click="setTheme('dq')">
            <label for="dq" class="theme-label">
              <div class="theme-preview dq-theme"></div>
              <span class="theme-name">DQ</span>
            </label>
          </div>
        </div>
      </div>

      <!-- User Section -->
      <div class="user-section">
        <div v-if="isAuth()" class="user-greeting">
          <span class="greeting-text">Hello,</span>
          <span class="username">{{ username }}</span>
        </div>

        <div class="user-actions">
          <Settings />
          <Auth v-if="!isAuth()" />

          <!-- Queue Button -->
          <div class="queue-button" @click="queueStore.setQueueModal(true)">
            <div class="queue-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor">
                <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>
              </svg>
            </div>
            <div v-if="queueStore.getQueue" class="queue-badge">{{ queueStore.getQueue }}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
