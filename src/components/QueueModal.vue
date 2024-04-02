<script setup>
import {useDMStore} from "../stores/dm-store";

const store = useDMStore()
</script>

<template>
  <div class="modal" v-if="store.queueModal">
    <a class="modal__close" href="#"></a>
    <div class="modal__content">
      <a class="modal__content__close pointer" @click="store.queueModal=false">x</a>
      <div style="margin-bottom: 10px;">Queue</div>
      <div class="d-flex align-items-center">
        <button v-on:click="store.savequeue()">Save all tracks</button>
        <select class="text-truncate">
          <option selected disabled>Add all to playlist</option>
          <option v-on:click="store.createplaylist()">New playlist</option>
          <template v-for="(playlist,index) of store.listplaylists" v-bind:key="index">
            <option v-bind:id="playlist.id">{{ playlist.name }}</option>
          </template>
        </select>
        <div v-on:click="store.removequeue()"><svg height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg></div>
      </div>
      <div class="pe-3" style="height: 250px;overflow-y: auto;margin-top: 10px;">
        <div v-for="(q,index) in store.queuearr" class="playable-modal"
             v-bind:key="index">
          <div class="d-flex">
            <div v-if="q.image" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
                 v-bind:style="{ 'background-image': 'url(' + q.image.url + ')' }">
            </div>
            <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" style="color: grey;opacity: .5">
              <audio preload="none"></audio>
            </div>
            <div>
              <div style="font-size: .9em;">{{ q.name }}</div>
              <div class="artist" style="font-size: .85em;">{{ q.artists }}</div>
            </div>
          </div>
          <div class="d-flex align-items-center" v-on:click="store.removequeueitem(q.id)"><svg height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg></div>
        </div>
      </div>
      <p>Spotify Premium required to play the full song in Discover Mobily. Save these tracks above to listen in the
        main Spotify app.</p>
    </div>
  </div>
</template>

<style scoped>

</style>