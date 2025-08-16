<script setup>
import {useAudioStore} from "../stores/audio-store";
import {useQueueStore} from "../stores/queue-store";
import {useDeeperStore} from "../stores/deeper-store";
import {computed} from "vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";

const props = defineProps(['d', 'track', 'num','selected'])
defineEmits(['set-active'])

const audioStore = useAudioStore()
const queueStore = useQueueStore()
const deeperStore = useDeeperStore()

// Get media display for track with album cover
const { displayClass, backgroundStyle, audioPreload, audioSrc, hasPreview } = useMediaDisplay(computed(() => props.track), props.d.images?.[0])

const handleTrackClick = async () => {
  await deeperStore.getTrackDetails(props.track, 'deep_albums')
  queueStore.addToQueue(props.track)
}
</script>

<template>
  <div tabindex="0" 
       class="itemImg itemImg-xs itemImg-search"
       :class="[displayClass, selected===track.id ? 'selected' : '']"
       @mouseover="hasPreview && audioStore.handleAudioHover($event)"
       @mouseleave="hasPreview && audioStore.handleAudioLeave($event)"
       @click="$emit('set-active', track.id); handleTrackClick()"
       :style="backgroundStyle">
    <audio :preload="audioPreload" :src="audioSrc"></audio>
  </div>
  <div class="title"
       @click="handleTrackClick()">
    <div>{{ track.name }}</div>
  </div>

</template>

<style scoped>

</style>