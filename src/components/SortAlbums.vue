<script setup>
const modelValue = defineModel()
</script>

<template>
  <select style="max-width: 160px;" v-model="modelValue">
    <option value="">Initial</option>
    <option value="artist">Sort by artist</option>
    <option value="album">Sort by album</option>
    <option value="popularity">Sort by popularity</option>
    <option value="release_date">Sort by release date</option>
    <option value="name">Sort by name</option>
    <option value="number_of_tracks">Sort by number of tracks</option>
  </select>
</template>

<style scoped>

</style>