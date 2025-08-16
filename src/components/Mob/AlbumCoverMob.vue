<script setup>
import {useSpotifyStore} from "../../stores/spotify-store";
import {useAudioStore} from "../../stores/audio-store";
import {useQueueStore} from "../../stores/queue-store";
import {useDeeperStore} from "../../stores/deeper-store";

const props = defineProps(['d', 'cover'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
</script>
<template>
  <div v-if="d.preview_url && cover" class="con3" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }"
       v-on:click="store.click($event)">{{ d.name }}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div v-else-if="!d.preview_url && cover && audioStore.unplayableTracks" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" tabindex="0"
       class="con3 half-opacity">{{ d.name }}
    <audio preload="none"></audio>
  </div>
  <div v-else-if="d.preview_url && !cover" class="con3" v-on:click="store.click($event)">
    {{ d.name }}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="con3 half-opacity">{{ d.name }}
    <audio preload="none"></audio>
  </div>
</template>


<style scoped>

</style>