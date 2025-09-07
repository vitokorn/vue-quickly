<script setup>
const modelValue = defineModel()
defineProps(['full_width'])
</script>

<template>
  <div class="sort-container py-2" :class="{'w-100': full_width}">
    <select class="modern-select w-100" v-model="modelValue">
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
</style>
