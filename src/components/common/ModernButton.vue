<template>
  <button 
    class="modern-button"
    :class="[
      `btn-${variant}`,
      `btn-${size}`,
      { 'loading': loading, 'disabled': disabled }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <LoadingSpinner
      v-if="loading"
      size="20"
      :color="'currentColor'"
      :background-color="'transparent'"
    />
    <span v-else class="button-content">
      <span v-if="icon" class="button-icon">{{ icon }}</span>
      <span v-if="$slots.default" class="button-text">
        <slot></slot>
      </span>
    </span>
  </button>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
</style>
