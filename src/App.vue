<template>
  <div id="app">
    <header class="header" id="navbar">
      <img class="logo" src="./assets/logo-small.png" alt="">
      <h1>Discover Mobily</h1>
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
      <div style="display: flex;">
        <div class="themesnav" ><div class="themes" style="background-color: white;"></div><input id="light" type="radio" v-model="userTheme" value="light" v-on:click="setTheme('light')"><label for="light">White</label></div>
        <div class="themesnav"><div class="themes" style="background-color: #181a1b;"></div><input id="dark" type="radio"  v-model="userTheme" value="dark" v-on:click="setTheme('dark')"><label for="dark">Dark</label></div>
        <div class="themesnav"><div class="themes" style="background-color: #001331;"></div><input id="dark-blue" type="radio" v-model="userTheme" value="dark-blue" v-on:click="setTheme('dark-blue')"><label for="dark-blue">Dark blue</label></div>
        <div class="themesnav"><div class="themes" style="background-color: #3f3d58;"></div><input id="dq" type="radio" v-model="userTheme" value="dq" v-on:click="setTheme('dq')"><label for="dq">DQ</label></div>
      </div>
    </header>
    <br>
    <Desktop v-if="!isMobile() && isAuth()"/>
    <Mobile v-else-if="isMobile() && isAuth()"/>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */


const mixinDetictingMobile = {
  methods: {
    isMobile: function () {
      let check = false;
      (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      console.log('37 ' + check)
      return check;
    }
  }
};
const auth = {
  methods: {
    isAuth: function (){
      let access_token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (access_token.length === 0){
        localStorage.removeItem('queue')
      }
      return access_token.length !== 0;
    }
  }
}
const pref = {
  methods: {
    prefered: function (){
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
        console.log('54 prefered dark')
        return "dark"
      } else {
        if (localStorage.getItem('user-theme')){
          return localStorage.getItem('user-theme')
        } else {
          return "dq"
        }
      }
    }
  }
}
import Auth from "./components/Auth";
import Desktop from './components/Desktop.vue'
import Mobile from './components/Mobile.vue'
import Logout from "./components/Logout";

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
  mixins: [mixinDetictingMobile,auth,pref],
  components: {
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
/*@import './assets/style/normalize.css';*/
</style>

