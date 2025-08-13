<script setup>
const modelValue = defineModel()
</script>

<template>
  <div class="sort-container">
    <select class="modern-select" v-model="modelValue">
      <option value="">Initial</option>
      <option value="artist">Sort by artist</option>
      <option value="album">Sort by album</option>
      <option value="duration">Sort by duration</option>
      <option value="popularity">Sort by popularity</option>
      <option value="release_date">Sort by release date</option>
      <option value="track">Sort by track name</option>
    </select>
    <div class="select-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.sort-container {
  position: relative;
  display: inline-block;
}

.modern-select {
  appearance: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 36px 8px 12px;
  font-size: 14px;
  color: var(--search-color);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modern-select:focus {
  outline: none;
  border-color: var(--active-tab);
  box-shadow: 0 0 0 3px rgba(240, 55, 165, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.modern-select:hover {
  border-color: var(--active-tab);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.select-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--search-color);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.modern-select:focus + .select-icon {
  color: var(--active-tab);
  opacity: 1;
}

.select-icon svg {
  width: 16px;
  height: 16px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modern-select {
    min-width: 140px;
    padding: 6px 32px 6px 10px;
    font-size: 13px;
  }
  
  .select-icon svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .modern-select {
    min-width: 120px;
    padding: 6px 28px 6px 8px;
    font-size: 12px;
  }
  
  .select-icon svg {
    width: 12px;
    height: 12px;
  }
}

/* Dark mode support */
:root.dark .modern-select {
  background: rgba(42, 46, 47, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--search-color);
}

:root.dark .modern-select:focus {
  border-color: var(--active-tab);
  box-shadow: 0 0 0 3px rgba(240, 55, 165, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root.dark .modern-select:hover {
  border-color: var(--active-tab);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>