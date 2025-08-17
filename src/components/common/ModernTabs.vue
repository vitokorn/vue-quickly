<template>
  <nav class="modern-tabs">
    <ul class="tabs-list">
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
      <li v-for="tab in tabs"
          :key="tab.id"
          :id="tab.id"
          class="tab-item"
          :class="{ active: selectedTab === tab.value }"
          @click="handleTabClick(tab.value, $event)">
        <div class="tab-content">
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.text }}</span>
        </div>
      </li>

    </ul>
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
.modern-tabs {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  will-change: transform;
  transform: translateZ(0);
  transition: all 0.3s ease;
  min-height: 60px; /* Ensure minimum height for two-line layout */
}

.modern-tabs::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.tabs-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
  align-items: center;
}



.tab-item {
  flex-shrink: 0;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 3px solid transparent;
  position: relative;
  overflow: hidden;
}

.tab-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(240, 55, 165, 0.1), transparent);
  transition: left 0.5s;
  pointer-events: none;
}

.tab-item:hover::before {
  left: 100%;
}

.tab-item:hover {
  background: rgba(240, 55, 165, 0.05);
  transform: translateY(-1px);
}

.tab-item.active {
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  color: white;
  border-bottom-color: var(--active-tab);
  box-shadow: 0 4px 15px rgba(240, 55, 165, 0.3);
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  color: var(--tabs-color);
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.tab-item.active .tab-content {
  color: white;
}

.tab-icon {
  font-size: 18px;
  opacity: 0.8;
}

.tab-text {
  font-size: 14px;
  white-space: nowrap;
}

.search-tab {
  margin-left: auto;
  min-width: 250px;
  width: 100%;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

.modern-search {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 10px 40px 10px 16px;
  color: var(--search-color);
  outline: none;
  width: 100%;
  transition: all 0.3s ease;
  font-size: 14px;
}

.modern-search:focus {
  background: white;
  border-color: var(--active-tab);
  box-shadow: 0 0 0 3px rgba(240, 55, 165, 0.1);
}

.modern-search::placeholder {
  color: var(--search-color);
  opacity: 0.6;
}

.search-icon {
  position: absolute;
  right: 24px;
  font-size: 16px;
  opacity: 0.6;
  pointer-events: none;
}

/* Desktop Layout */
@media (min-width: 1077px) {
  .tabs-list {
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .tab-item {
    flex-shrink: 0;
  }

  .search-tab {
    margin-left: auto;
    flex-shrink: 0;
  }
}

/* Responsive Design */
@media (max-width: 1076px) and (min-width: 769px) {
  .tabs-list {
    flex-wrap: wrap;
  }

  .tab-content {
    padding: 12px 16px;
    font-size: 13px;
  }

  .tab-icon {
    font-size: 16px;
  }

  .search-tab {
    min-width: 200px;
  }

  .modern-search {
    width: 100%;
    min-width: 180px;
  }

  .modern-search:focus {
    width: 100%;
  }
}

/* Mobile Accordion Styles */
@media (max-width: 1076px) {
  .modern-tabs {
    position: relative;
  }

  .tabs-list {
    flex-direction: column;
    gap: 0;
  }

  .tab-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0;
  }

  .tab-item:last-child {
    border-bottom: none;
  }

  .tab-content {
    padding: 16px 20px;
    justify-content: space-between;
    align-items: center;
  }

  .tab-item::after {
    content: '▼';
    font-size: 12px;
    transition: transform 0.3s ease;
    opacity: 0.6;
  }

  .tab-item.active::after {
    transform: rotate(180deg);
  }

  .tab-item:hover {
    background: rgba(240, 55, 165, 0.05);
    transform: none;
  }

  .tab-item.active {
    background: linear-gradient(135deg, var(--active-tab), #e91e63);
    border-bottom-color: transparent;
  }
}

/* Mobile Grid Layout for Tabs */
@media (max-width: 768px) {
  .tabs-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: rgba(0, 0, 0, 0.1);
  }

  .tab-item {
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 0;
  }

  .tab-content {
    padding: 12px 8px;
    flex-direction: column;
    gap: 4px;
    text-align: center;
    justify-content: center;
  }

  .tab-icon {
    font-size: 20px;
  }

  .tab-text {
    font-size: 11px;
    display: block !important;
    line-height: 1.2;
  }

  .search-tab {
    grid-column: 1 / -1;
    margin-left: 0;
    background: rgba(255, 255, 255, 0.98);
  }

  .search-container {
    padding: 8px 12px;
  }

  .modern-search {
    width: 100%;
    max-width: none;
    font-size: 14px;
  }

  .modern-search:focus {
    width: 100%;
  }
}

/* Small Mobile Devices */
@media (max-width: 480px) {
  .tabs-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .tab-content {
    padding: 10px 6px;
  }

  .tab-icon {
    font-size: 18px;
  }

  .tab-text {
    font-size: 10px;
  }

  .search-container {
    padding: 6px 10px;
  }

  .modern-search {
    font-size: 13px;
    padding: 8px 35px 8px 12px;
  }
}

/* Dark mode support */
:root.dark .modern-tabs {
  background: rgba(34, 36, 38, 0.95);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:root.dark .modern-search {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark .modern-search:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--active-tab);
}

/* Dark mode mobile grid support */
@media (max-width: 768px) {
  :root.dark .tab-item {
    background: rgba(34, 36, 38, 0.95);
  }

  :root.dark .search-tab {
    background: rgba(34, 36, 38, 0.98);
  }

  :root.dark .tabs-list {
    background: rgba(255, 255, 255, 0.1);
  }
}

:root.dark-blue .modern-tabs {
  background: rgba(18, 33, 58, 0.95);
  border-bottom-color: rgba(120, 160, 220, 0.12);
}

:root.dark-blue .modern-search {
  background: rgba(43, 108, 176, 0.10);
  border-color: rgba(43, 108, 176, 0.25);
  color: var(--search-color);
}

:root.dark-blue .modern-search:focus {
  background: rgba(43, 108, 176, 0.16);
  border-color: var(--active-tab);
}

/* Blue theme mobile grid support */
@media (max-width: 768px) {
  :root.dark-blue .tab-item {
    background: rgba(18, 33, 58, 0.95);
  }

  :root.dark-blue .search-tab {
    background: rgba(18, 33, 58, 0.98);
  }

  :root.dark-blue .tabs-list {
    background: rgba(120, 160, 220, 0.10);
  }
}

:root.dq .modern-tabs {
  background: #2c2a3d;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* DQ theme mobile grid support */
@media (max-width: 768px) {
  :root.dq .tab-item {
    background: rgba(44, 42, 61, 0.95);
  }

  :root.dq .search-tab {
    background: rgba(44, 42, 61, 0.98);
  }

  :root.dq .tabs-list {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
