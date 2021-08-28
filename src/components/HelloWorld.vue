<template>
  <div>
    <div v-on:click="fetchApi">Top tracks
    <div id="toptrack" class="container-fluid con2" style="display: flex;color: black">
      <div class="trackbody" v-for="item of items" v-bind:key="item.id">
      <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;">
        <audio preload="none" v-bind:src="item.preview_url"></audio>
      </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;opacity:.5">
          <audio preload="none"></audio>
          </div>
      </div>
    </div>
    </div>
    <br>
    <div v-on:click="fetchApi2">Top tracks 6
    <div id="toptrack6" class="container-fluid con2" style="display: flex;color: black" >
      <div class="trackbody" v-for="item of itemsm" v-bind:key="item.id">
        <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;">
          <audio preload="none" v-bind:src="item.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;opacity:.5">
          <audio preload="none"></audio>
        </div>
      </div>
      </div>
    </div>
    <br>
    <div v-on:click="fetchApi3">Top tracks all time
    <div id="toptrackall" class="container-fluid con2" style="display: flex;color: black" >
      <div class="trackbody" v-for="item of itemsl" v-bind:key="item.id">
        <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;">
          <audio preload="none" v-bind:src="item.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;opacity:.5">
          <audio preload="none"></audio>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      items:[],
      itemsm:[],
      itemsl:[]
    }
  },
  methods: {
    fetchApi(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
      .then((response) =>{
        this.items = response.data['items']
      })
      .catch()
    },
    fetchApi2(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            this.itemsm = response.data['items']
          })
          .catch()
    },
  fetchApi3(){
    axios.request({
      url:'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
      method: 'get',
      headers: {'Authorization': 'Bearer '}
    })
        .then((response) =>{
          this.itemsl = response.data['items']
        })
        .catch()
  },
    mouseOver: function (event){
      let target = event.target
      let audios = target.lastChild
      audios.play()
    },
    mouseLeave: function (event){
      let target = event.target
      let audios = target.lastChild
      audios.pause()

    }
  }

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
