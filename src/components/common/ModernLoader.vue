<template>
  <div v-if="show" class="modern-loader-overlay">
    <div class="modern-loader">
      <div class="loader-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div v-if="message" class="loader-message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.modern-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modern-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.loader-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--active-tab);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: #e91e63;
  animation-delay: -0.4s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: #ff6b9d;
  animation-delay: -0.8s;
}

.loader-message {
  font-size: 16px;
  font-weight: 500;
  color: var(--search-color);
  text-align: center;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Dark mode support */
:root.dark .modern-loader {
  background: rgba(42, 46, 47, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .loader-message {
  color: var(--search-color);
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-loader {
    padding: 30px;
    border-radius: 16px;
  }
  
  .loader-spinner {
    width: 50px;
    height: 50px;
  }
  
  .loader-message {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .modern-loader {
    padding: 24px;
    border-radius: 12px;
  }
  
  .loader-spinner {
    width: 40px;
    height: 40px;
  }
  
  .loader-message {
    font-size: 13px;
  }
}
</style>
