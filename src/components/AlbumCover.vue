<script setup>
import {useDMStore} from "../stores/dm-store";

defineProps(['d','cover'])
const store = useDMStore()

</script>
<template>
  <div v-if="d.preview_url && cover" class="con3" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div v-else-if="!d.preview_url && cover && store.unplayable_tracks" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" tabindex="0" class="con3 half-opacity">{{d.name}}
    <audio preload="none"></audio>
  </div>
  <div v-else-if="d.preview_url && !cover" class="con3" v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity">{{d.name}}
    <audio preload="none"></audio>
  </div>
</template>



<style scoped>

</style>