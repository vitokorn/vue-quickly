<script setup>
const modelValue = defineModel()
</script>

<template>
  <select style="max-width: 160px;" v-model="modelValue">
    <option value="">Initial</option>
    <option value="artist">Sort by artist</option>
    <option value="album">Sort by album</option>
    <option value="duration">Sort by duration</option>
    <option value="popularity">Sort by popularity</option>
    <option value="release_date">Sort by release date</option>
    <option value="track">Sort by track name</option>
  </select>
</template>

<style scoped>

</style>