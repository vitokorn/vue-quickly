<script setup>
import {computed, ref} from 'vue'
import {useSpotifyStore} from '../../stores/spotify-store'
import {useAudioStore} from '../../stores/audio-store'
import {useQueueStore} from '../../stores/queue-store'
import {useDeeperStore} from '../../stores/deeper-store'
import {useSorting} from '../../composables/useSorting.js'
import {useSelection} from '../../composables/useSelection.js'
import {useFiltering} from '../../composables/useFiltering.js'
import {artistUtils} from '../../utils/artistUtils.js'
import RecTrack from '../RecTrack.vue'
import Loader from '../Loader.vue'
import Footer from '../Footer.vue'
import SortTracks from '../SortTracks.vue'
import SortArtists from '../SortArtists.vue'
import SortAlbums from '../SortAlbums.vue'
import ModernTabs from '../common/ModernTabs.vue'
import TrackCover from "../TrackCover.vue"
import Playlist from '../Playlist.vue'
import PlaylistSelector from '../PlaylistSelector.vue'
import TrackItem from '../TrackItem.vue'
import ArtistItem from '../ArtistItem.vue'
import TimeRangeSelector from '../TimeRangeSelector.vue'
import AlbumItem from '../AlbumItem.vue'
import NewReleaseItem from '../NewReleaseItem.vue'
import SearchCategory from '../SearchCategory.vue'
import RefreshButton from '../RefreshButton.vue'
import WelcomeModal from '../WelcomeModal.vue'
import Header from "../Header.vue";
import QueueModal from "../QueueModal.vue";

// Stores
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Composables
const {createTrackSorter, createArtistSorter, createAlbumSorter} = useSorting()
const {
  selectedItem,
  selectedTopMenu,
  selectedPersonalPlaylist,
  selectedSpotifyPlaylist,
  setSelectedItem,
  setSelectedPersonalPlaylist,
  setSelectedSpotifyPlaylist,
  setSelectedTopMenu
} = useSelection()
const {search} = useFiltering()

// Local state
const accordionActive = ref(false)
const showWelcomeModal = ref(localStorage.getItem('welcome-modal-seen') !== 'true')
const expandedTabs = ref(new Set())
const selectedPlaylistSortOption = ref("")
const selectedTASortOption = ref("")
const selectedTA6SortOption = ref("")
const selectedTALLSortOption = ref("")
const selectedTTSortOption = ref("")
const selectedTTMSortOption = ref("")
const selectedTTLSortOption = ref("")
const selectedSASortOption = ref("")
const selectedSTSortOption = ref("")
const selectedFASortOption = ref("")
const selectedNRSortOption = ref("")
const selectedSpotPlaylistSortOption = ref("")

// Computed sorted data using composables
const sortedPlaylistItems = createTrackSorter(
    computed(() => spotifyStore.getCurrentPlaylist?.tracks?.items || []),
    selectedPlaylistSortOption
)

const sortedTAItems = createArtistSorter(
    computed(() => spotifyStore.getTopArtistsShort || []),
    selectedTASortOption
)

const sortedTA6Items = createArtistSorter(
    computed(() => spotifyStore.getTopArtistsMedium || []),
    selectedTA6SortOption
)

const sortedTALLItems = createArtistSorter(
    computed(() => spotifyStore.getTopArtistsLong || []),
    selectedTALLSortOption
)

const sortedTTItems = createTrackSorter(
    computed(() => spotifyStore.getTopTracksShort || []),
    selectedTTSortOption
)

const sortedTTMItems = createTrackSorter(
    computed(() => spotifyStore.getTopTracksMedium || []),
    selectedTTMSortOption
)

const sortedTTLItems = createTrackSorter(
    computed(() => spotifyStore.getTopTracksLong || []),
    selectedTTLSortOption
)

const sortedSAItems = createAlbumSorter(
    computed(() => spotifyStore.getSavedAlbums || []),
    selectedSASortOption
)

const sortedSTItems = createTrackSorter(
    computed(() => spotifyStore.getSavedTracks || []),
    selectedSTSortOption
)

const sortedFAItems = createArtistSorter(
    computed(() => spotifyStore.getFollowedArtists || []),
    selectedFASortOption
)

const sortedNRItems = createAlbumSorter(
    computed(() => spotifyStore.getNewReleases || []),
    selectedNRSortOption
)

const sortedSpotPlaylistItems = createTrackSorter(
    computed(() => spotifyStore.getCurrentSpotifyPlaylist?.tracks?.items || []),
    selectedSpotPlaylistSortOption
)

// Event handlers
const handleTrackClick = async (track, event) => {
  setSelectedItem(track.id)
  const sectionName = getSectionName(selectedTopMenu.value)
  await deeperStore.getTrackDetails(track, sectionName)
  queueStore.addToQueue(track)
}

const handleTrackHover = (event) => {
  audioStore.handleAudioHover(event)
}

const handleTrackLeave = (event) => {
  audioStore.handleAudioLeave(event)
}

const handleArtistClick = async (artist, event) => {
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

const handleGenreClick = (genre, event) => {
  // TODO: Implement genre functionality
  console.log('Genre click:', genre)
}

const handleSeedArtist = async (artist, event) => {
  const sectionName = getSectionName(selectedTopMenu.value)
  await deeperStore.getSeedArtistRecommendations(artist, sectionName)
}

const handleFollowArtist = async (artist, event) => {
  try {
    await spotifyStore.followArtist(artist)
  } catch (error) {
    console.error('Failed to follow artist:', error)
  }
}

const handleQueueTrack = (track) => {
  queueStore.addToQueue(track)
}

// Utility functions
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNamesSimple(artists)
}

const getSectionName = (num) => {
  switch (num) {
    case 1: return 'yourPlaylists'
    case 2: return 'topArtists'
    case 3: return 'topTracks'
    case 4: return 'savedAlbums'
    case 5: return 'savedTracks'
    case 6: return 'followedArtists'
    case 7: return 'newReleases'
    case 8: return 'spotifyPlaylists'
    case 10: return 'search'
    default: return 'search'
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

  // Handle mobile accordion behavior
  if (accordionActive.value) {
    if (expandedTabs.value.has(tabNumber)) {
      expandedTabs.value.delete(tabNumber)
    } else {
      // Close other tabs and open this one
      expandedTabs.value.clear()
      expandedTabs.value.add(tabNumber)
    }
  }

  // Set the selected menu
  setSelectedTopMenu(tabNumber)

  // Handle specific tab logic
  try {
    switch (tabNumber) {
      case 1:
        deeperStore.clearSection('yourPlaylists')
        if (!spotifyStore.getPlaylists || spotifyStore.getPlaylists.length === 0) {
          await spotifyStore.fetchPlaylists(0)
        }
        break
      case 2:
        deeperStore.clearSection('topArtists')
        spotifyStore.setSelectedArtistsRange(1)
        if (!spotifyStore.getTopArtistsShort || spotifyStore.getTopArtistsShort.length === 0) {
          await spotifyStore.fetchTopArtists('short_term')
        }
        break
      case 3:
        deeperStore.clearSection('topTracks')
        spotifyStore.setSelectedTracksRange(1)
        if (!spotifyStore.getTopTracksShort || spotifyStore.getTopTracksShort.length === 0) {
          await spotifyStore.fetchTopTracks('short_term')
        }
        break
      case 4:
        deeperStore.clearSection('savedAlbums')
        if (!spotifyStore.getSavedAlbums || spotifyStore.getSavedAlbums.length === 0) {
          await spotifyStore.fetchSavedAlbums(0)
        }
        break
      case 5:
        deeperStore.clearSection('savedTracks')
        if (!spotifyStore.getSavedTracks || spotifyStore.getSavedTracks.length === 0) {
          await spotifyStore.fetchSavedTracks(0)
        }
        break
      case 6:
        deeperStore.clearSection('followedArtists')
        if (!spotifyStore.getFollowedArtists || spotifyStore.getFollowedArtists.length === 0) {
          await spotifyStore.fetchFollowedArtists()
        }
        break
      case 7:
        deeperStore.clearSection('newReleases')
        if (!spotifyStore.getNewReleases || spotifyStore.getNewReleases.length === 0) {
          await spotifyStore.fetchNewReleases(0)
        }
        break
      case 8:
        deeperStore.clearSection('spotifyPlaylists')
        if (!spotifyStore.getSpotifyPlaylists || spotifyStore.getSpotifyPlaylists.length === 0) {
          await spotifyStore.fetchSpotifyPlaylists(0)
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
  spotifyStore.search(event.target.value)
}

// Resize event listener for accordion functionality
const handleResize = () => {
  const wasAccordionActive = accordionActive.value
  accordionActive.value = window.innerWidth < 1076

  // If switching to desktop mode, clear expanded tabs
  if (wasAccordionActive && !accordionActive.value) {
    expandedTabs.value.clear()
  }

  console.log('Accordion active:', accordionActive.value)
}

window.addEventListener('resize', handleResize)

// Initialize on mount
handleResize()

// Welcome modal handlers
const handleCloseWelcomeModal = () => {
  showWelcomeModal.value = false
  localStorage.setItem('welcome-modal-seen', 'true')
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

    <!-- Loader -->
    <Loader v-if="spotifyStore.isLoading"/>

    <!-- Main content -->
    <div class="content-wrapper">
      <!-- Top menu navigation -->
      <ModernTabs
          :selected-tab="selectedTopMenu"
          :search-query="search"
          @tab-click="handleTabClick"
          @search="handleSearch"
      />

      <!-- Mobile Accordion Content -->
      <div v-if="accordionActive" class="accordion-content"
           :class="{ expanded: expandedTabs.has(selectedTopMenu) }">
        <!-- Personal Playlists Section -->
        <div v-if="selectedTopMenu === 1">
          <Loader v-if="spotifyStore.isLoading"/>
          <div id="yourplaylists" class="con2">
            <div class="rel">
              <RefreshButton :on-click="() => spotifyStore.fetchPlaylists(0)"/>
            </div>
            <div class="pl justify-content-center">
              <template v-for="(item,index) of spotifyStore.getPlaylists" :key="index">
                <div :id="item.id"
                     @click="setSelectedPersonalPlaylist(item.id); spotifyStore.fetchPlaylist(item.id)"
                     class="hr-line-dashed"
                     :class="selectedPersonalPlaylist===item.id ? 'activetab':''">
                  {{ item.name }}
                </div>
              </template>
            </div>
            <Playlist
                v-if="spotifyStore.getCurrentPlaylist"
                :playlist="spotifyStore.getCurrentPlaylist"
                :sorted-tracks="sortedPlaylistItems"
                :selected-item="selectedItem"
                :selected-sort-option="selectedPlaylistSortOption"
                :unplayable-tracks="audioStore.unplayableTracks"
                @refresh="spotifyStore.fetchPlaylists(0)"
                @track-click="handleTrackClick"
                @track-hover="handleTrackHover"
                @track-leave="handleTrackLeave"
                @sort-change="selectedPlaylistSortOption = $event"
            />
          </div>
        </div>
      </div>

      <!-- Content sections -->
      <div class="modern-content">
        <div class="content-container">
          <!-- Personal Playlists Section -->
          <div v-if="selectedTopMenu === 1 && !accordionActive">
            <Loader v-if="spotifyStore.isLoading"/>
            <div id="yourplaylists" class="con2">
              <div class="rel">
                <RefreshButton :on-click="() => spotifyStore.fetchPlaylists(0)"/>
              </div>
              <PlaylistSelector
                :playlists="spotifyStore.getPlaylists"
                :selected-playlist="selectedPersonalPlaylist"
                placeholder="Search personal playlists..."
                @playlist-select="(playlistId, event) => { setSelectedPersonalPlaylist(playlistId); spotifyStore.fetchPlaylist(playlistId) }"
              />
              <Playlist
                  v-if="spotifyStore.getCurrentPlaylist"
                  :playlist="spotifyStore.getCurrentPlaylist"
                  :sorted-tracks="sortedPlaylistItems"
                  :selected-item="selectedItem"
                  :selected-sort-option="selectedPlaylistSortOption"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @refresh="spotifyStore.fetchPlaylists(0)"
                  @track-click="handleTrackClick"
                  @track-hover="handleTrackHover"
                  @track-leave="handleTrackLeave"
                  @sort-change="selectedPlaylistSortOption = $event"
              />
            </div>
          </div>

          <!-- Top Artists Section -->
          <div v-if="selectedTopMenu === 2">
            <Loader v-if="spotifyStore.isLoading"/>
            <teleport to="#option2" :disabled="!accordionActive">
              <TimeRangeSelector
                  v-show="selectedTopMenu===2"
                  :selected-range="spotifyStore.selectedArtistsRange"
                  :section-type="'artists'"
                  :ranges="[
                  { id: 1, label: 'Last month', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' },
                  { id: 2, label: 'Last 6 month', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' },
                  { id: 3, label: 'All time', fetchMethod: 'fetchTopArtists', reloadMethod: 'fetchTopArtists' }
                ]"
                  @range-change="async (rangeId, event) => {
                  spotifyStore.setSelectedArtistsRange(rangeId);
                  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term';
                  await spotifyStore.fetchTopArtists(timeRange);
                }"
                  @refresh="async (rangeId, event) => {
                  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term';
                  await spotifyStore.fetchTopArtists(timeRange);
                }"
              />
              <div id="topartist"
                   class="display-flex flex-wrap"
                   style="color: black;width: auto;"
                   :class="spotifyStore.selectedArtistsRange===1 ? '': 'd-none'">
                <SortArtists v-model="selectedTASortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedTAItems" :key="index">
                    <ArtistItem
                        :artist="item"
                        :selected="selectedItem === '2' + item.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :artist-prefix="'2'"
                        @click="handleArtistClick"
                        @hover="handleArtistHover"
                        @leave="handleArtistLeave"
                    />
                  </template>
                </div>
              </div>
              <div id="topartist6"
                   class="display-flex flex-wrap"
                   style="color: black;width: auto;"
                   :class="spotifyStore.selectedArtistsRange===2 ? '': 'd-none'">
                <SortArtists v-model="selectedTA6SortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedTA6Items" :key="index">
                    <ArtistItem
                        :artist="item"
                        :selected="selectedItem === '2' + item.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :artist-prefix="'2'"
                        @click="handleArtistClick"
                        @hover="handleArtistHover"
                        @leave="handleArtistLeave"
                    />
                  </template>
                </div>
              </div>
              <div id="topartista"
                   class="display-flex flex-wrap"
                   style="color: black;width: auto;"
                   :class="spotifyStore.selectedArtistsRange===3 ? '': 'd-none'">
                <SortArtists v-model="selectedTALLSortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedTALLItems" :key="index">
                    <ArtistItem
                        :artist="item"
                        :selected="selectedItem === '2' + item.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :artist-prefix="'2'"
                        @click="handleArtistClick"
                        @hover="handleArtistHover"
                        @leave="handleArtistLeave"
                    />
                  </template>
                </div>
              </div>
            </teleport>
          </div>

          <!-- Top Tracks Section -->
          <div v-if="selectedTopMenu === 3">
            <Loader v-if="spotifyStore.isLoading"/>
            <teleport to="#option3" :disabled="!accordionActive">
              <TimeRangeSelector
                  v-show="selectedTopMenu===3"
                  :selected-range="spotifyStore.selectedTracksRange"
                  :section-type="'tracks'"
                  :ranges="[
                  { id: 1, label: 'Last month', fetchMethod: 'fetchTopTracks', reloadMethod: 'fetchTopTracks' },
                  { id: 2, label: 'Last 6 month', fetchMethod: 'fetchTopTracks', reloadMethod: 'fetchTopTracks' },
                  { id: 3, label: 'All time', fetchMethod: 'fetchTopTracks', reloadMethod: 'fetchTopTracks' }
                ]"
                  @range-change="async (rangeId, event) => {
                  spotifyStore.setSelectedTracksRange(rangeId);
                  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term';
                  await spotifyStore.fetchTopTracks(timeRange);
                }"
                  @refresh="async (rangeId, event) => {
                  const timeRange = rangeId === 1 ? 'short_term' : rangeId === 2 ? 'medium_term' : 'long_term';
                  await spotifyStore.fetchTopTracks(timeRange);
                }"
              />
              <div id="toptracks"
                   class=""
                   style="color: black;width: auto;"
                   :class="spotifyStore.selectedTracksRange===1 ? '': 'd-none'">
                <SortTracks v-model="selectedTTSortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedTTItems" :key="index">
                    <TrackItem
                        :track="item"
                        :selected="selectedItem === '3' + item.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :track-prefix="'3'"
                        @click="handleTrackClick"
                        @hover="handleTrackHover"
                        @leave="handleTrackLeave"
                    />
                  </template>
                </div>
              </div>
              <div id="toptracks6"
                   class="display-flex flex-wrap"
                   style="color: black;width: auto;"
                   :class="spotifyStore.selectedTracksRange===2 ? '': 'd-none'">
                <SortTracks v-model="selectedTTMSortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedTTMItems" :key="index">
                    <TrackItem
                        :track="item"
                        :selected="selectedItem === '3' + item.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :track-prefix="'3'"
                        @click="handleTrackClick"
                        @hover="handleTrackHover"
                        @leave="handleTrackLeave"
                    />
                  </template>
                </div>
              </div>
              <div id="toptracksall"
                   class="display-flex flex-wrap"
                   style="color: black;width: auto;"
                   :class="spotifyStore.selectedTracksRange===3 ? '': 'd-none'">
                <SortTracks v-model="selectedTTLSortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedTTLItems" :key="index">
                    <TrackItem
                        :track="item"
                        :selected="selectedItem === '3' + item.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :track-prefix="'3'"
                        @click="handleTrackClick"
                        @hover="handleTrackHover"
                        @leave="handleTrackLeave"
                    />
                  </template>
                </div>
              </div>
            </teleport>
          </div>

          <!-- Saved Albums Section -->
          <div v-if="selectedTopMenu === 4">
            <Loader v-if="spotifyStore.isLoading"/>
            <teleport to="#option4" :disabled="!accordionActive">
              <div id="savedalbum" class="display-flex flex-wrap" v-show="selectedTopMenu===4">
                <div class="section-header">
                  <button class="refresh-button" @click="spotifyStore.fetchSavedAlbums(0)">
                    <img class="refresh-icon" src="../../assets/refresh-icon.png" alt="Refresh">
                  </button>
                </div>
                <SortAlbums v-model="selectedSASortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedSAItems" :key="index">
                    <AlbumItem
                        :album="item.album"
                        :selected="selectedItem === '4' + item.album.id"
                        :album-prefix="'4'"
                        @click="async (album, event) => { setSelectedItem('4' + album.id); await deeperStore.getAlbumDetails(item, 'savedAlbums') }"
                    />
                  </template>
                </div>
              </div>
            </teleport>
          </div>

          <!-- Saved Tracks Section -->
          <div v-if="selectedTopMenu === 5">
            <Loader v-if="spotifyStore.isLoading"/>
            <teleport to="#option5" :disabled="!accordionActive">
              <div id="savedtrack" class="display-flex flex-wrap" v-show="selectedTopMenu===5">
                <div class="section-header">
                  <button class="refresh-button" @click="spotifyStore.fetchSavedTracks(0)">
                    <img class="refresh-icon" src="../../assets/refresh-icon.png" alt="Refresh">
                  </button>
                </div>
                <SortTracks v-model="selectedSTSortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedSTItems" :key="index">
                    <TrackItem
                        :track="item.track"
                        :selected="selectedItem === '5' + item.track.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :track-prefix="'5'"
                        @click="async (track, event) => { setSelectedItem('5' + track.id); await deeperStore.getTrackDetails(track, 'savedTracks'); queueStore.addToQueue(track) }"
                        @hover="handleTrackHover"
                        @leave="handleTrackLeave"
                    />
                  </template>
                </div>
              </div>
            </teleport>
          </div>

          <!-- Followed Artists Section -->
          <div v-if="selectedTopMenu === 6">
            <Loader v-if="spotifyStore.isLoading"/>
            <teleport to="#option6" :disabled="!accordionActive">
              <div id="followedartist" class="display-flex flex-wrap" v-show="selectedTopMenu===6">
                <div class="section-header">
                  <button class="refresh-button" @click="spotifyStore.fetchFollowedArtists()">
                    <img class="refresh-icon" src="../../assets/refresh-icon.png" alt="Refresh">
                  </button>
                </div>
                <SortArtists v-model="selectedFASortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedFAItems" :key="index">
                    <ArtistItem
                        :artist="item"
                        :selected="selectedItem === '6' + item.id"
                        :unplayable-tracks="audioStore.unplayableTracks"
                        :artist-prefix="'6'"
                        @click="handleArtistClick"
                        @hover="handleArtistHover"
                        @leave="handleArtistLeave"
                    />
                  </template>
                </div>
              </div>
            </teleport>
          </div>

          <!-- New Releases Section -->
          <div v-if="selectedTopMenu === 7">
            <Loader v-if="spotifyStore.isLoading"/>
            <teleport to="#option7" :disabled="!accordionActive">
              <div id="newrelease" class="display-flex flex-wrap" v-show="selectedTopMenu===7">
                <div class="section-header">
                  <button class="refresh-button" @click="spotifyStore.fetchNewReleases(0)">
                    <img class="refresh-icon" src="../../assets/refresh-icon.png" alt="Refresh">
                  </button>
                </div>
                <SortAlbums v-model="selectedNRSortOption"/>
                <div class="display-flex flex-wrap py-2 gap-8">
                  <template v-for="(item,index) of sortedNRItems" :key="index">
                    <NewReleaseItem
                        :album="item"
                        :selected="selectedItem === '7' + item.id"
                        :album-prefix="'7'"
                        @click="async (album, event) => { setSelectedItem('7' + album.id); await deeperStore.getAlbumDetails(album, 'newReleases') }"
                        @hover="handleTrackHover"
                        @leave="handleTrackLeave"
                    />
                  </template>
                </div>
              </div>
            </teleport>
          </div>

          <!-- Spotify Playlists Section -->
          <div v-if="selectedTopMenu === 8">
            <Loader v-if="spotifyStore.isLoading"/>
            <teleport to="#option8" :disabled="!accordionActive">
              <div id="sptplaylists" class="con2" v-show="selectedTopMenu===8">
                <PlaylistSelector
                  :playlists="spotifyStore.getSpotifyPlaylists"
                  :selected-playlist="selectedSpotifyPlaylist"
                  placeholder="Search Spotify playlists..."
                  @playlist-select="(playlistId, event) => { setSelectedSpotifyPlaylist(playlistId); spotifyStore.fetchSpotifyPlaylist(playlistId) }"
                />
                <Playlist
                    v-if="spotifyStore.getCurrentSpotifyPlaylist"
                    :playlist="spotifyStore.getCurrentSpotifyPlaylist"
                    :sorted-tracks="sortedSpotPlaylistItems"
                    :selected-item="selectedItem"
                    :selected-sort-option="selectedSpotPlaylistSortOption"
                    :unplayable-tracks="audioStore.unplayableTracks"
                    :track-prefix="'8'"
                    @refresh="spotifyStore.fetchSpotifyPlaylists(0)"
                    @track-click="handleTrackClick"
                    @track-hover="handleTrackHover"
                    @track-leave="handleTrackLeave"
                    @sort-change="selectedSpotPlaylistSortOption = $event"
                />
              </div>
            </teleport>
          </div>

          <!-- Search Section -->
          <div v-if="selectedTopMenu === 10" id="search">
            <Loader v-if="spotifyStore.isLoading"/>
            <div class="display-flex flex-wrap" style="height: auto;">
              <div class="col-12" style="color:var(--search-color);font-size: 1.5em;">{{ search }}</div>
              <SearchCategory
                  title="Songs"
                  :items="spotifyStore.getSearchTracks"
                  type="song"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { setSelectedItem('song' + item.id); await deeperStore.getTrackDetails(item, 'search') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Artists"
                  :items="spotifyStore.getSearchArtists"
                  type="artist"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { setSelectedItem('artist' + item.id); await deeperStore.getArtistDetails(item, 'search') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Albums"
                  :items="spotifyStore.getSearchAlbums"
                  type="album"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { setSelectedItem('album' + item.id); await deeperStore.getAlbumDetails(item, 'search') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Playlists"
                  :items="spotifyStore.getSearchPlaylists"
                  type="playlist"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { setSelectedItem('playlist' + item.id); await deeperStore.getAlbumDetails(item, 'search') }"
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
      <Footer/>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--main-color) 0%, rgba(240, 55, 165, 0.05) 100%);
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}


/* Modern Playlist Header */
.modern-playlist-header {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 24px;
}

.playlist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.playlist-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0;
  line-height: 1.2;
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-button:hover {
  background: rgba(240, 55, 165, 0.1);
  transform: rotate(180deg);
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

.playlist-description {
  font-size: 14px;
  color: var(--search-color);
  opacity: 0.8;
  line-height: 1.4;
}

.playlist-cover {
  flex-shrink: 0;
}

.playlist-cover img {
  max-height: 165px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.playlist-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 200px;
}

.spotify-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
}

.spotify-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
}

.link-icon {
  font-size: 16px;
}

/* Mobile Responsive for Playlist Header */
@media (max-width: 768px) {
  .modern-playlist-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .playlist-title {
    font-size: 20px;
  }

  .playlist-actions {
    min-width: auto;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .spotify-link {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modern-playlist-header {
    padding: 16px;
  }

  .playlist-title {
    font-size: 18px;
  }

  .playlist-cover img {
    max-height: 120px;
  }
}

/* Dark mode support for playlist header */
:root.dark .modern-playlist-header {
  background: rgba(42, 46, 47, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .refresh-button {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:root.dark .refresh-button:hover {
  background: rgba(240, 55, 165, 0.2);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}


/* Modern Content Styling */
.modern-content {
  flex: 1;
  padding: 24px;
  background: transparent;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 24px;
  min-height: 500px;
}

/* Enhanced Card Styling */
.con2, .con3 {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.con3 {
  position: relative;
  overflow: hidden;
}

.con3::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

.con3:hover::before {
  opacity: 1;
}

.con3:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.con3.half-opacity {
  opacity: 0.6;
}

.con3.half-opacity:hover {
  opacity: 0.8;
}

.con3.no-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.con3.no-image::before {
  display: none;
}

/* Audio element styling */
.con3 audio {
  display: none;
}

/* Focus styles for accessibility */
.con3:focus {
  outline: 2px solid var(--active-tab);
  outline-offset: 2px;
}

/* Dark mode support */
:root.dark .con3 {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root.dark .con3:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.con3.selected {
  color: white;
  text-shadow: black 0 0 3px;
  border: 3px solid var(--active-tab);
  box-shadow: 0 0 20px rgba(240, 55, 165, 0.4);
}

/* Button Styling */
.btn {
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(240, 55, 165, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(240, 55, 165, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-content {
    padding: 16px;
  }

  .content-container {
    padding: 16px;
    border-radius: 12px;
  }
}

/* Mobile Accordion Styles */
@media (max-width: 1076px) {
  .modern-tabs {
    position: relative;
  }

  .tabs-list {
    flex-direction: column;
    gap: 0;
  }

  .tab-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0;
  }

  .tab-item:last-child {
    border-bottom: none;
  }

  .tab-content {
    padding: 16px 20px;
    justify-content: space-between;
    align-items: center;
  }

  .tab-item::after {
    content: '▼';
    font-size: 12px;
    transition: transform 0.3s ease;
    opacity: 0.6;
  }

  .tab-item.active::after {
    transform: rotate(180deg);
  }

  .tab-item:hover {
    background: rgba(240, 55, 165, 0.05);
    transform: none;
  }

  .tab-item.active {
    background: linear-gradient(135deg, var(--active-tab), #e91e63);
    border-bottom-color: transparent;
  }

  /* Accordion content animation */
  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    background: rgba(255, 255, 255, 0.95);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .accordion-content.expanded {
    max-height: 1000px;
  }
}

/* Dark mode support */
:root.dark .modern-tabs {
  background: rgba(34, 36, 38, 0.95);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:root.dark .content-container {
  background: rgba(42, 46, 47, 0.8);
}

:root.dark-blue .content-container {
  background: rgba(18, 33, 58, 0.85);
  border: 1px solid rgba(120,160,220,0.12);
}

:root.dark .modern-search {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark .modern-search:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--active-tab);
}

/* Section Header Styling */
.section-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  padding: 8px 0;
}

.section-header .refresh-button {
  margin-left: auto;
}

/* Enhanced Refresh Button Styling */
.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.refresh-button:hover {
  background: rgba(240, 55, 165, 0.1);
  transform: rotate(180deg);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.2);
}

.refresh-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.refresh-button:hover .refresh-icon {
  opacity: 1;
}

/* Dark mode support */
:root.dq .modern-tabs {
  background: #2c2a3d;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}


:root.dq .content-container {
  background: #2c2a3d;
}
</style>

