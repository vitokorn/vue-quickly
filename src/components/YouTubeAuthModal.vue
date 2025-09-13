<template>
  <div v-if="isVisible" class="welcome-modal-overlay" @click="handleOverlayClick">
    <div class="welcome-modal" @click.stop>
      <div class="modal-header">
        <div class="service-logo">
          <img src="/img/youtube-music-icon.svg" alt="YouTube Music" class="logo" />
        </div>
        <h1 class="modal-title">YouTube Music Authorization</h1>
        <p class="modal-subtitle">Enter required cookies to access your YouTube Music library</p>
      </div>

      <div class="form-section">
        <div class="input-grid">
          <div class="input-group">
            <label class="input-label">SAPISID</label>
            <input v-model="SAPISID" type="text" class="input-field" placeholder="SAPISID" :disabled="isLoading" />
          </div>
          <div class="input-group">
            <label class="input-label">HSID</label>
            <input v-model="HSID" type="text" class="input-field" placeholder="HSID" :disabled="isLoading" />
          </div>
          <div class="input-group">
            <label class="input-label">SSID</label>
            <input v-model="SSID" type="text" class="input-field" placeholder="SSID" :disabled="isLoading" />
          </div>
          <div class="input-group">
            <label class="input-label">SID</label>
            <input v-model="SID" type="text" class="input-field" placeholder="SID" :disabled="isLoading" />
          </div>
        </div>

        <div class="help-section">
          <details>
            <summary>How to get these cookies (Chrome/Edge)</summary>
            <ol>
              <li>Open music.youtube.com and sign in</li>
              <li>Right-click page → Inspect → Application tab</li>
              <li>Storage → Cookies → https://music.youtube.com</li>
              <li>Copy values for SAPISID, HSID, SSID, SID</li>
            </ol>
          </details>
          <details>
            <summary>Firefox</summary>
            <ol>
              <li>Open music.youtube.com and sign in</li>
              <li>Right-click → Inspect → Storage</li>
              <li>Cookies → https://music.youtube.com</li>
              <li>Copy values for SAPISID, HSID, SSID, SID</li>
            </ol>
          </details>
          <p class="note">We only store these in memory on the server for this session.</p>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </div>

      <div class="action-buttons">
        <button class="save-button" @click="handleSave" :disabled="!canSave || isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Saving...' : 'Save & Continue' }}
        </button>
        <button class="skip-button" @click="$emit('skip')" :disabled="isLoading">Continue without authorization</button>
      </div>
    </div>
  </div>
  </template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  isVisible: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'authorized', 'skip'])

const SAPISID = ref('')
const HSID = ref('')
const SSID = ref('')
const SID = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const canSave = computed(() => !!SAPISID.value && !!HSID.value && !!SSID.value && !!SID.value)

const handleSave = async () => {
  if (!canSave.value) {
    errorMessage.value = 'Please fill all cookie fields'
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const res = await axios.post('/youtube/auth/cookies', {
      SAPISID: SAPISID.value.trim(),
      HSID: HSID.value.trim(),
      SSID: SSID.value.trim(),
      SID: SID.value.trim(),
    })
    if (res.status === 200 && res.data.success) {
      successMessage.value = 'Authorization saved successfully.'
      emit('authorized')
      setTimeout(() => emit('close'), 800)
    } else {
      errorMessage.value = 'Failed to save cookies. Please try again.'
    }
  } catch (e) {
    console.error('Failed to save YouTube cookies', e)
    errorMessage.value = 'Failed to save cookies. Please verify values.'
  } finally {
    isLoading.value = false
  }
}

const handleOverlayClick = () => {
  if (!isLoading.value) emit('close')
}
</script>

<style scoped>
.welcome-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.welcome-modal { background: #f8f9fa; border-radius: 16px; padding: 32px; max-width: 720px; width: 94%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.modal-header { text-align: center; margin-bottom: 24px; }
.logo { width: 48px; height: 48px; border-radius: 8px; }
.modal-title { font-size: 24px; font-weight: 700; margin: 12px 0 4px; }
.modal-subtitle { font-size: 14px; color: #666; margin: 0; }
.form-section { margin-top: 16px; }
.input-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.input-group { display: flex; flex-direction: column; }
.input-label { font-size: 12px; font-weight: 600; margin-bottom: 6px; }
.input-field { padding: 10px 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px; background: #fff; }
.help-section { margin-top: 16px; font-size: 13px; color: #444; }
.help-section details { margin: 8px 0; }
.note { margin-top: 8px; color: #777; }
.error-message { background: #fee; color: #c33; padding: 10px 12px; border-radius: 8px; border: 1px solid #fcc; margin-top: 12px; }
.success-message { background: #efe; color: #363; padding: 10px 12px; border-radius: 8px; border: 1px solid #cfc; margin-top: 12px; }
.action-buttons { display: flex; gap: 12px; margin-top: 20px; }
.save-button { background: #cc0000; color: #fff; border: none; border-radius: 8px; padding: 12px 18px; font-weight: 600; cursor: pointer; }
.skip-button { background: transparent; color: #666; border: 1px solid #ddd; border-radius: 8px; padding: 12px 18px; }
.loading-spinner { width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>


