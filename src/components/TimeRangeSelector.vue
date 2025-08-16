<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedRange: {
    type: Number,
    required: true
  },
  ranges: {
    type: Array,
    default: () => [
      { id: 1, label: 'Last month', fetchMethod: 'fetchArtist', reloadMethod: 'reloadartists' },
      { id: 2, label: 'Last 6 month', fetchMethod: 'fetchArtist2', reloadMethod: 'reloadartists' },
      { id: 3, label: 'All time', fetchMethod: 'fetchArtist3', reloadMethod: 'reloadartists' }
    ]
  },
  sectionType: {
    type: String,
    default: 'artists' // 'artists' or 'tracks'
  }
})

const emit = defineEmits(['range-change', 'refresh'])

// Event handlers
const handleRangeClick = (range, event) => {
  emit('range-change', range.id, event)
}

const handleRefresh = (range, event) => {
  emit('refresh', range.id, event)
}
</script>

<template>
  <div class="time-range-selector">
    <div class="display-flex align-items-center">
      <template v-for="(range, index) of ranges" :key="range.id">
        <span :id="`top${sectionType}${range.id === 1 ? '' : range.id}`"
              @click="handleRangeClick(range, $event)"
              :class="[selectedRange === range.id ? 'activetab' : '', { 'mx-2': index > 0 }]">
          {{ range.label }}
        </span>
        <button class="refresh-button" @click="handleRefresh(range, $event)">
          <img class="refresh-icon" src="../assets/refresh-icon.png" alt="Refresh">
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.time-range-selector {
  margin-bottom: 16px;
}

.display-flex {
  display: flex;
  align-items: center;
  gap: 8px;
}

.activetab {
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(240, 55, 165, 0.3);
}

span:not(.activetab) {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

span:not(.activetab):hover {
  background: rgba(240, 55, 165, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.2);
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.refresh-button:hover {
  background: rgba(240, 55, 165, 0.1);
  transform: rotate(180deg);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.2);
}

.refresh-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.refresh-button:hover .refresh-icon {
  opacity: 1;
}

.mx-2 {
  margin-left: 8px;
  margin-right: 8px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .display-flex {
    flex-direction: column;
    gap: 12px;
  }
  
  .mx-2 {
    margin-left: 0;
    margin-right: 0;
  }
}

/* Dark mode support */
:root.dark span:not(.activetab) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark span:not(.activetab):hover {
  background: rgba(240, 55, 165, 0.2);
  border-color: var(--active-tab);
}

:root.dark .refresh-button {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:root.dark .refresh-button:hover {
  background: rgba(240, 55, 165, 0.2);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}
</style>
