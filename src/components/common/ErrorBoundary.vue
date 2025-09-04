<template>
  <div class="error-boundary">
    <!-- Error State -->
    <div v-if="hasError" class="error-state">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">{{ errorTitle }}</h3>
        <p class="error-message">{{ errorMessage }}</p>

        <div class="error-details" v-if="showDetails && currentError">
          <details class="error-details-toggle">
            <summary>Technical Details</summary>
            <pre class="error-stack">{{ currentError.stack }}</pre>
          </details>
        </div>

        <div class="error-actions">
          <ModernButton
            v-if="canRetry"
            variant="primary"
            size="small"
            :loading="isRecovering"
            @click="handleRetry"
          >
            Try Again
          </ModernButton>

          <ModernButton
            variant="secondary"
            size="small"
            @click="handleReport"
          >
            Report Issue
          </ModernButton>

          <ModernButton
            variant="outline"
            size="small"
            @click="handleReset"
          >
            Reset
          </ModernButton>
        </div>
      </div>
    </div>

    <!-- Content -->
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { ref, computed, onErrorCaptured } from 'vue'
import ModernButton from './ModernButton.vue'

const props = defineProps({
  fallbackTitle: {
    type: String,
    default: 'Something went wrong'
  },
  fallbackMessage: {
    type: String,
    default: 'We encountered an unexpected error. Please try again or contact support if the problem persists.'
  },
  showDetails: {
    type: Boolean,
    default: false
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  enableReporting: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['error', 'retry', 'reset', 'report'])

const currentError = ref(null)
const retryCount = ref(0)
const isRecovering = ref(false)

const hasError = computed(() => !!currentError.value)
const canRetry = computed(() => retryCount.value < props.maxRetries)
const errorTitle = computed(() => currentError.value?.title || props.fallbackTitle)
const errorMessage = computed(() => currentError.value?.message || props.fallbackMessage)

// Error boundary handler
const handleError = (error, context = {}) => {
  console.error('Error boundary caught error:', error)

  currentError.value = {
    error,
    title: error.title || props.fallbackTitle,
    message: error.message || props.fallbackMessage,
    stack: error.stack,
    context,
    timestamp: new Date()
  }

  emit('error', currentError.value)
}

// Vue's error boundary
onErrorCaptured((error, instance, info) => {
  handleError(error, { instance, info })
  return false // Prevent error from propagating
})

// Action handlers
const handleRetry = async () => {
  if (!canRetry.value) return

  retryCount.value++
  isRecovering.value = true

  try {
    emit('retry', { error: currentError.value, attempt: retryCount.value })
    // Reset error state after successful retry (handled by parent)
  } catch (error) {
    console.error('Retry failed:', error)
  } finally {
    isRecovering.value = false
  }
}

const handleReset = () => {
  currentError.value = null
  retryCount.value = 0
  emit('reset')
}

const handleReport = () => {
  if (!props.enableReporting) return

  const reportData = {
    error: currentError.value,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    retryCount: retryCount.value
  }

  console.log('Error report data:', reportData)

  // You can integrate with error reporting services here
  // Example: Sentry, Bugsnag, LogRocket, etc.

  emit('report', reportData)
}

// Reset function for parent components
const reset = () => {
  handleReset()
}

defineExpose({
  reset,
  hasError,
  currentError
})
</script>

<style scoped>
.error-boundary {
  width: 100%;
  min-height: 200px;
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background-color: var(--error-bg, #f8d7da);
  border: 1px solid var(--error-border, #f5c6cb);
  border-radius: 8px;
  color: var(--error-text, #721c24);
}

.error-content {
  max-width: 500px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}

.error-message {
  margin: 0 0 20px 0;
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.9;
}

.error-details {
  margin-bottom: 24px;
  text-align: left;
}

.error-details-toggle {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-details-toggle summary {
  cursor: pointer;
  font-weight: 500;
}

.error-stack {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  margin-top: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive design */
@media (max-width: 768px) {
  .error-state {
    padding: 30px 16px;
  }

  .error-icon {
    font-size: 36px;
  }

  .error-title {
    font-size: 20px;
  }

  .error-message {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-actions button {
    width: 100%;
    max-width: 200px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .error-state {
    background-color: var(--error-bg, #2d1818);
    border-color: var(--error-border, #5c2d2d);
    color: var(--error-text, #ea868f);
  }

  .error-details-toggle {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .error-stack {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .error-state {
    border-width: 2px;
  }

  .error-details-toggle {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .error-icon {
    animation: none;
  }
}
</style>
