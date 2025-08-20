<script setup>

</script>
<template>
  <a href="spotify/logout">
    <button class="inp">Logout</button>
  </a>
</template>


<style scoped>
.inp {
  background: white;
  color: black;
  border: none;
  border-radius: 0;
  padding: 12px 24px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 16px;
}

.inp:hover {
  background: #f0f0f0;
}

:root.metro .inp {
  background: white;
  color: black;
  border: none;
  border-radius: 0;
  padding: 12px 24px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 16px;
}

:root.metro .inp:hover {
  background: #f0f0f0;
}
</style>
