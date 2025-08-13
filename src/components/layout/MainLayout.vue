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
  computed(() => store.currentspl?.tracks || []),
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

// Resize event listener for accordion functionality
window.addEventListener('resize', () => {
  accordionActive.value = window.innerWidth < 1076
  console.log(accordionActive.value)
})
</script>

<template>
  <div class="main-layout">
    <!-- Loader -->
    <Loader v-if="store.loader" />

    <!-- Main content -->
    <div class="content-wrapper">
      <!-- Top menu navigation -->
      <nav class="modern-tabs">
        <ul class="tabs-list">
          <li class="tab-item" id="option1">
            <a id="playlistlist"
               @click="store.prepare({num:1});store.switchTabs({event:$event});setSelectedTopMenu(1)"
               @click.self.once="store.fetchPlaylists({event:$event,offset:0})"
               :class="{ active: selectedTopMenu === 1 }">
              <span class="tab-icon">📁</span>
              <span class="tab-text">Playlists</span>
            </a>
          </li>
          <li class="tab-item" id="option2">
            <a id="ta"
               @click="store.prepare({num:2});store.switchTabs({event:$event});store.switchArtist({num:1});setSelectedTopMenu(2)"
               @click.self.once="store.fetchArtist({event:$event})"
               :class="{ active: selectedTopMenu === 2 }">
              <span class="tab-icon">👤</span>
              <span class="tab-text">Top Artists</span>
            </a>
          </li>
          <li class="tab-item" id="option3">
            <a @click="store.prepare({num:3});store.switchTabs({event:$event});store.switchTracks({num:1});setSelectedTopMenu(3)"
               id="tt"
               @click.self.once="store.fetchApi({event:$event})"
               :class="{ active: selectedTopMenu === 3 }">
              <span class="tab-icon">🎵</span>
              <span class="tab-text">Top Tracks</span>
            </a>
          </li>
          <li class="tab-item" id="option4">
            <a @click="store.prepare({num:4});store.switchTabs({event:$event});setSelectedTopMenu(4)"
               id="sa"
               @click.self.once="store.fetchAlbums({offset:0,event:$event})"
               :class="{ active: selectedTopMenu === 4 }">
              <span class="tab-icon">💿</span>
              <span class="tab-text">Saved Albums</span>
            </a>
          </li>
          <li class="tab-item" id="option5">
            <a @click="store.prepare({num:5});store.switchTabs({event:$event});setSelectedTopMenu(5)"
               id="st"
               @click.self.once="store.fetchTracks({offset:0})"
               :class="{ active: selectedTopMenu === 5 }">
              <span class="tab-icon">❤️</span>
              <span class="tab-text">Saved Tracks</span>
            </a>
          </li>
          <li class="tab-item" id="option6">
            <a @click="store.prepare({num:6});store.switchTabs({event:$event});setSelectedTopMenu(6)"
               id="fa"
               @click.self.once="store.fetchFA()"
               :class="{ active: selectedTopMenu === 6 }">
              <span class="tab-icon">⭐</span>
              <span class="tab-text">Followed Artists</span>
            </a>
          </li>
          <li class="tab-item" id="option7">
            <a @click="store.prepare({num:7});store.switchTabs({event:$event});setSelectedTopMenu(7)"
               id="nr"
               @click.self.once="store.fetchNR({offset:0})"
               :class="{ active: selectedTopMenu === 7 }">
              <span class="tab-icon">🆕</span>
              <span class="tab-text">New Releases</span>
            </a>
          </li>
          <li class="tab-item" id="option8">
            <a @click="store.prepare({num:8});store.switchTabs({event:$event});setSelectedTopMenu(8)"
               id="spt"
               @click.self.once="store.fetchSpotPlaylists({offset:0})"
               :class="{ active: selectedTopMenu === 8 }">
              <span class="tab-icon">🎧</span>
              <span class="tab-text">Spotify Playlists</span>
            </a>
          </li>
          <li class="tab-item search-tab" id="srch">
            <div class="search-container">
              <input type="search"
                     class="modern-search"
                     v-model="search"
                     @keyup="selectedTopMenu=10;store.search($event)"
                     placeholder="Search music...">
              <span class="search-icon">🔍</span>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Content sections -->
      <div class="modern-content">
        <div class="content-container">
        <!-- Personal Playlists Section -->
        <div v-if="selectedTopMenu === 1">
          <Loader v-if="store.loader"/>
          <teleport to="#option1" :disabled="!accordionActive">
            <div id="yourplaylists" class="con2" v-show="selectedTopMenu===1">
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
          </teleport>
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
                    @click.self.once="store.fetchTracks2({event:$event})"
                    class="mx-2">
                Last 6 month
              </span>
              <button class="btn" @click="store.reloadtracks({num:2,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
              <span id="toptracksall"
                    @click="store.switchTracks({num:3})"
                    :class="store.selectedTracksRange === 3 ? 'activetab':''"
                    @click.self.once="store.fetchTracks3({event:$event})"
                    class="mx-2">
                All time
              </span>
              <button class="btn" @click="store.reloadtracks({num:3,event:$event})">
                <img class="refresh-end" src="../../assets/refresh-icon.png" alt="">
              </button>
            </div>
            <div id="toptracks"
                 class="display-flex flex-wrap"
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
                      <div v-if="spl.track.preview_url && spl.track.album.images[0]"
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
                      <div v-else-if="!spl.track.preview_url && spl.track.album.images[0] && store.unplayable_tracks"
                           :id="spl.track.id"
                           tabindex="0"
                           class="con3 half-opacity"
                           :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                           @click="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deeper({item:spl,num:8,event:$event}); store.queuein(spl['track'])"
                           :style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }">
                        {{ formatArtistNames(spl['track']['artists']) }} - {{ spl.track.name }}
                        <audio preload="auto"></audio>
                      </div>
                      <div v-else-if="spl.track.preview_url && !spl.track.album.images[0]"
                           :id="spl.track.id"
                           tabindex="0"
                           class="con3"
                           :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                           @click="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deeper({item:spl,num:8,event:$event}); store.queuein(spl['track'])">
                        {{ formatArtistNames(spl['track']['artists']) }} - {{ spl.track.name }}
                        <audio preload="auto" :src="spl.track.preview_url"></audio>
                      </div>
                      <div v-else
                           :id="spl.track.id"
                           class="con3 half-opacity"
                           :class="selectedItem==='8' + item.id ? 'selected' : ''"
                           @click="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deeper({item:spl,num:8,event:$event}); store.queuein(spl['track'])">
                        {{ formatArtistNames(spl['track']['artists']) }} - {{ spl.track.name }}
                      </div>
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

/* Modern Tab Styling */
.modern-tabs {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  will-change: transform;
  transform: translateZ(0);
  transition: all 0.3s ease;
}

.modern-tabs::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
  z-index: -1;
}

.tabs-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.tabs-list::-webkit-scrollbar {
  display: none;
}

.tab-item {
  flex-shrink: 0;
  margin: 0;
}

.tab-item a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  text-decoration: none;
  color: var(--tabs-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 3px solid transparent;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.tab-item a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(240, 55, 165, 0.1), transparent);
  transition: left 0.5s;
}

.tab-item a:hover::before {
  left: 100%;
}

.tab-item a:hover {
  background: rgba(240, 55, 165, 0.05);
  transform: translateY(-1px);
}

.tab-item a.active {
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  color: white;
  border-bottom-color: var(--active-tab);
  box-shadow: 0 4px 15px rgba(240, 55, 165, 0.3);
}

.tab-icon {
  font-size: 18px;
  opacity: 0.8;
}

.tab-text {
  font-size: 14px;
  white-space: nowrap;
}

/* Search Tab */
.search-tab {
  margin-left: auto;
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

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

.modern-search {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 10px 40px 10px 16px;
  color: var(--search-color);
  outline: none;
  width: 250px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.modern-search:focus {
  background: white;
  border-color: var(--active-tab);
  box-shadow: 0 0 0 3px rgba(240, 55, 165, 0.1);
  width: 300px;
}

.modern-search::placeholder {
  color: var(--search-color);
  opacity: 0.6;
}

.search-icon {
  position: absolute;
  right: 24px;
  font-size: 16px;
  opacity: 0.6;
  pointer-events: none;
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
  .tabs-list {
    flex-wrap: wrap;
  }

  .tab-item a {
    padding: 12px 16px;
    font-size: 13px;
  }

  .tab-icon {
    font-size: 16px;
  }

  .modern-search {
    width: 200px;
  }

  .modern-search:focus {
    width: 220px;
  }

  .modern-content {
    padding: 16px;
  }

  .content-container {
    padding: 16px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .tab-text {
    display: none;
  }

  .tab-item a {
    padding: 12px;
    justify-content: center;
  }

  .modern-search {
    width: 150px;
  }

  .modern-search:focus {
    width: 160px;
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
</style>

