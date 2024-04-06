<script setup>
import {useDMStore} from "../stores/dm-store";


defineProps(['d','index','num','cover'])
const store = useDMStore()
</script>
<template>
  <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2 plls d-flex" style="margin-top: 12px; margin-bottom: 6px;">
    <div class="con3" v-if="d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)">{{d.name}}
      <audio preload="auto" v-bind:src="d.preview_url"></audio>
    </div>
    <div class="con3 half-opacity" v-else-if="!d.preview_url && cover && store.unplayable_tracks" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }">{{d.name}}
      <audio preload="none"></audio>
    </div>
    <div class="con3" v-else-if="d.preview_url && !cover" v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)">{{d.name}}
      <audio preload="auto" v-bind:src="d.preview_url"></audio>
    </div>
    <div class="con3 half-opacity" v-else-if="store.unplayable_tracks">{{d.name}}
      <audio preload="none"></audio>
    </div>
    <div style="width: 50%;text-align: left;margin-left: 10px;">
      <div>{{d.name}}</div>
      <div class="d-flex align-items-center"><p>By </p>
        <div v-for="(art,index) in d.artists" v-bind:key="index" class="d-flex align-items-center">
          <div class="mx-2 pointer" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})">{{art.name}}</div>
        </div>
      </div>
      <span class="light-washed-rose" v-if="num !== 7" v-on:click="store.seedTracks({item:d,num:num,sib:'pl',child:'d'+ d.id})">Recommended songs based on this</span>
      <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
<!--        Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">-->
<!--        <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">-->
      </div>
    </div>
    <template v-for="(art,index) in d.artists">
      <div class="artist-cirle con3" v-if="d.preview_url && cover" v-bind:key="index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }">
        <audio preload="auto" v-bind:src="d.preview_url"></audio>
        <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
      <div class="artist-cirle con3" v-else-if="!d.preview_url && cover && store.unplayable_tracks" v-bind:key="'2'+index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" style="opacity: .5">
        <audio preload="none"></audio>
        <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
      <div class="artist-cirle con3" v-else-if="d.preview_url && !cover" v-bind:key="'3'+index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})">
        <audio preload="auto" v-bind:src="d.preview_url"></audio>
        <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
      <div class="artist-cirle con3" v-else-if="store.unplayable_tracks" v-bind:key="'4'+index" v-on:click="store.deeperartist({item:art,track:d,num:num,flag:false,sib:'plls'})" style="opacity: .5">
        <audio preload="none"></audio>
        <div class="float-left" style="position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
    </template>
  </div>
</template>



<style scoped>

</style>