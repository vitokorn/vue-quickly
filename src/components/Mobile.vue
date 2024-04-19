<script setup>
import RecTrack from "./RecTrack.vue";
import RecTrackM from "./Mob/RecTrackM.vue";
import {Lists} from "../common/lists";
import {useDMStore} from "../stores/dm-store";
import {computed, ref} from "vue";
import Loader from "./Loader.vue";
import SortTracks from "./SortTracks.vue";
import SortArtists from "./SortArtists.vue";
import SortAlbums from "./SortAlbums.vue";

const store = useDMStore()

const selectedTopMenu = ref(null)
const accordionActive = ref(true)
const search = ref('')
const selectedItem = ref(null)
const selectedPersonalPlaylist = ref(null)
const selectedSpotifyPlaylist = ref(null)

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
  return Lists.Ls(artists)
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
  const itemsCopy = [...store.currentpl.tracks.items];
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
  const itemsCopy = [...store.topartist];
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
  const itemsCopy = [...store.topartist6];
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
  const itemsCopy = [...store.topartista];
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
  const itemsCopy = [...store.items];
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
  const itemsCopy = [...store.itemsm];
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
  const itemsCopy = [...store.itemsl];
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
  const itemsCopy = [...store.savedalbums];
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
  const itemsCopy = [...store.savedtracks];
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
  const itemsCopy = [...store.followedartists];
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
  const itemsCopy = [...store.newreleases];
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
  const itemsCopy = [...store.currentspl.tracks.items];
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
  <ul class="tabs">
    <li id="option1">
      <a id="playlistlist" v-on:click="store.switchTabs({event:$event,mobile:true});setSelectedTopMenu(1)"
         v-on:click.self.once="store.fetchPlaylists({event:$event,offset:0})">Playlists</a>
    </li>
    <li id="option2">
      <a id="ta"
         v-on:click="store.switchTabs({event:$event,mobile:true}),store.switchArtist({num:1});setSelectedTopMenu(2)"
         v-on:click.self.once="store.fetchArtist({event:$event})">Top artists</a>
    </li>
    <li id="option3">
      <a v-on:click="store.switchTabs({event:$event,mobile:true}),store.switchTracks({num:1});setSelectedTopMenu(3)"
         id="tt"
         v-on:click.self.once="store.fetchApi({event:$event})">Top tracks</a>

    </li>

    <li id="option4">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});setSelectedTopMenu(4)" id="sa"
         v-on:click.self.once="store.fetchAlbums({offset:0,event:$event});">Saved albums</a>
    </li>
    <li id="option5">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});setSelectedTopMenu(5)" id="st"
         v-on:click.self.once="store.fetchTracks({offset:0})">Saved tracks</a>
    </li>
    <li id="option6">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});setSelectedTopMenu(6)" id="fa"
         v-on:click.self.once="store.fetchFA()">Followed
        artists</a>
    </li>
    <li id="option7">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});setSelectedTopMenu(7)" id="nr"
         v-on:click.self.once="store.fetchNR({offset:0})">New releases</a>
    </li>
    <li id="option8">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});setSelectedTopMenu(8)" id="spt"
         v-on:click.self.once="store.fetchSpotPlaylists({offset:0})">Spotify playlists</a>

    </li>
    <li id="srch" class="srch"><a id="sear" style="padding: 15px;"><input class="inp" v-model="search"
                                                                          v-on:keyup="selectedTopMenu=10;store.search($event)"></a>

    </li>
  </ul>
  <div v-if="selectedTopMenu===1">
    <Loader v-if="store.loader"/>
    <teleport to="#option1" :disabled="!accordionActive">
      <div id="yourplaylists" class="con2" v-show="selectedTopMenu===1">
        <div class="rel">
          <button class="btn" v-on:click="store.reloadpl({event:$event})"><img class="refresh-end"
                                                                               src="../assets/refresh-icon.png" alt="">
          </button>
        </div>
        <div class="pl justify-content-center">
          <template v-for="(item,index) of store.listplaylists" v-bind:key="index">
            <div v-bind:id="item.id" v-on:click="setSelectedPersonalPlaylist(item.id);store.fetchInit({event:$event})"
                 class="hr-line-dashed" :class="selectedPersonalPlaylist===item.id ? 'activetab':''">{{
                item.name
              }}
            </div>
          </template>
        </div>
        <div class="play" v-if="store.currentpl" v-bind:id="'p' + store.currentpl.id" v-bind:key="index">
          <div class="row align-items-center text-center w-100">
            <div class="col-3 text-dark" style="font-weight: bold;color: black">
              <div class="d-flex justify-content-center align-items-center">
                <div>{{ store.currentpl.name }}</div>
                <button class="btn" v-on:click="store.reloader({num:1,event:$event})"><img
                    class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
              </div>

            </div>
            <div class="col-4 aresset display-flex align-items-center flex-wrap pointer"
                 v-html="store.currentpl.description">

            </div>
            <div v-if="store.currentpl.images[0]" class="col-3">
              <img style="max-height: 165px" :src="store.currentpl.images[0].url">
            </div>
            <div class="col-2">
              <button class="button"><a class="linkresset" v-bind:href="store.currentpl['external_urls']['spotify']"
                                        target="_blank">Open in Spotify</a></button>
              <sort-tracks v-model="selectedPlaylistSortOption"/>
            </div>
          </div>
          <div class="conm display-flex" style="color: black" v-bind:key="index">
            <template v-if="item.tracks">
              <template v-for="(pl,ind) of sortedPlaylistItems">
                <template v-if="pl.track">
                  <div v-bind:id="'1' + pl.track.id" v-if="pl.track.preview_url && pl.track.album.images[0]"
                       tabindex="0"
                       class="con3"
                       :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                       v-on:click.self="setSelectedItem('1' + pl.track.id);store.deepermobile({item:pl,num:1,event:$event, parent: pl.track.id});store.click($event)"
                       v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }">
                    {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}
                    <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                  </div>
                  <div v-bind:id="'1' + pl.track.id"
                       v-else-if="pl.track.album.images[0] && !pl.track.preview_url && store.unplayable_tracks"
                       tabindex="0" class="con3 half-opacity"
                       :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                       v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }"
                       v-on:click.self="setSelectedItem('1' + pl.track.id);store.deepermobile({item:pl,num:1,event:$event, parent: pl.track.id})">
                    {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}
                    <audio preload="auto"></audio>
                  </div>
                  <div v-bind:id="'1' + pl.track.id" v-else-if="!pl.track.album.images[0] && pl.track.preview_url"
                       class="con3"
                       :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                       v-on:click.self="setSelectedItem('1' + pl.track.id);store.deepermobile({item:pl,num:1,event:$event, parent: pl.track.id});store.click($event)">
                    {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}>
                    <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                  </div>
                  <div v-bind:id="'1' + pl.track.id" v-else-if="store.unplayable_tracks" class="con3 half-opacity"
                       :class="selectedItem==='1' + pl.track.id ? 'selected' : ''"
                       v-on:click.self="setSelectedItem('1' + pl.track.id);store.deepermobile({item:pl,num:1,event:$event, parent: pl.track.id})">
                    {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}>
                    <audio preload="none"></audio>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </div>
        <rec-track-m :num="1"></rec-track-m>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===2">
    <Loader v-if="store.loader"/>
    <teleport to="#option2" :disabled="!accordionActive">
      <div v-show="selectedTopMenu===2">
        <div class="display-flex align-items-center">
          <span id="topartists" v-on:click="store.switchArtist({num:1})"
                :class="store.selectedArtistsRange === 1 ? 'activetab':''">Last month</span>
          <button class="btn" v-on:click="store.reloadartists({num:1,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="topartists6" v-on:click="store.switchArtist({num:2})" class="mx-2"
                :class="store.selectedArtistsRange === 2 ? 'activetab':''"
                v-on:click.self.once="store.fetchArtist2({event:$event})">Last 6 month</span>
          <button class="btn" v-on:click="store.reloadartists({num:2,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="topartistsall" v-on:click="store.switchArtist({num:3})" class="mx-2"
                :class="store.selectedArtistsRange === 3 ? 'activetab':''"
                v-on:click.self.once="store.fetchArtist3({event:$event})">All time</span>
          <button class="btn" v-on:click="store.reloadartists({num:3,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        </div>
        <div id="topartist" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===1 ? '': 'd-none'">
          <sort-artists v-model="selectedTASortOption"/>
          <div class="display-flex flex-wrap">
            <template v-for="(item,index) of sortedTAItems" v-bind:key="index">
              <div v-if="item.preview_url && item.images[1]" tabindex="0" class="con3"
                   :class="selectedItem==='2' + item.id ? 'selected' : ''"
                   v-bind:id="'2' + item.id"
                   v-on:click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:'2' + item.id});store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
                <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="!item.preview_url && item.images[1]" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='2' + item.id ? 'selected' : ''"
                   v-bind:id="'2' + item.id"
                   v-on:click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:'2' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
              </div>
              <div v-else-if="item.preview_url && !item.images[1]" tabindex="0" class="con3"
                   :class="selectedItem==='2' + item.id ? 'selected' : ''"
                   v-bind:id="'2' + item.id"
                   v-on:click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:'2' + item.id});store.click($event)">
                <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
                {{ item.name }}
              </div>
              <div v-else tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='2' + item.id ? 'selected' : ''"
                   v-bind:id="'2' + item.id"
                   v-on:click="setSelectedItem('2' + item.id);store.prepare({num:2});store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:'2' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
              </div>
            </template>
          </div>
          <rec-track-m :num="2"></rec-track-m>
        </div>
        <div id="topartist6" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===2 ? '': 'd-none'">
          <sort-artists v-model="selectedTA6SortOption"/>
          <div class="display-flex flex-wrap">
            <template v-for="(item,index) of sortedTA6Items" v-bind:key="index">
              <div v-if="item.preview_url && item.images[1]" tabindex="0" class="con3"
                   :class="selectedItem==='22' + item.id ? 'selected' : ''"
                   v-bind:id="'22' + item.id"
                   v-on:click="setSelectedItem('22' + item.id);store.prepare({num:22});store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:'22' + item.id});store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
                <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="!item.preview_url && item.images[1]" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='22' + item.id ? 'selected' : ''"
                   v-bind:id="'22' + item.id"
                   v-on:click="setSelectedItem('22' + item.id);store.prepare({num:22});store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:'22' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
              </div>
              <div v-else-if="item.preview_url && !item.images[1]" tabindex="0" class="con3"
                   :class="selectedItem==='22' + item.id ? 'selected' : ''"
                   v-bind:id="'22' + item.id"
                   v-on:click="setSelectedItem('22' + item.id);store.prepare({num:22});store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:'22' + item.id});store.click($event)">
                <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
                {{ item.name }}
              </div>
              <div v-else tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='22' + item.id ? 'selected' : ''"
                   v-bind:id="'22' + item.id"
                   v-on:click="setSelectedItem('22' + item.id);store.prepare({num:22});store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:'22' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
              </div>
            </template>
          </div>
          <rec-track-m :num="22"></rec-track-m>
        </div>
        <div id="topartista" class="display-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===3 ? '': 'd-none'">
          <sort-artists v-model="selectedTALLSortOption"/>
          <div class="display-flex flex-wrap">
            <template v-for="(item,index) of sortedTALLItems" v-bind:key="index">
              <div v-if="item.preview_url && item.images[1]" tabindex="0" class="con3"
                   :class="selectedItem==='23' + item.id ? 'selected' : ''"
                   v-bind:id="'23' + item.id"
                   v-on:click="setSelectedItem('23' + item.id);store.prepare({num:23});store.deeperartistmob({item:item,track:item.tracks,num:23,flag:true,sib:false,related:false,parent:'23' + item.id});store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
                <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="!item.preview_url && item.images[1]" tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='23' + item.id ? 'selected' : ''"
                   v-bind:id="'23' + item.id"
                   v-on:click="setSelectedItem('23' + item.id);store.prepare({num:23});store.deeperartistmob({item:item,track:item.tracks,num:23,flag:true,sib:false,related:false,parent:'23' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
              </div>
              <div v-else-if="item.preview_url && !item.images[1]" tabindex="0" class="con3"
                   :class="selectedItem==='23' + item.id ? 'selected' : ''"
                   v-bind:id="'23' + item.id"
                   v-on:click="setSelectedItem('23' + item.id);store.prepare({num:23});store.deeperartistmob({item:item,track:item.tracks,num:23,flag:true,sib:false,related:false,parent:'23' + item.id});store.click($event)">
                <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
                {{ item.name }}
              </div>
              <div v-else tabindex="0" class="con3 half-opacity"
                   :class="selectedItem==='23' + item.id ? 'selected' : ''"
                   v-bind:id="'23' + item.id"
                   v-on:click="setSelectedItem('23' + item.id);store.prepare({num:23});store.deeperartistmob({item:item,track:item.tracks,num:23,flag:true,sib:false,related:false,parent:'23' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
                {{ item.name }}
              </div>
            </template>
          </div>
          <rec-track-m :num="23"></rec-track-m>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===3">
    <Loader v-if="store.loader"/>
    <teleport to="#option3" :disabled="!accordionActive">
      <div class="display-flex align-items-center" v-show="selectedTopMenu===3">
          <span id="toptracks" v-on:click="store.switchTracks({num:1})"
                :class="store.selectedTracksRange === 1 ? 'activetab':''">Last month</span>
        <button class="btn" v-on:click="store.reloadtracks({num:1,event:$event})"><img class="refresh-end"
                                                                                       src="../assets/refresh-icon.png"
                                                                                       alt=""></button>
        <span id="toptrackssix" v-on:click="store.switchTracks({num:2})"
              v-on:click.self.once="store.fetchApi2({event:$event})" class="mx-2"
              :class="store.selectedTracksRange === 2 ? 'activetab':''">Last 6 month</span>
        <button class="btn" v-on:click="store.reloadtracks({num:2,event:$event})"><img class="refresh-end"
                                                                                       src="../assets/refresh-icon.png"
                                                                                       alt=""></button>
        <span id="toptracksall" v-on:click="store.switchTracks({num:3})"
              v-on:click.self.once="store.fetchApi3({event:$event})" class="mx-2"
              :class="store.selectedTracksRange === 3 ? 'activetab':''">All time</span>
        <button class="btn" v-on:click="store.reloadtracks({num:3,event:$event})"><img class="refresh-end"
                                                                                       src="../assets/refresh-icon.png"
                                                                                       alt=""></button>
      </div>
      <div id="toptrack" class="display-flex flex-wrap" :class="store.selectedTracksRange===1 ? '': 'd-none'">
        <sort-tracks v-model="selectedTTSortOption"/>
        <div class="display-flex flex-wrap">
          <template v-for="(item,index) of sortedTTItems" v-bind:key="index">
            <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                 :class="selectedItem==='3' + item.id ? 'selected' : ''"
                 :id="'3' + item.id"
                 v-on:click="setSelectedItem(item.id);store.deepermobile({item:item,num:3,event:$event,parent:'3' + item.id});store.click($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              {{ lists(item.artists) }} - {{ item.name }}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="!item.preview_url && item.album.images[0] && store.unplayable_tracks" tabindex="0"
                 class="con3 half-opacity"
                 :class="selectedItem==='3' + item.id ? 'selected' : ''"
                 :id="'3' + item.id"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                 v-on:click="setSelectedItem(item.id);store.deepermobile({item:item,num:3,event:$event,parent:'3' + item.id});">
              {{ lists(item.artists) }}
              -
              {{ item.name }}
            </div>
            <div v-else-if="item.preview_url && !item.album.images[0]" tabindex="0" class="con3"
                 :class="selectedItem==='3' + item.id ? 'selected' : ''"
                 :id="'3' + item.id"
                 v-on:click="setSelectedItem(item.id);store.deepermobile({item:item,num:3,event:$event,parent:'3' + item.id});">
              {{ lists(item.artists) }}
              -
              {{ item.name }}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity"
                 :class="selectedItem==='3' + item.id ? 'selected' : ''"
                 :id="'3' + item.id"
                 v-on:click="setSelectedItem(item.id);store.deepermobile({item:item,num:3,event:$event,parent:'3' + item.id});">
              {{ lists(item.artists) }}
              -
              {{ item.name }}
            </div>
          </template>
        </div>
        <rec-track-m :num="3"></rec-track-m>
      </div>
      <div id="toptrack6" class="display-flex flex-wrap" style="color: black;width: auto;"
           :class="store.selectedTracksRange===2 ? '': 'd-none'">
        <sort-tracks v-model="selectedTTMSortOption"/>
        <div class="display-flex flex-wrap">
          <template v-for="(item,index) of sortedTTMItems" v-bind:key="index">
            <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                 :class="selectedItem==='32' + item.id ? 'selected' : ''"
                 :id="'32' + item.id"
                 v-on:click="setSelectedItem('32' + item.id);store.deepermobile({item:item,num:32,event:$event,parent:item.id});store.click($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              {{ lists(item.artists) }} - {{ item.name }}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="!item.preview_url && item.album.images[0] && store.unplayable_tracks" tabindex="0"
                 class="con3 half-opacity"
                 :class="selectedItem==='32' + item.id ? 'selected' : ''"
                 :id="'32' + item.id"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                 v-on:click="setSelectedItem('32' + item.id);store.deepermobile({item:item,num:32,event:$event,parent:item.id});">
              {{
                lists(item.artists)
              }} -
              {{ item.name }}
            </div>
            <div v-else-if="item.preview_url && !item.album.images[0]" tabindex="0" class="con3"
                 :class="selectedItem==='32' + item.id ? 'selected' : ''"
                 :id="'32' + item.id"
                 v-on:click="setSelectedItem('32' + item.id);store.deepermobile({item:item,num:32,event:$event,parent:item.id});">
              {{
                lists(item.artists)
              }} -
              {{ item.name }}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity"
                 :class="selectedItem==='32' + item.id ? 'selected' : ''"
                 :id="'32' + item.id"
                 v-on:click="setSelectedItem('32' + item.id);store.deepermobile({item:item,num:32,event:$event,parent:item.id});">
              {{
                lists(item.artists)
              }} -
              {{ item.name }}
            </div>
          </template>
        </div>
        <rec-track-m :num="32"></rec-track-m>
      </div>
      <div id="toptrackall" class="display-flex flex-wrap" style="color: black;width: auto;"
           :class="store.selectedTracksRange===3 ? '': 'd-none'">
        <sort-tracks v-model="selectedTTLSortOption"/>
        <div class="display-flex flex-wrap">
          <template v-for="(item,index) of sortedTTLItems" v-bind:key="index">
            <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                 :class="selectedItem==='33' + item.id ? 'selected' : ''"
                 :id="'33' + item.id"
                 v-on:click="setSelectedItem('33' + item.id);store.deepermobile({item:item,num:33,event:$event,parent:'33' + item.id});store.click($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              {{ lists(item.artists) }} - {{ item.name }}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="!item.preview_url && item.album.images[0] && store.unplayable_tracks" tabindex="0"
                 class="con3 half-opacity"
                 :class="selectedItem==='33' + item.id ? 'selected' : ''"
                 :id="'33' + item.id"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                 v-on:click="setSelectedItem('33' + item.id);store.deepermobile({item:item,num:33,event:$event,parent:'33' + item.id});">
              {{
                lists(item.artists)
              }} -
              {{ item.name }}
            </div>
            <div v-else-if="item.preview_url && !item.album.images[0]" tabindex="0" class="con3"
                 :class="selectedItem==='33' + item.id ? 'selected' : ''"
                 :id="'33' + item.id"
                 v-on:click="setSelectedItem('33' + item.id);store.deepermobile({item:item,num:33,event:$event,parent:'33' + item.id});">
              {{
                lists(item.artists)
              }} -
              {{ item.name }}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity"
                 :class="selectedItem==='33' + item.id ? 'selected' : ''"
                 :id="'33' + item.id"
                 v-on:click="setSelectedItem('33' + item.id);store.deepermobile({item:item,num:33,event:$event,parent:'33' + item.id});">
              {{
                lists(item.artists)
              }} -
              {{ item.name }}
            </div>
          </template>
        </div>
        <rec-track-m :num="33"></rec-track-m>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===4">
    <Loader v-if="store.loader"/>
    <teleport to="#option4" :disabled="!accordionActive">
      <div id="savedalbum" class="conm" v-show="selectedTopMenu===4">
        <sort-albums v-model="selectedSASortOption"/>
        <div class="display-flex flex-wrap">
          <template v-for="(item,index) of sortedSAItems" v-bind:key="index">
            <div v-if="item.album.tracks.items[0].preview_url && item.album.images[0]" tabindex="0" class="con3"
                 v-bind:id="'4' + item.album.id"
                 :class="selectedItem===item.album.id ? 'selected' : ''"
                 v-on:click="setSelectedItem('4' + item.album.id);store.deeperAlbumMob({item:item,num:4,parent:'4' + item.album.id});store.click($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              {{ lists(item.album.artists) }}
              <audio preload="auto" v-bind:src="item.album.tracks.items[0].preview_url"></audio>
            </div>
            <div v-else-if="item.album.images[0] && !item.album.tracks.items[0].preview_url && store.unplayable_tracks "
                 tabindex="0"
                 v-bind:id="'4' + item.album.id"
                 class="con3 half-opacity"
                 :class="selectedItem==='4' + item.album.id ? 'selected' : ''"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                 v-on:click="setSelectedItem('4' + item.album.id);store.deeperAlbumMob({item:item,num:4,parent:'4' + item.album.id})">
              {{ lists(item.album.artists) }}
            </div>
            <div v-else-if="!item.album.images[0] && item.album.tracks.items[0].preview_url " tabindex="0"
                 v-bind:id="'4' + item.album.id"
                 class="con3 half-opacity"
                 :class="selectedItem==='4' + item.album.id ? 'selected' : ''"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                 v-on:click="setSelectedItem('4' + item.album.id);store.deeperAlbumMob({item:item,num:4,parent:'4' + item.album.id})">
              {{ lists(item.album.artists) }}
            </div>
            <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity"
                 v-bind:id="'4' + item.album.id"
                 :class="selectedItem==='4' + item.album.id ? 'selected' : ''"
                 v-on:click="setSelectedItem('4' + item.album.id);store.deeperAlbumMob({item:item,num:4,parent:'4' + item.album.id})">
              {{ lists(item.album.artists) }}
            </div>
          </template>
        </div>
        <rec-track-m :num="4"></rec-track-m>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===5">
    <Loader v-if="store.loader"/>
    <teleport to="#option5" :disabled="!accordionActive">
      <div id="savedtrack" class="con2" v-show="selectedTopMenu===5">
        <sort-tracks v-model="selectedSTSortOption"/>
        <div class="display-flex flex-wrap">
          <template v-for="(item,index) of sortedSTItems" v-bind:key="index">
            <div v-if="item.track.preview_url && item.track.album.images[0]" tabindex="0" class="con3"
                 :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                 v-bind:id="'5' + item.track.id"
                 v-on:click="setSelectedItem('5' + item.track.id);store.deepermobile({item:item,num:5,event:$event,parent: '5' + item.track.id});store.click($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }">
              {{ lists(item.track.artists) }} - {{ item.track.name }}
              <audio preload="auto" v-bind:src="item.track.preview_url"></audio>
            </div>
            <div v-else-if="!item.track.preview_url && item.track.album.images[0] && store.unplayable_tracks"
                 tabindex="0"
                 class="con3 half-opacity"
                 :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                 v-bind:id="'5' + item.track.id"
                 v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }"
                 v-on:click="setSelectedItem('5' + item.track.id);store.deepermobile({item:item,num:5,event:$event,parent: '5' + item.track.id})">
              {{ lists(item.track.artists) }} - {{ item.track.name }}
            </div>
            <div v-else-if="item.track.preview_url && !item.track.album.images[0]" class="con3"
                 :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                 v-bind:id="'5' + item.track.id"
                 v-on:click="setSelectedItem('5' + item.track.id);store.deepermobile({item:item,num:5,event:$event,parent: '5' + item.track.id})">
              {{ lists(item.track.artists) }} -
              {{ item.track.name }}
              <audio preload="auto" v-bind:src="item.track.preview_url"></audio>
            </div>
            <div v-else-if="store.unplayable_tracks" class="con3 half-opacity"
                 :class="selectedItem==='5' + item.track.id ? 'selected' : ''"
                 v-bind:id="'5' + item.track.id"
                 v-on:click="setSelectedItem('5' + item.track.id);store.deepermobile({item:item,num:5,event:$event,parent: '5' + item.track.id})"
            >{{ lists(item.track.artists) }} - {{ item.track.name }}
            </div>
          </template>
        </div>
        <rec-track-m :num="5"></rec-track-m>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===6">
    <Loader v-if="store.loader"/>
    <teleport to="#option6" :disabled="!accordionActive">
      <div class="display-flex">
        <button class="btn" v-on:click="store.reloadartists(4,$event)"><img class="refresh-end"
                                                                            src="../assets/refresh-icon.png" alt="">
        </button>
      </div>
      <div id="followedartist" class="conm display-flex" style="color: black;" v-show="selectedTopMenu===6">
        <sort-artists v-model="selectedFASortOption"/>
        <div class="display-flex flex-wrap">
          <template v-for="(item,index) of sortedFAItems"
                    v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3"
                 v-bind:id="'6' + item.id"
                 :class="selectedItem==='6' + item.id ? 'selected' : ''"
                 v-on:click="setSelectedItem('6' + item.id);store.deeperartistmob({item:item,track:item.tracks,num:6,flag:true,sib:false,related:false,parent:'6' + item.id});store.click($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3 half-opacity"
                 v-bind:id="'6' + item.id"
                 :class="selectedItem==='6' + item.id ? 'selected' : ''"
                 v-on:click="setSelectedItem('6' + item.id);store.deeperartistmob({item:item,track:item.tracks,num:6,flag:true,sib:false,related:false,parent:'6' + item.id})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">
              {{ item.name }}
            </div>
          </template>
        </div>
        <rec-track-m :num="6"></rec-track-m>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===7">
    <Loader v-if="store.loader"/>
    <teleport to="#option7" :disabled="!accordionActive">
      <div id="newrelease" class="conm" v-show="selectedTopMenu===7">
        <sort-tracks v-model="selectedNRSortOption"/>
        <div class="display-flex flex-wrap">
          <template v-for="(item,index) of sortedNRItems" v-bind:key="index">
            <div v-if="item.tracks.items[0].preview_url && item.images[0].url" tabindex="0" class="con3"
                 :class="selectedItem==='7' + item.id ? 'selected' : ''"
                 v-bind:id="'7' + item.id"
                 v-on:click="setSelectedItem('7' + item.id);store.deepermobile({item:item,num:7,event:$event,parent:'7' + item.id});store.click($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">{{ lists(item.artists) }} -
              {{ item.name }}
              <audio preload="auto" v-bind:src="item.tracks.items[0].preview_url"></audio>
            </div>
            <div v-else-if="!item.tracks.items[0].preview_url && item.images[0].url && store.unplayable_tracks"
                 tabindex="0"
                 class="con3 half-opacity"
                 :class="selectedItem==='7' + item.id ? 'selected' : ''"
                 v-bind:id="'7' + item.id"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                 v-on:click="setSelectedItem('7' + item.id);store.deepermobile({item:item,num:7,event:$event,parent:'7' + item.id})">
              {{ lists(item.artists) }} -
              {{ item.name }}
            </div>
            <div v-else-if="item.tracks.items[0].preview_url && !item.images[0].url" tabindex="0" class="con3"
                 :class="selectedItem==='7' + item.id ? 'selected' : ''"
                 v-bind:id="'7' + item.id"
                 v-on:click="setSelectedItem('7' + item.id);store.deepermobile({item:item,num:7,event:$event,parent:'7' + item.id})">
              {{ lists(item.artists) }} -
              {{ item.name }}
              <audio preload="auto" v-bind:src="item.tracks.items[0].preview_url"></audio>
            </div>
            <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity"
                 :class="selectedItem==='7' + item.id ? 'selected' : ''"
                 v-bind:id="'7' + item.id"
                 v-on:click="setSelectedItem('7' + item.id);store.deepermobile({item:item,num:7,event:$event,parent:'7' + item.id})">
              {{ lists(item.artists) }} -
              {{ item.name }}
            </div>
          </template>
        </div>
        <rec-track-m :num="7"></rec-track-m>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===8">
    <Loader v-if="store.loader"/>
    <teleport to="#option8" :disabled="!accordionActive">
      <div id="sptplaylists" class="con2" v-show="selectedTopMenu===8">
        <div class="head">
          <input class="inp" type="text" v-on:keyup="filterres"
                 placeholder="Please enter a search term.." title="Type in a name">
        </div>
        <div class="sp">
          <div class="pl justify-content-center">
            <template v-for="item of store.spotplaylists" v-bind:key="item.id">
              <div v-bind:id="item.id" v-on:click="setSelectedSpotifyPlaylist(item.id);store.SpotInit({event:$event})"
                   class="hr-line-dashed">{{
                  item.name
                }}
              </div>
            </template>
          </div>
        </div>
        <div class="play" v-for="(item,index) of store.sptplaylists" v-bind:id="'s' + item.id" v-bind:key="index">
          <div class="row align-items-center text-center w-100">
            <div class="col-3 text-dark" style="font-weight: bold;color: black">
              <div class="d-flex justify-content-center align-items-center">
                <div>{{ store.currentspl.name }}</div>
                <button class="btn" v-on:click="store.reloader({num:1,event:$event})"><img
                    class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
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
              <input type="checkbox" v-if="store.currentspl.followed"
                     @click.once="store.followPlaylist($event)" checked
                     v-model="store.currentspl.followed">
              <button class="button"><a class="linkresset" v-bind:href="store.currentspl['external_urls']['spotify']"
                                        target="_blank">Open in Spotify</a></button>
              <sort-tracks v-model="selectedSpotPlaylistSortOption"/>
            </div>
          </div>
          <div class="conm display-flex" style="color: black">
            <template v-if="item.tracks">
              <template v-for="(spl,index) of sortedSpotPlaylistItems" v-bind:key="index">
                <div v-bind:id="'8' + spl.track.id" v-if="spl.track.preview_url && spl.track.album.images[0]"
                     tabindex="0"
                     class="con3"
                     :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                     v-on:click.self="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deepermobile({item:spl,num:8,event:$event,parent:'8' + spl.track.id});store.click($event)"
                     v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }">
                  {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                  <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                </div>
                <div v-bind:id="'8' + spl.track.id"
                     v-else-if="spl.track.album.images[0] && !spl.track.preview_url && store.unplayable_tracks"
                     tabindex="0" class="con3 half-opacity"
                     :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                     v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }"
                     v-on:click.self="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deepermobile({item:spl,num:8,event:$event,parent:'8' + spl.track.id})">
                  {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                </div>
                <div v-bind:id="'8' + spl.track.id" v-else-if="!spl.track.album.images[0] && spl.track.preview_url"
                     class="con3"
                     :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                     v-on:click.self="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deepermobile({item:spl,num:8,event:$event,parent:'8' + spl.track.id});store.click($event)">
                  {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                  <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                </div>
                <div v-bind:id="'8' + spl.track.id" v-else-if="store.unplayable_tracks" class="con3 half-opacity"
                     :class="selectedItem==='8' + spl.track.id ? 'selected' : ''"
                     v-on:click.self="setSelectedItem('8' + spl.track.id);store.prepare({num:8});store.deepermobile({item:spl,num:8,event:$event,parent:'8' + spl.track.id})">
                  {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                </div>
              </template>
            </template>
          </div>
        </div>
        <rec-track-m :num="8"></rec-track-m>
      </div>
    </teleport>
  </div>
  <div v-if="selectedTopMenu===10">
    <Loader v-if="store.loader"/>
    <teleport to="#srch" :disabled="!accordionActive">
      <div id="search">
        <div class="display-flex flex-wrap">
          <div class="col-12" style="color:var(--search-color);font-size: 1.5em;">{{ search }}</div>
          <div class="col-6">
            <div class="stitle">Songs</div>
            <div v-for="(item,index) in store.tracks" class="playable-search"
                 v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   :class="selectedItem==='song' + item.id ? 'selected' : ''"
                   v-bind:id="'song' + item.id"
                   v-on:click="setSelectedItem('song' + item.id);store.prepare({num:10});store.deeperTracksM({item:item,num:10,flag:true,parent:'song' + item.id});store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0"
                   class="itemImg itemImg-xs itemImg-search half-opacity"
                   :class="selectedItem==='song' + item.id ? 'selected' : ''"
                   v-bind:id="'song' + item.id"
                   v-on:click="setSelectedItem('song' + item.id);store.prepare({num:10});store.deeperTracksM({item:item,num:10,flag:true,parent:'song' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                <audio preload="none"></audio>
              </div>
              <div class="title"
                   v-on:click="setSelectedItem('song' + item.id);store.deeperTracksM({item:item,num:10,flag:true,parent:'song' + item.id});store.specialClick($event)">
                <div>{{ item.name }}</div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="stitle">Artists</div>
            <div v-for="(item,index) in store.artists" class="playable-search"
                 v-bind:key="index">
              <div v-if="item.tracks[0].preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   :class="selectedItem==='artist' + item.id ? 'selected' : ''"
                   v-bind:id="'artist' + item.id"
                   v-on:click="setSelectedItem('artist' + item.id);store.prepare({num:10});store.deeperartistmob({item:item,track:item.tracks,num:10,flag:true,parent:'artist' + item.id});store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.tracks[0].preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0"
                   class="itemImg itemImg-xs itemImg-search half-opacity"
                   :class="selectedItem==='artist' + item.id ? 'selected' : ''"
                   v-bind:id="'artist' + item.id"
                   v-on:click="setSelectedItem('artist' + item.id);store.prepare({num:10});store.deeperartistmob({item:item,track:item.tracks,num:10,flag:true,parent:'artist' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="none"></audio>
              </div>
              <div class="title"
                   v-on:click="setSelectedItem('artist' + item.id);store.prepare({num:10});store.deeperartistmob({item:item,track:item.tracks,num:10,flag:true,parent:'artist' + item.id});store.specialClick($event)">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="stitle">Albums</div>
            <div v-for="(item,index) in store.albums" class="playable-search"
                 v-on:click="setSelectedItem('album' + item.id);" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   :class="selectedItem==='album' + item.id ? 'selected' : ''"
                   v-bind:id="'album' + item.id"
                   v-on:click="store.prepare({num:10});store.deeperAlbumMob({item:item,num:10,search:true,parent:'album' + item.id});store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0"
                   class="itemImg itemImg-xs itemImg-search half-opacity"
                   :class="selectedItem===item.id ? 'selected' : ''"
                   v-bind:id="'album' + item.id"
                   v-on:click="store.prepare({num:10});store.deeperAlbumMob({item:item,num:10,search:true,parent:'album' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="none"></audio>
              </div>
              <div class="title"
                   v-on:click="setSelectedItem('album' + item.id);store.deeperAlbumMob({item:item,num:10,search:true,parent:'album' + item.id});store.specialClick($event)">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="stitle">Playlists</div>
            <div v-for="(item,index) in store.splaylists" class="playable-search" v-on:click="store.playlM({item:item})"
                 v-bind:key="index">
              <div v-if="item.preview_url && item.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                   v-bind:id="'playlist' + item.id"
                   v-on:click="setSelectedItem('playlist' + item.id);store.prepare({num:10});store.playlM({item:item,parent:'playlist' + item.id});store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="!item.preview_url && item.images[0] && store.unplayable_tracks" tabindex="0"
                   class="itemImg itemImg-xs  itemImg-search"
                   :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                   v-bind:id="'playlist' + item.id"
                   v-on:click="setSelectedItem('playlist' + item.id);store.prepare({num:10});store.playlM({item:item,parent:'playlist' + item.id})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="none"></audio>
              </div>
              <div v-else-if="item.preview_url && !item.images[0]" tabindex="0"
                   class="itemImg itemImg-xs  itemImg-search"
                   :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                   v-bind:id="'playlist' + item.id"
                   v-on:click="setSelectedItem('playlist' + item.id);store.prepare({num:10});store.playlM({item:item,parent:'playlist' + item.id});store.click($event)">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0"
                   class="itemImg itemImg-xs itemImg-search half-opacity"
                   :class="selectedItem==='playlist' + item.id ? 'selected' : ''"
                   v-bind:id="'playlist' + item.id"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                   v-on:click="setSelectedItem('playlist' + item.id);store.prepare({num:10});store.playlM({item:item,parent:'playlist' + item.id})">
                <audio preload="none"></audio>
              </div>
              <div class="title"
                   v-on:click="store.playlM({item:item,parent:'playlist' + item.id});store.specialClick($event)">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <rec-track-m :num="10"></rec-track-m>
      </div>
    </teleport>
  </div>

</template>

<style scoped>

</style>