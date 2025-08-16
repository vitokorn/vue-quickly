<script setup>
import {useSpotifyStore} from "../../stores/spotify-store";
import {useAudioStore} from "../../stores/audio-store";
import {useQueueStore} from "../../stores/queue-store";
import {useDeeperStore} from "../../stores/deeper-store";

const props = defineProps(['d','cover'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
</script>
<template>
  <div class="con3" v-if="d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:click="store.click($event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div class="con3 half-opacity" v-else-if="!d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }">{{d.name}}
  </div>
  <div class="con3" v-else-if="d.preview_url && !cover" v-on:click="store.click($event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div class="con3 half-opacity" v-else>{{d.name}}
  </div>
</template>

<style scoped>

</style>