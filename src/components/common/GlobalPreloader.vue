<template>
  <div v-if="isVisible" class="global-preloader">
    <div class="global-preloader-content">
      <div class="global-preloader-spinner"></div>
      <div class="global-preloader-text">Loading...</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDeeperStore } from '../../stores/deeper-store.js'

const deeperStore = useDeeperStore()

const isVisible = computed(() => deeperStore.getIsGloballyLoading)
</script>

<style scoped>
.global-preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.global-preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.global-preloader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #1db954;
  border-radius: 50%;
  animation: globalSpin 1s linear infinite;
}

.global-preloader-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

@keyframes globalSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
