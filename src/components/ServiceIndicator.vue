<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useMusicStore} from '../stores/music-store.js'
import {SERVICE_TYPES as SERIVICE_TYPES, SERVICE_TYPES} from '../services/types.js'

const emit = defineEmits(['openServiceSelector'])

const musicStore = useMusicStore()

const showDropdown = ref(false)
const availableServices = ref([])
const currentServiceType = ref(SERVICE_TYPES.SPOTIFY)

const implementedServices = [
  SERVICE_TYPES.SPOTIFY,
  SERVICE_TYPES.DEEZER,
  SERVICE_TYPES.APPLE,
  // Add other services as they are implemented
]

const currentServiceName = computed(() => {
  return musicStore.currentServiceName
})

const currentServiceIcon = computed(() => {
  return getServiceIcon(currentServiceType.value)
})

onMounted(async () => {
  await musicStore.initializeServices()
  availableServices.value = musicStore.availableServices
  currentServiceType.value = musicStore.currentServiceType

  // Close dropdown when clicking outside
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (!event.target.closest('.service-indicator')) {
    showDropdown.value = false
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

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

const selectService = async (serviceType) => {
  if (!isServiceImplemented(serviceType) || serviceType === currentServiceType.value) {
    return
  }

  try {
    await musicStore.switchService(serviceType)
    currentServiceType.value = serviceType
    showDropdown.value = false

    // Emit event to parent component if needed
    // emit('serviceChanged', serviceType)
  } catch (error) {
    console.error('Failed to switch service:', error)
  }
}

const openServiceSelector = () => {
  showDropdown.value = false
  // Emit event to open full service selector modal
  emit('openServiceSelector')
}

const handleImageError = (event) => {
  event.target.src = '/img/default-service-icon.svg'
}
</script>

<template>
  <div class="service-indicator" @click="toggleDropdown">
    <div class="current-service">
      <img
          :src="currentServiceIcon"
          :alt="currentServiceName"
          class="service-logo"
          @error="handleImageError"
      />
      <span class="service-name">{{ currentServiceName }}</span>
      <i class="dropdown-arrow" :class="{ 'open': showDropdown }">▼</i>
    </div>

    <div v-if="showDropdown" class="service-dropdown">
      <div class="dropdown-header">
        <h4>Switch Music Service</h4>
        <button @click="closeDropdown" class="close-btn">×</button>
      </div>

      <div class="service-list">
        <div
            v-for="service in availableServices"
            :key="service.type"
            class="service-option"
            :class="{
            'active': service.type === currentServiceType,
            'disabled': !isServiceImplemented(service.type)
          }"
        >
          <img
              :src="getServiceIcon(service.type)"
              :alt="service.name"
              class="option-icon"
              @error="handleImageError"
          />
          <span class="option-name">{{ service.name }}</span>
          <span v-if="service.type === currentServiceType" class="current-badge">Current</span>
          <span v-else-if="!isServiceImplemented(service.type)" class="coming-soon-badge">Soon</span>
        </div>
      </div>

      <div class="dropdown-footer">
        <button @click="openServiceSelector" class="manage-services-btn">
          Manage Services
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-indicator {
  position: relative;
  display: inline-block;
}

.current-service {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
}

.current-service:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
}

.service-logo {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  object-fit: contain;
}

.service-name {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: #666;
  transition: transform 0.2s ease;
  margin-left: 0.5rem;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.service-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 0.25rem;
  min-width: 200px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.dropdown-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.service-list {
  max-height: 200px;
  overflow-y: auto;
}

.service-option {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.service-option:last-child {
  border-bottom: none;
}

.service-option:hover:not(.disabled) {
  background: #f8f9fa;
}

.service-option.active {
  background: #e8f5e8;
}

.service-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.option-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
  object-fit: contain;
}

.option-name {
  flex: 1;
  font-size: 0.85rem;
  color: #333;
}

.current-badge {
  font-size: 0.7rem;
  color: #28a745;
  font-weight: 500;
  background: #d4edda;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.coming-soon-badge {
  font-size: 0.7rem;
  color: #ffc107;
  font-weight: 500;
  background: #fff3cd;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.dropdown-footer {
  padding: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.manage-services-btn {
  width: 100%;
  padding: 0.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.manage-services-btn:hover {
  background: #0056b3;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .current-service {
    min-width: 120px;
    padding: 0.4rem 0.6rem;
  }

  .service-name {
    font-size: 0.8rem;
  }

  .service-dropdown {
    min-width: 180px;
  }
}
</style>
