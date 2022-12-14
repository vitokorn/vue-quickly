<template>
  <div id="app">
    <header class="header" id="navbar">
      <img class="logo" src="./assets/logo-small.png" alt="">
      <h1>Discover Mobily</h1>
      <div style="color: var(--h1-color)" class="aresset">Inspired by <a href="https://discoverquickly.com/">Discover Quickly</a></div>
      <div class="content">

        <div v-if="isAuth()" class="">Hello, {{username}}</div>
        <div class="dropdown-content">
          <Auth v-if="!isAuth()"/>
          <Logout v-else-if="isAuth()"/>
        </div>
<!--        <div>-->
<!--          <a href="/lang/en/">En</a>-->
<!--          <a href="/lang/ru/">Ru</a>-->
<!--        </div>-->

      </div>
      <br>
      <div style="display: flex;">
        <div class="themesnav" ><div class="themes" style="background-color: white;"></div><input id="light" type="radio" v-model="userTheme" value="light" v-on:click="setTheme('light')"><label for="light">White</label></div>
        <div class="themesnav"><div class="themes" style="background-color: #181a1b;"></div><input id="dark" type="radio"  v-model="userTheme" value="dark" v-on:click="setTheme('dark')"><label for="dark">Dark</label></div>
        <div class="themesnav"><div class="themes" style="background-color: #001331;"></div><input id="dark-blue" type="radio" v-model="userTheme" value="dark-blue" v-on:click="setTheme('dark-blue')"><label for="dark-blue">Dark blue</label></div>
        <div class="themesnav"><div class="themes" style="background-color: #3f3d58;"></div><input id="dq" type="radio" v-model="userTheme" value="dq" v-on:click="setTheme('dq')"><label for="dq">DQ</label></div>
      </div>
    </header>
    <br>
    <Desktop v-if="!isMobile()"></Desktop>
    <Mobile v-else></Mobile>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */


import Auth from "./components/Auth";
import Desktop from './components/Desktop.vue'
import Mobile from './components/Mobile.vue'
import Logout from "./components/Logout";
import authMixin from "./mixins/authMixin";
import detectingMobileMixin from "./mixins/detectingMobileMixin";
import prefMixin from "./mixins/prefMixin";
// import DesktopRefactored from "./components/DesktopLegacy";
// import MobileRefactored from  "./components/MobileLegacy";


export default {
  mounted() {
    const initUserTheme = this.prefered();
    this.setTheme(initUserTheme)
  },
  data(){
    return{
      username: document.cookie.replace(/(?:(?:^|.*;\s*)nickname\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
      userTheme:localStorage.getItem('user-theme'),
    }
  },
  name: 'App',
  mixins: [detectingMobileMixin,authMixin,prefMixin],
  components: {
    // DesktopLegacy,
    // MobileLegacy,
    Auth,
    Desktop,
    Mobile,
    Logout
  },
  methods:{
    setTheme(theme) {
      localStorage.setItem("user-theme", theme);
      this.userTheme = theme;
      document.documentElement.className = theme;
    },
  },
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>

<style>
@import './assets/style/styles.css';
@import './assets/style/normalize.css';
</style>

