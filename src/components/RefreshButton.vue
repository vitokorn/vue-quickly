<script setup>
import { computed } from 'vue'

const props = defineProps({
  onClick: {
    type: Function,
    required: true
  },
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Event handler
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
    props.onClick(event)
  }
}

// Computed class for button size
const buttonClass = computed(() => {
  const baseClass = 'refresh-button'
  const sizeClass = `refresh-button-${props.size}`
  const disabledClass = props.disabled ? 'disabled' : ''
  return `${baseClass} ${sizeClass} ${disabledClass}`.trim()
})
</script>

<template>
  <button 
    :class="buttonClass"
    @click="handleClick"
    :disabled="disabled"
    :title="disabled ? 'Loading...' : 'Refresh'">
    <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
  </button>
</template>

<style scoped>
.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.refresh-button:hover:not(.disabled) {
  background: rgba(240, 55, 165, 0.1);
  transform: rotate(180deg);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.2);
}

.refresh-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.refresh-icon {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.refresh-button:hover:not(.disabled) .refresh-icon {
  opacity: 1;
}

/* Size variants */
.refresh-button-small {
  width: 28px;
  height: 28px;
}

.refresh-button-small .refresh-icon {
  width: 14px;
  height: 14px;
}

.refresh-button-medium {
  width: 32px;
  height: 32px;
}

.refresh-button-medium .refresh-icon {
  width: 16px;
  height: 16px;
}

.refresh-button-large {
  width: 36px;
  height: 36px;
}

.refresh-button-large .refresh-icon {
  width: 18px;
  height: 18px;
}

/* Focus styles for accessibility */
.refresh-button:focus {
  outline: 2px solid var(--active-tab);
  outline-offset: 2px;
}

/* Dark mode support */
:root.dark .refresh-button {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:root.dark .refresh-button:hover:not(.disabled) {
  background: rgba(240, 55, 165, 0.2);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}
</style>
