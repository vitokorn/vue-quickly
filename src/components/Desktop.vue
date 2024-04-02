<script setup>
import RecTrack from "./RecTrack.vue";
import {useDMStore} from "../stores/dm-store";
import {ref} from "vue";
import Loader from "./Loader.vue";
import Footer from "./Footer.vue";

const store = useDMStore()
const selectedOption = ref(null)
const accordionActive = ref(false)

// eslint-disable-next-line no-unused-vars
function polygon(item, d, num) {
  item.deeper1 = []
  let tt = []
  tt = item
  tt.type = 'pl'
  store.setDeeper1(tt)
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

window.addEventListener('resize', () => {
  accordionActive.value = window.innerWidth < 1076;
  console.log(accordionActive.value)
})


</script>

<template>
  <div>
    <ul class="tabs">
      <li id="option1">
        <a id="playlistlist" v-on:click="store.switchTabs({event:$event});selectedOption=1"
           v-on:click.self.once="store.fetchPlaylists({event:$event,offset:0})">Playlists Pc</a>
      </li>
      <li id="option2">
        <a id="ta"
           v-on:click="store.switchTabs({event:$event}),store.switchArtist({num:1});selectedOption=2"
           v-on:click.self.once="store.fetchArtist({event:$event})">Top artists</a>
      </li>
      <li id="option3">
        <a v-on:click="store.switchTabs({event:$event}),store.switchTracks({num:1});selectedOption=3"
           id="tt" v-on:click.self.once="store.fetchApi({event:$event})">Top tracks</a>
      </li>
      <li id="option4">
        <a v-on:click="store.switchTabs({event:$event});selectedOption=4" id="sa"
           v-on:click.self.once="store.fetchAlbums({offset:0,event:$event})">Saved albums</a>

      </li>
      <li id="option5">
        <a v-on:click="store.switchTabs({event:$event});selectedOption=5" id="st"
           v-on:click.self.once="store.fetchTracks({offset:0})">Saved tracks</a>

      </li>
      <li id="option6">
        <a v-on:click="store.switchTabs({event:$event});selectedOption=6" id="fa"
           v-on:click.self.once="store.fetchFA()">Followed artists</a>

      </li>
      <li id="option7">
        <a v-on:click="store.switchTabs({event:$event});selectedOption=7" id="nr"
           v-on:click.self.once="store.fetchNR({offset:0})">New releases</a>

      </li>
      <li id="option8">
        <a v-on:click="store.switchTabs({event:$event});selectedOption=8" id="spt"
           v-on:click.self.once="store.fetchSpotPlaylists({offset:0})">Spotify playlists</a>
      </li>
      <li id="srch" class="srch"><a id="sear" style="padding: 15px;"><input type="search" class="inp" style="cursor: pointer"
                                                                            v-on:keyup="selectedOption=9;store.search($event)"></a>
      </li>
    </ul>
    <div v-if="selectedOption===1">
      <Loader v-if="store.loader"/>
      <teleport to="#option1" :disabled="!accordionActive">
        <div id="yourplaylists" class="con2" style="display: block;">
          <div class="rel">
            <button class="btn" v-on:click="store.reloadpl({event:$event})"><img class="refresh-end"
                                                                                 src="../assets/refresh-icon.png"
                                                                                 alt=""></button>
          </div>
          <div class="pl" style="justify-content: center;">
            <template v-for="(item,index) of store.listplaylists" v-bind:key="index">
              <div v-bind:id="item.id" v-on:click="store.fetchInit({event:$event})"
                   class="hr-line-dashed">{{ item.name }}
              </div>
            </template>
          </div>
          <div class="play" v-for="(item,index) of store.playlists" v-bind:id="'p' + item.id"
               v-bind:key="index">
            <div class="con2">
              <div class="con4">{{ item.name }}</div>
              <button class="btn" v-on:click="store.reloader({num:1,event:$event})"><img
                  class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
              <div class="aresset"
                   style="width: 60%;display: flex;align-items: center;flex-wrap: wrap;cursor: pointer">
                {{ item.description }}
                <button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']"
                                          target="_blank">Open in Spotify</a></button>
                Follow<input type="checkbox" v-if="item.followed"
                             @click.once="store.followPlaylist($event)" checked
                             v-model="item.followed">
                <input type="checkbox" v-else @click.once="store.followPlaylist($event)"
                       v-model="item.followed"></div>
              <div v-if="item.images[0]" class="con4" style="background-repeat: no-repeat;background-size: cover;"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
            </div>
            <div class="con2" style="display: flex;color: black" v-bind:key="index">
              <template v-if="item.tracks">
                <template v-for="(pl,ind) of item['tracks']['items']">
                  <template v-if="pl.track">
                    <div v-bind:id="pl.track.id" v-bind:key="ind"
                         v-if="pl.track.preview_url && pl.track.album.images[0]" tabindex="0" class="con3"
                         v-on:mouseover="store.mouseOver($event)"
                         v-on:mouseleave="store.mouseLeave($event)"
                         v-on:click="store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])"
                         v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }">
                      {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}
                      <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                    </div>
                    <div v-else-if="pl.track.album.images[0] && !pl.track.preview_url" tabindex="0"
                         v-bind:key="'2'+ind" class="con3"
                         v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }"
                         v-on:click="store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])"
                         style="opacity: .5">{{ lists(pl['track']['artists']) }} - {{ pl.track.name }}
                      <audio preload="auto"></audio>
                    </div>
                    <div v-else-if="!pl.track.album.images[0] && pl.track.preview_url" v-bind:key="'3'+ind"
                         class="con3"
                         v-on:click="store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])">
                      {{ lists(pl['track']['artists']) }} - {{ pl.track.name }}>
                      <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                    </div>
                    <div v-else v-bind:key="'4'+ind" class="con3"
                         v-on:click="store.deeper({item:pl,num:1,event:$event}); store.queuein(pl['track'])"
                         style="opacity: .5">{{ lists(pl['track']['artists']) }} - {{ pl.track.name }}>
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
    <div v-if="selectedOption===2">
      <Loader v-if="store.loader"/>
      <teleport to="#option2" :disabled="!accordionActive">
      <div style="display: flex;">
        <span id="topartists" v-on:click="store.switchArtist({num:1})" :class="store.selectedArtistsRange === 1 ? 'activetab':''">Last month</span>
        <button class="btn" v-on:click="store.reloadartists({num:1,event:$event})"><img
            class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        <span id="topartists6" v-on:click="store.switchArtist({num:2})" style="margin-left: 12px" :class="store.selectedArtistsRange === 2 ? 'activetab':''"
              v-on:click.self.once="store.fetchArtist2({event:$event})">Last 6 month</span>
        <button class="btn" v-on:click="store.reloadartists({num:2,event:$event})"><img
            class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        <span id="topartistsall" v-on:click="store.switchArtist({num:3})" style="margin-left: 12px" :class="store.selectedArtistsRange === 3 ? 'activetab':''"
              v-on:click.self.once="store.fetchArtist3({event:$event})">All time</span>
        <button class="btn" v-on:click="store.reloadartists({num:3,event:$event})"><img
            class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
      </div>
      <div id="topartist" class="d-flex flex-wrap" style="color: black;width: auto;" :class="store.selectedArtistsRange===1 ? '': 'd-none'">
        <template v-for="(item,index) of store.topartist" v-bind:key="index">
          <div v-if="item.preview_url" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
               v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
            <audio preload="auto" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:2,flag:true})"
               v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
            {{ item.name }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="2">

        </rec-track>
      </div>
      <div id="topartist6" class="d-flex flex-wrap" style="color: black;width: auto;" :class="store.selectedArtistsRange===2 ? '': 'd-none'">
        <template v-for="(item,index) of store.topartist6" v-bind:key="index">
          <div v-if="item.preview_url" tabindex="0" class="con3"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:22,flag:true})"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
            <audio preload="auto" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:22,flag:true})"
               v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
            {{ item.name }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="22">

        </rec-track>
      </div>
      <div id="topartista" class="d-flex flex-wrap" style="color: black;width: auto;" :class="store.selectedArtistsRange===3 ? '': 'd-none'">
        <template v-for="(item,index) of store.topartista">
          <div v-if="item.preview_url" tabindex="0" v-bind:key="index"
               class="con3"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:23,flag:true})"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
            <audio preload="auto" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:key="'2'+index"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:23,flag:true})"
               v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
            {{ item.name }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="23"></rec-track>
      </div>
      </teleport>
    </div>
    <div v-if="selectedOption===3">
      <Loader v-if="store.loader"/>
      <teleport to="#option3" :disabled="!accordionActive">
      <div style="display: flex;">
        <span id="toptracks" v-on:click="store.switchTracks({num:1});" :class="store.selectedTracksRange === 1 ? 'activetab':''">Last month</span>
        <button class="btn" v-on:click="store.reloadtracks({num:1,event:$event})"><img
            class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        <span id="toptrackssix" v-on:click="store.switchTracks({num:2})"
              v-on:click.self.once="store.fetchApi2({event:$event})" style="margin-left: 12px" :class="store.selectedTracksRange === 2 ? 'activetab':''">Last 6 month</span>
        <button class="btn" v-on:click="store.reloadtracks({num:2,event:$event})"><img
            class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        <span id="toptracksall" v-on:click="store.switchTracks({num:3})"
              v-on:click.self.once="store.fetchApi3({event:$event})" style="margin-left: 12px" :class="store.selectedTracksRange === 3 ? 'activetab':''">All time</span>
        <button class="btn" v-on:click="store.reloadtracks({num:3,event:$event})"><img
            class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
      </div>
      <div id="toptrack" class="d-flex flex-wrap" :class="store.selectedTracksRange===1 ? '': 'd-none'">
        <template class="trackbody" v-for="(item,index) of store.items" v-bind:key="index">
          <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeper({item:item,num:3,event:$event}); store.queuein(item)"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
            {{ lists(item.artists) }} - {{ item.name }}
            <audio preload="auto" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else-if="item.album.images[0]" tabindex="0" class="con3"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5"
               v-on:click="store.deeper({item:item,num:3,event:$event}); store.queuein(item)">
            {{ lists(item.artists) }} - {{ item.name }}
            <audio preload="auto"></audio>
          </div>
          <div v-else tabindex="0" class="con3" style="opacity: .5"
               v-on:click="store.deeper({item:item,num:3,event:$event}); store.queuein(item)">
            {{ lists(item.artists) }} - {{ item.name }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="3">

        </rec-track>
      </div>
      <div id="toptrack6" class="d-flex flex-wrap" style="display: flex;color: black;width: auto;" :class="store.selectedTracksRange===2 ? '': 'd-none'">
        <template class="trackbody" v-for="(item,index) of store.itemsm" v-bind:key="index">
          <div v-if="item.preview_url" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeper({item:item,num:32,event:$event});"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
            {{ lists(item.artists) }} - {{ item.name }}
            <audio preload="auto" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
               v-on:click="store.deeper({item:item,num:32,event:$event})" style="opacity: .5">
            {{ lists(item.artists) }} - {{ item.name }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="32">

        </rec-track>
      </div>
      <div id="toptrackall" class="d-flex flex-wrap" style="display: flex;color: black;width: auto;" :class="store.selectedTracksRange===3 ? '': 'd-none'">
        <template class="trackbody" v-for="(item,index) of store.itemsl" v-bind:key="index">
          <div v-if="item.preview_url" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeper({item:item,num:33,event:$event})"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
            {{ lists(item.artists) }} - {{ item.name }}
            <audio preload="auto" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
               v-on:click="store.deeper({item:item,num:33,event:$event})" style="opacity: .5">
            {{ lists(item.artists) }} - {{ item.name }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="33">

        </rec-track>

      </div>
      </teleport>
    </div>
    <div v-if="selectedOption===4">
      <Loader v-if="store.loader"/>
      <teleport to="#option4" :disabled="!accordionActive">

      <div id="savedalbum" class="d-flex flex-wrap">
        <template class="albumbody" v-for="(item,index) of store.savedalbums" v-bind:key="index">
          <div v-if="item.album.tracks.items[0].preview_url" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeperAlbum({item:item,num:4})"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
            {{ lists(item.album.artists) }}
            <audio preload="auto" v-bind:src="item.album.tracks.items[0].preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"
               v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
               v-on:click="store.deeperAlbum({item:item,num:4})" style="opacity: .5">
            {{ lists(item.album.artists) }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="4">

        </rec-track>
      </div>
      </teleport>
    </div>
    <div v-if="selectedOption===5">
      <Loader v-if="store.loader"/>
      <teleport to="#option5" :disabled="!accordionActive">
      <div id="savedtrack" class="d-flex flex-wrap">
        <template class="albumbody" v-for="(item,index) of store.savedtracks" v-bind:key="index">
          <div v-if="item.track.preview_url && item.track.album.images[0]" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeper({item:item,num:5,event:$event}); store.queuein(item.track)"
               v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }">
            {{ lists(item.track.artists) }} - {{ item.track.name }}
            <audio preload="auto" v-bind:src="item.track.preview_url"></audio>
          </div>
          <div v-else-if="item.track.album.images[0]" tabindex="0" class="con3"
               v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }"
               style="opacity: .5"
               v-on:click="store.deeper({item:item,num:5,event:$event}); store.queuein(item.track)">
            {{ lists(item.track.artists) }} - {{ item.track.name }}
            <audio preload="auto"></audio>
          </div>
          <div v-else class="con3"
               v-on:click="store.deeper({item:item,num:5,event:$event}); store.queuein(item.track)"
               style="opacity: .5">{{ lists(item.track.artists) }} - {{ item.track.name }}
          </div>
        </template>
        <rec-track :num="5"></rec-track>
      </div>
      </teleport>
    </div>
    <div v-if="selectedOption===6">
      <Loader v-if="store.loader"/>
      <teleport to="#option6" :disabled="!accordionActive">
      <div style="display: flex;">
        <button class="btn" v-on:click="store.reloadartists(4,$event)"><img class="refresh-end"
                                                                            src="../assets/refresh-icon.png"
                                                                            alt=""></button>
      </div>
      <div id="followedartist" class="d-flex flex-wrap">
        <template class="fabody" v-for="(item,index) of store.followedartists" v-bind:key="index">
          <div v-if="item.preview_url" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:6,flag:true})"
               v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">{{ item.name }}
            <audio preload="auto" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"
               v-on:click="store.deeperartist({item:item,track:item.tracks,num:6,flag:true})"
               v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
            {{ item.name }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="6"></rec-track>
      </div>
      </teleport>
    </div>
    <div v-if="selectedOption===7" style="display: block;">
      <Loader v-if="store.loader"/>
      <teleport to="#option7" :disabled="!accordionActive">

      <div id="newrelease" class="d-flex flex-wrap">
        <template class="newbody" v-for="(item,index) of store.newreleases" v-bind:key="index">
          <div v-if="item.tracks.items[0].preview_url" tabindex="0" class="con3"
               v-on:mouseover="store.mouseOver($event)"
               v-on:mouseleave="store.mouseLeave($event)"
               v-on:click="store.deeper({item:item,num:7,event:$event}); store.queuein(item)"
               v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">{{ lists(item.artists) }} -
            {{ item.name }}
            <audio preload="auto" v-bind:src="item.tracks.items[0].preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"
               v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5"
               v-on:click="store.deeper({item:item,num:7,event:$event}); store.queuein(item)">
            {{ lists(item.artists) }}
            <audio preload="auto"></audio>
          </div>
        </template>
        <rec-track :num="7"></rec-track>
      </div>
      </teleport>
    </div>
    <div v-if="selectedOption===8" style="display: block;">
      <Loader v-if="store.loader"/>
      <teleport to="#option8" :disabled="!accordionActive">
      <div id="sptplaylists" class="con2" style="display: block;">
        <div class="head">
          <input class="inp" type="text" v-on:keyup="filterres"
                 placeholder="Please enter a search term.." title="Type in a name">

        </div>
        <div class="sp" style="display: block">
          <div class="pl" style="justify-content: center;">
            <template v-for="item of store.spotplaylists" v-bind:key="item.id">
              <div v-bind:id="item.id" v-on:click="store.SpotInit({event:$event})"
                   class="hr-line-dashed">{{ item.name }}
              </div>
            </template>
          </div>
        </div>
        <div class="play" v-for="(item,index) of store.sptplaylists" v-bind:id="'s' + item.id"
             v-bind:key="index">
          <div class="con2">
            <div class="con4">{{ item.name }}</div>
            <button class="btn" v-on:click="store.reloader({num:9,event:$event})"><img
                class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
            <div class="aresset"
                 style="width: 60%;display: flex;align-items: center;flex-wrap: wrap;cursor: pointer">
              {{ item.description }}
              <button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']"
                                        target="_blank">Open in Spotify</a></button>
              Follow<input type="checkbox" v-if="item.followed"
                           @click.once="store.followPlaylist($event)" checked
                           v-model="item.followed">
              <input type="checkbox" v-else @click.once="store.followPlaylist($event)"
                     v-model="item.followed"></div>
            <div v-if="item.images" class="con4" style="background-repeat: no-repeat;background-size: cover;"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
          </div>
          <div class="d-flex flex-wrap" style="color: black">
            <template v-if="item.tracks">
              <template v-for="(spl,index) of item['tracks']['items']">
                <div v-bind:id="spl.track.id" v-bind:key="index"
                     v-if="spl.track.preview_url && spl.track.album.images[0]" tabindex="0" class="con3"
                     v-on:mouseover="store.mouseOver($event)"
                     v-on:mouseleave="store.mouseLeave($event)"
                     v-on:click="store.deeper({item:spl,num:9,event:$event}); store.queuein(spl['track'])"
                     v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }">
                  {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                  <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                </div>
                <div v-bind:id="spl.track.id" v-else-if="!spl.track.preview_url && spl.track.album.images[0]"
                     tabindex="0" v-bind:key="'2'+index" class="con3"
                     v-on:click="store.deeper({item:spl,num:9,event:$event}); store.queuein(spl['track'])"
                     v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }"
                     style="opacity: .5">{{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                  <audio preload="auto"></audio>
                </div>
                <div v-bind:id="spl.track.id" v-else-if="spl.track.preview_url && !spl.track.album.images[0]"
                     tabindex="0" v-bind:key="'3'+index" class="con3"
                     v-on:click="store.deeper({item:spl,num:9,event:$event}); store.queuein(spl['track'])">
                  {{ lists(spl['track']['artists']) }} - {{ spl.track.name }}
                  <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                </div>
                <div v-bind:id="spl.track.id" v-else v-bind:key="'4'+index" class="con3"
                     v-on:click="store.deeper({item:spl,num:9,event:$event}); store.queuein(spl['track'])"
                     style="opacity: .5">{{ lists(spl['track']['artists']) }} - {{ spl.track.name }}>
                </div>
              </template>
            </template>
          </div>
        </div>
        <rec-track :num="9">

        </rec-track>
      </div>
      </teleport>
    </div>
    <div v-if="selectedOption===9" id="search">
      <Loader v-if="store.loader"/>
      <div style="display: flex;height: auto; flex-flow: row wrap;">
        <div style="width: 100%;color:var(--search-color);font-size: 1.5em;"></div>
        <div style="width: 50%">
          <div class="stitle">Songs</div>
          <div v-for="(item,index) in store.tracks" class="playable-search"
               v-on:mouseover="store.parentmouseOver($event)"
               v-on:mouseleave="store.parentmouseLeave($event)" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-on:click="store.deeperTracks({item:item,num:10,flag:true})"
                 v-on:mouseover="store.mouseOver($event)"
                 v-on:mouseleave="store.mouseLeave($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-on:click="store.deeperTracks({item:item,num:10,flag:true})"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">
              <audio preload="auto"></audio>
            </div>
            <div class="title" v-on:click="store.deeperTracks({item:item,num:10,flag:true})">
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div style="width: 50%">
          <div class="stitle">Artists</div>
          <div v-for="(item,index) in store.artists" class="playable-search"
               v-on:mouseover="store.parentmouseOver($event)"
               v-on:mouseleave="store.parentmouseLeave($event)" v-bind:key="index">
            <div v-if="item.tracks[0].preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-on:click="store.deeperartist({item:item,track:item.tracks.tracks,num:10,flag:true})"
                 v-on:mouseover="store.mouseOver($event)"
                 v-on:mouseleave="store.mouseLeave($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.tracks[0].preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
              <audio preload="auto"></audio>
            </div>
            <div class="title"
                 v-on:click="store.deeperartist({item:item,track:item.tracks.tracks,num:10,flag:true})">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div style="width: 50%">
          <div class="stitle">Albums</div>
          <div v-for="(item,index) in store.albums" class="playable-search"
               v-on:mouseover="store.parentmouseOver($event)"
               v-on:mouseleave="store.parentmouseLeave($event)" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-on:click="store.deeperAlbum({item:item,num:10,child:false,search:true})"
                 v-on:mouseover="store.mouseOver($event)"
                 v-on:mouseleave="store.mouseLeave($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-on:click="store.deeperAlbum({item:item,num:10,child:false,search:true})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
              <audio preload="auto"></audio>
            </div>
            <div class="title"
                 v-on:click="store.deeperAlbum({item:item,num:10,child:false,search:true})">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div style="width: 50%">
          <div class="stitle">Playlists</div>
          <div v-for="(item,index) in store.splaylists" class="playable-search"
               v-on:mouseover="store.parentmouseOver($event)"
               v-on:mouseleave="store.parentmouseLeave($event)" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-on:mouseover="store.mouseOver($event)"
                 v-on:mouseleave="store.mouseLeave($event)"
                 v-on:click="store.playl({item:item})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
              <audio preload="auto" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                 v-on:click="store.playl({item:item})" style="opacity: .5">
              <audio preload="auto"></audio>
            </div>
            <div class="title" v-on:click="store.playl({item:item})">{{ item.name }}</div>
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
