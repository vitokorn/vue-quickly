<script setup>
import {useSpotifyStore} from "../../stores/spotify-store";
import {useAudioStore} from "../../stores/audio-store";
import {useQueueStore} from "../../stores/queue-store";
import {useDeeperStore} from "../../stores/deeper-store";

const props = defineProps(['d', 'track', 'num', 'item'])
const spotifyStore = useSpotifyStore()
const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()
</script>
<template>
  <div v-if="track.preview_url && d.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
       v-on:click=";deeperStore.getTrackDetails(track, 'deep_albums'); queueStore.addToQueue(track)"
       v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
    <audio preload="auto" v-bind:src="track.preview_url"></audio>
  </div>
  <div v-else-if="!track.preview_url && d.images[0] && audioStore.unplayableTracks" tabindex="0" class="itemImg itemImg-xs itemImg-search half-opacity"
       v-on:click="deeperStore.getTrackDetails(track, 'deep_albums'); queueStore.addToQueue(track)"
       v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
    <audio preload="none"></audio>
  </div>
  <div v-else-if="track.preview_url && !d.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search"
       v-on:click=";deeperStore.getTrackDetails(track, 'deep_albums'); queueStore.addToQueue(track)">
    <audio preload="auto" v-bind:src="track.preview_url"></audio>
  </div>
  <div v-else-if="audioStore.unplayableTracks" tabindex="0" class="itemImg itemImg-xs itemImg-search half-opacity"
       v-on:click="deeperStore.getTrackDetails(track, 'deep_albums'); queueStore.addToQueue(track)"
       >
    <audio preload="none"></audio>
  </div>
  <div class="title"
       v-on:click="deeperStore.getTrackDetails(track, 'deep_albums'); queueStore.addToQueue(track)">
    <div>{{ track.name }}</div>
  </div>

</template>


<style scoped>

</style>