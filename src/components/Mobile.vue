<script setup>
import RecTrack from "./RecTrack.vue";
import RecTrackM from "./Mob/RecTrackM.vue";
import {Lists} from "../common/lists";
import {useDMStore} from "../stores/dm-store";
import {ref} from "vue";
import Loader from "./Loader.vue";

const store = useDMStore()

const selectedOption = ref(null)
const accordionActive = ref(true)


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

window.addEventListener('resize', () => {
  accordionActive.value = window.innerWidth < 1076;
  console.log(accordionActive.value)
})

</script>
<template>
  <ul class="tabs">
    <li id="option1">
      <a id="playlistlist" v-on:click="store.switchTabs({event:$event,mobile:true});selectedOption=1"
         v-on:click.self.once="store.fetchPlaylists({event:$event,offset:0})">Playlists</a>
    </li>
    <li id="option2">
      <a id="ta" v-on:click="store.switchTabs({event:$event,mobile:true}),store.switchArtist({num:1});selectedOption=2"
         v-on:click.self.once="store.fetchArtist({event:$event})">Top artists</a>
    </li>
    <li id="option3">
      <a v-on:click="store.switchTabs({event:$event,mobile:true}),store.switchTracks({num:1});selectedOption=3" id="tt"
         v-on:click.self.once="store.fetchApi({event:$event})">Top tracks</a>

    </li>

    <li id="option4">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});selectedOption=4" id="sa"
         v-on:click.self.once="store.fetchAlbums({offset:0,event:$event});selectedOption=4">Saved albums</a>
    </li>
    <li id="option5">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});selectedOption=5" id="st"
         v-on:click.self.once="store.fetchTracks({offset:0})">Saved tracks</a>
    </li>
    <li id="option6">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});selectedOption=6" id="fa"
         v-on:click.self.once="store.fetchFA()">Followed
        artists</a>
    </li>
    <li id="option7">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});selectedOption=7" id="nr"
         v-on:click.self.once="store.fetchNR({offset:0})">New releases</a>
    </li>
    <li id="option8">
      <a v-on:click="store.switchTabs({event:$event,mobile:true});selectedOption=8" id="spt"
         v-on:click.self.once="store.fetchSpotPlaylists({offset:0})">Spotify playlists</a>

    </li>
    <li id="srch" class="srch"><a id="sear" style="padding: 15px;"><input class="inp"
                                                                          v-on:keyup="selectedOption=9;store.search($event)"></a>

    </li>
  </ul>
  <div v-if="selectedOption===1">
    <Loader v-if="store.loader"/>
    <teleport to="#option1" :disabled="!accordionActive">
      <div id="yourplaylists" class="con2" style="display: block;">
        <div class="rel">
          <button class="btn" v-on:click="store.reloadpl({event:$event})"><img class="refresh-end"
                                                                               src="../assets/refresh-icon.png" alt="">
          </button>
        </div>
        <div class="pl" style="justify-content: center;">
          <template v-for="(item,index) of store.listplaylists" v-bind:key="index">
            <div v-bind:id="item.id" v-on:click="store.fetchInit({event:$event})" class="hr-line-dashed">{{
                item.name
              }}
            </div>
          </template>
        </div>
        <div class="play" v-for="(item,index) of store.playlists" v-bind:id="'p' + item.id" v-bind:key="index">
          <div class="con2">
            <div class="con4">{{ item.name }}</div>
            <button class="btn" v-on:click="store.reloader({num:1,event:$event})"><img class="refresh-end"
                                                                                       src="../assets/refresh-icon.png"
                                                                                       alt=""></button>
            <div class="aresset" style="width: 60%;display: flex;align-items: center;flex-wrap: wrap;cursor: pointer">
              {{ item.description }}
              <button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']"
                                        target="_blank">Open in Spotify</a></button>
              Follow<input type="checkbox" v-if="item.followed" @click.once="store.followPlaylist($event)" checked
                           v-model="item.followed">
              <input type="checkbox" v-else @click.once="store.followPlaylist($event)" v-model="item.followed"></div>
            <div v-if="item.images" class="con4" style="background-repeat: no-repeat;background-size: cover;"
                 v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
          </div>
          <div class="conm" style="display: flex;color: black" v-bind:key="index">
            <template v-if="item.tracks">
              <template v-for="(pl,ind) of item['tracks']['items']">
                <template v-if="pl.track">
                  <div class="item-container" v-bind:key="ind">
                    <div v-bind:id="pl.track.id" v-if="pl.track.preview_url && pl.track.album.images[0]" tabindex="0"
                         class="con3"
                         v-on:click.self="store.deepermobile({item:pl,num:1,event:$event}),store.specialClick($event)"
                         v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }">
                      <template v-if="pl.track.artists">{{ lists(pl.track.artists) }} - {{ pl.track.name }}</template>
                      <template v-else>{{ pl.track.name }}</template>
                    </div>
                    <div v-bind:id="pl.track.id" v-else-if="pl.track.album.images[0] && !pl.track.preview_url"
                         tabindex="0" class="con3"
                         v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }"
                         v-on:click.self="store.deepermobile({item:pl,num:1,event:$event})" style="opacity: .5">
                      <template v-if="pl.track.artists">{{ lists(pl.track.artists) }} - {{ pl.track.name }}</template>
                      <template v-else>{{ pl.track.name }}</template>
                    </div>
                    <div v-bind:id="pl.track.id" v-else-if="!pl.track.album.images[0] && pl.track.preview_url"
                         class="con3"
                         v-on:click.self="store.deepermobile({item:pl,num:1,event:$event}),store.specialClick($event)">
                      <template v-if="pl.track.artists">{{ lists(pl.track.artists) }} - {{ pl.track.name }}</template>
                      <template v-else>{{ pl.track.name }}</template>
                    </div>
                    <div v-bind:id="pl.track.id" v-else class="con3"
                         v-on:click.self="store.deepermobile({item:pl,num:1,event:$event})" style="opacity: .5">
                      <template v-if="pl.track.artists">{{ lists(pl.track.artists) }} - {{ name }}</template>
                      <template v-else>{{ pl.track.name }}</template>
                    </div>
                    <rec-track-m :num="1" :item="pl.track"></rec-track-m>
                    <audio v-if="pl.track.preview_url" preload="none" v-bind:src="pl.track.preview_url"></audio>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===2">
    <Loader v-if="store.loader"/>
    <teleport to="#option2" :disabled="!accordionActive">
      <div>
        <div style="display: flex;">
          <span id="topartists" v-on:click="store.switchArtist({num:1})"
                :class="store.selectedArtistsRange === 1 ? 'activetab':''">Last month</span>
          <button class="btn" v-on:click="store.reloadartists({num:1,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="topartists6" v-on:click="store.switchArtist({num:2})" style="margin-left: 12px"
                :class="store.selectedArtistsRange === 2 ? 'activetab':''"
                v-on:click.self.once="store.fetchArtist2({event:$event})">Last 6 month</span>
          <button class="btn" v-on:click="store.reloadartists({num:2,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
          <span id="topartistsall" v-on:click="store.switchArtist({num:3})" style="margin-left: 12px"
                :class="store.selectedArtistsRange === 3 ? 'activetab':''"
                v-on:click.self.once="store.fetchArtist3({event:$event})">All time</span>
          <button class="btn" v-on:click="store.reloadartists({num:3,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        </div>
        <div id="topartist" class="d-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===1 ? '': 'd-none'">
          <div class="item-container" v-for="(item,index) of store.topartist" v-bind:id="item.id" v-bind:key="index">
            <div v-if="item.preview_url && item.images[1]" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:item}),store.specialClick($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
            </div>
            <div v-else-if="!item.preview_url && item.images[1]" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:item})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
              {{ item.name }}
            </div>
            <div v-else-if="item.preview_url && !item.images[1]" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:item})">
              {{ item.name }}
            </div>
            <div v-else tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:2,flag:true,sib:false,related:false,parent:item})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
              {{ item.name }}
            </div>
            <rec-track-m :num="2" :item="item"></rec-track-m>
            <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
          </div>
        </div>
        <div id="topartist6" class="d-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===2 ? '': 'd-none'">
          <div v-for="(item,index) of store.topartist6" v-bind:id="item.id" v-bind:key="index">
            <div v-if="item.preview_url && item.images[1]" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:item}),store.specialClick($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
            </div>
            <div v-else-if="!item.preview_url && item.images[1]" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:item})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
              {{ item.name }}
            </div>
            <div v-else-if="item.preview_url && !item.images[1]" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:item})">
              {{ item.name }}
            </div>
            <div v-else tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:22,flag:true,sib:false,related:false,parent:item})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
              {{ item.name }}
            </div>
            <rec-track-m :num="22" :item="item"></rec-track-m>
            <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
          </div>
        </div>
        <div id="topartista" class="d-flex flex-wrap" style="color: black;width: auto;"
             :class="store.selectedArtistsRange===3 ? '': 'd-none'">
          <div class="item-container" v-for="(item,index) of store.topartista" v-bind:id="item.id" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:23,flag:true,sib:false,related:false,parent:item}),store.specialClick($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
            </div>
            <div v-else tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:23,flag:true,sib:false,related:false,parent:item})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
              {{ item.name }}
            </div>
            <rec-track-m :num="23" :item="item"></rec-track-m>
            <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
          </div>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===3">
    <Loader v-if="store.loader"/>
    <teleport to="#option3" :disabled="!accordionActive">
      <div>
        <div style="display: flex;">
          <span id="toptracks" v-on:click="store.switchTracks({num:1})"
                :class="store.selectedTracksRange === 1 ? 'activetab':''">Last month</span>
          <button class="btn" v-on:click="store.reloadtracks({num:1,event:$event})"><img class="refresh-end"
                                                                                         src="../assets/refresh-icon.png"
                                                                                         alt=""></button>
          <span id="toptrackssix" v-on:click="store.switchTracks({num:2})"
                v-on:click.self.once="store.fetchApi2({event:$event})" style="margin-left: 12px"
                :class="store.selectedTracksRange === 2 ? 'activetab':''">Last 6 month</span>
          <button class="btn" v-on:click="store.reloadtracks({num:2,event:$event})"><img class="refresh-end"
                                                                                         src="../assets/refresh-icon.png"
                                                                                         alt=""></button>
          <span id="toptracksall" v-on:click="store.switchTracks({num:3})"
                v-on:click.self.once="store.fetchApi3({event:$event})" style="margin-left: 12px"
                :class="store.selectedTracksRange === 3 ? 'activetab':''">All time</span>
          <button class="btn" v-on:click="store.reloadtracks({num:3,event:$event})"><img class="refresh-end"
                                                                                         src="../assets/refresh-icon.png"
                                                                                         alt=""></button>
        </div>
        <div id="toptrack" class="d-flex flex-wrap" :class="store.selectedTracksRange===1 ? '': 'd-none'">
          <template v-for="(item,index) of store.items" v-bind:key="index">
            <div class="item-container" v-bind:id="item.id">
              <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:3,event:$event}),store.specialClick($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                {{ lists(item.artists) }} - {{ item.name }}
              </div>
              <div v-else-if="!item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:3,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else-if="item.preview_url && !item.album.images[0]" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:3,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else tabindex="0" class="con3" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:3,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <rec-track-m :num="3" :item="item"></rec-track-m>
              <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
            </div>
          </template>
        </div>
        <div id="toptrack6" class="d-flex flex-wrap" style="display: flex;color: black;width: auto;"
             :class="store.selectedTracksRange===2 ? '': 'd-none'">
          <template v-for="(item,index) of store.itemsm" v-bind:key="index">
            <div class="item-container" v-bind:id="item.id">
              <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:32,event:$event}),store.specialClick($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                {{ lists(item.artists) }} - {{ item.name }}
              </div>
              <div v-else-if="!item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:32,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else-if="item.preview_url && !item.album.images[0]" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:32,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else-if="!item.preview_url && !item.album.images[0]" tabindex="0" class="con3" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:32,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <rec-track-m :num="32" :item="item"></rec-track-m>
              <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
            </div>
          </template>
        </div>
        <div id="toptrackall" class="d-flex flex-wrap" style="display: flex;color: black;width: auto;"
             :class="store.selectedTracksRange===3 ? '': 'd-none'">
          <template v-for="(item,index) of store.itemsl" v-bind:key="index">
            <div class="item-container" v-bind:id="item.id">
              <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:33,event:$event}),store.specialClick($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                {{ lists(item.artists) }} - {{ item.name }}
              </div>
              <div v-else-if="!item.preview_url && item.album.images[0]" tabindex="0" class="con3"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:33,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else-if="item.preview_url && !item.album.images[0]" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:33,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else tabindex="0" class="con3" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:33,event:$event});">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <rec-track-m :num="33" :item="item"></rec-track-m>
              <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
            </div>
          </template>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===4">
    <Loader v-if="store.loader"/>
    <teleport to="#option4" :disabled="!accordionActive">
      <div>
        <div id="savedalbum" class="conm">
          <div class="item-container" v-for="(item,index) of store.savedalbums" v-bind:key="index"
               v-bind:id="item.album.id">
            <div v-if="item.album.tracks.items[0].preview_url" tabindex="0" class="con3"
                 v-on:click="store.deeperAlbumMob({item:item,num:4,parent:item.album}),store.specialClick($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
              {{ lists(item.album.artists) }}
            </div>
            <div v-else-if="!item.album.tracks.items[0].preview_url && item.album.images[0]" tabindex="0" class="con3"
                 v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }"
                 v-on:click="store.deeperAlbumMob({item:item,num:4,parent:item.album})" style="opacity: .5">
              {{ lists(item.album.artists) }}
            </div>
            <div v-else tabindex="0" class="con3" style="opacity: .5"
                 v-on:click="store.deeperAlbumMob({item:item,num:4,parent:item.album})">{{ lists(item.album.artists) }}
            </div>
            <rec-track-m :num="4" :item="item.album"></rec-track-m>
            <audio v-bind:key="index" v-if="item.album.tracks.items[0].preview_url" preload="none"
                   v-bind:src="item.album.tracks.items[0].preview_url"></audio>
          </div>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===5">
    <Loader v-if="store.loader"/>
    <teleport to="#option3" :disabled="!accordionActive">
      <div>
        <div id="savedtrack" class="con2">
          <template v-for="(item,index) of store.savedtracks" v-bind:key="index">
            <div class="item-container" v-bind:id="item.track.id">
              <div v-if="item.track.preview_url && item.track.album.images[0]" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:5,event:$event}),store.specialClick($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }">
                {{ lists(item.track.artists) }} - {{ item.track.name }}
              </div>
              <div v-else-if="!item.track.preview_url && item.track.album.images[0]" tabindex="0" class="con3"
                   v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }"
                   style="opacity: .5" v-on:click="store.deepermobile({item:item,num:5,event:$event})">
                {{ lists(item.track.artists) }} - {{ item.track.name }}
              </div>
              <div v-else-if="item.track.preview_url && !item.track.album.images[0]" class="con3"
                   v-on:click="store.deepermobile({item:item,num:5,event:$event})">{{ lists(item.track.artists) }} -
                {{ item.track.name }}
              </div>
              <div v-else class="con3" v-on:click="store.deepermobile({item:item,num:5,event:$event})"
                   style="opacity: .5">{{ lists(item.track.artists) }} - {{ item.track.name }}
              </div>
              <rec-track-m :num="5" :item="item.track"></rec-track-m>
              <audio preload="auto" v-if="item.track.preview_url" v-bind:src="item.track.preview_url"></audio>
            </div>
          </template>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===6">
    <Loader v-if="store.loader"/>
    <teleport to="#option3" :disabled="!accordionActive">
      <div>
        <div style="display: flex;">
          <button class="btn" v-on:click="store.reloadartists(4,$event)"><img class="refresh-end"
                                                                              src="../assets/refresh-icon.png" alt="">
          </button>
        </div>
        <div id="followedartist" class="conm" style="display: flex;color: black;">
          <div class="item-container" v-for="(item,index) of store.followedartists" v-bind:id="item.id"
               v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:6,flag:true,sib:false,related:false,parent:item}),store.specialClick($event)"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{ item.name }}
            </div>
            <div v-else tabindex="0" class="con3"
                 v-on:click="store.deeperartistmob({item:item,track:item.tracks,num:6,flag:true,sib:false,related:false,parent:item})"
                 v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">
              {{ item.name }}
            </div>
            <rec-track-m :num="6" :item="item"></rec-track-m>
            <audio v-bind:key="index" v-if="item.preview_url" preload="none" v-bind:src="item.preview_url"></audio>
          </div>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===7">
    <Loader v-if="store.loader"/>
    <teleport to="#option3" :disabled="!accordionActive">
      <div style="display: block">
        <div id="newrelease" class="conm">
          <template v-for="(item,index) of store.newreleases" v-bind:key="index">
            <div class="item-container" v-bind:id="item.id">
              <div v-if="item.tracks.items[0].preview_url && item.images[0].url" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:7,event:$event}),store.specialClick($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else-if="!item.tracks.items[0].preview_url && item.images[0].url" tabindex="0" class="con3"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:7,event:$event})">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else-if="item.tracks.items[0].preview_url && !item.images[0].url" tabindex="0" class="con3"
                   v-on:click="store.deepermobile({item:item,num:7,event:$event})">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <div v-else tabindex="0" class="con3" style="opacity: .5"
                   v-on:click="store.deepermobile({item:item,num:7,event:$event})">{{ lists(item.artists) }} -
                {{ item.name }}
              </div>
              <rec-track-m :num="7" :item="item"></rec-track-m>
              <audio preload="auto" v-if="item.tracks.items[0].preview_url"
                     v-bind:src="item.tracks.items[0].preview_url"></audio>
            </div>
          </template>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===8">
    <Loader v-if="store.loader"/>
    <teleport to="#option3" :disabled="!accordionActive">
      <div style="display: block;">
        <div id="sptplaylists" class="con2" style="display: block;">
          <div class="head">
            <input class="inp" type="text" v-on:keyup="filterres"
                   placeholder="Please enter a search term.." title="Type in a name">
          </div>
          <div class="sp" style="display: block">
            <div class="pl" style="justify-content: center;">
              <template v-for="item of store.spotplaylists" v-bind:key="item.id">
                <div v-bind:id="item.id" v-on:click="store.SpotInit({event:$event})" class="hr-line-dashed">{{
                    item.name
                  }}
                </div>
              </template>
            </div>
          </div>
          <div class="play" v-for="(item,index) of store.sptplaylists" v-bind:id="'s' + item.id" v-bind:key="index">
            <div class="con2">
              <div class="con4">{{ item.name }}</div>
              <button class="btn" v-on:click="store.reloader({num:9,event:$event})"><img class="refresh-end"
                                                                                         src="../assets/refresh-icon.png"
                                                                                         alt=""></button>
              <div class="aresset" style="width: 60%;display: flex;align-items: center;flex-wrap: wrap;cursor: pointer">
                {{ item.description }}
                <button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']"
                                          target="_blank">Open in Spotify</a></button>
                Follow<input type="checkbox" v-if="item.followed" @click.once="store.followPlaylist($event)" checked
                             v-model="item.followed">
                <input type="checkbox" v-else @click.once="store.followPlaylist($event)" v-model="item.followed"></div>
              <div v-if="item.images" class="con4" style="background-repeat: no-repeat;background-size: cover;"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
            </div>
            <div class="conm" style="display: flex;color: black">
              <template v-if="item.tracks">
                <template v-for="(spl,index) of item['tracks']['items']" v-bind:key="index">
                  <div class="item-container">
                    <div v-bind:id="spl.track.id" v-if="spl.track.preview_url && spl.track.album.images[0]" tabindex="0"
                         class="con3"
                         v-on:click.self="store.deepermobile({item:spl,num:9,event:$event}),store.specialClick($event)"
                         v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }">
                      <template v-if="spl.track.artists">{{ lists(spl.track.artists) }} - {{ spl.track.name }}
                      </template>
                      <template v-else>{{ spl.track.name }}</template>
                    </div>
                    <div v-bind:id="spl.track.id" v-else-if="spl.track.album.images[0] && !spl.track.preview_url"
                         tabindex="0" class="con3"
                         v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }"
                         v-on:click.self="store.deepermobile({item:spl,num:9,event:$event})" style="opacity: .5">
                      <template v-if="spl.track.artists">{{ lists(spl.track.artists) }} - {{ spl.track.name }}
                      </template>
                      <template v-else>{{ spl.track.name }}</template>
                    </div>
                    <div v-bind:id="spl.track.id" v-else-if="!spl.track.album.images[0] && spl.track.preview_url"
                         class="con3"
                         v-on:click.self="store.deepermobile({item:spl,num:9,event:$event}),store.specialClick($event)">
                      <template v-if="spl.track.artists">{{ lists(spl.track.artists) }} - {{ spl.track.name }}
                      </template>
                      <template v-else>{{ spl.track.name }}</template>
                    </div>
                    <div v-bind:id="spl.track.id" v-else class="con3"
                         v-on:click.self="store.deepermobile({item:spl,num:9,event:$event})" style="opacity: .5">
                      <template v-if="spl.track.artists">{{ lists(spl.track.artists) }} - {{ spl.track.name }}
                      </template>
                      <template v-else>{{ spl.track.name }}</template>
                    </div>
                    <rec-track-m :num="9" :item="spl.track"></rec-track-m>
                    <audio v-if="spl.track.preview_url" preload="none" v-bind:src="spl.track.preview_url"></audio>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
  <div v-if="selectedOption===9">
    <Loader v-if="store.loader"/>
    <teleport to="#option3" :disabled="!accordionActive">
      <div id="search">
        <div style="display: flex;height: auto; flex-flow: row wrap;">
          <div style="width: 100%;color:var(--search-color);font-size: 1.5em;"></div>
          <div style="width: 50%">
            <div class="stitle">Songs</div>
            <div v-for="(item,index) in store.tracks" class="playable-search"
                 v-on:click="store.parentClick({event:$event})" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-on:click="store.deeperTracks({item:item,num:10,flag:true}),store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-on:click="store.deeperTracks({item:item,num:10,flag:true})"
                   v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="store.deeperTracks({item:item,num:10,flag:true})">
                <div>{{ item.name }}</div>
              </div>
            </div>
          </div>
          <div style="width: 50%">
            <div class="stitle">Artists</div>
            <div v-for="(item,index) in store.artists" class="playable-search"
                 v-on:click="store.parentClick({event:$event})" v-bind:key="index">
              <div v-if="item.tracks[0].preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-on:click="store.deeperartist({item:item,track:item.tracks,num:10,flag:true}),store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.tracks[0].preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="store.deeperartist({item:item,track:item.tracks,num:10,flag:true})">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div style="width: 50%">
            <div class="stitle">Albums</div>
            <div v-for="(item,index) in store.albums" class="playable-search"
                 v-on:click="store.parentClick({event:$event})" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-on:click="store.deeperAlbumMob({item:item,num:10,search:true}),store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-on:click="store.deeperAlbum({item:item,num:10,search:true})"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="store.deeperAlbum({item:item,num:10,search:true})">{{ item.name }}</div>
            </div>
          </div>
          <div style="width: 50%">
            <div class="stitle">Playlists</div>
            <div v-for="(item,index) in store.splaylists" class="playable-search" v-on:click="store.playl({item:item})"
                 v-bind:key="index">
              <div v-if="item.preview_url && item.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-on:click="store.playl({item:item}),store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="!item.preview_url && item.images[0] && store.unplayable_tracks" tabindex="0"
                   class="itemImg itemImg-xs  itemImg-search" v-on:click="store.playl({item:item}),store.click($event)"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="none"></audio>
              </div>
              <div v-else-if="item.preview_url && !item.images[0]" tabindex="0"
                   class="itemImg itemImg-xs  itemImg-search" v-on:click="store.playl({item:item}),store.click($event)">
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="store.unplayable_tracks" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                   v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"
                   v-on:click="store.playl({item:item})" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="store.playl({item:item})">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <rec-track :num="10"></rec-track>
      </div>
    </teleport>
  </div>

</template>

<style scoped>

</style>