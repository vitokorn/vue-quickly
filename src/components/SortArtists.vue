<script setup>
const modelValue = defineModel()
</script>

<template>
  <div class="sort-container">
    <select class="modern-select" v-model="modelValue">
      <option value="">Initial</option>
      <option value="artist">Name</option>
      <option value="popularity">Sort by popularity</option>
      <option value="followers">Sort by followers</option>
    </select>
    <div class="select-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
</style>