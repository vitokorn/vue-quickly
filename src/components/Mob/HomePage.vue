<script setup>

</script>

<template>
  <!-- Search Bar -->
  <div class="search-container">
    <div class="search-bar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
      </svg>
      <input
          type="text"
          placeholder="Search artists, songs, albums..."
          class="search-input"
          v-model="searchQuery"
          @input="handleSearch"
      >
    </div>
  </div>
</template>

<style scoped>

/* Search Bar Styles */
.search-container {
  width: 100%;
  box-sizing: border-box;
}

.search-bar {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #a0a0a0;
  z-index: 1;
}

.search-input {
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 0 16px 0 48px;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #a0a0a0;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

</style>
