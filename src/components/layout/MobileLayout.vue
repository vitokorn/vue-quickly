<template>
  <div class="mobile-layout">
    <!-- Header Section -->
    <header class="mobile-header">
      <div class="header-content">
        <!-- Hamburger Menu Button -->
        <button class="hamburger-button" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="hamburger-icon">
            <path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="header-text">
          <h1 class="app-title">
            <img class="logo" src="../../assets/logo-small.png" alt="Discover Mobily">
            <span class="ps-2">
            Discover Mobily
            </span>
          </h1>
          <p class="app-subtitle">Your music discovery companion</p>
        </div>
      </div>
    </header>

    <!-- Left Sidebar -->
    <aside class="mobile-sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <nav class="sidebar-navigation">
        <!-- Your Music -->
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Your Music</h3>
          <button
              class="sidebar-nav-item"
              :class="{ active: currentTab === 1 }"
              @click="setCurrentTab(1); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path fill-rule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
            <span class="sidebar-nav-label">Playlists</span>
          </button>
          <button
              class="sidebar-nav-item"
              :class="{ active: currentTab === 2 }"
              @click="setCurrentTab(2); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
            </svg>
            <span class="sidebar-nav-label">Top Artists</span>
          </button>
          <button
              class="sidebar-nav-item"
              :class="{ active: currentTab === 3 }"
              @click="setCurrentTab(3); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
            <span class="sidebar-nav-label">Top Tracks</span>
          </button>
        </div>
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Library</h3>

          <button
            class="sidebar-nav-item"
            :class="{ active: currentTab === 4 }"
            @click="setCurrentTab(4); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
              <path d="M20.25 11.25v5.533c0 1.036-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 013.75 16.783V11.25H2.25a.75.75 0 010-1.5h1.5V6.75c0-1.036.84-1.875 1.875-1.875h.75a.75.75 0 010 1.5h-.75a.375.375 0 00-.375.375v3.375h1.5a.75.75 0 010 1.5H3.75v5.533a.375.375 0 00.375.375h12.75a.375.375 0 00.375-.375V11.25h1.5a.75.75 0 010-1.5h-1.5V6.75a.375.375 0 00-.375-.375h-.75a.75.75 0 010-1.5h.75c1.036 0 1.875.84 1.875 1.875v3.375h1.5a.75.75 0 010 1.5z" />
            </svg>
            <span class="sidebar-nav-label">Saved Albums</span>
          </button>

          <button
            class="sidebar-nav-item"
            :class="{ active: currentTab === 5 }"
            @click="setCurrentTab(5); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
            <span class="sidebar-nav-label">Saved Tracks</span>
          </button>

          <button
            class="sidebar-nav-item"
            :class="{ active: currentTab === 6 }"
            @click="setCurrentTab(6); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
            </svg>
            <span class="sidebar-nav-label">Followed Artists</span>
          </button>
        </div>

        <!-- Discover -->
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Discover</h3>
          <button
            class="sidebar-nav-item"
            :class="{ active: currentTab === 7 }"
            @click="setCurrentTab(7); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
            </svg>
            <span class="sidebar-nav-label">New Releases</span>
          </button>
          <button
              class="sidebar-nav-item"
              :class="{ active: currentTab === 8 }"
              @click="setCurrentTab(8); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
            </svg>
            <span class="sidebar-nav-label">Spotify Playlists</span>
          </button>
        </div>

        <!-- Settings -->
        <div class="sidebar-section">
          <h3 class="sidebar-section-title">Settings</h3>
          <button
            class="sidebar-nav-item"
            :class="{ active: currentTab === 12 }"
            @click="setCurrentTab(12); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
            </svg>
            <span class="sidebar-nav-label">Queue</span>
          </button>
          <button
              class="sidebar-nav-item"
              :class="{ active: currentTab === 11 }"
              @click="setCurrentTab(11); closeSidebar()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-nav-icon">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
            <span class="sidebar-nav-label">Profile</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Overlay for sidebar -->
    <div class="sidebar-overlay" :class="{ 'overlay-active': isSidebarOpen }" @click="closeSidebar"></div>

    <!-- Main Content Area -->
    <main class="mobile-main">

      <div v-if="currentTab === 1">
        <PlaylistsPage />
      </div>

      <div v-else-if="currentTab === 2">
        <MobileTopArtists />
      </div>

      <div v-else-if="currentTab === 3">
        <MobileTopTracks />
      </div>

      <div v-else-if="currentTab === 4">
        <MobileSavedAlbums />
      </div>

      <div v-else-if="currentTab === 5">
        <MobileSavedTracks />
      </div>

      <div v-else-if="currentTab === 6">
        <MobileFollowedArtists />
      </div>

      <div v-else-if="currentTab === 7">
        <NewReleasesPage />
      </div>

      <div v-else-if="currentTab === 8">
        <SpotifyPlaylistsPage />
      </div>

      <div v-if="currentTab === 11">
        <SettingsDisplay/>
      </div>
      <div v-else-if="currentTab === 12">
        <slot name="queue">
          <QueueDisplay />
        </slot>
      </div>
    </main>

    <RecTrackM :num="currentTab"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SettingsDisplay from '../Mob/SettingsDisplay.vue'
import QueueDisplay from "../Mob/QueueDisplay.vue"
import PlaylistsPage from "../Mob/PlaylistsPage.vue"
import NewReleasesPage from "../Mob/NewReleasesPage.vue"
import RecTrackM from "../Mob/RecTrackM.vue";
import SpotifyPlaylistsPage from "../Mob/SpotifyPlaylistsPage.vue";
import MobileTopArtists from "../Mob/MobileTopArtists.vue";
import MobileTopTracks from "../Mob/MobileTopTracks.vue";
import MobileSavedAlbums from "../Mob/MobileSavedAlbums.vue";
import MobileFollowedArtists from "../Mob/MobileFollowedArtists.vue";
import MobileSavedTracks from "../Mob/MobileSavedTracks.vue";

// Reactive state
const currentTab = ref('profile')
const searchQuery = ref('')
const isSidebarOpen = ref(false)

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

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const handleSearch = () => {
  // Emit search event for parent components
  emit('search', searchQuery.value)
}

// Define emits
const emit = defineEmits(['search'])
</script>

<style scoped>
/* Styles moved to mobile.css */
</style>
