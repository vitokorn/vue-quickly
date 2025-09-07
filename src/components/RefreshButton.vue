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
</style>
