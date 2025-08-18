<script setup>
/* eslint-disable no-useless-escape */
import MobileLayout from './components/layout/MobileLayout.vue'
import MainLayout from "./components/layout/MainLayout.vue";

</script>

<template>
  <MainLayout/>
  <MobileLayout/>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>

<style>
@import './assets/style/styles.css';
@import './assets/style/normalize.css';
@import "./assets/style/bootstrap-grid.css";
</style>

