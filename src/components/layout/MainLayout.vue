<script setup>
import {computed, ref, watch, onMounted} from 'vue'
import {useMusicStore} from '../../stores/music-store'
import {useAudioStore} from '../../stores/audio-store'
import {useQueueStore} from '../../stores/queue-store'
import {useDeeperStore} from '../../stores/deeper-store'
import {musicServiceManager} from '../../services/MusicServiceManager'
import {storeToRefs} from 'pinia'
import {useSorting} from '../../composables/useSorting.js'
import {useSelection} from '../../composables/useSelection.js'
import {useFiltering} from '../../composables/useFiltering.js'
import {artistUtils} from '../../utils/artistUtils.js'
import RecTrack from '../RecTrack.vue'
import Loader from '../Loader.vue'
import Footer from '../Footer.vue'
import ModernTabs from '../common/ModernTabs.vue'
import GlobalPreloader from '../common/GlobalPreloader.vue'
import PlaylistSelector from '../PlaylistSelector.vue'
import SearchCategory from '../SearchCategory.vue'
import WelcomeModal from '../WelcomeModal.vue'
import DeezerWelcomeModal from '../DeezerWelcomeModal.vue'
import ServiceSelector from '../ServiceSelector.vue'
import Header from "../Header.vue";
import QueueModal from "../QueueModal.vue";
import TopTracks from '../TopTracks.vue'
import TopArtists from '../TopArtists.vue'
import SavedAlbums from '../SavedAlbums.vue'
import SavedTracks from '../SavedTracks.vue'
import FollowedArtists from '../FollowedArtists.vue'
import NewReleases from '../NewReleases.vue'
import Categories from '../Categories.vue'
// Stores
const musicStore = useMusicStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Reactive store properties
const { currentServiceType } = storeToRefs(musicStore)

// Composables
const {
  selectedItem,
  selectedTopMenu,
  selectedPersonalPlaylist,
  selectedSpotifyPlaylist,
  selectedGenrePlaylist,
  setSelectedItem,
  setSelectedTopMenu
} = useSelection()
const {search} = useFiltering()

// Local state
const showWelcomeModal = ref(localStorage.getItem('welcome-modal-seen') !== 'true')
const showDeezerWelcomeModal = ref(false)
const showServiceSelector = ref(false)

// For testing - you can temporarily set this to true to see the modal
// const showDeezerWelcomeModal = ref(true)

// Watch for service changes to show Deezer welcome modal
watch(currentServiceType, (newService) => {
  console.log('Service changed to:', newService)
  if (newService === 'deezer') {
    const deezerUserId = localStorage.getItem('deezer-user-id')
    console.log('Deezer User ID in localStorage:', deezerUserId)
    if (!deezerUserId) {
      console.log('Showing Deezer welcome modal')
      showDeezerWelcomeModal.value = true
    } else {
      console.log('Deezer User ID found, not showing modal')
    }

    // Redirect from Top Artists (2) or Top Tracks (3) to Your Playlists (1) when switching to Deezer
    if (selectedTopMenu.value === 2 || selectedTopMenu.value === 3) {
      console.log('Redirecting from Top Artists/Tracks to Your Playlists for Deezer')
      setSelectedTopMenu(1)
    }
  }
}, { immediate: true })


// Event handlers
const handleTrackClick = async (track, event) => {
  // Prevent multiple clicks when globally loading
  if (deeperStore.getIsGloballyLoading) {
    console.log('Track click blocked - global loading in progress')
    return
  }

  setSelectedItem(track.id)
  const sectionName = getSectionName(selectedTopMenu.value)
  await deeperStore.getTrackDetails(track, sectionName)
  if (selectedTopMenu.value in [1, 8]) {
    queueStore.addToQueue(track.track)
  } else {
    queueStore.addToQueue(track)
  }
}

const handleTrackHover = (event) => {
  audioStore.handleAudioHover(event)
}

const handleTrackLeave = (event) => {
  audioStore.handleAudioLeave(event)
}

const handleArtistClick = async (artist, event) => {
  // Prevent multiple clicks when globally loading
  if (deeperStore.getIsGloballyLoading) {
    console.log('Artist click blocked - global loading in progress')
    return
  }

  setSelectedItem(artist.id)
  const sectionName = getSectionName(selectedTopMenu.value)
  await deeperStore.getArtistDetails(artist, sectionName)
}

const handleArtistHover = (event) => {
  audioStore.handleAudioHover(event)
}

const handleArtistLeave = (event) => {
  audioStore.handleAudioLeave(event)
}

async function handlePlaylistClick(playlist, event) {
  const sectionName = getSectionName(selectedTopMenu.value)
  await deeperStore.getPlaylistDetails(playlist, sectionName)
}

async function handleGenreClick(genrePlaylist, event) {
  if (deeperStore.getIsGloballyLoading) {
    console.log('Genre playlist click blocked - global loading in progress')
    return
  }

  // Load genre playlist details
  const sectionName = getSectionName(selectedTopMenu.value)
  await deeperStore.getGenreDetails(genrePlaylist, sectionName)
}

const getSectionName = (num) => {
  switch (num) {
    case 1:
      return 'yourPlaylists'
    case 2:
      return 'topArtists'
    case 3:
      return 'topTracks'
    case 4:
      return 'savedAlbums'
    case 5:
      return 'savedTracks'
    case 6:
      return 'followedArtists'
    case 7:
      return 'newReleases'
    case 8:
      return 'spotifyPlaylists'
    case 9:
      return 'categories'
    case 11:
      return 'genres'
    case 10:
      return 'search'
    default:
      return 'search'
  }
}

const polygon = (item, d, num) => {
  const sectionName = getSectionName(num)
  deeperStore.clearSection(sectionName)
  let tt = item
  tt.type = 'deepertracks'
  deeperStore.addToSection(sectionName, tt)
  console.log(item)
  console.log(d)
  console.log(num)
}

const polygon2 = (id) => {
  console.log(id)
}

const findPos = (obj) => {
  let curtop = 0
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop
    } while (obj == obj.offsetParent)
    return [curtop]
  }
}

// Tab click handler
const handleTabClick = async (tabNumber, event) => {
  // Prevent event bubbling
  event.stopPropagation()

  // Set the selected menu
  setSelectedTopMenu(tabNumber)

  // Handle specific tab logic
  try {
    switch (tabNumber) {
      case 1:
        deeperStore.clearSection('yourPlaylists')
        if (!musicStore.getPlaylists || musicStore.getPlaylists.length === 0) {
          await musicStore.fetchPlaylists(0)
        }
        break
      case 2:
        deeperStore.clearSection('topArtists')
        musicStore.setSelectedArtistsRange(1)
        if (!musicStore.getTopArtistsShort || musicStore.getTopArtistsShort.length === 0) {
          await musicStore.fetchTopArtists('short_term')
        }
        break
      case 3:
        deeperStore.clearSection('topTracks')
        musicStore.setSelectedTracksRange(1)
        if (!musicStore.getTopTracksShort || musicStore.getTopTracksShort.length === 0) {
          await musicStore.fetchTopTracks('short_term')
        }
        break
      case 4:
        deeperStore.clearSection('savedAlbums')
        if (!musicStore.getSavedAlbums || musicStore.getSavedAlbums.length === 0) {
          await musicStore.fetchSavedAlbums(0)
        }
        break
      case 5:
        deeperStore.clearSection('savedTracks')
        if (!musicStore.getSavedTracks || musicStore.getSavedTracks.length === 0) {
          await musicStore.fetchSavedTracks(0)
        }
        break
      case 6:
        deeperStore.clearSection('followedArtists')
        if (!musicStore.getFollowedArtists || musicStore.getFollowedArtists.length === 0) {
          await musicStore.fetchFollowedArtists()
        }
        break
      case 7:
        deeperStore.clearSection('newReleases')
        if (!musicStore.getNewReleases || musicStore.getNewReleases.length === 0) {
          await musicStore.fetchNewReleases(0)
        }
        break
      case 8:
        deeperStore.clearSection('spotifyPlaylists')
        if (!musicStore.getSpotifyPlaylists || musicStore.getSpotifyPlaylists.length === 0) {
          await musicStore.fetchSpotifyPlaylists(0)
        }
        break
      case 9:
        deeperStore.clearSection('categories')
        // Categories will be loaded by the Categories component
        break
      case 11:
        // Load genre playlists through the music store
        if (!musicStore.getGenrePlaylists || musicStore.getGenrePlaylists.length === 0) {
          await musicStore.fetchGenrePlaylists(0)
        }
        break
    }
  } catch (error) {
    console.error('Failed to fetch data for tab:', tabNumber, error)
  }
}

// Search handler
const handleSearch = (event) => {
  selectedTopMenu.value = 10
  musicStore.search(event.target.value)
}

const handleSearchClick = async (item, type) => {
  deeperStore.sections['search'] = [];
  if (type === 'song') {
    setSelectedItem('song' + item.id);
    await deeperStore.getTrackDetails(item, 'search')
  } else if (type === 'artist') {
    setSelectedItem('artist' + item.id);
    await deeperStore.getArtistDetails(item, 'search')
  } else if (type === 'album') {
    setSelectedItem('album' + item.id);
    await deeperStore.getAlbumDetails(item, 'search')
  } else if (type === 'playlist') {
    setSelectedItem('playlist' + item.id);
    await deeperStore.getPlaylistDetails(item, 'search')
  }
}

// Welcome modal handlers
const handleCloseWelcomeModal = () => {
  showWelcomeModal.value = false
  localStorage.setItem('welcome-modal-seen', 'true')
}

const handleCloseDeezerWelcomeModal = () => {
  showDeezerWelcomeModal.value = false
}

const handleDeezerUserSaved = (userData) => {
  console.log('Deezer user saved:', userData)
  // The modal will close automatically after success
}

const handleOpenServiceSelector = () => {
  showServiceSelector.value = true
}
</script>

<template>
  <Header/>
  <QueueModal/>
  <div class="main-layout">
    <!-- Welcome Modal -->
    <WelcomeModal
        :is-visible="showWelcomeModal"
        @close="handleCloseWelcomeModal"
    />

    <!-- Deezer Welcome Modal -->
    <DeezerWelcomeModal
        :is-visible="showDeezerWelcomeModal"
        @close="handleCloseDeezerWelcomeModal"
        @user-saved="handleDeezerUserSaved"
    />

    <!-- Service Selector Modal -->
    <ServiceSelector
        :is-visible="showServiceSelector"
        @close="showServiceSelector = false"
    />

    <!-- Main content -->
    <div class="content-wrapper">
      <!-- Top menu navigation -->
      <ModernTabs
          :selected-tab="selectedTopMenu"
          :search-query="search"
          @tab-click="handleTabClick"
          @search="handleSearch"
      />

      <!-- Content sections -->
      <div class="modern-content">
        <div class="content-container">
          <!-- Personal Playlists Section -->
          <div v-if="selectedTopMenu === 1">
            <div id="yourplaylists" class="flex-stretch">
              <Loader v-if="musicStore.isLoading"/>
              <PlaylistSelector
                  :playlists="musicStore.getPlaylists"
                  :selected-playlist="selectedPersonalPlaylist"
                  title="Your Personal Playlists"
                  placeholder="Search personal playlists..."
                  @playlist-select="handlePlaylistClick"
              />
            </div>
          </div>

          <!-- Top Artists Section -->
          <div v-if="selectedTopMenu === 2 && currentServiceType !== 'deezer'">
            <TopArtists
                :selected-top-menu="selectedTopMenu"
                @artist-click="handleArtistClick"
                @artist-hover="handleArtistHover"
                @artist-leave="handleArtistLeave"
            />
          </div>

          <!-- Top Tracks Section -->
          <div v-if="selectedTopMenu === 3 && currentServiceType !== 'deezer'">
            <TopTracks
                :selected-top-menu="selectedTopMenu"
                @track-click="handleTrackClick"
                @track-hover="handleTrackHover"
                @track-leave="handleTrackLeave"
            />
          </div>

          <!-- Saved Albums Section -->
          <div v-if="selectedTopMenu === 4">
            <SavedAlbums
                :selected-top-menu="selectedTopMenu"
                @album-click="async (album, event) => { if (deeperStore.getIsGloballyLoading) return; setSelectedItem('4' + album.id); await deeperStore.getAlbumDetails(album, 'savedAlbums') }"
            />
          </div>

          <!-- Saved Tracks Section -->
          <div v-if="selectedTopMenu === 5">
            <SavedTracks
                :selected-top-menu="selectedTopMenu"
                @track-click="async (track, event) => { if (deeperStore.getIsGloballyLoading) return; setSelectedItem('5' + track.id); await deeperStore.getTrackDetails(track, 'savedTracks'); queueStore.addToQueue(track) }"
                @track-hover="handleTrackHover"
                @track-leave="handleTrackLeave"
            />
          </div>

          <!-- Followed Artists Section -->
          <div v-if="selectedTopMenu === 6">
            <FollowedArtists
                :selected-top-menu="selectedTopMenu"
                @artist-click="handleArtistClick"
                @artist-hover="handleArtistHover"
                @artist-leave="handleArtistLeave"
            />
          </div>

          <!-- New Releases Section -->
          <div v-if="selectedTopMenu === 7">
            <NewReleases
                :selected-top-menu="selectedTopMenu"
                @album-click="async (album, event) => { if (deeperStore.getIsGloballyLoading) return; setSelectedItem('7' + album.id); await deeperStore.getAlbumDetails(album, 'newReleases') }"
                @album-hover="handleTrackHover"
                @album-leave="handleTrackLeave"
            />
          </div>

          <!-- Spotify Playlists Section -->
          <div v-if="selectedTopMenu === 8">
            <Loader v-if="musicStore.isLoading"/>
            <div id="sptplaylists" class="flex-stretch" v-show="selectedTopMenu===8">
              <PlaylistSelector
                  :playlists="musicStore.getSpotifyPlaylists"
                  :selected-playlist="selectedSpotifyPlaylist"
                  :title="currentServiceType.charAt(0).toUpperCase() + currentServiceType.slice(1) + ' Playlists'"
                  placeholder="Search Spotify playlists..."
                  @playlist-select="handlePlaylistClick"
              />
            </div>
          </div>

          <!-- Categories Section -->
          <div v-if="selectedTopMenu === 9">
            <Categories />
          </div>

          <!-- Genres Section -->
          <div v-if="selectedTopMenu === 11">
            <Loader v-if="musicStore.isLoading"/>
            <div v-show="!musicStore.isLoading" class="flex-stretch">
              <PlaylistSelector
                :playlists="musicStore.getGenrePlaylists"
                :selected-playlist="selectedGenrePlaylist"
                title="Genre Playlists"
                placeholder="Search genre playlists..."
                @playlist-select="handleGenreClick"
              />
            </div>
          </div>

          <!-- Search Section -->
          <div v-if="selectedTopMenu === 10" class="search-section">
            <Loader v-if="musicStore.isLoading"/>
            <div class="search-header">
              <h2 class="search-title">{{ musicStore.searchInput }}</h2>
            </div>
            <div class="search-grid">
              <SearchCategory
                  title="Songs"
                  :items="musicStore.getSearchTracks"
                  type="song"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; await handleSearchClick(item, 'song') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Artists"
                  :items="musicStore.getSearchArtists"
                  type="artist"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; await handleSearchClick(item, 'artist') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Albums"
                  :items="musicStore.getSearchAlbums"
                  type="album"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; await handleSearchClick(item, 'album')}"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Playlists"
                  :items="musicStore.getSearchPlaylists"
                  type="playlist"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; await handleSearchClick(item, 'playlist') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
            </div>
          </div>
        </div>

        <!-- Recommendation tracks -->
        <RecTrack :num="selectedTopMenu"/>
      </div>

      <!-- Footer -->
      <Footer @openServiceSelector="handleOpenServiceSelector"/>
    </div>
  </div>

  <!-- Global Preloader -->
  <GlobalPreloader/>
</template>

<style scoped>

</style>

