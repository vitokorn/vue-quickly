<script setup>
/* eslint-disable no-useless-escape */
import Desktop from './components/Desktop.vue'
import Mobile from './components/Mobile.vue'
import {isMobile} from "./mixins/detectingMobileMixin";
import Header from "./components/Header.vue";
import QueueModal from "./components/QueueModal.vue";

</script>

<template>
  <Header/>
  <br>
  <Desktop v-if="!isMobile()"></Desktop>
  <Mobile v-else></Mobile>
  <QueueModal/>
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

