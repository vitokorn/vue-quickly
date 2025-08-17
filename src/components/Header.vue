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
.modern-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.logo-container {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--title-color);
  margin: 0;
  background: linear-gradient(135deg, var(--logo-color), #e91e63);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Theme Section */
.theme-section {
  display: flex;
  align-items: center;
}

.theme-switcher {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 4px;
}

.theme-option {
  position: relative;
}

.theme-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.theme-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.theme-label:hover {
  background: rgba(240, 55, 165, 0.1);
}

.theme-option input[type="radio"]:checked + .theme-label {
  background: var(--active-tab);
  color: white;
  box-shadow: 0 2px 8px rgba(240, 55, 165, 0.3);
}

.theme-preview {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.theme-option input[type="radio"]:checked + .theme-label .theme-preview {
  border-color: white;
}

.light-theme { background: white; }
.dark-theme { background: #181a1b; }
.dark-blue-theme { background: #001331; }
.dq-theme { background: #3f3d58; }

.theme-name {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.user-greeting {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.greeting-text {
  font-size: 12px;
  color: var(--search-color);
  opacity: 0.7;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: var(--title-color);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Queue Button */
.queue-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}

.queue-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 55, 165, 0.4);
}

.queue-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.queue-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Mobile Responsive */
.mobile-themes .theme-switcher {
  flex-wrap: wrap;
  gap: 4px;
}

.mobile-themes .theme-label {
  padding: 6px 8px;
  min-width: 50px;
}

.mobile-themes .theme-name {
  font-size: 10px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 12px 16px;
    gap: 16px;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .logo-container {
    width: 40px;
    height: 40px;
  }

  .user-greeting {
    display: none;
  }

  .theme-section {
    order: 3;
  }

  .user-section {
    order: 2;
  }
}

@media (max-width: 480px) {
  .header-container {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .brand-section {
    order: 1;
  }

  .user-section {
    order: 2;
    width: 100%;
    justify-content: center;
  }

  .theme-section {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .theme-switcher {
    width: 100%;
    justify-content: center;
  }
}

/* Dark mode support */
:root.dark .modern-header {
  background: rgba(34, 36, 38, 0.95);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:root.dark .theme-switcher {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .theme-label:hover {
  background: rgba(240, 55, 165, 0.2);
}

:root.dark .theme-preview {
  border-color: rgba(255, 255, 255, 0.2);
}
:root.dq .modern-header {
  background: #2c2a3d;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* Blue theme support */
:root.dark-blue .modern-header {
  background: rgba(18, 33, 58, 0.95);
  border-bottom-color: rgba(120, 160, 220, 0.12);
}

:root.dark-blue .theme-switcher {
  background: rgba(43, 108, 176, 0.10);
}

:root.dark-blue .theme-label:hover {
  background: rgba(43, 108, 176, 0.18);
}

:root.dark-blue .theme-preview {
  border-color: rgba(120, 160, 220, 0.3);
}
</style>
