<template>
  <div class="mobile-layout">
    <!-- Header Section -->
    <header class="mobile-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="app-title">
            <img class="logo" src="../../assets/logo-small.png" alt="Discover Mobily">
            <span class="ps-2">
            Discover Mobily
            </span>
          </h1>
          <p class="app-subtitle">Your music discovery companion</p>
        </div>
        <div class="header-actions">
          <button class="queue-button" @click="showQueue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="queue-icon">
              <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
            </svg>
          </button>
          <button class="profile-button" @click="showProfile">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="profile-icon">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="mobile-main">
      <div v-if="currentTab === 'profile'" class="profile-section">
        <div class="profile-content">
          <div class="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="avatar-icon">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="profile-title">Profile</h2>
          <p class="profile-description">Your profile settings and preferences</p>

          <!-- Settings Component -->
          <div class="settings-wrapper">
            <SettingsDisplay />
          </div>
        </div>
      </div>

      <div v-else-if="currentTab === 'home'">

        <slot name="home">
          <HomePage/>
        </slot>
      </div>

      <div v-else-if="currentTab === 'discover'">
        <slot name="discover">
          <DiscoverPage />
        </slot>
      </div>

      <div v-else-if="currentTab === 'library'">
        <slot name="library">
          <LibraryPage />
        </slot>
      </div>

      <div v-else-if="currentTab === 'queue'">
        <slot name="queue">
          <QueueDisplay />
        </slot>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-navigation">
      <button
        class="nav-item"
        :class="{ active: currentTab === 'home' }"
        @click="setCurrentTab('home')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
        <span class="nav-label">Home</span>
      </button>

      <button
        class="nav-item"
        :class="{ active: currentTab === 'discover' }"
        @click="setCurrentTab('discover')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
          <path fill-rule="evenodd" d="M8.25 3.75a4.5 4.5 0 117.5 2.25 7.5 7.5 0 012.25 4.5 4.5 4.5 0 11-8.998 3.14A7.5 7.5 0 018.25 3.75zm.75 12l-3-3m0 0l3-3m-3 3H12a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-2.25 2.25H9a2.25 2.25 0 01-2.25-2.25v-4.5A2.25 2.25 0 019 9h2.25z" clip-rule="evenodd" />
        </svg>
        <span class="nav-label">Discover</span>
      </button>

      <button
        class="nav-item"
        :class="{ active: currentTab === 'library' }"
        @click="setCurrentTab('library')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
          <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
        </svg>
        <span class="nav-label">Library</span>
      </button>

      <button
        class="nav-item"
        :class="{ active: currentTab === 'profile' }"
        @click="setCurrentTab('profile')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="nav-icon">
          <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
        </svg>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SettingsDisplay from '../Mob/SettingsDisplay.vue'
import HomePage from "../Mob/HomePage.vue"
import DiscoverPage from "../Mob/DiscoverPage.vue"
import LibraryPage from "../Mob/LibraryPage.vue"
import QueueDisplay from "../Mob/QueueDisplay.vue"

// Reactive state
const currentTab = ref('profile')
const searchQuery = ref('')

// Methods
const setCurrentTab = (tab) => {
  currentTab.value = tab
}

const showProfile = () => {
  setCurrentTab('profile')
}

const showQueue = () => {
  setCurrentTab('queue')
}

const handleSearch = () => {
  // Emit search event for parent components
  emit('search', searchQuery.value)
}

// Define emits
const emit = defineEmits(['search'])
</script>

<style scoped>
.mobile-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Modern Header Styles */
.mobile-header {
  padding: 24px 20px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.header-text {
  flex: 1;
}

.app-title {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0 0 8px 0;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  border-radius: 8px;
}

.app-subtitle {
  font-size: 14px;
  color: var(--search-color);
  margin: 0;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.queue-button,
.profile-button {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: var(--title-color);
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.queue-button:hover,
.profile-button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.queue-icon,
.profile-icon {
  width: 20px;
  height: 20px;
}

/* Main Content Area */
.mobile-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Profile Section */
.profile-section {
  max-width: 600px;
  margin: 0 auto;
}

.profile-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.avatar-icon {
  width: 40px;
  height: 40px;
  color: var(--search-color);
  opacity: 0.6;
}

.profile-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0 0 8px 0;
}

.profile-description {
  font-size: 16px;
  color: var(--search-color);
  margin: 0 0 24px 0;
  opacity: 0.8;
}

.settings-wrapper {
  margin-top: 24px;
}

/* Section Styles */
.home-section,
.discover-section,
.library-section,
.queue-section {
  max-width: 600px;
  margin: 0 auto;
}

/* Modern Bottom Navigation */
.bottom-navigation {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--search-color);
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 12px;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.nav-item.active {
  color: var(--active-tab);
  background: rgba(240, 55, 165, 0.1);
}

.nav-icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .mobile-header {
    padding: 20px 16px 16px;
  }

  .app-title {
    font-size: 24px;
  }

  .logo {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }

  .app-subtitle {
    font-size: 13px;
  }

  .header-actions {
    gap: 8px;
  }

  .queue-button,
  .profile-button {
    width: 40px;
    height: 40px;
    padding: 10px;
  }

  .queue-icon,
  .profile-icon {
    width: 18px;
    height: 18px;
  }

  .mobile-main {
    padding: 16px;
  }

  .profile-content {
    padding: 24px 20px;
  }

  .profile-avatar {
    width: 70px;
    height: 70px;
  }

  .avatar-icon {
    width: 35px;
    height: 35px;
  }

  .profile-title {
    font-size: 20px;
  }

  .profile-description {
    font-size: 14px;
  }

  .bottom-navigation {
    padding: 10px 16px;
  }

  .nav-item {
    padding: 6px 8px;
    font-size: 11px;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }

  .nav-label {
    font-size: 10px;
  }
}

/* Dark theme support */
:root.dark .mobile-layout {
  background: linear-gradient(135deg, #0b1222 0%, #1a2332 100%);
}

:root.dark .mobile-header {
  background: rgba(42, 46, 47, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .queue-button,
:root.dark .profile-button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark .queue-button:hover,
:root.dark .profile-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark .profile-content {
  background: rgba(42, 46, 47, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .profile-avatar {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .bottom-navigation {
  background: rgba(42, 46, 47, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .nav-item {
  color: var(--search-color);
}

:root.dark .nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .nav-item.active {
  background: rgba(240, 55, 165, 0.2);
}

/* Dark-blue theme support */
:root.dark-blue .mobile-layout {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

:root.dark-blue .mobile-header {
  background: rgba(30, 41, 59, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .queue-button,
:root.dark-blue .profile-button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dark-blue .queue-button:hover,
:root.dark-blue .profile-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dark-blue .profile-content {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .profile-avatar {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-blue .bottom-navigation {
  background: rgba(30, 41, 59, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-blue .nav-item {
  color: var(--search-color);
}

:root.dark-blue .nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-blue .nav-item.active {
  background: rgba(240, 55, 165, 0.2);
}

/* DQ theme support */
:root.dq .mobile-layout {
  background: linear-gradient(135deg, #1C1A2D 0%, var(--main-color) 100%);
}

:root.dq .mobile-header {
  background: rgba(28, 26, 45, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .queue-button,
:root.dq .profile-button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--title-color);
}

:root.dq .queue-button:hover,
:root.dq .profile-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

:root.dq .profile-content {
  background: rgba(28, 26, 45, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .profile-avatar {
  background: rgba(255, 255, 255, 0.1);
}

:root.dq .bottom-navigation {
  background: rgba(28, 26, 45, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dq .nav-item {
  color: var(--search-color);
}

:root.dq .nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dq .nav-item.active {
  background: rgba(240, 55, 165, 0.2);
}
</style>
