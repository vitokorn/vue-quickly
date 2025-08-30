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
</script>

<template>
  <div class="time-range-selector">
    <div class="display-flex align-items-center">
      <template v-for="(range, index) of ranges" :key="range.id">
        <span :id="`top${sectionType}${range.id === 1 ? '' : range.id}`"
              @click="handleRangeClick(range, $event)"
              :class="[selectedRange === range.id ? 'active_tab' : '', { 'mx-2': index > 0 }]">
          {{ range.label }}
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
