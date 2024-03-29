<script setup>
import {Lists} from "@/common/lists";
import {useDMStore} from "@/stores/dm-store";

defineProps(['d', 'num'])

const store = useDMStore()

function lists(artists) {
  return Lists.Ls(artists)
}
</script>
<template>
  <div class="playlist card2" v-bind:key="'dp'+index" v-bind:id="'p' + d.id">
    <div class="con2">
      <div class="con4">{{ d.name }}</div>
      <button class="btn" v-on:click="store.reloader({num:num,event:$event})"><img class="refresh-end"
                                                                                   src="@/assets/refresh-icon.png"
                                                                                   alt=""></button>
      <div class="aresset" style="width: 60%;display: flex;align-items: center;flex-wrap: wrap;cursor: pointer"
           v-html="d.description"></div>
      <div class="con4" style="background-repeat: no-repeat;background-size: cover;"
           v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }"></div>
    </div>
    <div class="con2" style="display: flex;color: black">
      <div class="trackbody" v-for="(plitem,index) of d['tracks']['items']" v-bind:key="index">
        <div v-if="plitem.track && plitem.track.preview_url && plitem.track.album.images[0]" v-bind:id="plitem.track.id"
             tabindex="0" class="con3"
             v-on:click="store.deeperTracks({item:plitem.track,num:num,flag:false,sib:'playlist'})"
             v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)"
             v-bind:style="{ 'background-image': 'url(' + plitem.track.album.images[0].url + ')' }">
          {{ lists(plitem['track']['artists']) }} - {{ plitem.track.name }}
          <audio preload="auto" v-bind:src="plitem.track.preview_url"></audio>
        </div>
        <div v-else-if="plitem.track && !plitem.track.preview_url && plitem.track.album.images[0]"
             v-bind:id="plitem.track.id" tabindex="0" class="con3"
             v-on:click="store.deeperTracks({item:plitem.track,num:num,flag:false,sib:'playlist'});"
             v-bind:style="{ 'background-image': 'url(' + plitem.track.album.images[0].url + ')' }" style="opacity: .5">
          {{ lists(plitem['track']['artists']) }} - {{ plitem.track.name }}
          <audio preload="none"></audio>
        </div>
        <div v-else-if="plitem.track && plitem.track.preview_url && !plitem.track.album.images[0]"
             v-bind:id="plitem.track.id" tabindex="0" class="con3"
             v-on:click="store.deeperTracks({item:plitem.track,num:num,flag:false,sib:'playlist'})"
             v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)">
          {{ lists(plitem['track']['artists']) }} - {{ plitem.track.name }}
          <audio preload="auto" v-bind:src="plitem.track.preview_url"></audio>
        </div>
        <div v-else-if="plitem.track && plitem.track && !plitem.track.preview_url && !plitem.track.album.images[0]"
             tabindex="0" class="con3" v-bind:id="plitem.track.id"
             v-on:click="store.deeperTracks({item:plitem.track,num:num,flag:false,sib:'playlist'});"
             style="opacity: .5">{{ lists(plitem['track']['artists']) }} - {{ plitem.track.name }}
          <audio preload="none"></audio>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>