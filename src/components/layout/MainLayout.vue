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
import ModernTabs from '../common/ModernTabs.vue'
import TrackCover from "../TrackCover.vue"
import Playlist from '../Playlist.vue'
import GlobalPreloader from '../common/GlobalPreloader.vue'
import PlaylistSelector from '../PlaylistSelector.vue'
import TrackItem from '../TrackItem.vue'
import ArtistItem from '../ArtistItem.vue'
import SearchCategory from '../SearchCategory.vue'
import RefreshButton from '../RefreshButton.vue'
import WelcomeModal from '../WelcomeModal.vue'
import Header from "../Header.vue";
import QueueModal from "../QueueModal.vue";
import TopTracks from '../TopTracks.vue'
import TopArtists from '../TopArtists.vue'
import SavedAlbums from '../SavedAlbums.vue'
import SavedTracks from '../SavedTracks.vue'
import FollowedArtists from '../FollowedArtists.vue'
import NewReleases from '../NewReleases.vue'

// Stores
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Composables
const {createPlaylistTrackSorter, createTrackSorter, createArtistSorter, createAlbumSorter} = useSorting()
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
const showWelcomeModal = ref(localStorage.getItem('welcome-modal-seen') !== 'true')
const expandedTabs = ref(new Set())
const selectedPlaylistSortOption = ref("")
const selectedSpotPlaylistSortOption = ref("")

// Computed sorted data using composables
const sortedPlaylistItems = createPlaylistTrackSorter(
    computed(() => spotifyStore.getCurrentPlaylist?.tracks?.items || []),
    selectedPlaylistSortOption
)

const sortedSpotPlaylistItems = createPlaylistTrackSorter(
    computed(() => spotifyStore.getCurrentSpotifyPlaylist?.tracks?.items || []),
    selectedSpotPlaylistSortOption
)

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
    if (selectedTopMenu.value in [1,8]) {
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
              <Loader v-if="spotifyStore.isLoading"/>
              <PlaylistSelector
                :playlists="spotifyStore.getPlaylists"
                :selected-playlist="selectedPersonalPlaylist"
                title="Your Personal Playlists"
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
            <TopArtists
              :selected-top-menu="selectedTopMenu"
              @artist-click="handleArtistClick"
              @artist-hover="handleArtistHover"
              @artist-leave="handleArtistLeave"
            />
          </div>

          <!-- Top Tracks Section -->
          <div v-if="selectedTopMenu === 3">
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
            <Loader v-if="spotifyStore.isLoading"/>
              <div id="sptplaylists" class="flex-stretch" v-show="selectedTopMenu===8">
                <PlaylistSelector
                  :playlists="spotifyStore.getSpotifyPlaylists"
                  :selected-playlist="selectedSpotifyPlaylist"
                  title="Spotify Playlists"
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
          </div>

          <!-- Search Section -->
          <div v-if="selectedTopMenu === 10" class="search-section">
            <Loader v-if="spotifyStore.isLoading"/>
            <div class="search-header">
              <h2 class="search-title">{{ spotifyStore.searchInput }}</h2>
            </div>
            <div class="search-grid">
              <SearchCategory
                  title="Songs"
                  :items="spotifyStore.getSearchTracks"
                  type="song"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; setSelectedItem('song' + item.id); await deeperStore.getTrackDetails(item, 'search') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Artists"
                  :items="spotifyStore.getSearchArtists"
                  type="artist"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; setSelectedItem('artist' + item.id); await deeperStore.getArtistDetails(item, 'search') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Albums"
                  :items="spotifyStore.getSearchAlbums"
                  type="album"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; setSelectedItem('album' + item.id); await deeperStore.getAlbumDetails(item, 'search') }"
                  @item-hover="audioStore.handleParentAudioHover"
                  @item-leave="audioStore.handleParentAudioLeave"
              />
              <SearchCategory
                  title="Playlists"
                  :items="spotifyStore.getSearchPlaylists"
                  type="playlist"
                  :selected-item="selectedItem"
                  :unplayable-tracks="audioStore.unplayableTracks"
                  @item-click="async (item, event) => { if (deeperStore.getIsGloballyLoading) return; setSelectedItem('playlist' + item.id); await deeperStore.getPlaylistDetails(item, 'search') }"
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

  <!-- Global Preloader -->
  <GlobalPreloader />
</template>

<style scoped>
/* Search Section Styles */
.search-section {
  padding: 2rem 0;
  max-width: 100%;
}

.search-header {
  margin-bottom: 2rem;
  text-align: center;
}

.search-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--search-color, #ffffff);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

/* Search Category Styles */
.search-category {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.search-category:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.search-category-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--search-color, #ffffff);
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.search-category-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-item-wrapper {
  transition: transform 0.2s ease;
}

.search-item-wrapper:hover {
  transform: scale(1.02);
}

/* Search Result Item Styles */
.search-result-container {
  width: 100%;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.search-result-item--selected {
  background: linear-gradient(135deg, rgba(29, 185, 84, 0.2), rgba(29, 185, 84, 0.1));
  border-color: rgba(29, 185, 84, 0.3);
  box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
}

.search-result-item--disabled {
  opacity: 0.6;
  filter: grayscale(0.3);
}

.search-result-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.search-result-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.search-result-image--placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.search-result-text {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--search-color, #ffffff);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .search-title {
    font-size: 2rem;
  }

  .search-category {
    padding: 1rem;
  }

  .search-result-image {
    width: 40px;
    height: 40px;
  }

  .search-result-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 1rem 0;
  }

  .search-title {
    font-size: 1.75rem;
  }

  .search-result-content {
    gap: 0.75rem;
  }

  .search-result-image {
    width: 36px;
    height: 36px;
  }
}
</style>

