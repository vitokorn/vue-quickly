<template>
  <div>
    <div id="playlistlist" v-on:click.self="fetchPlaylists" class="container pl">Playlists Pc
      <div v-for="item of listplaylists" v-bind:key="item.id">
        <div v-bind:id="item.id" v-on:click="fetchInit" class="hr-line-dashed">{{ item.name }}</div>
      </div>
    </div>
<!--    <div id="playlist" class="container-fluid con2">-->
<!--      <div id="p_" class="con2">-->
<!--        <div class="con4">{{ playinfo.name }}</div>-->
<!--        <div style="width: 60%; display: flex; align-items: center;">-->
<!--          <div>-->
<!--            <a v-bind:href="playinfo.name" target="_blank">-->
<!--              <button class="button">Open is Spotify</button>-->
<!--            </a>-->
<!--          </div>-->
<!--          <div class="con4" v-bind:style="{ 'background-image': 'url(' + playinfo['images'][0]['url'] + ')' }" style=" background-repeat: no-repeat; background-size: cover;"></div>-->
<!--        </div>-->
<!--        </div>-->
<!--      </div>-->
    <div class="con2" style="display: flex;color: black">
      <div class="trackbody" v-for="item of playlists" v-bind:key="item.id">
        <div v-bind:id="item.id" ref="myDiv" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="test(item)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}}
          <audio preload="none" v-bind:src="item.track.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">
          <audio preload="none"></audio>
        </div>
          <div class="rectrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
            <div v-for="d in deeper1" v-bind:key="d.added_at">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
            </div>
          </div>
      </div>


    </div>
    <div v-on:click.self="fetchArtist">Top artists
      <div id="topartist" class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of topartist" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" >{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div v-on:click.self="fetchArtist2">Top artists 6 month
      <div id="topartist6" class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of topartist6" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div v-on:click.self="fetchArtist3">Top artists all time
      <div id="topartista" class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of topartista" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div v-on:click.self="fetchApi">Top tracks
    <div id="toptrack" class="con2" style="display: flex;color: black">
      <div class="trackbody" v-for="item of items" v-bind:key="item.id">
      <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">{{lists(item.artists)}}
        <audio preload="none" v-bind:src="item.preview_url"></audio>
      </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
          <audio preload="none"></audio>
          </div>
      </div>
    </div>
    </div>
    <br>
    <div v-on:click.self="fetchApi2">Top tracks 6
    <div id="toptrack6" class="con2" style="display: flex;color: black" >
      <div class="trackbody" v-for="item of itemsm" v-bind:key="item.id">
        <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}}
          <audio preload="none" v-bind:src="item.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
          <audio preload="none"></audio>
        </div>
      </div>
      </div>
    </div>
    <br>
    <div v-on:click.self="fetchApi3">Top tracks all time
    <div id="toptrackall" class="con2" style="display: flex;color: black" >
      <div class="trackbody" v-for="item of itemsl" v-bind:key="item.id">
        <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}}
          <audio preload="none" v-bind:src="item.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
          <audio preload="none"></audio>
        </div>
      </div>
      </div>
    </div>
    <br>
    <div v-on:click.self="fetchAlbums">Saved albums
      <div id="savedalbum" class="con2">
      <div class="albumbody" v-for="item of savedalbums" v-bind:key="item.id">
        <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.album.artists)}}
          <audio preload="none" v-bind:src="item.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.album.artists)}}
          <audio preload="none"></audio>
        </div>
        </div>
      </div>
      </div>
    <div v-on:click.self="fetchTracks">Saved tracks
      <div id="savedtrack" class="con2">
        <div class="albumbody" v-for="item of savedtracks" v-bind:key="item.id">
          <div v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item.track.artists)}}
            <audio preload="none" v-bind:src="item.track.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.track.artists)}}
            <audio preload="none"></audio>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div v-on:click.self="fetchFA">Followed artist
      <div id="followedartist" class="con2">
        <div class="fabody" v-for="item of followedartists" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div v-on:click.self="fetchNR">New releases
      <div id="newrelease" class="con2">
        <div class="newbody" v-for="item of newreleases" v-bind:key="item.id">
          <div v-if="item.tracks.items[0].preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{lists(item.artists)}}
            <audio preload="none" v-bind:src="item.tracks.items[0].preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
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
      listplaylists:[],
      playinfo:[],
      playlists:[],
      topartist:[],
      topartist6:[],
      topartista:[],
      savedalbums:[],
      savedtracks:[],
      newreleases:[],
      followedartists:[],
      items:[],
      itemsm:[],
      itemsl:[],
      deeper1:[]
    }
  },
  methods: {
    test: function(item){
      console.log(item)
      this.deeper1.push(item)
    },
    fetchPlaylists(){
      axios.request({
        url:'https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            this.listplaylists = response.data['items']
          })
          .catch()
    },
    fetchInit:function(event){
      console.log('167'  + event.currentTarget.id)
      let id = event.currentTarget.id
      axios.request({
        url:'https://api.spotify.com/v1/playlists/' + id,
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            this.playinfo = response.data
            this.playlists = response.data['tracks']['items']
          })
          .catch()
    },
    fetchArtist(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=short_term',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=UA',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
              .then((response) =>{
                console.log('247' + response.data)
                let tracks = response.data['tracks']
                if (tracks[0]['preview_url']){
                  items[i].preview_url = tracks[0]['preview_url']
                }
                newarr.push(items[i])

              })
            }
            this.topartist = newarr
          })
          .catch()
    },
    fetchArtist2(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=medium_term',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=UA',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    console.log('247' + response.data)
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(items[i])

                  })
            }
            this.topartist6 = newarr
          })
          .catch()
    },
    fetchArtist3(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=UA',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    console.log('247' + response.data)
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(items[i])

                  })
            }
            this.topartista = newarr
          })
          .catch()
    },
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
    fetchAlbums(){
      axios.request({
        url: 'https://api.spotify.com/v1/me/albums',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + items[i].album.id + '/tracks?market=UA&limit=10',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    console.log('247' + response.data)
                    let tracks = response.data['items']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(items[i])

                  })
            }
            this.savedalbums = newarr
          })
          .catch()
    },
    fetchTracks(){
      axios.request({
        url: 'https://api.spotify.com/v1/me/tracks?offset=' + 0 + '&limit=50',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            this.savedtracks =response.data['items']

          })
          .catch((onerror) =>{
            console.log(onerror)
          })
      },
    fetchNR(){
      axios.request({
        url: 'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + 0,
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['albums']['items']
            console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              newarr.push(items[i].id)
            }
            axios.request({
              url:'https://api.spotify.com/v1/albums?ids=' + newarr ,
              method: 'get',
              headers: {'Authorization': 'Bearer '}
            })
                  .then((response) => {
                        this.newreleases = response.data['albums']}

                  )


          })
          .catch()
    },
    fetchFA(){
      axios.request({
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['artists']['items']
            for (let i=0;i <  items.length;i++){
              console.log('237 ' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=UA&limit=10',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(items[i])

                  })
            }
            this.followedartists = newarr
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

    },
    lists: function (artists){
  const names = artists.map(({
                               name
                             }) => name);
  const finalName = names.pop();
  return names.length ?
      names.join(', ') + ' & ' + finalName :
      finalName;
},
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
