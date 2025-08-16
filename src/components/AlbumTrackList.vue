<script setup>
import {useDMStore} from "../stores/dm-store";
import {computed} from "vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";

const props = defineProps(['d', 'track', 'num','selected'])
defineEmits(['set-active'])
const store = useDMStore()

// Get media display for track with album cover
const { displayClass, backgroundStyle, audioPreload, audioSrc, hasPreview } = useMediaDisplay(computed(() => props.track), props.d.images?.[0])
</script>

<template>
  <div tabindex="0" 
       class="itemImg itemImg-xs itemImg-search"
       :class="[displayClass, selected===track.id ? 'selected' : '']"
       @mouseover="hasPreview && store.mouseOver($event)"
       @mouseleave="hasPreview && store.mouseLeave($event)"
       @click="$emit('set-active', track.id);store.deeperTracks2({item:track,d:d,num:num,sib:'deep_albums'}); store.queuein(track)"
       :style="backgroundStyle">
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
  <div class="title"
       @click="store.deeperTracks2({item:track,d:d,num:num,sib:'deep_albums'}); store.queuein(track)">
    <div>{{ track.name }}</div>
  </div>

</template>


<style scoped>

</style>