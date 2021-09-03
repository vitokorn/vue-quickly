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
        <div v-bind:id="item.id" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}}
          <audio preload="none" v-bind:src="item.track.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">
          <audio preload="none"></audio>
        </div>
      </div>
    </div>
    <div class="rectrack" >
      <div v-for="d in deeper1" v-bind:key="d.added_at">
        <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
          <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
            <audio preload="none" v-bind:src="d.track.preview_url"></audio>
          </div>
          <div style="width: 50%;text-align: left;">
            <div>{{d.track.name}}</div>
            <div style="display: flex; align-items: center;"><p>By </p>
              <div v-for="art in d.track.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track)">{{art.name}}</div>
              </div>
            </div>
            <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track)">Recommended songs based on this</span>
            <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
              <button class="button">Open is Spotify</button></a>
            </div>
          </div>
          <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
            <audio preload="none" v-bind:src="d.track.preview_url"></audio>
            <div style="float: left; margin-left: 50px;">{{art.name}}</div>
          </div>
        </div>
        <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
          <div v-for="s in d.tracks" v-bind:key="s.id">
            <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
              <audio preload="none" v-bind:src="s.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          </div>
        <div v-else-if="d.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
          <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
            <audio v-bind:src="d.preview_url"></audio>
          </div>
          <div style="width: 60%">{{d.name}}
            <div>{{d['followers']['total'] + ' followers'}}</div>
            <div>{{d['genres']}}</div>
            <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(d)">Recomended artists songs based on this</div>
            <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
              <button class="button">Open is Spotify</button></a>
            </div>
          </div>
          <div v-for="ra in relatedartist1" v-bind:key="ra.id">
            <div v-if="ra.type==='related-artists'" >Related Artist</div>
            <div v-if="ra.type==='related-artists'" class="col2">
            <div v-for="r in ra['items']" v-bind:key="r.id">
              <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">
                <audio v-bind:src="r.preview_url"></audio>
              </div>
              <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                <audio></audio>
              </div>
              </div>
            </div>
          </div>
          <div >
            <div v-for="da in deeperartist1" v-bind:key="da.id">
            <div v-if="da.type==='top_tracks'">Top tracks</div>
            <div v-if="da.type==='top_tracks'" class="top-tracks con2">
              <div v-for="tt in da['tracks']" v-bind:key="tt.id">
                <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{tt.name}}
                  <audio v-bind:src="tt.preview_url"></audio>
                </div>
                <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                  <audio></audio>
                </div>
              </div>
            </div>
            <div v-if="da.type==='albums'">Albums</div>
            <div v-if="da.type==='albums'" class="album con2">
              <div v-for="alb in da" v-bind:key="alb.id">
                <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb)" v-on:mouseleave="mouseLeave">{{alb.name}}
                  <audio v-bind:src="alb.preview_url"></audio>
                </div>
                <div v-else class="con3" v-on:click="deeperAlbum(alb)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                  <audio></audio>
                </div>
              </div>
            </div>
            <div v-if="da.type==='single'">Single</div>
            <div v-if="da.type==='single'" class="single con2">
              <div v-for="s in da" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                  <audio v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else class="con3" v-on:click="deeperAlbum(s)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio></audio>
                </div>
              </div>
            </div>

            <div v-if="da.type==='appears_on'">Appears on</div>
            <div v-if="da.type==='appears_on'" class="appear con2">
              <div v-for="a in da" v-bind:key="a.id">
                <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                  <audio v-bind:src="a.preview_url"></audio>
                </div>
                <div v-else class="con3" v-on:click="deeperAlbum(a)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                  <audio></audio>
                </div>
              </div>
            </div>
          </div>
          </div>

        </div>
        <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
          <div style="width: 100%;">Seed artist</div>
          <div v-for="s in d.tracks" v-bind:key="s.id">
            <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
              <audio preload="none" v-bind:src="s.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
              <audio preload="none"></audio>
            </div>
          </div>
        </div>
        <div v-for="d in deeperalbums1" v-bind:key="d.id">
        <div class="deep_albums con2" >
            <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
              <audio preload="none" v-bind:src="d.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
              <audio preload="none"></audio>
            </div>
          <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
          <div>{{d.release_date}}</div>
<!--            <div>{{list(d.artists)}}</div>-->
            <span style="color: rgb(240, 55, 165);">Recomended songs based on this</span>
          </div>
          <div style="display: block;" class="trackList">Tracks
            <div v-for="track in d.tracks" v-bind:key="track.id">
            <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">
              <div class="trackTitle">{{track.name}}</div>
              <audio preload="none" v-bind:src="track.preview_url"></audio>
            </div>
              <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5">
                <div class="trackTitle">{{track.name}}</div>
                <audio preload="none" v-bind:src="track.preview_url"></audio>
              </div>
            </div>
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
    <div v-on:click.self="fetchTracks(0)">Saved tracks
      <div id="savedtrack" class="con2">
        <div class="albumbody" v-for="item of savedtracks" v-bind:key="item.id">
          <div v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item.track.artists)}} - {{item.track.name}}
            <audio preload="none" v-bind:src="item.track.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.track.artists)}} - {{item.track.name}}
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
    <div v-on:click.self="fetchNR(0)">New releases
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
      deeper1:[],
      deeperartist1:[],
      relatedartist1:[],
      deeperalbums1:[],
      arr:[]
    }
  },
  methods: {
    deeper: function(item){
      console.log(item)
      item.type = 'pl'
      console.log('196' + item)
      this.deeper1.push(item)
    },
    deeperartist: function (item,track){
      axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id,
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let data = response.data
            data.type = 'artist'
            if (track.preview_url){
              data.preview_url = track.preview_url
            }
            console.log(data)
            this.deeper1.push(data)
          })
          .catch()
      // top tracks
      axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/top-tracks?limit=10&market=UA',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let data = response.data
            data.type = 'top_tracks'
            console.log(data)
            this.deeperartist1.push(data)
          })
          .catch()
      // album
      axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=album&limit=10',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let arr = []
            arr.items = response.data['items']
            console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.items.length;i++){
              console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr.items[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    // console.log(333)
                    // console.log(response.data)
                    arr.items[i].tracks = tracks
                    if (tracks[0]['preview_url']){
                      arr.items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(arr.items[i])

                  })
            }newarr.type = 'albums'
            console.log(newarr)
            this.deeperartist1.push(newarr)

          })
          .catch()
      // single,compilation
      axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=single,compilation',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let arr = []
            arr.items = response.data['items']
            console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.items.length;i++){
              console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr.items[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    // console.log(333)
                    // console.log(response.data)
                    arr.items[i].tracks = tracks
                    if (tracks[0]['preview_url']){
                      arr.items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(arr.items[i])

                  })
            }newarr.type = 'single'
            console.log(newarr)
            this.deeperartist1.push(newarr)

          })
          .catch()
      // appears_on
      axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=appears_on',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let arr = []
            arr.items = response.data['items']
            console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.items.length;i++){
              console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr.items[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    arr.items[i].tracks = tracks
                    // console.log(333)
                    // console.log(response.data)
                    if (tracks[0]['preview_url']){
                      arr.items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(arr.items[i])

                  })
            }newarr.type = 'appears_on'
            console.log(newarr)
            this.deeperartist1.push(newarr)

          })
          .catch()
      // related-artists
      axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/related-artists',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            let newarr = []
            let fin = []
            let arr = []
            arr.items = response.data['artists']
            // console.log(444)
            // console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.items.length;i++){
              console.log('447 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + arr.items[i].id + '/top-tracks?market=UA',
                method: 'get',
                headers: {'Authorization': 'Bearer '}
              })
                  .then((response) =>{
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      arr.items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(arr.items[i])

                  })
            }
            fin.type = 'related-artists'
            fin.items = newarr
            console.log(468)
            console.log(fin)
            this.relatedartist1.push(fin)

          })
          .catch()
    },
    deeperAlbum(item){
      console.log(item)
      this.deeperalbums1.push(item)
    },
    seedArtist(item) {
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + item['id'] + '&limit=50&offset=0&market=UA',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) => {
            let data = []
            data.tracks = response.data['tracks']
            data.type = 'seed_artists'
            console.log(data)
            this.deeper1.push(data)
          })
          .catch()
    },
    seedTracks(item) {
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + item['id'] + '&limit=50&offset=0&market=UA',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) => {
            let data = []
            data.tracks = response.data['tracks']
            data.type = 'seed_tracks'
            console.log(data)
            this.deeper1.push(data)
          })
          .catch()
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
        headers: {'Authorization': 'Bearer BQDM_QOzRvqooDNHoGwzZvCSnphJCtiu8bSdvyxmUQtc0urniPAKCatxCHhd3A7b4Y_YzyABQJMM6tcS4FC2jjvZzM_7l0EGy2ZI_Yz9C-WbmOuPSsvCKGzebSK0oCUI84W4SCa17yYGiHcDw_ADgH3fgLc80y923-n4B6VGceDsMQiylitOPvlRLGWkAhC9o3xXN-QOqNi6in4CwBeky1jyWUa_IFSIJTxGddXTdZ1oQyAhEg'}
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
    fetchTracks(offset){
      axios.request({
        url: 'https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=50',
        method: 'get',
        headers: {'Authorization': 'Bearer '}
      })
          .then((response) =>{
            this.savedtracks.push(...response.data['items'])
            if (response.data['items'].length > 0){
              this.fetchTracks(offset += 50)
            }

          })
          .catch((onerror) =>{
            console.log(onerror)
          })
    },
    fetchNR(offset){
      axios.request({
        url: 'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + offset,
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
                this.getNewrelease(newarr,offset)
          })

    },
    getNewrelease(newarr,offset){
        axios.request({
          url:'https://api.spotify.com/v1/albums?ids=' + newarr ,
          method: 'get',
          headers: {'Authorization': 'Bearer '}
        })
            .then((response) => {
              console.log('452 ' + this.newreleases)
              // let old = this.newreleases
              // old.push(response.data['albums'])
              this.newreleases.push(...response.data['albums'])
                  if (response.data['albums'].length > 0){
                    this.fetchNR(offset +=20)
                  }
            }

            )
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
