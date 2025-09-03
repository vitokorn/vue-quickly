<template>
  <div class="loading-state" :class="stateClass" :style="stateStyle">
    <div class="loading-content">
      <LoadingSpinner
        :size="spinnerSize"
        :color="spinnerColor"
        :background-color="spinnerBackgroundColor"
        :progress="progress"
        :show-progress="showProgress"
        :show-progress-text="showProgressText"
      />

      <div class="loading-text" v-if="message || $slots.default">
        <slot>
          <p>{{ message }}</p>
        </slot>
      </div>

      <div class="loading-details" v-if="details">
        <small>{{ details }}</small>
      </div>

      <div class="loading-actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Optional overlay for full-screen loading -->
    <div v-if="overlay" class="loading-overlay" @click="overlayClickable ? $emit('overlay-click') : null"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  message: {
    type: String,
    default: 'Loading...'
  },
  details: {
    type: String,
    default: null
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
  spinnerSize: {
    type: Number,
    default: 40
  },
  spinnerColor: {
    type: String,
    default: 'var(--active-tab, #007bff)'
  },
  spinnerBackgroundColor: {
    type: String,
    default: 'var(--item-border, #e9ecef)'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'inline', 'fullscreen', 'minimal']
  },
  overlay: {
    type: Boolean,
    default: false
  },
  overlayClickable: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: null
  },
  minHeight: {
    type: String,
    default: null
  }
})

defineEmits(['overlay-click'])

const stateClass = computed(() => `loading-${props.variant}`)

const stateStyle = computed(() => ({
  '--loading-padding': props.padding,
  '--loading-min-height': props.minHeight
}))
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--loading-padding, 60px 20px);
  min-height: var(--loading-min-height, auto);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 300px;
  z-index: 10;
}

.loading-text {
  margin-top: 16px;
}

.loading-text p {
  margin: 0;
  font-size: 16px;
  color: var(--search-color, #6c757d);
  line-height: 1.5;
}

.loading-details {
  margin-top: 8px;
}

.loading-details small {
  color: var(--search-color, #6c757d);
  opacity: 0.7;
  font-size: 14px;
}

.loading-actions {
  margin-top: 20px;
}

/* Variant styles */
.loading-default {
  /* Default centered loading state */
}

.loading-inline {
  padding: 20px;
  min-height: auto;
}

.loading-inline .loading-content {
  flex-direction: row;
  text-align: left;
  max-width: none;
}

.loading-inline .loading-text {
  margin-top: 0;
  margin-left: 12px;
}

.loading-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.loading-minimal {
  padding: 16px;
}

.loading-minimal .loading-content {
  flex-direction: row;
}

.loading-minimal .loading-text {
  margin-top: 0;
  margin-left: 8px;
}

.loading-minimal .loading-text p {
  font-size: 14px;
}

/* Overlay for fullscreen loading */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .loading-state {
    padding: var(--loading-padding, 40px 16px);
  }

  .loading-inline .loading-content {
    flex-direction: column;
    text-align: center;
  }

  .loading-inline .loading-text {
    margin-top: 12px;
    margin-left: 0;
  }

  .loading-minimal {
    padding: 12px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .loading-text p {
    color: var(--search-color, #adb5bd);
  }

  .loading-details small {
    color: var(--search-color, #adb5bd);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .loading-text p {
    color: var(--text-color, #000);
  }

  .loading-details small {
    color: var(--text-color, #000);
    opacity: 0.9;
  }
}
</style>
