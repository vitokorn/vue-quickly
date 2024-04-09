<script setup>

import Logout from "./Logout.vue";
import Auth from "./Auth.vue";
import {isAuth} from '../mixins/authMixin'
import {preferred} from "../mixins/prefMixin";
import {ref} from "vue";
import {useDMStore} from "../stores/dm-store";
import Settings from "./Settings.vue";
import {isMobile} from "../mixins/detectingMobileMixin";
const store = useDMStore()
const initUserTheme = preferred();
let username =  document.cookie.replace(/(?:(?:^|.*;\s*)nickname\s*\=\s*([^;]*).*$)|^.*$/, "$1")
let userTheme = ref(localStorage.getItem('user-theme'))
const mobileVersion = ref(false)
setTheme(initUserTheme)


function setTheme(theme) {
  localStorage.setItem("user-theme", theme);
  userTheme.value = theme;
  document.documentElement.className = theme;
}

window.addEventListener('resize', () => {
  mobileVersion.value = window.innerWidth < 1076;
})
</script>

<template>
  <header class="display-flex align-items-center justify-content-between">
    <div class="display-flex align-items-center">
      <img class="logo" src="../assets/logo-small.png" alt="" style="height: 50px;width: 50px">
      <div style="font-size: 2em" class="ps-2 font-bold">Discover Mobily</div>
    </div>
    <div :class="mobileVersion || isMobile() ? 'd-block':'display-flex'">
      <div class="themesnav" ><div class="themes" style="background-color: white;"></div><input id="light" type="radio" v-model="userTheme" value="light" v-on:click="setTheme('light')"><label for="light">White</label></div>
      <div class="themesnav"><div class="themes" style="background-color: #181a1b;"></div><input id="dark" type="radio"  v-model="userTheme" value="dark" v-on:click="setTheme('dark')"><label for="dark">Dark</label></div>
      <div class="themesnav"><div class="themes" style="background-color: #001331;"></div><input id="dark-blue" type="radio" v-model="userTheme" value="dark-blue" v-on:click="setTheme('dark-blue')"><label for="dark-blue">Dark blue</label></div>
      <div class="themesnav"><div class="themes" style="background-color: #3f3d58;"></div><input id="dq" type="radio" v-model="userTheme" value="dq" v-on:click="setTheme('dq')"><label for="dq">DQ</label></div>
    </div>
    <div class="display-flex align-items-center">
      <div v-if="isAuth()" class="me-1">Hello, {{username}}</div>
      <Settings/>
      <Auth v-if="!isAuth()"/>
      <div style="position: relative" class="pointer" @click="store.checkPlaylists()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="2em" fill="var(--tabs-target)"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>
        <div style="position: absolute;top: 4px;left: 8px">{{ store.queue }}</div>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>