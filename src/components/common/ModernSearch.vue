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
</style>
