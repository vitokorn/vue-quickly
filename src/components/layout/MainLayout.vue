<script setup>
import { computed, ref } from 'vue'
import { useDMStore } from '../../stores/dm-store.js'
import { useSorting } from '../../composables/useSorting.js'
import { useSelection } from '../../composables/useSelection.js'
import { useFiltering } from '../../composables/useFiltering.js'
import { artistUtils } from '../../utils/artistUtils.js'
import TrackList from '../common/TrackList.vue'
import ArtistList from '../common/ArtistList.vue'
import RecTrack from '../RecTrack.vue'
import Loader from '../Loader.vue'
import Footer from '../Footer.vue'
import SortTracks from '../SortTracks.vue'
import SortArtists from '../SortArtists.vue'
import SortAlbums from '../SortAlbums.vue'
import ModernTabs from '../common/ModernTabs.vue'

// Store
const store = useDMStore()

// Composables
const { createTrackSorter, createArtistSorter, createAlbumSorter } = useSorting()
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
const { search, filterres } = useFiltering()

// Local state
const accordionActive = ref(false)
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
  computed(() => store.currentpl?.tracks?.items || []),
  selectedPlaylistSortOption
)

const sortedTAItems = createArtistSorter(
  computed(() => store.topartist || []),
  selectedTASortOption
)

const sortedTA6Items = createArtistSorter(
  computed(() => store.topartist6 || []),
  selectedTA6SortOption
)

const sortedTALLItems = createArtistSorter(
  computed(() => store.topartista || []),
  selectedTALLSortOption
)

const sortedTTItems = createTrackSorter(
  computed(() => store.items || []),
  selectedTTSortOption
)

const sortedTTMItems = createTrackSorter(
  computed(() => store.itemsm || []),
  selectedTTMSortOption
)

const sortedTTLItems = createTrackSorter(
  computed(() => store.itemsl || []),
  selectedTTLSortOption
)

const sortedSAItems = createAlbumSorter(
  computed(() => store.savedalbums || []),
  selectedSASortOption
)

const sortedSTItems = createTrackSorter(
  computed(() => store.savedtracks || []),
  selectedSTSortOption
)

const sortedFAItems = createArtistSorter(
  computed(() => store.followedartists || []),
  selectedFASortOption
)

const sortedNRItems = createAlbumSorter(
  computed(() => store.newreleases || []),
  selectedNRSortOption
)

const sortedSpotPlaylistItems = createTrackSorter(
  computed(() => store.currentspl?.tracks?.items || []),
  selectedSpotPlaylistSortOption
)

// Event handlers
const handleTrackClick = (track, event) => {
  setSelectedItem(track.id)
  store.prepare({ num: selectedTopMenu.value })
  store.deeper({ item: track, num: selectedTopMenu.value, event })
  store.queuein(track)
}

const handleTrackHover = (event) => {
  store.mouseOver(event)
}

const handleTrackLeave = (event) => {
  store.mouseLeave(event)
}

const handleArtistClick = (artist, event) => {
  setSelectedItem(artist.id)
  store.prepare({ num: selectedTopMenu.value })
  store.deeper({ item: artist, num: selectedTopMenu.value, event })
}

const handleArtistHover = (event) => {
  store.mouseOver(event)
}

const handleArtistLeave = (event) => {
  store.mouseLeave(event)
}

const handleGenreClick = (genre, event) => {
  store.thesoundof({ name: genre, num: selectedTopMenu.value, sib: 'trackartist', child: false })
}

const handleSeedArtist = (artist, event) => {
  store.seedArtist({ item: artist, num: selectedTopMenu.value, sib: 'trackartist' })
}

const handleFollowArtist = (artist, event) => {
  store.followArtist({ artist, event })
}

const handleQueueTrack = (track) => {
  store.queuein(track)
}

// Utility functions
const formatArtistNames = (artists) => {
  return artistUtils.formatArtistNames(artists)
}

const polygon = (item, d, num) => {
  item.deeper1 = []
  let tt = []
  tt = item
  tt.type = 'pl'
  store.setDeeper1(tt)
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
const handleTabClick = (tabNumber, event) => {
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
  switch (tabNumber) {
    case 1:
      store.prepare({num: 1})
      store.switchTabs({event})
      if (!store.listplaylists || store.listplaylists.length === 0) {
        store.fetchPlaylists({event, offset: 0})
      }
      break
    case 2:
      store.prepare({num: 2})
      store.switchTabs({event})
      store.switchArtist({num: 1})
      if (!store.topartist || store.topartist.length === 0) {
        store.fetchArtist({event})
      }
      break
    case 3:
      store.prepare({num: 3})
      store.switchTabs({event})
      store.switchTracks({num: 1})
      if (!store.items || store.items.length === 0) {
        store.fetchApi({event})
      }
      break
    case 4:
      store.prepare({num: 4})
      store.switchTabs({event})
      if (!store.savedalbums || store.savedalbums.length === 0) {
        store.fetchAlbums({offset: 0, event})
      }
      break
    case 5:
      store.prepare({num: 5})
      store.switchTabs({event})
      if (!store.savedtracks || store.savedtracks.length === 0) {
        store.fetchTracks({offset: 0})
      }
      break
    case 6:
      store.prepare({num: 6})
      store.switchTabs({event})
      if (!store.followedartists || store.followedartists.length === 0) {
        store.fetchFA()
      }
      break
    case 7:
      store.prepare({num: 7})
      store.switchTabs({event})
      if (!store.newreleases || store.newreleases.length === 0) {
        store.fetchNR({offset: 0})
      }
      break
    case 8:
      store.prepare({num: 8})
      store.switchTabs({event})
      if (!store.spotplaylists || store.spotplaylists.length === 0) {
        store.fetchSpotPlaylists({offset: 0})
      }
      break
  }
}

// Search handler
const handleSearch = (event) => {
  selectedTopMenu.value = 10
  store.search(event)
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
</script>

<template>
  <div class="main-layout">
    <!-- Loader -->
    <Loader v-if="store.loader" />

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
          <Loader v-if="store.loader"/>
          <div id="yourplaylists" class="con2">
            <div class="rel">
              <button class="btn" @click="store.reloadpl({event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
            </div>
            <div class="pl justify-content-center">
              <template v-for="(item,index) of store.listplaylists" :key="index">
                <div :id="item.id"
                     @click="setSelectedPersonalPlaylist(item.id);store.fetchInit({event:$event})"
                     class="hr-line-dashed"
                     :class="selectedPersonalPlaylist===item.id ? 'activetab':''">
                  {{ item.name }}
                </div>
              </template>
            </div>
            <div class="play" v-if="store.currentpl" :id="'p' + store.currentpl.id">
              <div class="modern-playlist-header">
                <div class="playlist-info">
                  <div class="playlist-title-section">
                    <h2 class="playlist-title">{{ store.currentpl.name }}</h2>
                    <button class="refresh-button" @click="store.reloader({num:1,event:$event})">
                      <img class="refresh-icon" src="../../assets/refresh-icon.png" alt="Refresh">
                    </button>
                  </div>
                  <div class="playlist-description" v-html="store.currentpl.description"></div>
                </div>

                <div class="playlist-cover" v-if="store.currentpl.images[0]">
                  <img :src="store.currentpl.images[0].url" alt="Playlist cover">
                </div>

                <div class="playlist-actions">
                  <a class="spotify-link"
                     :href="store.currentpl['external_urls']['spotify']"
                     target="_blank"
                     rel="noopener">
                    <span class="link-icon">🎧</span>
                    Open in Spotify
                  </a>
                  <SortTracks v-model="selectedPlaylistSortOption"/>
                </div>
              </div>
              <div class="con2 display-flex" style="color: black">
                <template v-if="store.currentpl.tracks">
                  <template v-for="(pl,ind) of sortedPlaylistItems" :key="ind">
                    <template v-if="pl.track">
                      <div v-if="pl.track.preview_url && pl.track.album.images[0]"
                           tabindex="0"
                           class="con3"
                           :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                           @mouseover="store.mouseOver($event)"
                           @mouseleave="store.mouseLeave($event)"
                           @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])"
                           :style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }">
                        {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                        <audio preload="auto" :src="pl.track.preview_url"></audio>
                      </div>
                      <div v-else-if="pl.track.album.images[0] && !pl.track.preview_url && store.unplayable_tracks"
                           tabindex="0"
                           class="con3 half-opacity"
                           :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                           :style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }"
                           @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])">
                        {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                        <audio preload="auto"></audio>
                      </div>
                      <div v-else-if="!pl.track.album.images[0] && pl.track.preview_url"
                           class="con3"
                           :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                           @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])">
                        {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                        <audio preload="auto" :src="pl.track.preview_url"></audio>
                      </div>
                      <div v-else-if="store.unplayable_tracks"
                           class="con3 half-opacity"
                           :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                           @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])">
                        {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                      </div>
                    </template>
                  </template>
                </template>
              </div>
            </div>
            <RecTrack :num="1" />
          </div>
        </div>
      </div>

      <!-- Content sections -->
      <div class="modern-content">
        <div class="content-container">
        <!-- Personal Playlists Section -->
        <div v-if="selectedTopMenu === 1 && !accordionActive">
          <Loader v-if="store.loader"/>
          <div id="yourplaylists" class="con2">
              <div class="rel">
                <button class="btn" @click="store.reloadpl({event:$event})">
                  <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
                </button>
              </div>
              <div class="pl justify-content-center">
                <template v-for="(item,index) of store.listplaylists" :key="index">
                  <div :id="item.id"
                       @click="setSelectedPersonalPlaylist(item.id);store.fetchInit({event:$event})"
                       class="hr-line-dashed"
                       :class="selectedPersonalPlaylist===item.id ? 'activetab':''">
                    {{ item.name }}
                  </div>
                </template>
              </div>
              <div class="play" v-if="store.currentpl" :id="'p' + store.currentpl.id">
                <div class="modern-playlist-header">
                  <div class="playlist-info">
                    <div class="playlist-title-section">
                      <h2 class="playlist-title">{{ store.currentpl.name }}</h2>
                      <button class="refresh-button" @click="store.reloader({num:1,event:$event})">
                        <img class="refresh-icon" src="../../assets/refresh-icon.png" alt="Refresh">
                      </button>
                    </div>
                    <div class="playlist-description" v-html="store.currentpl.description"></div>
                  </div>

                  <div class="playlist-cover" v-if="store.currentpl.images[0]">
                    <img :src="store.currentpl.images[0].url" alt="Playlist cover">
                  </div>

                  <div class="playlist-actions">
                    <a class="spotify-link"
                       :href="store.currentpl['external_urls']['spotify']"
                       target="_blank"
                       rel="noopener">
                      <span class="link-icon">🎧</span>
                      Open in Spotify
                    </a>
                    <SortTracks v-model="selectedPlaylistSortOption"/>
                  </div>
                </div>
                <div class="con2 display-flex" style="color: black">
                  <template v-if="store.currentpl.tracks">
                    <template v-for="(pl,ind) of sortedPlaylistItems" :key="ind">
                      <template v-if="pl.track">
                        <div v-if="pl.track.preview_url && pl.track.album.images[0]"
                             tabindex="0"
                             class="con3"
                             :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                             @mouseover="store.mouseOver($event)"
                             @mouseleave="store.mouseLeave($event)"
                             @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])"
                             :style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }">
                          {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                          <audio preload="auto" :src="pl.track.preview_url"></audio>
                        </div>
                        <div v-else-if="pl.track.album.images[0] && !pl.track.preview_url && store.unplayable_tracks"
                             tabindex="0"
                             class="con3 half-opacity"
                             :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                             :style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }"
                             @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])">
                          {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                          <audio preload="auto"></audio>
                        </div>
                        <div v-else-if="!pl.track.album.images[0] && pl.track.preview_url"
                             class="con3"
                             :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                             @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])">
                          {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                          <audio preload="auto" :src="pl.track.preview_url"></audio>
                        </div>
                        <div v-else-if="store.unplayable_tracks"
                             class="con3 half-opacity"
                             :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                             @click.stop="setSelectedItem('1' + pl.track.id);store.prepare({num:1});store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])">
                          {{ formatArtistNames(pl['track']['artists']) }} - {{ pl.track.name }}
                        </div>
                      </template>
                    </template>
                  </template>
                </div>
              </div>
              <RecTrack :num="1" />
            </div>
        </div>

        <!-- Top Artists Section -->
        <div v-if="selectedTopMenu === 2">
          <Loader v-if="store.loader"/>
          <teleport to="#option2" :disabled="!accordionActive">
            <div class="display-flex align-items-center" v-show="selectedTopMenu===2">
              <span id="topartists"
                    @click="store.switchArtist({num:1})"
                    :class="store.selectedArtistsRange === 1 ? 'activetab':''">
                Last month
              </span>
              <button class="btn" @click="store.reloadartists({num:1,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
              <span id="topartists6"
                    @click="store.switchArtist({num:2})"
                    :class="store.selectedArtistsRange === 2 ? 'activetab':''"
                    @click.self.once="store.fetchArtist2({event:$event})"
                    class="mx-2">
                Last 6 month
              </span>
              <button class="btn" @click="store.reloadartists({num:2,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
              <span id="topartistsall"
                    @click="store.switchArtist({num:3})"
                    :class="store.selectedArtistsRange === 3 ? 'activetab':''"
                    @click.self.once="store.fetchArtist3({event:$event})"
                    class="mx-2">
                All time
              </span>
              <button class="btn" @click="store.reloadartists({num:3,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
            </div>
            <div id="topartist"
                 class="display-flex flex-wrap"
                 style="color: black;width: auto;"
                 :class="store.selectedArtistsRange===1 ? '': 'd-none'">
              <SortArtists v-model="selectedTASortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedTAItems" :key="index">
                  <div v-if="item.preview_url"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='2' + item.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='2' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                </template>
              </div>
              <RecTrack :num="2" />
            </div>
            <div id="topartist6"
                 class="display-flex flex-wrap"
                 style="color: black;width: auto;"
                 :class="store.selectedArtistsRange===2 ? '': 'd-none'">
              <SortArtists v-model="selectedTA6SortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedTA6Items" :key="index">
                  <div v-if="item.preview_url"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='2' + item.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='2' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                </template>
              </div>
              <RecTrack :num="2" />
            </div>
            <div id="topartista"
                 class="display-flex flex-wrap"
                 style="color: black;width: auto;"
                 :class="store.selectedArtistsRange===3 ? '': 'd-none'">
              <SortArtists v-model="selectedTALLSortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedTALLItems" :key="index">
                  <div v-if="item.preview_url"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='2' + item.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='2' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                </template>
              </div>
              <RecTrack :num="2" />
            </div>
          </teleport>
        </div>

        <!-- Top Tracks Section -->
        <div v-if="selectedTopMenu === 3">
          <Loader v-if="store.loader"/>
          <teleport to="#option3" :disabled="!accordionActive">
            <div class="display-flex align-items-center" v-show="selectedTopMenu===3">
              <span id="toptracks"
                    @click="store.switchTracks({num:1})"
                    :class="store.selectedTracksRange === 1 ? 'activetab':''">
                Last month
              </span>
              <button class="btn" @click="store.reloadtracks({num:1,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
              <span id="toptracks6"
                    @click="store.switchTracks({num:2})"
                    :class="store.selectedTracksRange === 2 ? 'activetab':''"
                    @click.self.once="store.fetchApi2({event:$event})"
                    class="mx-2">
                Last 6 month
              </span>
              <button class="btn" @click="store.reloadtracks({num:2,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
              <span id="toptracksall"
                    @click="store.switchTracks({num:3})"
                    :class="store.selectedTracksRange === 3 ? 'activetab':''"
                    @click.self.once="store.fetchApi3({event:$event})"
                    class="mx-2">
                All time
              </span>
              <button class="btn" @click="store.reloadtracks({num:3,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
            </div>
            <div id="toptracks"
                 class=""
                 style="color: black;width: auto;"
                 :class="store.selectedTracksRange===1 ? '': 'd-none'">
              <SortTracks v-model="selectedTTSortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedTTItems" :key="index">
                  <div v-if="item.preview_url && item.album.images[0]"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)"
                       :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="item.album.images[0] && !item.preview_url && store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                  <div v-else-if="!item.album.images[0] && item.preview_url"
                       class="con3"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       class="con3 half-opacity"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                  </div>
                </template>
              </div>
              <RecTrack :num="3" />
            </div>
            <div id="toptracks6"
                 class="display-flex flex-wrap"
                 style="color: black;width: auto;"
                 :class="store.selectedTracksRange===2 ? '': 'd-none'">
              <SortTracks v-model="selectedTTMSortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedTTMItems" :key="index">
                  <div v-if="item.preview_url && item.album.images[0]"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)"
                       :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="item.album.images[0] && !item.preview_url && store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                  <div v-else-if="!item.album.images[0] && item.preview_url"
                       class="con3"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       class="con3 half-opacity"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                  </div>
                </template>
              </div>
              <RecTrack :num="3" />
            </div>
            <div id="toptracksall"
                 class="display-flex flex-wrap"
                 style="color: black;width: auto;"
                 :class="store.selectedTracksRange===3 ? '': 'd-none'">
              <SortTracks v-model="selectedTTLSortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedTTLItems" :key="index">
                  <div v-if="item.preview_url && item.album.images[0]"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)"
                       :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="item.album.images[0] && !item.preview_url && store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                  <div v-else-if="!item.album.images[0] && item.preview_url"
                       class="con3"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       class="con3 half-opacity"
                       :class="selectedItem==='3' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('3' + item.id);store.prepare({num:3});store.deeperTracks({item:item,num:3,flag:true}); store.queuein(item)">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                  </div>
                </template>
              </div>
              <RecTrack :num="3" />
            </div>
          </teleport>
        </div>

        <!-- Saved Albums Section -->
        <div v-if="selectedTopMenu === 4">
          <Loader v-if="store.loader"/>
          <teleport to="#option4" :disabled="!accordionActive">
            <div id="savedalbum" class="display-flex flex-wrap" v-show="selectedTopMenu===4">
              <SortAlbums v-model="selectedSASortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedSAItems" :key="index">
                  <div v-if="item.album.images[0]"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='4' + item.album.id ? 'selected' : ''"
                       @click="setSelectedItem('4' + item.album.id);store.prepare({num:4});store.deeperAlbum({item:item,num:4,event:$event})"
                       :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                    {{ formatArtistNames(item.album.artists) }} - {{ item.album.name }}
                  </div>
                  <div v-else
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='4' + item.album.id ? 'selected' : ''"
                       @click="setSelectedItem('4' + item.album.id);store.prepare({num:4});store.deeperAlbum({item:item,num:4,event:$event})">
                    {{ formatArtistNames(item.album.artists) }} - {{ item.album.name }}
                  </div>
                </template>
              </div>
              <RecTrack :num="4" />
            </div>
          </teleport>
        </div>

        <!-- Saved Tracks Section -->
        <div v-if="selectedTopMenu === 5">
          <Loader v-if="store.loader"/>
          <teleport to="#option5" :disabled="!accordionActive">
            <div id="savedtrack" class="display-flex flex-wrap" v-show="selectedTopMenu===5">
              <SortTracks v-model="selectedSTSortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedSTItems" :key="index">
                  <div v-if="item.track.preview_url && item.track.album.images[0]"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('5' + item.track.id);store.prepare({num:5});store.deeperTracks({item:item.track,num:5,flag:true}); store.queuein(item.track)"
                       :style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }">
                    {{ formatArtistNames(item.track.artists) }} - {{ item.track.name }}
                    <audio preload="auto" :src="item.track.preview_url"></audio>
                  </div>
                  <div v-else-if="item.track.album.images[0] && !item.track.preview_url && store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                       :style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }"
                       @click="setSelectedItem('5' + item.track.id);store.prepare({num:5});store.deeperTracks({item:item.track,num:5,flag:true}); store.queuein(item.track)">
                    {{ formatArtistNames(item.track.artists) }} - {{ item.track.name }}
                    <audio preload="auto"></audio>
                  </div>
                  <div v-else-if="!item.track.album.images[0] && item.track.preview_url"
                       class="con3"
                       :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                       @click="setSelectedItem('5' + item.track.id);store.prepare({num:5});store.deeperTracks({item:item.track,num:5,flag:true}); store.queuein(item.track)">
                    {{ formatArtistNames(item.track.artists) }} - {{ item.track.name }}
                    <audio preload="auto" :src="item.track.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       class="con3 half-opacity"
                       :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                       @click="setSelectedItem('5' + item.track.id);store.prepare({num:5});store.deeperTracks({item:item.track,num:5,flag:true}); store.queuein(item.track)">
                    {{ formatArtistNames(item.track.artists) }} - {{ item.track.name }}
                  </div>
                </template>
              </div>
              <RecTrack :num="5" />
            </div>
          </teleport>
        </div>

        <!-- Followed Artists Section -->
        <div v-if="selectedTopMenu === 6">
          <Loader v-if="store.loader"/>
          <teleport to="#option6" :disabled="!accordionActive">
            <div id="followedartist" class="display-flex flex-wrap" v-show="selectedTopMenu===6">
              <SortArtists v-model="selectedFASortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedFAItems" :key="index">
                  <div v-if="item.preview_url"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='6' + item.id ? 'selected' : ''"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       @click="setSelectedItem('6' + item.id);store.prepare({num:6});store.deeperartist({item:item,track:item.tracks,num:6,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto" :src="item.preview_url"></audio>
                  </div>
                  <div v-else-if="store.unplayable_tracks"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='6' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('6' + item.id);store.prepare({num:6});store.deeperartist({item:item,track:item.tracks,num:6,flag:true})"
                       :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                    {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                </template>
              </div>
              <RecTrack :num="6" />
            </div>
          </teleport>
        </div>

        <!-- New Releases Section -->
        <div v-if="selectedTopMenu === 7">
          <Loader v-if="store.loader"/>
          <teleport to="#option7" :disabled="!accordionActive">
            <div id="newrelease" class="display-flex flex-wrap" v-show="selectedTopMenu===7">
              <SortAlbums v-model="selectedNRSortOption"/>
              <div class="display-flex flex-wrap">
                <template v-for="(item,index) of sortedNRItems" :key="index">
                  <div v-if="item.images[0] && item.tracks && item.tracks.items.length && item.tracks.items[0].preview_url"
                       tabindex="0"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       class="con3"
                       :class="selectedItem==='7' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('7' + item.id);store.prepare({num:7});store.deeperAlbum({item:item,num:7,event:$event})"
                       :style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.tracks.items[0].preview_url"></audio>
                  </div>
                  <div v-else-if="item.images && (!item.tracks && !item.tracks.items.length || !item.tracks.items[0].preview_url)"
                       tabindex="0"
                       class="con3 half-opacity"
                       :class="selectedItem==='7' + item.id ? 'selected' : ''"
                       :style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                    @click="setSelectedItem('7' + item.id);store.prepare({num:7});store.deeperAlbum({item:item,num:7,event:$event})">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto"></audio>
                  </div>
                  <div v-else-if="(!item.images.length) && item.tracks.items.length && item.tracks.items[0].preview_url"
                       class="con3"
                       @mouseover="store.mouseOver($event)"
                       @mouseleave="store.mouseLeave($event)"
                       :class="selectedItem==='7' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('7' + item.id);store.prepare({num:7});store.deeperAlbum({item:item,num:7,event:$event})">>
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                    <audio preload="auto" :src="item.tracks.items[0].preview_url"></audio>
                  </div>
                  <div v-else
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='7' + item.id ? 'selected' : ''"
                       @click="setSelectedItem('7' + item.id);store.prepare({num:7});store.deeperAlbum({item:item,num:7,event:$event})">
                    {{ formatArtistNames(item.artists) }} - {{ item.name }}
                  </div>
                </template>
              </div>
              <RecTrack :num="7" />
            </div>
          </teleport>
        </div>

        <!-- Spotify Playlists Section -->
        <div v-if="selectedTopMenu === 8">
          <Loader v-if="store.loader"/>
          <teleport to="#option8" :disabled="!accordionActive">
            <div id="sptplaylists" class="con2" v-show="selectedTopMenu===8">
              <div class="head">
                <input class="inp"
                       type="text"
                       @keyup="filterres"
                       placeholder="Please enter a search term.."
                       title="Type in a name">
              </div>
              <div class="sp">
                <div class="pl justify-content-center">
                  <template v-for="item of store.spotplaylists" :key="item.id">
                    <div :id="item.id"
                         @click="setSelectedSpotifyPlaylist(item.id);store.SpotInit({event:$event})"
                         class="hr-line-dashed"
                         :class="selectedSpotifyPlaylist===item.id ? 'activetab':''">
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="play" v-if="store.currentspl" :id="'s' + store.currentspl.id">
                <div class="row align-items-center text-center w-100">
                  <div class="col-3 text-dark" style="font-weight: bold;color: black">
                    <div class="d-flex justify-content-center align-items-center">
                      <div>{{ store.currentspl.name }}</div>
                      <button class="btn" @click="store.reloader({num:1,event:$event})">
                        <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
                      </button>
                    </div>
                  </div>
                  <div class="col-4 aresset display-flex align-items-center flex-wrap pointer"
                       v-html="store.currentspl.description">
                  </div>
                  <div v-if="store.currentspl.images[0]" class="col-3">
                    <img style="max-height: 165px" :src="store.currentspl.images[0].url">
                  </div>
                  <div class="col-2">
                    <div style="color: black;">Follow</div>
                    <input type="checkbox"
                           v-if="store.currentspl.followed"
                           @click.once="store.followPlaylist($event)"
                           checked
                           v-model="store.currentspl.followed">
                    <button class="button">
                      <a class="linkresset"
                         :href="store.currentspl['external_urls']['spotify']"
                         target="_blank">
                        Open in Spotify
                      </a>
                    </button>
                    <SortTracks v-model="selectedSpotPlaylistSortOption"/>
                  </div>
                </div>
                <div class="display-flex flex-wrap" style="color: black">
                  <template v-if="store.currentspl.tracks">
                    <template v-for="(spl,index) of sortedSpotPlaylistItems" :key="index">
                      <template v-if="spl">
                      <div v-if="spl.track && spl.track.preview_url && spl.track.album.images[0]"
                           :id="spl.track.id"
                           tabindex="0"
                           class="con3"
                           :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                           @mouseover="store.mouseOver($event)"
                           @mouseleave="store.mouseLeave($event)"
                           @click="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deeper({item:spl,num:8,event:$event}); store.queuein(spl['track'])"
                           :style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }">
                        {{ formatArtistNames(spl['track']['artists']) }} - {{ spl.track.name }}
                        <audio preload="auto" :src="spl.track.preview_url"></audio>
                      </div>
                      <div v-else-if="spl.track && !spl.track.preview_url && spl.track.album.images[0] && store.unplayable_tracks"
                           :id="spl.track.id"
                           tabindex="0"
                           class="con3 half-opacity"
                           :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                           @click="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deeper({item:spl,num:8,event:$event}); store.queuein(spl['track'])"
                           :style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }">
                        {{ formatArtistNames(spl['track']['artists']) }} - {{ spl.track.name }}
                        <audio preload="auto"></audio>
                      </div>
                      <div v-else-if="spl.track && spl.track.preview_url && !spl.track.album.images[0]"
                           :id="spl.track.id"
                           tabindex="0"
                           class="con3"
                           :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                           @click="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deeper({item:spl,num:8,event:$event}); store.queuein(spl['track'])">
                        {{ formatArtistNames(spl['track']['artists']) }} - {{ spl.track.name }}
                        <audio preload="auto" :src="spl.track.preview_url"></audio>
                      </div>
                      <div v-else-if="spl.track"
                           :id="spl.track.id"
                           class="con3 half-opacity"
                           :class="selectedItem==='8' + item.id ? 'selected' : ''"
                           @click="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deeper({item:spl,num:8,event:$event}); store.queuein(spl['track'])">
                        {{ formatArtistNames(spl['track']['artists']) }} - {{ spl.track.name }}
                      </div>
                      </template>
                    </template>
                  </template>
                </div>
              </div>
              <RecTrack :num="8" />
            </div>
          </teleport>
        </div>

        <!-- Search Section -->
        <div v-if="selectedTopMenu === 10" id="search">
          <Loader v-if="store.loader"/>
          <div class="display-flex flex-wrap" style="height: auto;">
            <div class="col-12" style="color:var(--search-color);font-size: 1.5em;">{{ search }}</div>
            <div class="col-6">
              <div class="stitle">Songs</div>
              <div v-for="(item,index) in store.tracks"
                   class="playable-search"
                   @mouseover="store.parentmouseOver($event)"
                   @mouseleave="store.parentmouseLeave($event)"
                   :key="index">
                <div v-if="item.preview_url"
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search"
                     :class="selectedItem==='song' + item.id ? 'selected' : ''"
                     :id="'song' + item.id"
                     @click="setSelectedItem('song' + item.id);store.prepare({num:10});store.deeperTracks({item:item,num:10,flag:true})"
                     @mouseover="store.mouseOver($event)"
                     @mouseleave="store.mouseLeave($event)"
                     :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                  {{ formatArtistNames(item.artists) }} - {{ item.name }}
                  <audio preload="auto" :src="item.preview_url"></audio>
                </div>
                <div v-else-if="store.unplayable_tracks"
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search half-opacity"
                     :class="selectedItem==='song' + item.id ? 'selected' : ''"
                     :id="'song' + item.id"
                     @click="setSelectedItem('song' + item.id);store.prepare({num:10});store.deeperTracks({item:item,num:10,flag:true})"
                     :style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                  {{ formatArtistNames(item.artists) }} - {{ item.name }}
                  <audio preload="auto"></audio>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="stitle">Artists</div>
              <div v-for="(item,index) in store.artists"
                   class="playable-search"
                   @mouseover="store.parentmouseOver($event)"
                   @mouseleave="store.parentmouseLeave($event)"
                   :key="index">
                <div v-if="item.preview_url"
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search"
                     :class="selectedItem==='artist' + item.id ? 'selected' : ''"
                     :id="'artist' + item.id"
                     @click="setSelectedItem('artist' + item.id);store.prepare({num:10});store.deeperartist({item:item,track:item.tracks,num:10,flag:true})"
                     @mouseover="store.mouseOver($event)"
                     @mouseleave="store.mouseLeave($event)"
                     :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                  {{ item.name }}
                  <audio preload="auto" :src="item.preview_url"></audio>
                </div>
                <div v-else-if="store.unplayable_tracks"
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search half-opacity"
                     :class="selectedItem==='artist' + item.id ? 'selected' : ''"
                     :id="'artist' + item.id"
                     @click="setSelectedItem('artist' + item.id);store.prepare({num:10});store.deeperartist({item:item,track:item.tracks,num:10,flag:true})"
                     :style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                  {{ item.name }}
                  <audio preload="auto"></audio>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="stitle">Albums</div>
              <div v-for="(item,index) in store.albums"
                   class="playable-search"
                   @mouseover="store.parentmouseOver($event)"
                   @mouseleave="store.parentmouseLeave($event)"
                   :key="index">
                <div v-if="item.images[0]"
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search"
                     :class="selectedItem==='album' + item.id ? 'selected' : ''"
                     :id="'album' + item.id"
                     @click="setSelectedItem('album' + item.id);store.prepare({num:10});store.deeperAlbum({item:item,num:10,event:$event})"
                     :style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                  {{ formatArtistNames(item.artists) }} - {{ item.name }}
                </div>
                <div v-else
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search"
                     :class="selectedItem==='album' + item.id ? 'selected' : ''"
                     :id="'album' + item.id"
                     @click="setSelectedItem('album' + item.id);store.prepare({num:10});store.deeperAlbum({item:item,num:10,event:$event})">
                  {{ formatArtistNames(item.artists) }} - {{ item.name }}
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="stitle">Playlists</div>
              <div v-for="(item,index) in store.splaylists"
                   class="playable-search"
                   @mouseover="store.parentmouseOver($event)"
                   @mouseleave="store.parentmouseLeave($event)"
                   :key="index">
                <div v-if="item.images[0]"
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search"
                     :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                     :id="'playlist' + item.id"
                     @click="setSelectedItem('playlist' + item.id);store.prepare({num:10});store.deeperPlaylist({item:item,num:10,event:$event})"
                     :style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                  {{ item.name }}
                </div>
                <div v-else
                     tabindex="0"
                     class="itemImg itemImg-xs itemImg-search"
                     :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                     :id="'playlist' + item.id"
                     @click="setSelectedItem('playlist' + item.id);store.prepare({num:10});store.deeperPlaylist({item:item,num:10,event:$event})">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendation tracks -->
      <RecTrack :num="selectedTopMenu" />
    </div>

    <!-- Footer -->
    <Footer />
  </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--main-color) 0%, rgba(240, 55, 165, 0.05) 100%);
  overflow-x: hidden;
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
}

.con3:hover::before {
  opacity: 1;
}

.con3:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.con3.selected {
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

:root.dark .modern-search {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark .modern-search:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--active-tab);
}

/* Dark mode support */
:root.dq .modern-tabs {
  background: #2c2a3d;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}


:root.dq .content-container {
  background:  #2c2a3d;
}
</style>

