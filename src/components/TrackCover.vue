<script setup>
import {useAudioStore} from "../stores/audio-store";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import {computed} from "vue";

const props = defineProps(['d', 'cover'])
const audioStore = useAudioStore()

const { displayClass, backgroundStyle, audioPreload, audioSrc, hasPreview } = useMediaDisplay(computed(() => props.d), props.cover)
</script>

<template>
  <div class="con3"
       :class="displayClass"
       :style="backgroundStyle"
       @mouseover="hasPreview && audioStore.handleAudioHover($event)"
       @mouseleave="hasPreview && audioStore.handleAudioLeave($event)">
    <div class="track-overlay">
      <div class="track-info">
        <div class="track-name">{{d.name}}</div>
      </div>
    </div>
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>

<style scoped>

</style>
