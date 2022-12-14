<template>
  <div>
    <div><a style="color: var(--h1-color)" v-on:click="this.$store.dispatch('checkPlaylists')" href="#modal1">{{queue}}</a></div>
    <ul class="tabs">
      <li id="option1">
        <a id="playlistlist" v-on:click="this.$store.dispatch('switchTabs',{event:$event})" v-on:click.self.once="this.$store.dispatch('fetchPlaylists',{event:$event,offset:0})">Playlists Pc</a>
        <div style="display: block;width: 95%">
          <div id="yourplaylists" class="con2" style="display: block;">
            <div class="rel"><button class="btn" v-on:click="this.$store.dispatch('reloadpl',{event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
            </div>
            <div class="pl" style="justify-content: center;">
              <template  v-for="(item,index) of this.$store.state.listplaylists" v-bind:key="index">
                <div v-bind:id="item.id" v-on:click="this.$store.dispatch('fetchInit',{event:$event})" class="hr-line-dashed">{{ item.name }}</div>
              </template>
            </div>
            <div class="play" v-for="(item,index) of this.$store.state.playlists" v-bind:id="'p' + item.id" v-bind:key="index">
              <div class="con2" >
                <div class="con4">{{item.name}}</div>
                <button class="btn" v-on:click="this.$store.dispatch('reloader',{num:1,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
                <div class="aresset" style="width: 60%;display: flex;align-items: center;flex-wrap: wrap;cursor: pointer">{{item.description}}<button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                  Follow<input type="checkbox" v-if="item.followed" @click.once="this.$store.dispatch('followPlaylist',$event)"  checked v-model="item.followed">
                  <input type="checkbox" v-else @click.once="this.$store.dispatch('followPlaylist',$event)" v-model="item.followed"></div>
                <div v-if="item.images[0]" class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
              </div>
              <div class="con2" style="display: flex;color: black" v-bind:key="index">
                <template v-if="item.tracks">
                  <template v-for="(pl,ind) of item['tracks']['items']" >
                    <template v-if="pl.track">
                      <div v-bind:id="pl.track.id" v-bind:key="ind" v-if="pl.track.preview_url && pl.track.album.images[0]" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeper',{item:pl,num:1,event:$event}); this.$store.dispatch('queuein',pl['track'])" v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }" >{{lists(pl['track']['artists'])}} - {{pl.track.name}}
                        <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                      </div>
                      <div v-else-if="pl.track.album.images[0] && !pl.track.preview_url" tabindex="0" v-bind:key="'2'+ind" class="con3" v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }" v-on:click="this.$store.dispatch('deeper',{item:pl,num:1,event:$event}); this.$store.dispatch('queuein',pl['track'])" style="opacity: .5">{{lists(pl['track']['artists'])}} - {{pl.track.name}}
                        <audio preload="auto"></audio>
                      </div>
                      <div v-else-if="!pl.track.album.images[0] && pl.track.preview_url" v-bind:key="'3'+ind" class="con3" v-on:click="this.$store.dispatch('deeper',{item:pl,num:1,event:$event}); this.$store.dispatch('queuein',pl['track'])">{{lists(pl['track']['artists'])}} - {{pl.track.name}}>
                        <audio preload="auto" v-bind:src="pl.track.preview_url"></audio>
                      </div>
                      <div v-else v-bind:key="'4'+ind" class="con3" v-on:click="this.$store.dispatch('deeper',{item:pl,num:1,event:$event}); this.$store.dispatch('queuein',pl['track'])" style="opacity: .5">{{lists(pl['track']['artists'])}} - {{pl.track.name}}></div>
                    </template>
                  </template>
                </template>
              </div>
            </div>
            <rec-track :num="1">

            </rec-track>
          </div>
          <div class="footer"></div>
        </div>
      </li>
      <li id="option2">
        <a id="ta" v-on:click="this.$store.dispatch('switchTabs',{event:$event}),this.$store.dispatch('switchArtist',{num:1})" v-on:click.self.once="this.$store.dispatch('fetchArtist',{event:$event})">Top artists</a>
        <div>
          <div style="display: flex;">
            <span id="topartists" v-on:click="this.$store.dispatch('switchArtist',{num:1})">Last month</span>
            <button class="btn" v-on:click="this.$store.dispatch('reloadartists',{num:1,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
            <span id="topartists6" v-on:click="this.$store.dispatch('switchArtist',{num:2})" style="margin-left: 12px" v-on:click.self.once="this.$store.dispatch('fetchArtist2',{event:$event})">Last 6 month</span>
            <button class="btn" v-on:click="this.$store.dispatch('reloadartists',{num:2,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
            <span id="topartistsall" v-on:click="this.$store.dispatch('switchArtist',{num:3})" style="margin-left: 12px" v-on:click.self.once="this.$store.dispatch('fetchArtist3',{event:$event})">All time</span>
            <button class="btn" v-on:click="this.$store.dispatch('reloadartists',{num:3,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
          </div>
          <div id="topartist" class="con2" style="display: flex;color: black;width: auto;">
            <div class="trackbody" v-for="(item,index) of this.$store.state.topartist" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:2,flag:true})" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" >{{item.name}}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:2,flag:true})" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="2">

            </rec-track>
          </div>
          <div id="topartist6" class="con2" style="display: flex;color: black;width: auto;">
            <div class="trackbody" v-for="(item,index) of this.$store.state.topartist6" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:22,flag:true})"  v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:22,flag:true})" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="22">

            </rec-track>
          </div>
          <div id="topartista" class="con2" style="display: flex;color: black;width: auto;">
            <template v-for="(item,index) of this.$store.state.topartista" >
              <div v-if="item.preview_url" tabindex="0" v-bind:key="index" class="con3" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:23,flag:true})"  v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-bind:key="'2'+index" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:23,flag:true})" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
                <audio preload="auto"></audio>
              </div>
            </template>
            <rec-track :num="23"></rec-track>
          </div>
        </div>
      </li>
      <!--        <li id="option3">-->
      <!--    <a href="#option3" v-on:click.self.once="fetchArtist2">Top artists 6 month</a>-->
      <!--      -->

      <!--          </li>-->
      <!--        <li id="option4">-->
      <!--          <a href="#option4" v-on:click.self.once="fetchArtist3">Top artists all time</a>-->
      <!--      -->
      <!--        </li>-->
      <li id="option3">
        <a v-on:click="this.$store.dispatch('switchTabs',{event:$event}),this.$store.dispatch('switchTracks',{num:1})" id="tt" v-on:click.self.once="this.$store.dispatch('fetchApi',{event:$event})">Top tracks</a>
        <div>
          <div style="display: flex;">
            <span id="toptracks" v-on:click="this.$store.dispatch('switchTracks',{num:1})">Last month</span>
            <button class="btn" v-on:click="this.$store.dispatch('reloadtracks',{num:1,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
            <span id="toptrackssix" v-on:click="this.$store.dispatch('switchTracks',{num:2})" v-on:click.self.once="this.$store.dispatch('fetchApi2',{event:$event})" style="margin-left: 12px">Last 6 month</span>
            <button class="btn" v-on:click="this.$store.dispatch('reloadtracks',{num:2,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
            <span id="toptracksall" v-on:click="this.$store.dispatch('switchTracks',{num:3})" v-on:click.self.once="this.$store.dispatch('fetchApi3',{event:$event})" style="margin-left: 12px">All time</span>
            <button class="btn" v-on:click="this.$store.dispatch('reloadtracks',{num:3,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
          </div>
          <div id="toptrack" class="con2" style="display: flex;color: black;width: auto;">
            <div class="trackbody" v-for="(item,index) of this.$store.state.items" v-bind:key="index">
              <div v-if="item.preview_url && item.album.images[0]" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeper',{item:item,num:3,event:$event}); this.$store.dispatch('queuein',item)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else-if="item.album.images[0]" tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeper',{item:item,num:3,event:$event}); this.$store.dispatch('queuein',item)">{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto"></audio>
              </div>
              <div v-else tabindex="0" class="con3" style="opacity: .5" v-on:click="this.$store.dispatch('deeper',{item:item,num:3,event:$event}); this.$store.dispatch('queuein',item)">{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="3">

            </rec-track>
          </div>
          <div id="toptrack6" class="con2" style="display: flex;color: black;width: auto;" >
            <div class="trackbody" v-for="(item,index) of this.$store.state.itemsm" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeper',{item:item,num:32,event:$event})" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" v-on:click="this.$store.dispatch('deeper',{item:item,num:32,event:$event})" style="opacity: .5">{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="32">

            </rec-track>
          </div>
          <div id="toptrackall" class="con2" style="display: flex;color: black;width: auto;" >
            <div class="trackbody" v-for="(item,index) of this.$store.state.itemsl" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeper',{item:item,num:33,event:$event})" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" v-on:click="this.$store.dispatch('deeper',{item:item,num:33,event:$event})" style="opacity: .5">{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="33">

            </rec-track>

          </div>
        </div>
      </li>
      <!--        <li id="option6">-->
      <!--    <a href="#option6" v-on:click.self.once="fetchApi2">Top tracks 6 month</a>-->
      <!--      -->
      <!--        </li>-->
      <!--        <li id="option7">-->
      <!--    <a href="#option7" v-on:click.self.once="fetchApi3">Top tracks all time</a>-->
      <!--      -->
      <!--        </li>-->
      <li id="option4">
        <a v-on:click="this.$store.dispatch('switchTabs',{event:$event})" id="sa" v-on:click.self.once="this.$store.dispatch('fetchAlbums',{offset:0,event:$event})">Saved albums</a>
        <div>
          <div id="savedalbum" class="con2" >
            <div class="albumbody" v-for="(item,index) of this.$store.state.savedalbums" v-bind:key="index">
              <div v-if="item.album.tracks.items[0].preview_url" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeperAlbum',{item:item,num:4})" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.album.artists)}}
                <audio preload="auto" v-bind:src="item.album.tracks.items[0].preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" v-on:click="this.$store.dispatch('deeperAlbum',{item:item,num:4})" style="opacity: .5">{{lists(item.album.artists)}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="4">

            </rec-track>
          </div>
        </div>
      </li>
      <li id="option5">
        <a v-on:click="this.$store.dispatch('switchTabs',{event:$event})" id="st" v-on:click.self.once="this.$store.dispatch('fetchTracks',{offset:0})">Saved tracks</a>
        <div>
          <div id="savedtrack" class="con2">
            <div class="albumbody" v-for="(item,index) of this.$store.state.savedtracks" v-bind:key="index">
              <div v-if="item.track.preview_url && item.track.album.images[0]" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeper',{item:item,num:5,event:$event}); this.$store.dispatch('queuein',item.track)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item.track.artists)}} - {{item.track.name}}
                <audio preload="auto" v-bind:src="item.track.preview_url"></audio>
              </div>
              <div v-else-if="item.track.album.images[0]" tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeper',{item:item,num:5,event:$event}); this.$store.dispatch('queuein',item.track)">{{lists(item.track.artists)}} - {{item.track.name}}
                <audio preload="auto"></audio>
              </div>
              <div v-else class="con3" v-on:click="this.$store.dispatch('deeper',{item:item,num:5,event:$event}); this.$store.dispatch('queuein',item.track)" style="opacity: .5">{{lists(item.track.artists)}} - {{item.track.name}}</div>
            </div>
            <rec-track :num="5"></rec-track>
          </div>
        </div>
      </li>
      <li id="option6">
        <a v-on:click="this.$store.dispatch('switchTabs',{event:$event})" id="fa" v-on:click.self.once="this.$store.dispatch('fetchFA')">Followed artists</a>
        <div>
          <div style="display: flex;"><button class="btn" v-on:click="this.$store.dispatch('reloadartists',4,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
          <div id="followedartist" style="width: 95%;" class="con2">
            <div class="fabody" v-for="(item,index) of this.$store.state.followedartists" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:6,flag:true})" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{item.name}}
                <audio preload="auto" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3"  v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks,num:6,flag:true})" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">{{item.name}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="6"></rec-track>
          </div>
        </div>
      </li>
      <li id="option7">
        <a v-on:click="this.$store.dispatch('switchTabs',{event:$event})" id="nr"  v-on:click.self.once="this.$store.dispatch('fetchNR',{offset:0})">New releases</a>
        <div style="display: block;width: 95%">
          <div id="newrelease" class="con2">
            <div class="newbody" v-for="(item,index) of this.$store.state.newreleases" v-bind:key="index">
              <div v-if="item.tracks.items[0].preview_url" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeper',{item:item,num:7,event:$event}); this.$store.dispatch('queuein',item)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{lists(item.artists)}} - {{item.name}}
                <audio preload="auto" v-bind:src="item.tracks.items[0].preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeper',{item:item,num:7,event:$event}); this.$store.dispatch('queuein',item)">{{lists(item.artists)}}
                <audio preload="auto"></audio>
              </div>
            </div>
            <rec-track :num="7"></rec-track>
          </div>
        </div>
      </li>
      <li id="option8">
        <a v-on:click="this.$store.dispatch('switchTabs',{event:$event})" id="spt" v-on:click.self.once="this.$store.dispatch('fetchSpotPlaylists',{offset:0})" >Spotify playlists</a>
        <div style="display: block;width: 95%">
          <div id="sptplaylists" class="con2" style="display: block;width: 95%;">
            <div class="head">
              <input class="inp" type="text" v-on:keyup="filterres"
                     placeholder="Please enter a search term.." title="Type in a name">

            </div >
            <div class="sp" style="display: block">
              <div class="pl" style="justify-content: center;">
                <template v-for="item of this.$store.state.spotplaylists" v-bind:key="item.id">
                  <div v-bind:id="item.id" v-on:click="this.$store.dispatch('SpotInit',{event:$event})"  class="hr-line-dashed">{{ item.name }}</div>
                </template>
              </div>
            </div>
            <div class="play" v-for="(item,index) of this.$store.state.sptplaylists" v-bind:id="'s' + item.id" v-bind:key="index">
              <div class="con2" >
                <div class="con4">{{item.name}}</div>
                <button class="btn" v-on:click="this.$store.dispatch('reloader',{num:9,event:$event})"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
                <div class="aresset" style="width: 60%;display: flex;align-items: center;flex-wrap: wrap;cursor: pointer">{{item.description}}<button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                  Follow<input type="checkbox" v-if="item.followed" @click.once="this.$store.dispatch('followPlaylist',$event)"  checked v-model="item.followed">
                  <input type="checkbox" v-else @click.once="this.$store.dispatch('followPlaylist',$event)" v-model="item.followed"></div>
                <div v-if="item.images" class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
              </div>
              <div class="con2" style="display: flex;color: black">
                <template v-if="item.tracks">
                  <template v-for="(spl,index) of item['tracks']['items']" >
                    <div v-bind:id="spl.track.id" v-bind:key="index" v-if="spl.track.preview_url && spl.track.album.images[0]" tabindex="0" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeper',{item:spl,num:9,event:$event}); this.$store.dispatch('queuein',spl['track'])" v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }" >{{lists(spl['track']['artists'])}} - {{spl.track.name}}
                      <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                    </div>
                    <div v-bind:id="spl.track.id" v-else-if="!spl.track.preview_url && spl.track.album.images[0]" tabindex="0" v-bind:key="'2'+index" class="con3" v-on:click="this.$store.dispatch('deeper',{item:spl,num:9,event:$event}); this.$store.dispatch('queuein',spl['track'])" v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }" style="opacity: .5">{{lists(spl['track']['artists'])}} - {{spl.track.name}}
                      <audio preload="auto"></audio>
                    </div>
                    <div v-bind:id="spl.track.id" v-else-if="spl.track.preview_url && !spl.track.album.images[0]" tabindex="0" v-bind:key="'3'+index" class="con3" v-on:click="this.$store.dispatch('deeper',{item:spl,num:9,event:$event}); this.$store.dispatch('queuein',spl['track'])">{{lists(spl['track']['artists'])}} - {{spl.track.name}}
                      <audio preload="auto" v-bind:src="spl.track.preview_url"></audio>
                    </div>
                    <div v-bind:id="spl.track.id" v-else v-bind:key="'4'+index" class="con3" v-on:click="this.$store.dispatch('deeper',{item:spl,num:9,event:$event}); this.$store.dispatch('queuein',spl['track'])" style="opacity: .5">{{lists(spl['track']['artists'])}} - {{spl.track.name}}></div>
                  </template>
                </template>
              </div>
            </div>
            <rec-track :num="9">

            </rec-track>
          </div>
        </div>
      </li>
      <li id="srch" class="srch"><a id="sear" style="padding: 15px;"><input type="search" class="inp" v-on:keyup="this.$store.dispatch('search',$event)"></a>
        <div id="search" style="width: 100%">
          <div style="display: flex;height: auto; flex-flow: row wrap;">
            <div style="width: 100%;color:var(--search-color);font-size: 1.5em;"></div>
            <div style="width: 50%">
              <div class="stitle">Songs</div>
              <div v-for="(item,index) in this.$store.state.tracks" class="playable-search" v-on:mouseover="this.$store.dispatch('parentmouseOver',$event)" v-on:mouseleave="this.$store.dispatch('parentmouseLeave',$event)" v-bind:key="index">
                <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="this.$store.dispatch('deeperTracks',{item:item,num:10,flag:true})" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                  <audio preload="auto" v-bind:src="item.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="this.$store.dispatch('deeperTracks',{item:item,num:10,flag:true})" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">
                  <audio preload="auto"></audio>
                </div>
                <div class="title" v-on:click="this.$store.dispatch('deeperTracks',{item:item,num:10,flag:true})" ><div >{{item.name}}</div></div>
              </div>
            </div>
            <div style="width: 50%">
              <div class="stitle">Artists</div>
              <div v-for="(item,index) in this.$store.state.artists" class="playable-search" v-on:mouseover="this.$store.dispatch('parentmouseOver',$event)" v-on:mouseleave="this.$store.dispatch('parentmouseLeave',$event)" v-bind:key="index">
                <div v-if="item.tracks[0].preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks.tracks,num:10,flag:true})" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                  <audio preload="auto" v-bind:src="item.tracks[0].preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
                  <audio preload="auto"></audio>
                </div>
                <div class="title" v-on:click="this.$store.dispatch('deeperartist',{item:item,track:item.tracks.tracks,num:10,flag:true})" >{{item.name}}</div>
              </div>
            </div>
            <div style="width: 50%">
              <div class="stitle">Albums</div>
              <div v-for="(item,index) in this.$store.state.albums" class="playable-search" v-on:mouseover="this.$store.dispatch('parentmouseOver',$event)" v-on:mouseleave="this.$store.dispatch('parentmouseLeave',$event)" v-bind:key="index">
                <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="this.$store.dispatch('deeperAlbum',{item:item,num:10,child:false,search:true})" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                  <audio preload="auto" v-bind:src="item.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="this.$store.dispatch('deeperAlbum',{item:item,num:10,child:false,search:true})" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
                  <audio preload="auto"></audio>
                </div>
                <div class="title" v-on:click="this.$store.dispatch('deeperAlbum',{item:item,num:10,child:false,search:true})">{{item.name}}</div>
              </div>
            </div>
            <div style="width: 50%">
              <div class="stitle">Playlists</div>
              <div v-for="(item,index) in this.$store.state.splaylists" class="playable-search" v-on:mouseover="this.$store.dispatch('parentmouseOver',$event)" v-on:mouseleave="this.$store.dispatch('parentmouseLeave',$event)" v-bind:key="index">
                <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('playl',{item:item})" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                  <audio preload="auto" v-bind:src="item.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" v-on:click="this.$store.dispatch('playl',{item:item})" style="opacity: .5">
                  <audio preload="auto"></audio>
                </div>
                <div class="title" v-on:click="this.$store.dispatch('playl',{item:item})">{{item.name}}</div>
              </div>
            </div>
          </div>
          <rec-track :num="10"></rec-track>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import RecTrack from "./RecTrack";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "DesktopRefactored",
  components: {RecTrack},
  methods: {
    polygon(item,d,num){
      item.deeper1 = []
      let tt = []
      tt = item
      tt.type = 'pl'
      item.deeper1.push(tt)
      console.log(item)
      console.log(d)
      console.log(num)
    },
    polygon2(id){
      console.log(id)
    },
    filterres(event){
      let input = event.target
      let filter = input.value.toUpperCase();
      let pl = document.querySelectorAll('#sptplaylists > div:not(.rectrack,.head) > div.pl > div');

      for (let i=0; i<pl.length; i++){
        if(pl[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
          pl[i].style.display = "block";
        }
        else{
          pl[i].style.display = "none";
        }
      }
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
    findPos(obj) {
      let curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while (obj == obj.offsetParent);
        return [curtop];
      }
    },
  },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
