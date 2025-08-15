<template>
  <div class="modern-search-container">
    <div class="search-input-wrapper">
      <input
        ref="searchInput"
        type="search"
        class="modern-search-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup="$emit('keyup', $event)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <div class="search-icon">
        <span v-if="!isFocused && !modelValue">🔍</span>
        <span v-else-if="isFocused || modelValue" class="clear-icon" @click="clearSearch">✕</span>
      </div>
      <div v-if="isFocused && suggestions.length > 0" class="search-suggestions">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="suggestion-item"
          :class="{ 'selected': selectedSuggestion === index }"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedSuggestion = index"
        >
          <span class="suggestion-icon">{{ suggestion.icon }}</span>
          <span class="suggestion-text">{{ suggestion.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  suggestions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'keyup', 'suggestion-selected'])

const searchInput = ref(null)
const isFocused = ref(false)
const selectedSuggestion = ref(-1)

const clearSearch = () => {
  emit('update:modelValue', '')
  searchInput.value?.focus()
}

const selectSuggestion = (suggestion) => {
  emit('suggestion-selected', suggestion)
  isFocused.value = false
}
</script>

<style scoped>
.modern-search-container {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.modern-search-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 14px;
  color: var(--search-color);
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modern-search-input:focus {
  border-color: var(--active-tab);
  background: white;
  box-shadow: 0 0 0 4px rgba(240, 55, 165, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.modern-search-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.05);
}

.modern-search-input::placeholder {
  color: var(--search-color);
  opacity: 0.6;
}

.search-icon {
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.clear-icon {
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-icon:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

/* Search Suggestions */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.selected {
  background: rgba(240, 55, 165, 0.1);
}

.suggestion-icon {
  font-size: 18px;
  opacity: 0.8;
}

.suggestion-text {
  font-size: 14px;
  color: var(--search-color);
  font-weight: 500;
}

/* Scrollbar styling */
.search-suggestions::-webkit-scrollbar {
  width: 6px;
}

.search-suggestions::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-search-input {
    padding: 10px 44px 10px 14px;
    font-size: 13px;
  }
  
  .search-icon {
    right: 14px;
    width: 18px;
    height: 18px;
    font-size: 14px;
  }
  
  .suggestion-item {
    padding: 10px 14px;
  }
  
  .suggestion-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .modern-search-input {
    padding: 8px 40px 8px 12px;
    font-size: 12px;
  }
  
  .search-icon {
    right: 12px;
    width: 16px;
    height: 16px;
    font-size: 12px;
  }
}

/* Dark mode support */
:root.dark .modern-search-input {
  background: rgba(42, 46, 47, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark .modern-search-input:focus {
  background: rgba(42, 46, 47, 1);
  border-color: var(--active-tab);
}

:root.dark .search-suggestions {
  background: rgba(42, 46, 47, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .suggestion-item {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:root.dark .suggestion-item:hover,
:root.dark .suggestion-item.selected {
  background: rgba(240, 55, 165, 0.2);
}

:root.dark .clear-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
