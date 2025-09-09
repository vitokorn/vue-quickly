<template>
    <div class="media-card"
         :class="displayClass"
         :style="backgroundStyle"
         @click="handleClick"
         @mouseover="handleMouseOver"
         @mouseleave="handleMouseLeave">
      <div class="track-overlay">
        <div class="track-info">
          <div class="track-name">{{ playlist.name }}</div>
          <div class="track-meta" v-if="playlist.totalTracks">
            {{ playlist.totalTracks }} tracks
          </div>
        </div>
      </div>
      <audio
          :preload="audioPreload"
          :src="audioSrc"
          ref="audioElement">
      </audio>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAudioStore } from '../stores/audio-store'
import {useMediaDisplay} from "../composables/useMediaDisplay.js";

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const audioStore = useAudioStore()
const audioElement = ref(null)

const { displayClass, backgroundStyle, audioPreload, audioSrc, hasPreview } = useMediaDisplay(computed(() => props.playlist), computed(() => props.playlist.images[0]))

// Event handlers
const handleClick = () => {
  emit('click', props.playlist)
}

const handleMouseOver = (event) => {
  if (hasPreview && audioElement.value) {
    audioStore.handleAudioHover(event)
  }
}

const handleMouseLeave = (event) => {
  if (hasPreview && audioElement.value) {
    audioStore.handleAudioLeave(event)
  }
}
</script>

<style scoped>

</style>
