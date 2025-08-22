<script setup>
import {useAudioStore} from "../stores/audio-store";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import {computed} from "vue";

const props = defineProps(['d', 'cover'])
const audioStore = useAudioStore()

const { displayClass, backgroundStyle, audioPreload, audioSrc, hasPreview } = useMediaDisplay(computed(() => props.d), props.cover)
</script>

<template>
  <div class="media-card"
       :class="displayClass"
       :style="backgroundStyle"
       @mouseover="hasPreview && audioStore.handleAudioHover($event)"
       @mouseleave="hasPreview && audioStore.handleAudioLeave($event)">
    {{d.name}}
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>

<style scoped>

</style>
