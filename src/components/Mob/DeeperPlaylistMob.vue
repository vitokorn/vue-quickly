<script setup>
import {Lists} from "../../common/lists";
import {useDMStore} from "../../stores/dm-store";
import {computed, ref} from "vue";
import SortTracks from "../SortTracks.vue";

const props = defineProps(['d', 'num', 'item'])
const store = useDMStore()
const selected = ref()
const sortedDeeperPlaylistItems = computed(() => {
  const itemsCopy = [...props.d['tracks']['items']];
  switch (selectedDeeperPlaylistSortOption.value) {
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
function setActive(id) {
  selected.value = id
}
function lists(artists) {
  return Lists.Ls(artists)
}
</script>
<template>
  <div class="playlist card2" v-bind:id="'p' + d.id">
    <div class="row align-items-center text-center w-100">
      <div class="col-3 text-dark" style="font-weight: bold;color: black">
        <div class="d-flex justify-content-center align-items-center">
          <div>{{ d.name }}</div>
          <button class="btn" v-on:click="store.reloader({num:1,event:$event})"><img
              class="refresh-end" src="../assets/refresh-icon.png" alt=""></button>
        </div>

      </div>
      <div class="col-4 aresset display-flex align-items-center flex-wrap pointer" v-html="d.description">

      </div>
      <div v-if="d.images[0]" class="col-3">
        <img style="max-height: 165px" :src="d.images[0].url">
      </div>
      <div class="col-2">
        <div style="color: black;">Follow</div><input type="checkbox" v-if="d.followed"
                                                      @click.once="store.followPlaylist($event)" checked
                                                      v-model="d.followed">
        <button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']"
                                  target="_blank">Open in Spotify</a></button>
        <sort-tracks v-model="selectedDeeperPlaylistSortOption"/>
      </div>
    </div>
    <div class="con2 display-flex" style="color: black">
      <div class="trackbody" v-for="(plitem,index) of sortedDeeperPlaylistItems" v-bind:key="index" @click="setActive(plitem.track.id);">
        <div v-if="plitem.track && plitem.track.preview_url && plitem.track.album.images[0]" v-bind:id="plitem.track.id"
             tabindex="0" class="con3"
             :class="selected===plitem.track.id ? 'selected' : ''"
             v-on:click="store.deeperTracksM({item:plitem.track,num:num,flag:false,sib:'playlist',parent:'p' + d.id});store.click($event)"
             v-bind:style="{ 'background-image': 'url(' + plitem.track.album.images[0].url + ')' }">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ lists(plitem['track']['artists']) }}</div>
              <div class="track-name">{{ plitem.track.name }}</div>
            </div>
          </div>
          <audio preload="auto" v-bind:src="plitem.track.preview_url"></audio>
        </div>
        <div
            v-else-if="plitem.track && !plitem.track.preview_url && plitem.track.album.images[0] && store.unplayable_tracks"
            :class="selected===plitem.track.id ? 'selected' : ''"
            v-bind:id="plitem.track.id" tabindex="0" class="con3 half-opacity"
            v-on:click="store.deeperTracksM({item:plitem.track,num:num,flag:false,sib:'playlist',parent:'p' + d.id});"
            v-bind:style="{ 'background-image': 'url(' + plitem.track.album.images[0].url + ')' }">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ lists(plitem['track']['artists']) }}</div>
              <div class="track-name">{{ plitem.track.name }}</div>
            </div>
          </div>
          <audio preload="none"></audio>
        </div>
        <div v-else-if="plitem.track && plitem.track.preview_url && !plitem.track.album.images[0]"
             :class="selected===plitem.track.id ? 'selected' : ''"
             v-bind:id="plitem.track.id" tabindex="0" class="con3"
             v-on:click="store.deeperTracksM({item:plitem.track,num:num,flag:false,sib:'playlist',parent:'p' + d.id});store.click($event)">
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ lists(plitem['track']['artists']) }}</div>
              <div class="track-name">{{ plitem.track.name }}</div>
            </div>
          </div>
          <audio preload="auto" v-bind:src="plitem.track.preview_url"></audio>
        </div>
        <div
            v-else-if="plitem.track && plitem.track && !plitem.track.preview_url && !plitem.track.album.images[0] && store.unplayable_tracks"
            tabindex="0" class="con3 half-opacity" v-bind:id="plitem.track.id"
            :class="selected===plitem.track.id ? 'selected' : ''"
            v-on:click="store.deeperTracksM({item:plitem.track,num:num,flag:false,sib:'playlist',parent:'p' + d.id});"
        >
          <div class="track-overlay">
            <div class="track-info">
              <div class="track-artists">{{ lists(plitem['track']['artists']) }}</div>
              <div class="track-name">{{ plitem.track.name }}</div>
            </div>
          </div>
          <audio preload="none"></audio>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>