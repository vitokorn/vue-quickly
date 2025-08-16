<script setup>
import {useDMStore} from "../stores/dm-store";
import {useMediaDisplay} from "../composables/useMediaDisplay";
import {computed} from "vue";

const props = defineProps(['d', 'cover'])
const store = useDMStore()

const { displayClass, backgroundStyle, audioPreload, audioSrc, hasPreview } = useMediaDisplay(computed(() => props.d), props.cover)
</script>

<template>
  <div class="con3" 
       :class="displayClass" 
       :style="backgroundStyle" 
       @mouseover="hasPreview && store.mouseOver($event)" 
       @mouseleave="hasPreview && store.mouseLeave($event)">
    {{d.name}}
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
</template>

<style scoped>

</style>