<script setup>
import RecTrack from "./RecTrack.vue";
import {useSpotifyStore} from "../stores/spotify-store";
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {ref, computed} from "vue";
import Loader from "./Loader.vue";
import Footer from "./Footer.vue";
import SortTracks from "./SortTracks.vue";
import SortArtists from "./SortArtists.vue";
import SortAlbums from "./SortAlbums.vue";

const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
const selectedTopMenu = ref(null)
const accordionActive = ref(false)
const search = ref('')
const selectedItem = ref(null)
const selectedPersonalPlaylist = ref(null)
const selectedSpotifyPlaylist = ref(null)
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

// eslint-disable-next-line no-unused-vars
function polygon(item, d, num) {
  item.deeper1 = []
  let tt = []
  tt = item
  tt.type = 'pl'
  deeperStore.addToSection('yourPlaylists')(tt)
  console.log(item)
  console.log(d)
  console.log(num)
}

// eslint-disable-next-line no-unused-vars
function polygon2(id) {
  console.log(id)
}

function filterres(event) {
  let input = event.target
  let filter = input.value.toUpperCase();
  let pl = document.querySelectorAll('#sptplaylists > div:not(.rectrack,.head) > div.pl > div');

  for (let i = 0; i < pl.length; i++) {
    if (pl[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      pl[i].style.display = "block";
    } else {
      pl[i].style.display = "none";
    }
  }
}

function lists(artists) {
  const names = artists.map(({
                               name
                             }) => name);
  const finalName = names.pop();
  return names.length ?
      names.join(', ') + ' & ' + finalName :
      finalName;
}

// eslint-disable-next-line no-unused-vars
function findPos(obj) {
  let curtop = 0;
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while (obj == obj.offsetParent);
    return [curtop];
  }
}

function setSelectedItem(value) {
  selectedItem.value = value
}

function setSelectedPersonalPlaylist(value) {
  selectedPersonalPlaylist.value = value
}

function setSelectedSpotifyPlaylist(value) {
  selectedSpotifyPlaylist.value = value
}

function setSelectedTopMenu(value) {
  selectedTopMenu.value = selectedTopMenu.value === value ? null : value
}

const sortedPlaylistItems = computed(() => {
  const itemsCopy = [...spotifyStore.getCurrentPlaylist.tracks.items];
  switch (selectedPlaylistSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.track.name.localeCompare(b.track.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.track.album.name.localeCompare(b.track.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.track.artists[0].name.localeCompare(b.track.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.track.popularity > b.track.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.track.album.release_date.localeCompare(b.track.album.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.track.duration_ms > b.track.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedTAItems = computed(() => {
  const itemsCopy = [...spotifyStore.getTopArtistsShort];
  switch (selectedTASortOption.value) {
    case 'artist':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'followers':
      return itemsCopy.sort((a, b) => a.followers > b.followers);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedTA6Items = computed(() => {
  const itemsCopy = [...spotifyStore.getTopArtistsShort6];
  switch (selectedTA6SortOption.value) {
    case 'artist':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'followers':
      return itemsCopy.sort((a, b) => a.followers > b.followers);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedTALLItems = computed(() => {
  const itemsCopy = [...spotifyStore.getTopArtistsShorta];
  switch (selectedTALLSortOption.value) {
    case 'artist':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'followers':
      return itemsCopy.sort((a, b) => a.followers > b.followers);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedTTItems = computed(() => {
  const itemsCopy = [...spotifyStore.getTopTracksShort];
  switch (selectedTTSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.duration_ms > b.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedTTMItems = computed(() => {
  const itemsCopy = [...spotifyStore.getTopTracksShortm];
  switch (selectedTTMSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.duration_ms > b.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedTTLItems = computed(() => {
  const itemsCopy = [...spotifyStore.getTopTracksShortl];
  switch (selectedTTLSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.duration_ms > b.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedSAItems = computed(() => {
  const itemsCopy = [...spotifyStore.getSavedAlbums];
  switch (selectedSASortOption.value) {
    case 'name':
      return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.album.artists[0].name.localeCompare(b.album.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.album.popularity > b.album.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date));
    case 'number_of_tracks':
      return itemsCopy.sort((a, b) => a.album.total_tracks > b.album.total_tracks);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedSTItems = computed(() => {
  const itemsCopy = [...spotifyStore.getSavedTracks];
  switch (selectedSTSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.track.name.localeCompare(b.track.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.track.album.name.localeCompare(b.track.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.track.artists[0].name.localeCompare(b.track.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.track.popularity > b.track.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.track.album.release_date.localeCompare(b.track.album.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.track.duration_ms > b.track.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedFAItems = computed(() => {
  const itemsCopy = [...spotifyStore.getFollowedArtists];
  switch (selectedFASortOption.value) {
    case 'artist':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'followers':
      return itemsCopy.sort((a, b) => a.followers > b.followers);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedNRItems = computed(() => {
  const itemsCopy = [...spotifyStore.getNewReleases];
  switch (selectedNRSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.release_date.localeCompare(b.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.duration_ms > b.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

const sortedSpotPlaylistItems = computed(() => {
  const itemsCopy = [...spotifyStore.getCurrentSpotifyPlaylist.tracks.items];
  switch (selectedSpotPlaylistSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.track.name.localeCompare(b.track.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.track.album.name.localeCompare(b.track.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.track.artists[0].name.localeCompare(b.track.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.track.popularity > b.track.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.track.album.release_date.localeCompare(b.track.album.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.track.duration_ms > b.track.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

window.addEventListener('resize', () => {
  accordionActive.value = window.innerWidth < 1076;
  console.log(accordionActive.value)
})


</script>

<template>
  <div>
    <ul class="tabs">
      <li id="option1">
        <a id="playlistlist" v-on:click="deeperStore.clearSection({num:1});store.switchTabs({event:$event});setSelectedTopMenu(1)"
           v-on:click.self.once="spotifyStore.fetchPlaylists({event:$event,offset:0})">Playlists Pc</a>
      </li>
      <li id="option2">
        <a id="ta"
           v-on:click="deeperStore.clearSection('topArtists');store.switchTabs({event:$event});store.switchArtist({num:1});setSelectedTopMenu(2)"
           v-on:click.self.once="store.fetchArtist({event:$event})">Top artists</a>
      </li>
      <li id="option3">
        <a v-on:click="deeperStore.clearSection({num:3});store.switchTabs({event:$event});store.switchTracks({num:1});setSelectedTopMenu(3)"
           id="tt" v-on:click.self.once="store.fetchApi({event:$event})">Top tracks</a>
      </li>
      <li id="option4">
        <a v-on:click="deeperStore.clearSection({num:4});store.switchTabs({event:$event});setSelectedTopMenu(4)" id="sa"
           v-on:click.self.once="store.fetchAlbums({offset:0,event:$event})">Saved albums</a>

      </li>
      <li id="option5">
        <a v-on:click="deeperStore.clearSection({num:5});store.switchTabs({event:$event});setSelectedTopMenu(5)" id="st"
           v-on:click.self.once="store.fetchTracks({offset:0})">Saved tracks</a>

      </li>
      <li id="option6">
        <a v-on:click="deeperStore.clearSection('followedArtists');store.switchTabs({event:$event});setSelectedTopMenu(6)" id="fa"
           v-on:click.self.once="store.fetchFA()">Followed artists</a>

      </li>
      <li id="option7">
        <a v-on:click="deeperStore.clearSection({num:7});store.switchTabs({event:$event});setSelectedTopMenu(7)" id="nr"
           v-on:click.self.once="store.fetchNR({offset:0})">New releases</a>

      </li>
      <li id="option8">
        <a v-on:click="deeperStore.clearSection({num:8});store.switchTabs({event:$event});setSelectedTopMenu(8)" id="spt"
           v-on:click.self.once="store.fetchSpotPlaylists({offset:0})">Spotify playlists</a>
      </li>
      <li id="srch" class="srch"><a id="sear" style="padding: 15px;"><input type="search" class="inp pointer"
                                                                            v-model="search"
                                                                            v-on:keyup="selectedTopMenu=10;spotifyStore.search($event)"></a>
      </li>
    </ul>
    <div v-if="selectedTopMenu===1">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option1" :disabled="!accordionActive">
        <div id="yourplaylists" class="con2" v-show="selectedTopMenu===1">
          <div class="rel">
            <button class="btn" v-on:click="store.reloadpl({event:$event})"><img class="refresh-end"
                                                                                 src="../assets/refresh-icon.png"
                                                                                 alt=""></button>
          </div>
          <div class="pl justify-content-center">
            <template v-for="(item,index) of spotifyStore.getPlaylists" v-bind:key="index">
              <div v-bind:id="item.id" v-on:click="setSelectedPersonalPlaylist(item.id);store.fetchInit({event:$event})"
                   class="hr-line-dashed" :class="selectedPersonalPlaylist===item.id ? 'activetab':''">{{ item.name }}
              </div>
            </template>
          </div>
          <div class="play" v-if="spotifyStore.getCurrentPlaylist" v-bind:id="'p' + spotifyStore.getCurrentPlaylist.id">
            <div class="row align-items-center text-center w-100">
              <div class="col-3 text-dark" style="font-weight: bold;color: black">
                <div class="d-flex justify-content-center align-items-center">
                  <div>{{ spotifyStore.getCurrentPlaylist.name }}</div>
                  <button class="btn" v-on:click="store.reloader({num:1,event:$event})"><img
                      class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
                </div>

              </div>
              <div class="col-4 aresset display-flex align-items-center flex-wrap pointer"
                   v-html="spotifyStore.getCurrentPlaylist.description">

              </div>
              <div v-if="spotifyStore.getCurrentPlaylist.images[0]" class="col-3">
                <img style="max-height: 165px" :src="spotifyStore.getCurrentPlaylist.images[0].url">
              </div>
              <div class="col-2">
                <button class="button"><a class="linkresset" v-bind:href="spotifyStore.getCurrentPlaylist['external_urls']['spotify']"
                                          target="_blank">Open in Spotify</a></button>
                <sort-tracks v-model="selectedPlaylistSortOption"/>
              </div>
            </div>
            <div class="con2 display-flex" style="color: black">
              <template v-if="spotifyStore.getCurrentPlaylist.tracks">
                <template v-for="(pl,ind) of sortedPlaylistItems">
                  <template v-if="pl.track">
                    <div v-bind:key="ind"
                         v-if="pl.track.preview_url && pl.track.album.images[0]" tabindex="0" class="con3"
                         :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                         v-on:mouseover="audioStore.handleAudioHover($event)"
                         v-on:mouseleave="audioStore.handleAudioLeave($event)"
                         v-on:click="setSelectedItem('1' + pl.track.id);deeperStore.clearSection({num:1});deeperStore.getTrackDetails({item:pl,num:1,event:$event}); queueStore.addToQueue(pl['track'])"
                         v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }">
                      {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}
                      <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                    </div>
                    <div v-else-if="pl.track.album.images[0] && !pl.track.preview_url && audioStore.unplayableTracks"
                         tabindex="0"
                         v-bind:key="'2'+ind" class="con3 half-opacity"
                         :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                         v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }"
                         v-on:click="setSelectedItem('1' + pl.track.id);deeperStore.clearSection({num:1});deeperStore.getTrackDetails({item:pl,num:1,event:$event}); queueStore.addToQueue(pl['track'])"
                    >{{ lists(pl['track']['artists']) }} - {{ pl.track.name }}
                      <audio preload="auto"></audio>
                    </div>
                    <div v-else-if="!pl.track.album.images[0] && pl.track.preview_url" v-bind:key="'3'+ind"
                         class="con3"
                         :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                         v-on:click="setSelectedItem('1' + pl.track.id);deeperStore.clearSection({num:1});deeperStore.getTrackDetails({item:pl,num:1,event:$event}); queueStore.addToQueue(pl['track'])">
                      {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}>
                      <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                    </div>
                    <div v-else-if="audioStore.unplayableTracks" v-bind:key="'4'+ind" class="con3 half-opacity"
                         :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                         v-on:click="setSelectedItem('1' + pl.track.id);deeperStore.clearSection({num:1});deeperStore.getTrackDetails({item:pl,num:1,event:$event}); queueStore.addToQueue(pl['track'])"
                    >{{ lists(pl['track']['artists']) }} - {{ pl.track.name }}>
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </div>
          <rec-track :num="1">

          </rec-track>
        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===2">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option2" :disabled="!accordionActive">
        <div class="display-flex align-items-center" v-show="selectedTopMenu===2">
          <span id="topartists" v-on:click="store.switchArtist({num:1})"
                :class="store.selectedArtistsRange === 1 ? 'activetab':''">Last month</span>
          <button class="btn" v-on:click="store.reloadartists({num:1,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="topartists6" v-on:click="store.switchArtist({num:2})"
                :class="store.selectedArtistsRange === 2 ? 'activetab':''"
                v-on:click.self.once="store.fetchArtist2({event:$event})" class="mx-2">Last 6 month</span>
          <button class="btn" v-on:click="store.reloadartists({num:2,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="topartistsall" v-on:click="store.switchArtist({num:3})"
                :class="store.selectedArtistsRange === 3 ? 'activetab':''"
                v-on:click.self.once="store.fetchArtist3({event:$event})" class="mx-2">All time</span>
          <button class="btn" v-on:click="store.reloadartists({num:3,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        </div>
        <div id="topartist" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===1 ? '': 'd-none'">
          <sort-artists v-model="selectedTASortOption"/>
          <div class="display-flex flex-wrap">
            <template v-for="(item,index) of sortedTAItems" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3"
                   :class="selectedItem==='2' + item.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('2' + item.id);deeperStore.clearSection('topArtists');deeperStore.getArtistDetails(item, 'topArtists')"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='2' + item.id ? 'selected' : ''"
                   v-on:click="setSelectedItem('2' + item.id);deeperStore.clearSection('topArtists');deeperStore.getArtistDetails(item, 'topArtists')"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="2">

          </rec-track>
        </div>
        <div id="topartist6" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===2 ? '': 'd-none'">
          <sort-artists v-model="selectedTA6SortOption"/>
          <div class="display-flex flex-wrap">
            <template v-for="(item,index) of sortedTA6Items" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3"
                   :class="selectedItem==='22' + item.id ? 'selected' : ''"
                   v-on:click="setSelectedItem('22' + item.id);deeperStore.clearSection('topArtists6');deeperStore.getArtistDetails(item, 'topArtists6')"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='22' + item.id ? 'selected' : ''"
                   v-on:click="setSelectedItem('22' + item.id);deeperStore.clearSection('topArtists6');deeperStore.getArtistDetails(item, 'topArtists6')"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="22">

          </rec-track>
        </div>
        <div id="topartista" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===3 ? '': 'd-none'">
          <sort-artists v-model="selectedTALLSortOption"/>
          <div class="display-flex flex-wrap">
            <template v-for="(item,index) of sortedTALLItems">
              <div v-if="item.preview_url" tabindex="0" v-bind:key="index"
                   class="con3"
                   :class="selectedItem==='23' + item.id ? 'selected' : ''"
                   v-on:click="setSelectedItem('23' + item.id);deeperStore.clearSection('topArtistsAll');deeperStore.getArtistDetails(item, 'topArtistsAll')"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity" v-bind:key="'2'+index"
                   :class="selectedItem==='23' + item.id ? 'selected' : ''"
                   v-on:click="setSelectedItem('23' + item.id);deeperStore.clearSection('topArtistsAll');deeperStore.getArtistDetails(item, 'topArtistsAll')"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="23"></rec-track>
        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===3">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option3" :disabled="!accordionActive">
        <div class="display-flex align-items-center" v-show="selectedTopMenu===3">
          <span id="toptracks" v-on:click="store.switchTracks({num:1});"
                :class="store.selectedTracksRange === 1 ? 'activetab':''">Last month</span>
          <button class="btn" v-on:click="store.reloadtracks({num:1,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="toptrackssix" v-on:click="store.switchTracks({num:2})"
                v-on:click.self.once="store.fetchApi2({event:$event})"
                :class="store.selectedTracksRange === 2 ? 'activetab':''" class="mx-2">Last 6 month</span>
          <button class="btn" v-on:click="store.reloadtracks({num:2,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="toptracksall" v-on:click="store.switchTracks({num:3})"
                v-on:click.self.once="store.fetchApi3({event:$event})"
                :class="store.selectedTracksRange === 3 ? 'activetab':''" class="mx-2">All time</span>
          <button class="btn" v-on:click="store.reloadtracks({num:3,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        </div>
        <div id="toptrack" class="display-flex flex-wrap" :class="store.selectedTracksRange===1 ? '': 'd-none'">
          <sort-tracks v-model="selectedTTSortOption"/>
          <div class="display-flex flex-wrap">
            <template class="trackbody" v-for="(item,index) of sortedTTItems" v-bind:key="index">
              <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                   :class="selectedItem==='3' + item.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('3' + item.id);deeperStore.clearSection({num:3});deeperStore.getTrackDetails(item, 'topTracks'); queueStore.addToQueue(item)"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="item.album.images[0] && audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='3' + item.id ? 'selected' : ''"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                   v-on:click="setSelectedItem('3' + item.id);deeperStore.clearSection({num:3});deeperStore.getTrackDetails(item, 'topTracks'); queueStore.addToQueue(item)">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='3' + item.id ? 'selected' : ''"
                   v-on:click="setSelectedItem('3' + item.id);deeperStore.clearSection({num:3});deeperStore.getTrackDetails(item, 'topTracks'); queueStore.addToQueue(item)">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="3">

          </rec-track>
        </div>
        <div id="toptrack6" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedTracksRange===2 ? '': 'd-none'">
          <sort-tracks v-model="selectedTTMSortOption"/>
          <div class="display-flex flex-wrap">
            <template class="trackbody" v-for="(item,index) of sortedTTMItems" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3"
                   :class="selectedItem==='32' + item.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('32' + item.id);deeperStore.clearSection({num:32});deeperStore.getTrackDetails({item:item,num:32,event:$event});"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='32' + item.id ? 'selected' : ''"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                   v-on:click="setSelectedItem('32' + item.id);deeperStore.clearSection({num:32});deeperStore.getTrackDetails({item:item,num:32,event:$event})">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="32">

          </rec-track>
        </div>
        <div id="toptrackall" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedTracksRange===3 ? '': 'd-none'">
          <sort-tracks v-model="selectedTTLSortOption"/>
          <div class="display-flex flex-wrap">
            <template class="trackbody" v-for="(item,index) of sortedTTLItems" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3"
                   :class="selectedItem==='33' + item.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('33' + item.id);deeperStore.clearSection({num:33});deeperStore.getTrackDetails({item:item,num:33,event:$event})"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='33' + item.id ? 'selected' : ''"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                   v-on:click="setSelectedItem('33' + item.id);deeperStore.clearSection({num:33});deeperStore.getTrackDetails({item:item,num:33,event:$event})">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="33">

          </rec-track>

        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===4">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option4" :disabled="!accordionActive">

        <div id="savedalbum" class="display-flex flex-wrap" v-show="selectedTopMenu===4">
          <sort-albums v-model="selectedSASortOption"/>
          <div class="display-flex flex-wrap">
            <template class="albumbody" v-for="(item,index) of sortedSAItems" v-bind:key="index">
              <div v-if="item.album.tracks.items[0].preview_url" tabindex="0" class="con3"
                   :class="selectedItem==='4' + item.album.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('4' + item.album.id);deeperStore.clearSection({num:4});deeperStore.getTrackDetailsAlbum({item:item,num:4})"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                {{ lists(item.album.artists) }}
                <audio preload="auto" v-bind:src="item.album.tracks.items[0].preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='4' + item.album.id ? 'selected' : ''"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                   v-on:click="setSelectedItem('4' + item.album.id);deeperStore.clearSection({num:4});deeperStore.getTrackDetailsAlbum({item:item,num:4})">
                {{ lists(item.album.artists) }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="4">

          </rec-track>
        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===5">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option5" :disabled="!accordionActive">
        <div id="savedtrack" class="display-flex flex-wrap" v-show="selectedTopMenu===5">
          <sort-tracks v-model="selectedSTSortOption"/>
          <div class="display-flex flex-wrap">
            <template class="albumbody" v-for="(item,index) of sortedSTItems" v-bind:key="index">
              <div v-if="item.track.preview_url && item.track.album.images[0]" tabindex="0" class="con3"
                   :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('5' + item.track.id);deeperStore.clearSection({num:5});deeperStore.getTrackDetails(item, 'savedTracks'); queueStore.addToQueue(item.track)"
                   v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }">
                {{ lists(item.track.artists) }} - {{ item.track.name }}
                <audio preload="auto" v-bind:src="item.track.preview_url"></audio>
              </div>
              <div v-else-if="!item.track.preview_url && item.track.album.images[0] && audioStore.unplayableTracks"
                   tabindex="0"
                   class="con3 half-opacity"
                   :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                   v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }"
                   v-on:click="setSelectedItem('5' + item.track.id);deeperStore.getTrackDetails({item:item,num:5,event:$event,parent: '5' + item.track.id})">
                {{ lists(item.track.artists) }} - {{ item.track.name }}
              </div>
              <div v-else-if="item.track.preview_url && !item.track.album.images[0]" class="con3"
                   :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('5' + item.track.id);deeperStore.getTrackDetails({item:item,num:5,event:$event,parent: '5' + item.track.id})">
                {{ lists(item.track.artists) }} -
                {{ item.track.name }}
                <audio preload="auto" v-bind:src="item.track.preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" class="con3 half-opacity"
                   :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                   v-on:click="setSelectedItem(item.id);deeperStore.clearSection({num:5});deeperStore.getTrackDetails(item, 'savedTracks'); queueStore.addToQueue(item.track)"
              >{{ lists(item.track.artists) }} - {{ item.track.name }}
              </div>
            </template>
          </div>
          <rec-track :num="5"></rec-track>
        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===6">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option6" :disabled="!accordionActive">
        <div id="followedartist" class="display-flex flex-wrap" v-show="selectedTopMenu===6">
          <div class="display-flex">
            <button class="btn" v-on:click="store.reloadartists(4,$event)"><img class="refresh-end"
                                                                                src="../assets/refresh-icon.png"
                                                                                alt=""></button>
          </div>
          <sort-artists v-model="selectedFASortOption"/>
          <div class="display-flex flex-wrap">
            <template class="fabody" v-for="(item,index) of sortedFAItems" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3"
                   :class="'6' + selectedItem===item.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('6' + item.id);deeperStore.clearSection('followedArtists');setSelectedItem(item.id);deeperStore.clearSection('followedArtists');deeperStore.getArtistDetails(item, 'followedArtists')"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">{{ item.name }}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='6' + item.id ? 'selected' : ''"
                   v-on:click="setSelectedItem('6' + item.id);deeperStore.clearSection('followedArtists');deeperStore.clearSection('followedArtists');deeperStore.getArtistDetails(item, 'followedArtists')"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="6"></rec-track>
        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===7">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option7" :disabled="!accordionActive">

        <div id="newrelease" class="display-flex flex-wrap" v-show="selectedTopMenu===7">
          <sort-tracks v-model="selectedNRSortOption"/>
          <div class="display-flex flex-wrap">
            <template class="newbody" v-for="(item,index) of sortedNRItems" v-bind:key="index">
              <div v-if="item.tracks.items[0].preview_url" tabindex="0" class="con3"
                   :class="selectedItem==='7' + item.id ? 'selected' : ''"
                   v-on:mouseover="audioStore.handleAudioHover($event)"
                   v-on:mouseleave="audioStore.handleAudioLeave($event)"
                   v-on:click="setSelectedItem('7' + item.id);deeperStore.clearSection({num:7});deeperStore.getTrackDetails(item, 'newReleases'); queueStore.addToQueue(item)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">{{ lists(item.artists) }} -
                {{ item.name }}
                <audio preload="auto" v-bind:src="item.tracks.items[0].preview_url"></audio>
              </div>
              <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='7' + item.id ? 'selected' : ''"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                   v-on:click="setSelectedItem('7' + item.id);deeperStore.clearSection({num:7});deeperStore.getTrackDetails(item, 'newReleases'); queueStore.addToQueue(item)">
                {{ lists(item.artists) }} - {{ item.name }}
                <audio preload="auto"></audio>
              </div>
            </template>
          </div>
          <rec-track :num="7"></rec-track>
        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===8">
      <Loader v-if="spotifyStore.isLoading"/>
      <teleport to="#option8" :disabled="!accordionActive">
        <div id="sptplaylists" class="con2" v-show="selectedTopMenu===8">
          <div class="head">
            <input class="inp" type="text" v-on:keyup="filterres"
                   placeholder="Please enter a search term.." title="Type in a name">

          </div>
          <div class="sp">
            <div class="pl justify-content-center">
              <template v-for="item of spotifyStore.getSpotifyPlaylists" v-bind:key="item.id">
                <div v-bind:id="item.id" v-on:click="setSelectedSpotifyPlaylist(item.id);store.SpotInit({event:$event})"
                     class="hr-line-dashed" :class="selectedSpotifyPlaylist===item.id ? 'activetab':''">{{ item.name }}
                </div>
              </template>
            </div>
          </div>
          <div class="play" v-if="spotifyStore.getCurrentSpotifyPlaylist" v-bind:id="'s' + spotifyStore.getCurrentSpotifyPlaylist.id">
            <div class="row align-items-center text-center w-100">
              <div class="col-3 text-dark" style="font-weight: bold;color: black">
                <div class="d-flex justify-content-center align-items-center">
                  <div>{{ spotifyStore.getCurrentSpotifyPlaylist.name }}</div>
                  <button class="btn" v-on:click="store.reloader({num:1,event:$event})"><img
                      class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
                </div>

              </div>
              <div class="col-4 aresset display-flex align-items-center flex-wrap pointer"
                   v-html="spotifyStore.getCurrentSpotifyPlaylist.description">

              </div>
              <div v-if="spotifyStore.getCurrentSpotifyPlaylist.images[0]" class="col-3">
                <img style="max-height: 165px" :src="spotifyStore.getCurrentSpotifyPlaylist.images[0].url">
              </div>
              <div class="col-2">
                <div style="color: black;">Follow</div>
                <input type="checkbox" v-if="spotifyStore.getCurrentSpotifyPlaylist.followed"
                       @click.once="store.followPlaylist($event)" checked
                       v-model="spotifyStore.getCurrentSpotifyPlaylist.followed">
                <button class="button"><a class="linkresset" v-bind:href="spotifyStore.getCurrentSpotifyPlaylist['external_urls']['spotify']"
                                          target="_blank">Open in Spotify</a></button>
                <sort-tracks v-model="selectedSpotPlaylistSortOption"/>
              </div>
            </div>
            <div class="display-flex flex-wrap" style="color: black">
              <template v-if="spotifyStore.getCurrentSpotifyPlaylist.tracks">
                <template v-for="(spl,index) of sortedSpotPlaylistItems">
                  <div v-bind:id="spl.track.id" v-bind:key="index"
                       v-if="spl.track.preview_url && spl.track.album.images[0]" tabindex="0" class="con3"
                       :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                       v-on:mouseover="audioStore.handleAudioHover($event)"
                       v-on:mouseleave="audioStore.handleAudioLeave($event)"
                       v-on:click="setSelectedItem('8' + spl.track.id);deeperStore.clearSection({num:8});deeperStore.getTrackDetails(spl, 'spotifyPlaylists'); queueStore.addToQueue(spl['track'])"
                       v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }">
                    {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                    <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                  </div>
                  <div v-bind:id="spl.track.id"
                       v-else-if="!spl.track.preview_url && spl.track.album.images[0] && audioStore.unplayableTracks"
                       tabindex="0" v-bind:key="'2'+index" class="con3 half-opacity"
                       :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                       v-on:click="setSelectedItem('8' + spl.track.id);deeperStore.clearSection({num:8});deeperStore.getTrackDetails(spl, 'spotifyPlaylists'); queueStore.addToQueue(spl['track'])"
                       v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }"
                  >{{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                    <audio preload="auto"></audio>
                  </div>
                  <div v-bind:id="spl.track.id" v-else-if="spl.track.preview_url && !spl.track.album.images[0]"
                       tabindex="0" v-bind:key="'3'+index" class="con3"
                       :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                       v-on:click="setSelectedItem('8' + spl.track.id);deeperStore.clearSection({num:8});deeperStore.getTrackDetails(spl, 'spotifyPlaylists'); queueStore.addToQueue(spl['track'])">
                    {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                    <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                  </div>
                  <div v-bind:id="spl.track.id" v-else v-bind:key="'4'+index" class="con3 half-opacity"
                       :class="selectedItem==='8' + item.id ? 'selected' : ''"
                       v-on:click="setSelectedItem('8' + spl.track.id);deeperStore.clearSection({num:8});deeperStore.getTrackDetails(spl, 'spotifyPlaylists'); queueStore.addToQueue(spl['track'])"
                  >{{ lists(spl['track']['artists']) }} - {{ spl.track.name }}>
                  </div>
                </template>
              </template>
            </div>
          </div>
          <rec-track :num="8">

          </rec-track>
        </div>
      </teleport>
    </div>
    <div v-if="selectedTopMenu===10" id="search">
      <Loader v-if="spotifyStore.isLoading"/>
      <div class="display-flex flex-wrap" style="height: auto;">
        <div class="col-12" style="color:var(--search-color);font-size: 1.5em;">{{ search }}</div>
        <div class="col-6">
          <div class="stitle">Songs</div>
          <div v-for="(item,index) in spotifyStore.getSearchTracks" class="playable-search"
               v-on:mouseover="audioStore.handleParentAudioHover($event)"
               v-on:mouseleave="audioStore.handleParentAudioLeave($event)" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 :class="selectedItem==='song' + item.id ? 'selected' : ''"
                 v-bind:id="'song' + item.id"
                 v-on:click="setSelectedItem('song' + item.id);deeperStore.clearSection('search');deeperStore.getTrackDetails({item:item,num:10,flag:true})"
                 v-on:mouseover="audioStore.handleAudioHover($event)"
                 v-on:mouseleave="audioStore.handleAudioLeave($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="itemImg itemImg-xs itemImg-search half-opacity"
                 :class="selectedItem==='song' + item.id ? 'selected' : ''"
                 v-on:click="setSelectedItem('song' + item.id);deeperStore.clearSection('search');deeperStore.getTrackDetails({item:item,num:10,flag:true})"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              <audio preload="auto"></audio>
            </div>
            <div class="title"
                 v-on:click="setSelectedItem('song' + item.id);deeperStore.getTrackDetails({item:item,num:10,flag:true})">
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="stitle">Artists</div>
          <div v-for="(item,index) in spotifyStore.getSearchArtists" class="playable-search"
               v-on:mouseover="audioStore.handleParentAudioHover($event)"
               v-on:mouseleave="audioStore.handleParentAudioLeave($event)" v-bind:key="index">
            <div v-if="item.tracks[0].preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 :class="selectedItem==='artist' + item.id ? 'selected' : ''"
                 v-bind:id="'artist' + item.id"
                 v-on:click="setSelectedItem('artist' + item.id);deeperStore.clearSection('search');deeperStore.getArtistDetails(item, 'search')"
                 v-on:mouseover="audioStore.handleAudioHover($event)"
                 v-on:mouseleave="audioStore.handleAudioLeave($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.tracks[0].preview_url"></audio>
            </div>
            <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="itemImg itemImg-xs itemImg-search half-opacity"
                 :class="selectedItem==='artist' + item.id ? 'selected' : ''"
                 v-bind:id="'artist' + item.id"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                 v-on:click="setSelectedItem('artist' + item.id);deeperStore.clearSection('search');deeperStore.getArtistDetails(item, 'search')"
            >
              <audio preload="auto"></audio>
            </div>
            <div class="title"
                 v-on:click="setSelectedItem('artist' + item.id);deeperStore.clearSection('search');deeperStore.getArtistDetails(item, 'search')">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="stitle">Albums</div>
          <div v-for="(item,index) in spotifyStore.getSearchAlbums" class="playable-search"
               v-on:mouseover="audioStore.handleParentAudioHover($event)"
               v-on:mouseleave="audioStore.handleParentAudioLeave($event)"
               v-on:click="setSelectedItem('album' + item.id);"
               v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 :class="selectedItem==='album' + item.id ? 'selected' : ''"
                 v-bind:id="'album' + item.id"
                 v-on:click="deeperStore.getTrackDetailsAlbum({item:item,num:10,child:false,search:true})"
                 v-on:mouseover="audioStore.handleAudioHover($event)"
                 v-on:mouseleave="audioStore.handleAudioLeave($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="itemImg itemImg-xs itemImg-search half-opacity"
                 :class="selectedItem==='album' + item.id ? 'selected' : ''"
                 v-bind:id="'album' + item.id"
                 v-on:click="deeperStore.getTrackDetailsAlbum({item:item,num:10,child:false,search:true})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="auto"></audio>
            </div>
            <div class="title"
                 v-on:click="setSelectedItem('album' + item.id);deeperStore.getTrackDetailsAlbum({item:item,num:10,child:false,search:true})">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="stitle">Playlists</div>
          <div v-for="(item,index) in spotifyStore.getSearchPlaylists" class="playable-search"
               v-on:mouseover="audioStore.handleParentAudioHover($event)"
               v-on:mouseleave="audioStore.handleParentAudioLeave($event)"
               v-bind:key="index">
            <div v-if="item.preview_url && item.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                 v-on:mouseover="audioStore.handleAudioHover($event)"
                 v-on:mouseleave="audioStore.handleAudioLeave($event)"
                 v-bind:id="'playlist' + item.id"
                 v-on:click="setSelectedItem('playlist' + item.id);deeperStore.clearSection('search');store.playl({item:item,parent:'playlist' + item.id})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="!item.preview_url && item.images[0] && audioStore.unplayableTracks" tabindex="0"
                 class="itemImg itemImg-xs  itemImg-search"
                 :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                 v-bind:id="'playlist' + item.id"
                 v-on:click="setSelectedItem('playlist' + item.id);deeperStore.clearSection('search');store.playl({item:item,parent:'playlist' + item.id})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="none"></audio>
            </div>
            <div v-else-if="item.preview_url && !item.images[0]" tabindex="0"
                 class="itemImg itemImg-xs itemImg-search"
                 :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                 v-on:mouseover="audioStore.handleAudioHover($event)"
                 v-on:mouseleave="audioStore.handleAudioLeave($event)"
                 v-bind:id="'playlist' + item.id"
                 v-on:click="setSelectedItem('playlist' + item.id);deeperStore.clearSection('search');store.playl({item:item,parent:'playlist' + item.id})">
              <audio preload="auto" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="audioStore.unplayableTracks" tabindex="0"
                 class="itemImg itemImg-xs itemImg-search half-opacity"
                 :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                 v-bind:id="'playlist' + item.id"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                 v-on:click="setSelectedItem('playlist' + item.id);deeperStore.clearSection('search');store.playl({item:item,parent:'playlist' + item.id})">
              <audio preload="none"></audio>
            </div>
            <div class="title" v-on:click="setSelectedItem('playlist' + item.id);store.playl({item:item})">{{
                item.name
              }}
            </div>
          </div>
        </div>
      </div>
      <rec-track :num="10"></rec-track>
    </div>
    <Footer/>
  </div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
