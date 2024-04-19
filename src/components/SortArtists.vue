<script setup>
const modelValue = defineModel()
</script>

<template>
  <select style="max-width: 160px;" v-model="modelValue">
    <option value="">Initial</option>
    <option value="artist">Name</option>
    <option value="popularity">Sort by popularity</option>
    <option value="followers">Sort by followers</option>
  </select>
</template>

<style scoped>

</style>