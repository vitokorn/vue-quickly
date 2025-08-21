<template>
  <nav class="modern-tabs">
    <ul class="tabs-list">
      <li v-for="tab in tabs"
          :key="tab.id"
          :id="tab.id"
          class="tab-item"
          :class="{ active: selectedTab === tab.value }"
          @click="handleTabClick(tab.value, $event)">
        <div class="tab-content">
                  <span class="tabs-tab-icon">{{ tab.icon }}</span>
        <span class="tabs-tab-text">{{ tab.text }}</span>
        </div>
      </li>
    </ul>
    <li class="tab-item search-tab" id="srch">
      <div class="search-container">
        <input type="search"
               class="modern-search"
               v-model="searchQuery"
               @keyup="handleSearch"
               placeholder="Search music...">
        <span class="search-icon">🔍</span>
      </div>
    </li>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
const searchQuery = ref('')


const props = defineProps({
  selectedTab: {
    type: Number,
    required: true
  },
})

const emit = defineEmits(['tab-click', 'search'])

const tabs = [
  { id: 'option1', value: 1, icon: '📁', text: 'Playlists' },
  { id: 'option2', value: 2, icon: '👤', text: 'Top Artists' },
  { id: 'option3', value: 3, icon: '🎵', text: 'Top Tracks' },
  { id: 'option4', value: 4, icon: '💿', text: 'Saved Albums' },
  { id: 'option5', value: 5, icon: '❤️', text: 'Saved Tracks' },
  { id: 'option6', value: 6, icon: '⭐', text: 'Followed Artists' },
  { id: 'option7', value: 7, icon: '🆕', text: 'New Releases' },
  { id: 'option8', value: 8, icon: '🎧', text: 'Spotify Playlists' }
]

const handleTabClick = (tabValue, event) => {
  event.stopPropagation()
  emit('tab-click', tabValue, event)
}

const handleSearch = (event) => {
  emit('search', event)
}
</script>

<style scoped>
</style>
