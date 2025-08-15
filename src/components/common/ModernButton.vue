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
    <span v-if="loading" class="loading-spinner"></span>
    <span v-else class="button-content">
      <span v-if="icon" class="button-icon">{{ icon }}</span>
      <span v-if="$slots.default" class="button-text">
        <slot></slot>
      </span>
    </span>
  </button>
</template>

<script setup>
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
.modern-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  font-family: inherit;
}

.modern-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.modern-button:hover::before {
  left: 100%;
}

.modern-button:active {
  transform: translateY(1px);
}

.modern-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Variants */
.btn-primary {
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 55, 165, 0.3);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(240, 55, 165, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-success:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  transform: translateY(-2px);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-danger:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  transform: translateY(-2px);
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107, #e0a800);
  color: #212529;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.btn-warning:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
  transform: translateY(-2px);
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
}

.btn-info:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
  transform: translateY(-2px);
}

/* Sizes */
.btn-small {
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 8px;
}

.btn-medium {
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 12px;
}

.btn-large {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 16px;
}

/* Loading state */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.button-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.button-icon {
  font-size: 1.1em;
}

.button-text {
  white-space: nowrap;
}

/* Responsive design */
@media (max-width: 768px) {
  .btn-medium {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .btn-large {
    padding: 14px 28px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .btn-medium {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .btn-large {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .button-icon {
    font-size: 1em;
  }
}
</style>
