<template>
  <div class="loading-spinner" :class="sizeClass" :style="spinnerStyle">
    <div v-if="showProgress" class="progress-ring">
      <svg class="progress-circle" :width="size" :height="size">
        <circle
          class="progress-circle-bg"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
        />
        <circle
          class="progress-circle-fg"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          :style="{ transformOrigin: `${center}px ${center}px` }"
        />
      </svg>
      <div class="progress-text" v-if="showProgressText">
        {{ progress }}%
      </div>
    </div>
    <div v-else class="spinner-ring">
      <div class="spinner-dot" v-for="i in 3" :key="i" :style="{ animationDelay: `${i * 0.1}s` }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 40
  },
  color: {
    type: String,
    default: 'var(--active-tab, #007bff)'
  },
  backgroundColor: {
    type: String,
    default: 'var(--item-border, #e9ecef)'
  },
  progress: {
    type: Number,
    default: 0
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  showProgressText: {
    type: Boolean,
    default: false
  },
  strokeWidth: {
    type: Number,
    default: 3
  }
})

const sizeClass = computed(() => {
  if (props.size <= 24) return 'spinner-small'
  if (props.size <= 32) return 'spinner-medium'
  if (props.size <= 48) return 'spinner-large'
  return 'spinner-xl'
})

const spinnerStyle = computed(() => ({
  '--spinner-color': props.color,
  '--spinner-bg-color': props.backgroundColor,
  '--spinner-size': `${props.size}px`
}))

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value - (props.progress / 100) * circumference.value)
</script>

<style scoped>
.loading-spinner {
  display: inline-block;
  position: relative;
}

.spinner-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--spinner-size);
  height: var(--spinner-size);
}

.spinner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--spinner-color);
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner-dot:nth-child(1) { animation-delay: -0.32s; }
.spinner-dot:nth-child(2) { animation-delay: -0.16s; }
.spinner-dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Progress ring styles */
.progress-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--spinner-size);
  height: var(--spinner-size);
}

.progress-circle {
  transform: rotate(-90deg);
}

.progress-circle-bg,
.progress-circle-fg {
  fill: none;
  stroke-linecap: round;
}

.progress-circle-bg {
  stroke: var(--spinner-bg-color);
}

.progress-circle-fg {
  stroke: var(--spinner-color);
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: var(--spinner-color);
}

/* Size variants */
.spinner-small .spinner-dot {
  width: 6px;
  height: 6px;
}

.spinner-large .spinner-dot {
  width: 10px;
  height: 10px;
}

.spinner-xl .spinner-dot {
  width: 12px;
  height: 12px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .spinner-dot {
    background-color: var(--spinner-color, #ffffff);
  }

  .progress-circle-fg {
    stroke: var(--spinner-color, #ffffff);
  }

  .progress-text {
    color: var(--spinner-color, #ffffff);
  }
}
</style>
