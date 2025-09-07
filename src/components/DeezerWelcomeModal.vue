<template>
  <div v-if="isVisible" class="welcome-modal-overlay" @click="handleOverlayClick">
    <div class="welcome-modal" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="service-logo">
          <img src="/img/deezer-icon.svg" alt="Deezer" class="logo" />
        </div>
        <h1 class="modal-title">Welcome to Deezer!</h1>
        <p class="modal-subtitle">Enter your Deezer User ID to access your personal music data</p>
      </div>

      <!-- Form Section -->
      <div class="form-section">
        <div class="input-group">
          <label for="deezer-id" class="input-label">Deezer User ID</label>
          <input
            id="deezer-id"
            v-model="deezerId"
            type="text"
            class="input-field"
            placeholder="Enter your Deezer User ID (e.g., 2354623523)"
            :disabled="isLoading"
          />
          <p class="input-help">
            You can find your User ID in your Deezer profile URL:
            <code>https://www.deezer.com/profile/YOUR_USER_ID</code>
          </p>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
          class="save-button"
          @click="handleSave"
          :disabled="!deezerId || isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Loading...' : 'Save & Continue' }}
        </button>

        <button
          class="skip-button"
          @click="handleSkip"
          :disabled="isLoading"
        >
          Skip for now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MusicServiceFactory } from '../services/MusicServiceFactory'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'user-saved'])

const deezerId = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSave = async () => {
  if (!deezerId.value.trim()) {
    errorMessage.value = 'Please enter your Deezer User ID'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Get the Deezer service
    const deezerService = MusicServiceFactory.createService('deezer')

    // Fetch user data from Deezer API
    const userData = await deezerService.getUser(deezerId.value.trim())

    // Save user data to localStorage
    document.cookie = `deezer-user-id=${deezerId.value.trim()}`;
    localStorage.setItem('deezer-user-id', deezerId.value.trim())
    localStorage.setItem('deezer-username', userData.display_name)
    localStorage.setItem('deezer-user-data', JSON.stringify(userData))

    successMessage.value = `Welcome, ${userData.display_name}!`

    // Emit user saved event
    emit('user-saved', userData)

    // Close modal after a short delay
    setTimeout(() => {
      emit('close')
    }, 1500)

  } catch (error) {
    console.error('Error fetching Deezer user data:', error)
    errorMessage.value = 'Invalid User ID or unable to fetch user data. Please check your ID and try again.'
  } finally {
    isLoading.value = false
  }
}

const handleSkip = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (!isLoading.value) {
    emit('close')
  }
}
</script>

<style scoped>
.welcome-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.welcome-modal {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.service-logo {
  margin-bottom: 16px;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.form-section {
  margin-bottom: 32px;
}

.input-group {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #8A2BE2;
  box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
}

.input-field:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.input-help {
  font-size: 12px;
  color: #666;
  margin: 8px 0 0 0;
  line-height: 1.4;
}

.input-help code {
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 16px;
  border: 1px solid #fcc;
}

.success-message {
  background: #efe;
  color: #363;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 16px;
  border: 1px solid #cfc;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-button {
  background: #8A2BE2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.save-button:hover:not(:disabled) {
  background: #7B1FA2;
  transform: translateY(-1px);
}

.save-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.skip-button {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skip-button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #bbb;
}

.skip-button:disabled {
  color: #999;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-modal {
    padding: 24px;
    margin: 20px;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-subtitle {
    font-size: 14px;
  }
}

/* Dark mode support */
:root.dark .welcome-modal {
  background: #2a2e2f;
  color: #fff;
}

:root.dark .modal-title,
:root.dark .input-label {
  color: #fff;
}

:root.dark .modal-subtitle {
  color: #ccc;
}

:root.dark .input-field {
  background: #3a3e3f;
  border-color: #4a4e4f;
  color: #fff;
}

:root.dark .input-field:focus {
  border-color: #8A2BE2;
}

:root.dark .input-help {
  color: #aaa;
}

:root.dark .input-help code {
  background: #4a4e4f;
  color: #fff;
}

:root.dark .skip-button {
  color: #ccc;
  border-color: #4a4e4f;
}

:root.dark .skip-button:hover:not(:disabled) {
  background: #3a3e3f;
  border-color: #5a5e5f;
}
</style>
