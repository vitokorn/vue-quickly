<script setup>
import {useDMStore} from "../stores/dm-store";

defineProps(['d', 'cover'])
const store = useDMStore()

</script>

<template>
  <div class="con3" v-if="d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div class="con3" v-else-if="!d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" style="opacity: .5">{{d.name}}
  </div>
  <div class="con3" v-else-if="d.preview_url && !cover" v-on:mouseover="store.mouseOver($event)" v-on:mouseleave="store.mouseLeave($event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div class="con3 half-opacity" v-else>{{d.name}}
  </div>
</template>



<style scoped>

</style>