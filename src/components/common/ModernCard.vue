<template>
  <div 
    class="modern-card"
    :class="{ 
      'selected': selected,
      'playable': playable,
      'half-opacity': halfOpacity 
    }"
    :style="{ 
      'background-image': backgroundImage ? `url(${backgroundImage})` : 'none'
    }"
    @click="$emit('click', $event)"
    @mouseover="$emit('mouseover', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    tabindex="0"
  >
    <div class="card-overlay">
      <div class="card-content">
        <slot></slot>
      </div>
      <div class="card-actions" v-if="showActions">
        <button class="action-btn play-btn" @click.stop="$emit('play')">
          ▶️
        </button>
        <button class="action-btn queue-btn" @click.stop="$emit('queue')">
          ➕
        </button>
      </div>
    </div>
    <audio v-if="audioSrc" preload="auto" :src="audioSrc"></audio>
  </div>
</template>

<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false
  },
  playable: {
    type: Boolean,
    default: true
  },
  halfOpacity: {
    type: Boolean,
    default: false
  },
  backgroundImage: {
    type: String,
    default: null
  },
  audioSrc: {
    type: String,
    default: null
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click', 'mouseover', 'mouseleave', 'play', 'queue'])
</script>

<style scoped>
</style>
