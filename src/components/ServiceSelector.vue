<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMusicStore } from '../stores/music-store.js'
import { SERVICE_TYPES } from '../services/types.js'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const musicStore = useMusicStore()

const availableServices = ref([])
const currentServiceType = ref(SERVICE_TYPES.SPOTIFY)
const showSwitchWarning = ref(false)
const pendingServiceType = ref(null)
const isLoading = ref(false)

const implementedServices = [
  SERVICE_TYPES.SPOTIFY,
  SERVICE_TYPES.DEEZER,
  SERVICE_TYPES.APPLE,
  // Add other services as they are implemented
]

onMounted(async () => {
  await musicStore.initializeServices()
  availableServices.value = musicStore.availableServices
  currentServiceType.value = musicStore.currentServiceType
})

const isServiceImplemented = (serviceType) => {
  return implementedServices.includes(serviceType)
}

const getServiceIcon = (serviceType) => {
  const icons = {
    [SERVICE_TYPES.SPOTIFY]: '/img/spotify-icon.svg',
    [SERVICE_TYPES.DEEZER]: '/img/deezer-icon.svg',
    [SERVICE_TYPES.TIDAL]: '/img/tidal-icon.svg',
    [SERVICE_TYPES.APPLE]: '/img/apple-music-icon.svg',
  }
  return icons[serviceType] || '/img/default-service-icon.svg'
}

const getServiceDescription = (serviceType) => {
  const descriptions = {
    [SERVICE_TYPES.SPOTIFY]: 'Access your Spotify library and playlists',
    [SERVICE_TYPES.DEEZER]: 'Connect to your Deezer account',
    [SERVICE_TYPES.TIDAL]: 'High-quality music streaming',
    [SERVICE_TYPES.APPLE]: 'Access your Apple Music library and playlists',
  }
  return descriptions[serviceType] || 'Music streaming service'
}

const selectService = (serviceType) => {
  if (!isServiceImplemented(serviceType)) {
    return // Don't allow selection of unimplemented services
  }

  if (serviceType === currentServiceType.value) {
    return // Already selected
  }

  // Show confirmation dialog
  pendingServiceType.value = serviceType
  showSwitchWarning.value = true
}

const confirmSwitch = async () => {
  if (!pendingServiceType.value) return

  isLoading.value = true
  showSwitchWarning.value = false

  try {
    await musicStore.switchService(pendingServiceType.value)
    currentServiceType.value = pendingServiceType.value
    // Redirect to authentication if needed
    if (!musicStore.isAuthenticated) {
      await musicStore.authenticate()
    }
  } catch (error) {
    console.error('Failed to switch service:', error)
    // Show error message to user
  } finally {
    isLoading.value = false
    pendingServiceType.value = null
  }
}

const cancelSwitch = () => {
  showSwitchWarning.value = false
  pendingServiceType.value = null
}

const handleImageError = (event) => {
  // Fallback to default icon if service icon fails to load
  event.target.src = '/img/default-service-icon.svg'
}
</script>

<template>
  <div v-if="props.isVisible" class="service-selector-modal-overlay" @click.self="emit('close')">
    <div class="service-selector">
    <div class="service-selector-header">
      <h3>Music Service</h3>
      <p>Choose your preferred music streaming service</p>
    </div>

    <div class="service-grid">
      <div
        v-for="service in availableServices"
        :key="service.type"
        class="service-card"
        :class="{
          'active': service.type === currentServiceType,
          'disabled': !isServiceImplemented(service.type)
        }"
        @click="selectService(service.type)"
      >
        <div class="service-icon">
          <img
            :src="getServiceIcon(service.type)"
            :alt="service.name"
            @error="handleImageError"
          />
        </div>
        <div class="service-info">
          <h4>{{ service.name }}</h4>
          <p v-if="!isServiceImplemented(service.type)" class="coming-soon">
            Coming Soon
          </p>
          <p v-else-if="service.type === currentServiceType" class="current-service">
            Currently Active
          </p>
          <p v-else class="service-description">
            {{ getServiceDescription(service.type) }}
          </p>
        </div>
        <div class="service-status">
          <div v-if="service.type === currentServiceType" class="status-indicator active">
            <i class="check-icon">✓</i>
          </div>
          <div v-else-if="!isServiceImplemented(service.type)" class="status-indicator disabled">
            <i class="lock-icon">🔒</i>
          </div>
          <div v-else class="status-indicator available">
            <i class="arrow-icon">→</i>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSwitchWarning" class="switch-warning">
      <div class="warning-content">
        <i class="warning-icon">⚠️</i>
        <div class="warning-text">
          <h4>Switch Music Service?</h4>
          <p>Switching services will clear your current data and require re-authentication.</p>
        </div>
        <div class="warning-actions">
          <button @click="confirmSwitch" class="btn-confirm">Switch</button>
          <button @click="cancelSwitch" class="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Switching service...</p>
    </div>
    </div>
  </div>
</template>

<style scoped>
.service-selector-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.service-selector {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.service-selector-header {
  text-align: center;
  margin-bottom: 2rem;
}

.service-selector-header h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.service-selector-header p {
  color: #666;
  font-size: 0.9rem;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.service-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.service-card:hover:not(.disabled) {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.service-card.active {
  border-color: #28a745;
  background: #f8fff9;
}

.service-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.service-icon {
  width: 48px;
  height: 48px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.service-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.service-info {
  flex: 1;
}

.service-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #333;
}

.service-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.coming-soon {
  color: #ffc107 !important;
  font-weight: 500;
}

.current-service {
  color: #28a745 !important;
  font-weight: 500;
}

.service-status {
  margin-left: 1rem;
}

.status-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.status-indicator.active {
  background: #28a745;
  color: white;
}

.status-indicator.available {
  background: #007bff;
  color: white;
}

.status-indicator.disabled {
  background: #6c757d;
  color: white;
}

.switch-warning {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.warning-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
}

.warning-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.warning-text h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.warning-text p {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.warning-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-confirm, .btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-confirm {
  background: #dc3545;
  color: white;
}

.btn-confirm:hover {
  background: #c82333;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .service-selector {
    padding: 1rem;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }

  .service-card {
    padding: 0.75rem;
  }

  .service-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
