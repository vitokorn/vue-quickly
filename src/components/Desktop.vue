<template>
  <div>
    <div class="main">
      <ul class="tabs">
        <li id="option1">
    <a id="playlistlist" href="#option1" v-on:click.self="fetchPlaylists" class="container pl">Playlists Pc</a>
      <div v-for="(item,index) of listplaylists" v-bind:key="index">
        <div v-bind:id="item.id" v-on:click="fetchInit" class="hr-line-dashed">{{ item.name }}</div>
      </div>
<!--        <div id="playlist" class="container-fluid con2">-->
<!--          <div id="p_" class="con2">-->
<!--            <div class="con4">{{ playinfo.name }}</div>-->
<!--            <div style="width: 60%; display: flex; align-items: center;">-->
<!--              <div>-->
<!--                <a v-bind:href="playinfo.name" target="_blank">-->
<!--                  <button class="button">Open is Spotify</button>-->
<!--                </a>-->
<!--              </div>-->
<!--              <div class="con4" v-bind:style="{ 'background-image': 'url(' + playinfo['images'][0]['url'] + ')' }" style=" background-repeat: no-repeat; background-size: cover;"></div>-->
<!--            </div>-->
<!--            </div>-->
<!--          </div>-->
      <div class="con2" v-for="item of playinfo" v-bind:key="item.id">
        <div class="con4" style="color: black">{{item.name}}</div>
        <div style="width: 60%;display: flex;align-items: center;">{{item.description}}</div>
        <div class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
        <button v-bind:id="'refresh_' + item.id" v-on:click="refreshplaylists('refresh_' + item.id)" class=""><img v-bind:id="'icon_'+ item.id"></button>
<!--        <div v-bind:id="item.id" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}}-->
<!--          <audio preload="none" v-bind:src="item.track.preview_url"></audio>-->
<!--        </div>-->
      </div>
      <div class="con2" style="display: flex;color: black">
      <div class="trackbody" v-for="(item,index) of playlists" v-bind:key="index">
        <div v-bind:id="item.id" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,1)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}}
          <audio preload="none" v-bind:src="item.track.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">
          <audio preload="none"></audio>
        </div>
      </div>
    </div>
    <div class="rectrack">
      <div v-for="d in deeper1" v-bind:key="d.id">
        <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
          <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
            <audio preload="none" v-bind:src="d.track.preview_url"></audio>
          </div>
          <div style="width: 50%;text-align: left;">
            <div>{{d.track.name}}</div>
            <div style="display: flex; align-items: center;"><p>By </p>
              <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,1)">{{art.name}}</div>
              </div>
            </div>
            <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,1)">Recommended songs based on this</span>
            <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
              <button class="button">Open is Spotify</button></a>
            </div>
          </div>
          <div class="artist-cirle con3" v-for="(art,index) in d.track.artists" v-bind:key="index" v-on:click="deeperartist(art,d,1)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
            <audio preload="none" v-bind:src="d.track.preview_url"></audio>
            <div style="float: left; margin-left: 50px;">{{art.name}}</div>
          </div>
        </div>
        <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
          <div v-for="(s,index) in d.tracks" v-bind:key="index">
            <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,1)">{{s.name}}
              <audio preload="none" v-bind:src="s.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          </div>
        <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
          <div v-for="(ta,index) in d" v-bind:key="index">
          <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
          <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
            <audio v-bind:src="ta.preview_url"></audio>
          </div>
          <div style="width: 60%">{{ta.name}}
            <div>{{ta['followers']['total'] + ' followers'}}</div>
            <div>{{ta['genres']}}</div>
            <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,1)">Recomended artists songs based on this</div>
            <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
              <button class="button">Open is Spotify</button></a>
            </div>
          </div>
            </div>
            <div v-if="ta.type==='related-artists'" >Related Artist</div>
            <div v-if="ta.type==='related-artists'" class="col2">
            <div v-for="(r,index) in ta['items']" v-bind:key="index">
              <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,1)">
                <audio v-bind:src="r.preview_url"></audio>
              </div>
              <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                <audio></audio>
              </div>
            </div>
          </div>
          <div >
            <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
            <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
              <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,1)">{{tt.name}}
                  <audio v-bind:src="tt.preview_url"></audio>
                </div>
                <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                  <audio></audio>
                </div>
              </div>
            </div>
            <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
            <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
              <div v-for="(alb,index) in ta" v-bind:key="index">
                <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,1)" v-on:mouseleave="mouseLeave">{{alb.name}}
                  <audio v-bind:src="alb.preview_url"></audio>
                </div>
                <div v-else class="con3" v-on:click="deeperAlbum(alb,1)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                  <audio></audio>
                </div>
              </div>
            </div>
            <div v-if="ta.type==='single'" tabindex="3">Single</div>
            <div v-if="ta.type==='single'" tabindex="3" class="single con2">
              <div v-for="(s,index) in ta" v-bind:key="index">
                <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,1)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                  <audio v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else class="con3" v-on:click="deeperAlbum(s,1)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio></audio>
                </div>
              </div>
            </div>

            <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
            <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
              <div v-for="(a,index) in ta" v-bind:key="index">
                <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,1)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                  <audio v-bind:src="a.preview_url"></audio>
                </div>
                <div v-else class="con3" v-on:click="deeperAlbum(a,1)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                  <audio></audio>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div v-else-if="d.type ==='deepertracks'">
          <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
            <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
              <audio preload="none" v-bind:src="d.preview_url"></audio>
            </div>
            <div style="width: 50%;text-align: left;">
              <div>{{d.name}}</div>
              <div style="display: flex; align-items: center;"><p>By </p>
                <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                  <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,1)">{{art.name}}</div>
                </div>
              </div>
              <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,1)">Recommended songs based on this</span>
              <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                <button class="button">Open is Spotify</button></a>
              </div>
            </div>
            <div class="artist-cirle con3" v-for="(art,index) in d.artists" v-bind:key="index" v-on:click="deeperartist(art,d,1)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
              <audio preload="none" v-bind:src="d.preview_url"></audio>
              <div style="float: left; margin-left: 50px;">{{art.name}}</div>
            </div>
          </div>
        </div>
        <div v-else-if="d.type ==='deepertracks2'">
          <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
            <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
              <audio preload="none" v-bind:src="d.preview_url"></audio>
            </div>
            <div style="width: 50%;text-align: left;">
              <div>{{d.name}}</div>
              <div style="display: flex; align-items: center;"><p>By </p>
                <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                  <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,1)">{{art.name}}</div>
                </div>
              </div>
              <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,1)">Recommended songs based on this</span>
              <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                <button class="button">Open is Spotify</button></a>
              </div>
            </div>
            <div class="artist-cirle con3" v-for="(art,index) in d.artists" v-bind:key="index" v-on:click="deeperartist(art,d,1)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
              <audio preload="none" v-bind:src="d.preview_url"></audio>
              <div style="float: left; margin-left: 50px;">{{art.name}}</div>
            </div>
          </div>
        </div>
        <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,1)">
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
                <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
                  <div style="width: 100%;">Seed artist</div>
                  <div v-for="(s,index) in d.tracks" v-bind:key="index">
                    <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,1)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </div>
                </div>
</div>
        </div>
          </li>
        <li id="option2">
    <a href="#option2" v-on:click.self="fetchArtist">Top artists</a>
      <div id="topartist" class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of topartist" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(item,item.tracks,2)" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" >{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(item,item.tracks,2)" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper2" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.track.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,2)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,2)">Recommended songs based on this</span>
                <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,2)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,2)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,2)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,2)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,2)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,2)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,2)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,2)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,2)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,2)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,2)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,2)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,2)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,2)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,2)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,2)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,2)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,2)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,2)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          </li>
        <li id="option3">
    <a href="#option3" v-on:click.self="fetchArtist2">Top artists 6 month</a>
      <div id="topartist6" class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of topartist6" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3" v-on:click="deeperartist(item,item.tracks,22)"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper22" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.track.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.track.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,22)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,22)">Recommended songs based on this</span>
                <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,22)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,22)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,22)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,22)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,22)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,22)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,22)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,22)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,22)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,22)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,22)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,22)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,22)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,22)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,22)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,22)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,22)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,22)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,22)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

          </li>
        <li id="option4">
          <a href="#option4" v-on:click.self="fetchArtist3">Top artists all time</a>
      <div id="topartista" class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of topartista" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div v-for="d in deeper23" v-bind:key="d.id">
          <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
            <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
              <audio preload="none" v-bind:src="d.track.preview_url"></audio>
            </div>
            <div style="width: 50%;text-align: left;">
              <div>{{d.track.name}}</div>
              <div style="display: flex; align-items: center;"><p>By </p>
                <div v-for="art in d.track.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                  <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,23)">{{art.name}}</div>
                </div>
              </div>
              <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,23)">Recommended songs based on this</span>
              <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
                <button class="button">Open is Spotify</button></a>
              </div>
            </div>
            <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,23)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
              <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              <div style="float: left; margin-left: 50px;">{{art.name}}</div>
            </div>
          </div>
          <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
            <div v-for="s in d.tracks" v-bind:key="s.id">
              <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,23)">{{s.name}}
                <audio preload="none" v-bind:src="s.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                <audio preload="none"></audio>
              </div>
            </div>
          </div>
          <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
            <div v-for="ta in d" v-bind:key="ta.type">
              <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                  <audio v-bind:src="ta.preview_url"></audio>
                </div>
                <div style="width: 60%">{{ta.name}}
                  <div>{{ta['followers']['total'] + ' followers'}}</div>
                  <div>{{ta['genres']}}</div>
                  <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,23)">Recomended artists songs based on this</div>
                  <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
              </div>
              <div v-if="ta.type==='related-artists'" >Related Artist</div>
              <div v-if="ta.type==='related-artists'" class="col2">
                <div v-for="r in ta['items']" v-bind:key="r.id">
                  <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,23)">
                    <audio v-bind:src="r.preview_url"></audio>
                  </div>
                  <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                    <audio></audio>
                  </div>
                </div>
              </div>
              <div >
                <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                  <div v-for="tt in ta['tracks']" v-bind:key="tt">
                    <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,23)">{{tt.name}}
                      <audio v-bind:src="tt.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                  <div v-for="alb in ta" v-bind:key="alb">
                    <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,23)" v-on:mouseleave="mouseLeave">{{alb.name}}
                      <audio v-bind:src="alb.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(alb,23)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='single'" tabindex="3">Single</div>
                <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                  <div v-for="s in ta" v-bind:key="s">
                    <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,23)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                      <audio v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(s,23)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>

                <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                  <div v-for="a in ta" v-bind:key="a">
                    <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,23)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                      <audio v-bind:src="a.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(a,23)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="d.type ==='deepertracks'">
            <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                <audio preload="none" v-bind:src="d.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,23)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,23)">Recommended songs based on this</span>
                <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,23)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="d.type ==='deepertracks2'">
            <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                <audio preload="none" v-bind:src="d.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,23)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,23)">Recommended songs based on this</span>
                <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,23)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
          </div>
          <div v-else-if="d.type ==='deeperalbum'">
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
                  <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,23)">
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
          <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
            <div style="width: 100%;">Seed artist</div>
            <div v-for="s in d.tracks" v-bind:key="s.id">
              <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,23)">{{s.name}}
                <audio preload="none" v-bind:src="s.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                <audio preload="none"></audio>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option5">
    <a href="#option5" v-on:click.self="fetchApi">Top tracks</a>
      <div id="toptrack" class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of items" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,3)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">{{lists(item.artists)}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper3" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                <audio preload="none" v-bind:src="d.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,3)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,3)">Recommended songs based on this</span>
                <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,3)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,3)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,3)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,3)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,3)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,3)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,3)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,3)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,3)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,3)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,3)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,3)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,3)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,3)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,3)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,3)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,3)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,3)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,3)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option6">
    <a href="#option6" v-on:click.self="fetchApi2">Top tracks 6</a>
      <div id="toptrack6" class="con2" style="display: flex;color: black" >
        <div class="trackbody" v-for="item of itemsm" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,32)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper32" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                <audio preload="none" v-bind:src="d.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,32)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,32)">Recommended songs based on this</span>
                <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,32)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,32)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,3)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,3)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,32)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,3)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,32)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,32)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,32)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,32)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,32)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,32)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,3)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,32)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,3)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,3)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,32)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,32)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,32)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option7">
    <a href="#option7" v-on:click.self="fetchApi3">Top tracks all time</a>
      <div id="toptrackall" class="con2" style="display: flex;color: black" >
        <div class="trackbody" v-for="item of itemsl" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,33)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper33" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                <audio preload="none" v-bind:src="d.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,33)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,3)">Recommended songs based on this</span>
                <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,33)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,33)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,33)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,33)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,33)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,33)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,33)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,33)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,33)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,33)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,33)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,33)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,3)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,33)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,33)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,3)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,3)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,33)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,33)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option8">
    <a href="#option8" v-on:click.self="fetchAlbums">Saved albums</a>
      <div id="savedalbum" class="con2">
        <div class="albumbody" v-for="item of savedalbums" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperAlbum(item,4)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.album.artists)}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.album.artists)}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper4" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.track.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.track.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,4)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,4)">Recommended songs based on this</span>
                <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,4)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,4)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,4)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,4)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,4)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,4)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,4)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,4)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,4)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,4)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,4)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,4)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,4)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,4)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,4)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,4)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,4)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
              <div class="deep_albums con2" >
                <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.album.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[1].url + ')' }" style="opacity: .5">{{d.album.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="margin-left: 4px; margin-right: 4px;">{{d.album.name}}
                  <div>{{d.album.release_date}}</div>
                  <!--            <div>{{list(d.artists)}}</div>-->
                  <span style="color: rgb(240, 55, 165);">Recomended songs based on this</span>
                </div>
                <div style="display: block;" class="trackList">Tracks
                  <div v-for="track in d.album.tracks.items" v-bind:key="track.id">
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.album.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d.album,4)">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none" v-bind:src="track.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.album.images[1].url + ')' }"  style="opacity: .5">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none" v-bind:src="track.preview_url"></audio>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,4)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option9">
    <a href="#option9" v-on:click.self="fetchTracks(0)">Saved tracks</a>
      <div id="savedtrack" class="con2">
        <div class="albumbody" v-for="item of savedtracks" v-bind:key="item.id">
          <div v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,5)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item.track.artists)}} - {{item.track.name}}
            <audio preload="none" v-bind:src="item.track.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.track.artists)}} - {{item.track.name}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper5" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.track.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.track.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,5)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,5)">Recommended songs based on this</span>
                <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,5)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,5)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,5)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,5)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,5)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,5)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,5)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,5)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,5)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,5)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,5)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,5)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,5)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,5)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,5)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,5)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,5)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,5)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,5)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option10">
    <a href="#option10" v-on:click.self="fetchFA">Followed artist</a>
      <div id="followedartist" class="con2">
        <div class="fabody" v-for="item of followedartists" v-bind:key="item.id">
          <div v-if="item.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(item,item.tracks,6)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{item.name}}
            <audio preload="none" v-bind:src="item.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">{{item.name}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper6" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.track.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.track.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,6)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,6)">Recommended songs based on this</span>
                <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,6)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,6)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,6)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,6)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,6)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,6)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,6)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,6)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,6)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,6)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,6)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,6)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,2)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,6)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,6)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,2)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,6)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,6)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,6)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option11">
    <a href="#option11" v-on:click.self="fetchNR(0)">New releases</a>
      <div id="newrelease" class="con2">
        <div class="newbody" v-for="item of newreleases" v-bind:key="item.id">
          <div v-if="item.tracks.items[0].preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,7)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{lists(item.artists)}}
            <audio preload="none" v-bind:src="item.tracks.items[0].preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}}
            <audio preload="none"></audio>
          </div>
        </div>
        <div class="rectrack">
          <div v-for="d in deeper7" v-bind:key="d.id">
            <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                <audio preload="none" v-bind:src="d.tracks.items[0].preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;">
                <div>{{d.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,7)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,7)">Recommended songs based on this</span>
                <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,7)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.tracks.items[0].preview_url"></audio>
                <div style="float: left; margin-left: 50px;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,7)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
              <div v-for="ta in d" v-bind:key="ta.type">
                <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
                  <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div style="width: 60%">{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,7)">Recomended artists songs based on this</div>
                    <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                      <button class="button">Open is Spotify</button></a>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" class="col2">
                  <div v-for="r in ta['items']" v-bind:key="r.id">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,7)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div >
                  <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                    <div v-for="tt in ta['tracks']" v-bind:key="tt">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,7)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
                  <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                    <div v-for="alb in ta" v-bind:key="alb">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,7)" v-on:mouseleave="mouseLeave">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,7)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single'" tabindex="3">Single</div>
                  <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                    <div v-for="s in ta" v-bind:key="s">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,7)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,7)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
                  <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                    <div v-for="a in ta" v-bind:key="a">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,7)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,7)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,7)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,7)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,7)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,7)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,7)">Recommended songs based on this</span>
                  <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                    <button class="button">Open is Spotify</button></a>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,7)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; margin-left: 50px;">{{art.name}}</div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type ==='deeperalbum'">
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
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,7)">
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
            <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
              <div style="width: 100%;">Seed artist</div>
              <div v-for="s in d.tracks" v-bind:key="s.id">
                <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,7)">{{s.name}}
                  <audio preload="none" v-bind:src="s.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                  <audio preload="none"></audio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </li>
        <li id="option12">
    <a href="#option12" id="spt" v-on:click.self="fetchSpotPlaylists(0)" class="container pl">Spotify playlists</a>
      <div v-for="item of spotplaylists" v-bind:key="item.id">
        <div v-bind:id="item.id" v-on:click="SpotInit" class="hr-line-dashed">{{ item.name }}</div>
      </div>
      <div class="con2" v-for="item of sptinfo" v-bind:key="item.id">
        <div class="con4" style="color: black">{{item.name}}</div>
        <div style="width: 60%;display: flex;align-items: center;">{{item.description}}</div>
        <div class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
        <!--        <div v-bind:id="item.id" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}}-->
        <!--          <audio preload="none" v-bind:src="item.track.preview_url"></audio>-->
        <!--        </div>-->
      </div>
      <div class="con2" style="display: flex;color: black">
        <div class="trackbody" v-for="item of sptplaylists" v-bind:key="item.id">
          <div v-bind:id="item.id" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,9)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}}
            <audio preload="none" v-bind:src="item.track.preview_url"></audio>
          </div>
          <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">
            <audio preload="none"></audio>
          </div>
        </div>
      </div>
    <div class="rectrack">
      <div v-for="d in deeper9" v-bind:key="d.id">
        <div v-if="d.type==='pl'" class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
          <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.track.name}}
            <audio preload="none" v-bind:src="d.track.preview_url"></audio>
          </div>
          <div style="width: 50%;text-align: left;">
            <div>{{d.track.name}}</div>
            <div style="display: flex; align-items: center;"><p>By </p>
              <div v-for="art in d.track.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d.track,9)">{{art.name}}</div>
              </div>
            </div>
            <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,9)">Recommended songs based on this</span>
            <div><a v-bind:href="d['track']['external_urls']['spotify']" target="_blank">
              <button class="button">Open is Spotify</button></a>
            </div>
          </div>
          <div class="artist-cirle con3" v-for="art in d.track.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,9)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
            <audio preload="none" v-bind:src="d.track.preview_url"></audio>
            <div style="float: left; margin-left: 50px;">{{art.name}}</div>
          </div>
        </div>
        <div v-else-if="d.type==='seed_tracks'" class="seed_tracks con2">
          <div v-for="s in d.tracks" v-bind:key="s.id">
            <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,9)">{{s.name}}
              <audio preload="none" v-bind:src="s.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
              <audio preload="none"></audio>
            </div>
          </div>
        </div>
        <div v-else-if="d.type==='trackartist'" class="trackartist con2" style="gap: 16px;text-align: left">
          <div v-for="ta in d" v-bind:key="ta.type">
            <div v-if="ta.type==='artist'" class="recartist con2" style="gap: 16px;text-align: left">
              <div class="con3" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{ta.name}}
                <audio v-bind:src="ta.preview_url"></audio>
              </div>
              <div style="width: 60%">{{ta.name}}
                <div>{{ta['followers']['total'] + ' followers'}}</div>
                <div>{{ta['genres']}}</div>
                <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist(ta,9)">Recomended artists songs based on this</div>
                <div><a v-bind:href="ta['external_urls']['spotify']" target="_blank">
                  <button class="button">Open is Spotify</button></a>
                </div>
              </div>
            </div>
            <div v-if="ta.type==='related-artists'" >Related Artist</div>
            <div v-if="ta.type==='related-artists'" class="col2">
              <div v-for="r in ta['items']" v-bind:key="r.id">
                <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperartist(r,ta,9)">
                  <audio v-bind:src="r.preview_url"></audio>
                </div>
                <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                  <audio></audio>
                </div>
              </div>
            </div>
            <div >
              <div v-if="ta.type==='top_tracks'" tabindex="1">Top tracks</div>
              <div v-if="ta.type==='top_tracks'" tabindex="1" class="top-tracks con2">
                <div v-for="tt in ta['tracks']" v-bind:key="tt">
                  <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(tt,9)">{{tt.name}}
                    <audio v-bind:src="tt.preview_url"></audio>
                  </div>
                  <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                    <audio></audio>
                  </div>
                </div>
              </div>
              <div v-if="ta.type==='albums'" tabindex="2">Albums</div>
              <div v-if="ta.type==='albums'" tabindex="2" class="album con2">
                <div v-for="alb in ta" v-bind:key="alb">
                  <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:click="deeperAlbum(alb,9)" v-on:mouseleave="mouseLeave">{{alb.name}}
                    <audio v-bind:src="alb.preview_url"></audio>
                  </div>
                  <div v-else class="con3" v-on:click="deeperAlbum(alb,9)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                    <audio></audio>
                  </div>
                </div>
              </div>
              <div v-if="ta.type==='single'" tabindex="3">Single</div>
              <div v-if="ta.type==='single'" tabindex="3" class="single con2">
                <div v-for="s in ta" v-bind:key="s">
                  <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,9)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{s.name}}
                    <audio v-bind:src="s.preview_url"></audio>
                  </div>
                  <div v-else class="con3" v-on:click="deeperAlbum(s,9)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                    <audio></audio>
                  </div>
                </div>
              </div>

              <div v-if="ta.type==='appears_on'" tabindex="4">Appears on</div>
              <div v-if="ta.type==='appears_on'" tabindex="4" class="appear con2">
                <div v-for="a in ta" v-bind:key="a">
                  <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,9)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{a.name}}
                    <audio v-bind:src="a.preview_url"></audio>
                  </div>
                  <div v-else class="con3" v-on:click="deeperAlbum(a,9)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                    <audio></audio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="d.type ==='deepertracks'">
          <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
            <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
              <audio preload="none" v-bind:src="d.preview_url"></audio>
            </div>
            <div style="width: 50%;text-align: left;">
              <div>{{d.name}}</div>
              <div style="display: flex; align-items: center;"><p>By </p>
                <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                  <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,9)">{{art.name}}</div>
                </div>
              </div>
              <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,9)">Recommended songs based on this</span>
              <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                <button class="button">Open is Spotify</button></a>
              </div>
            </div>
            <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,9)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
              <audio preload="none" v-bind:src="d.preview_url"></audio>
              <div style="float: left; margin-left: 50px;">{{art.name}}</div>
            </div>
          </div>
        </div>
        <div v-else-if="d.type ==='deepertracks2'">
          <div class="playlisttrack" style="display: flex; width: 100%; margin-top: 12px; margin-bottom: 6px;">
            <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave">{{d.name}}
              <audio preload="none" v-bind:src="d.preview_url"></audio>
            </div>
            <div style="width: 50%;text-align: left;">
              <div>{{d.name}}</div>
              <div style="display: flex; align-items: center;"><p>By </p>
                <div v-for="art in d.artists" v-bind:key="art.id" style="display: flex;align-items: center">
                  <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,9)">{{art.name}}</div>
                </div>
              </div>
              <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,9)">Recommended songs based on this</span>
              <div><a v-bind:href="d['external_urls']['spotify']" target="_blank">
                <button class="button">Open is Spotify</button></a>
              </div>
            </div>
            <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist(art,d,9)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
              <audio preload="none" v-bind:src="d.preview_url"></audio>
              <div style="float: left; margin-left: 50px;">{{art.name}}</div>
            </div>
          </div>
        </div>
        <div v-else-if="d.type ==='deeperalbum'">
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
                <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks2(track,d,9)">
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
        <div v-else-if="d.type==='seed_artists'" class="seed_artists con2" >
          <div style="width: 100%;">Seed artist</div>
          <div v-for="s in d.tracks" v-bind:key="s.id">
            <div v-if="s.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeperTracks(s,9)">{{s.name}}
              <audio preload="none" v-bind:src="s.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
              <audio preload="none"></audio>
            </div>
          </div>
        </div>
      </div>
    </div>


<!--    <div class="con2" v-for="item of playinfo" v-bind:key="item.id">-->
<!--      <div class="con4" style="color: black">{{item.name}}</div>-->
<!--      <div style="width: 60%;display: flex;align-items: center;">{{item.description}}</div>-->
<!--      <div class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>-->
<!--    </div>-->
<!--    <div class="con2" style="display: flex;color: black">-->
<!--      <div class="trackbody" v-for="item of playlists" v-bind:key="item.id">-->
<!--        <div v-bind:id="item.id" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:mouseover="mouseOver" v-on:mouseleave="mouseLeave" v-on:click="deeper(item,1)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}}-->
<!--          <audio preload="none" v-bind:src="item.track.preview_url"></audio>-->
<!--        </div>-->
<!--        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">-->
<!--          <audio preload="none"></audio>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
        </li>
      </ul>
      </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div class="srch"><input v-on:input="search">
    <div class="tracks" v-for="(item,index) in tracks" v-bind:key="index">

    </div>
      <div class="artists" v-for="(item,index) in artists" v-bind:key="index">

      </div>
      <div class="albums" v-for="(item,index) in albums" v-bind:key="index">
        <div v-if="item.preview_url" tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
          <audio preload="none" v-bind:src="item.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
          <audio preload="none"></audio>
        </div>
      </div>
      <div class="playlists" v-for="(item,index) in splaylists" v-bind:key="index">
        <div v-if="item.preview_url" tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
          <audio preload="none" v-bind:src="item.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
          <audio preload="none"></audio>
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
      deeper2:[],
      deeper22:[],
      deeper23:[],
      deeper3:[],
      deeper32:[],
      deeper33:[],
      deeper4:[],
      deeper5:[],
      deeper6:[],
      deeper7:[],
      deeper8:[],
      deeper9:[],
      deepers:[],
      spotplaylists:[],
      sptinfo:[],
      sptplaylists:[],
      arr:[],
      tracks:[],
      artists:[],
      albums:[],
      splaylists:[],
    }
  },
  methods: {
    polygon(item,d,num){
      console.log(item)
      console.log(d)
      console.log(num)
    },
    deeper: function(item,num){
      console.log(item)
      let tracktrack = []
      tracktrack = item
      tracktrack.type = 'pl'
      if (num === 1){
        this.deeper1.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper1)
      } else if (num === 2){
        this.deeper2.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper2)
      } else if (num === 22){
        this.deeper22.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper22)
      } else if (num === 23){
        this.deeper23.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper23)
      } else if (num === 3){
        this.deeper3.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper3)
      } else if (num === 32){
        this.deeper32.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper32)
      } else if (num === 33){
        this.deeper33.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper33)
      } else if (num === 4){
        this.deeper4.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper4)
      } else if (num === 5){
        this.deeper5.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper5)
      } else if (num === 6){
        this.deeper6.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper6)
      } else if (num === 7){
        this.deeper7.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper7)
      } else if (num === 8){
        this.deeper8.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper8)
      } else if (num === 9){
        this.deeper9.push(tracktrack)
        console.log(tracktrack)
        console.log(this.deeper9)
      }
    },
    deeperartist: function (item,track,num){
      let trackartist = []
      trackartist.type = 'trackartist'
      this.deeperArtistself(item,track).then(result => trackartist.push(result))
      this.deeperArtisttt(item).then(tt => trackartist.push(tt))
      this.deeperArtistAlbums(item).then(album => trackartist.push(album))
      this.deeperArtistSingle(item).then(single => trackartist.push(single))
      this.deeperArtistAppear(item).then(appear => trackartist.push(appear))
      this.deeperArtistRelated(item).then(related => trackartist.push(related))
      if (num === 1){
        this.deeper1.push(trackartist)
      } else if (num === 2){
        this.deeper2.push(trackartist)
      } else if (num === 22){
        this.deeper22.push(trackartist)
      } else if (num === 23){
        this.deeper23.push(trackartist)
      } else if (num === 3){
        this.deeper3.push(trackartist)
      } else if (num === 32){
        this.deeper32.push(trackartist)
      } else if (num === 33){
        this.deeper33.push(trackartist)
      } else if (num === 4){
        this.deeper4.push(trackartist)
      } else if (num === 5){
        this.deeper5.push(trackartist)
      } else if (num === 6){
        this.deeper6.push(trackartist)
      } else if (num === 7){
        this.deeper7.push(trackartist)
      } else if (num === 8){
        this.deeper8.push(trackartist)
      } else if (num === 9){
        this.deeper9.push(trackartist)
      }
    },
    deeperArtistself(item,track){
      return axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let trackartist = []
            trackartist = response.data
            trackartist.type = 'artist'
            if (track.preview_url){
              trackartist.preview_url = track.preview_url
            }
            return trackartist
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperArtisttt(item){
      // top tracks
      return axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/top-tracks?limit=10&market=UA',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let tt = []
            tt = response.data
            tt.type = 'top_tracks'
            return tt
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperArtistAlbums(item){
      // album
      return axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=album&limit=10',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
            }
            newarr.type = 'albums'
            console.log(newarr)
            return newarr

          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperArtistSingle(item){
      // single,compilation
      return axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=single,compilation',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let single = []
            let arr = []
            arr.items = response.data['items']
            console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.items.length;i++){
              console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr.items[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    // console.log(333)
                    // console.log(response.data)
                    arr.items[i].tracks = tracks
                    if (tracks[0]['preview_url']){
                      arr.items[i].preview_url = tracks[0]['preview_url']
                    }
                    single.push(arr.items[i])

                  })
            }single.type = 'single'
            return single
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperArtistAppear(item){
      // appears_on
      return axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/albums?include_groups=appears_on',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let appears = []
            let arr = []
            arr.items = response.data['items']
            console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.items.length;i++){
              console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr.items[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    arr.items[i].tracks = tracks
                    // console.log(333)
                    // console.log(response.data)
                    if (tracks[0]['preview_url']){
                      arr.items[i].preview_url = tracks[0]['preview_url']
                    }
                    appears.push(arr.items[i])

                  })
            }appears.type = 'appears_on'
            return appears

          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperArtistRelated(item){
      // related-artists
      return axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/related-artists',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let relatedartist = []
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
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      arr.items[i].preview_url = tracks[0]['preview_url']
                    }
                    relatedartist.push(arr.items[i])

                  })
            }
            fin.type = 'related-artists'
            fin.items = relatedartist
            return fin
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperAlbum(item,num){
      item.type ='deeperalbum'
      console.log(item)
      console.log(this.deeper1)
      if (num === 1){
        this.deeper1.push(item)
      } else if (num === 2){
        this.deeper2.push(item)
      } else if (num === 22){
        this.deeper22.push(item)
      } else if (num === 23){
        this.deeper23.push(item)
      } else if (num === 3){
        this.deeper3.push(item)
      } else if (num === 32){
        this.deeper32.push(item)
      } else if (num === 33){
        this.deeper33.push(item)
      } else if (num === 4){
        this.deeper4.push(item)
      } else if (num === 5){
        this.deeper5.push(item)
      } else if (num === 6){
        this.deeper6.push(item)
      } else if (num === 7){
        this.deeper7.push(item)
      } else if (num === 8){
        this.deeper8.push(item)
      } else if (num === 9){
        this.deeper9.push(item)
      }
    },
    deeperTracks(item,num){
      item.type ='deepertracks'
      if (num === 1){
        this.deeper1.push(item)
      } else if (num === 2){
        this.deeper2.push(item)
      } else if (num === 22){
        this.deeper22.push(item)
      } else if (num === 23){
        this.deeper23.push(item)
      } else if (num === 3){
        this.deeper3.push(item)
      } else if (num === 32){
        this.deeper32.push(item)
      } else if (num === 33){
        this.deeper33.push(item)
      } else if (num === 4){
        this.deeper4.push(item)
      } else if (num === 5){
        this.deeper5.push(item)
      } else if (num === 6){
        this.deeper6.push(item)
      } else if (num === 7){
        this.deeper7.push(item)
      } else if (num === 8){
        this.deeper8.push(item)
      } else if (num === 9){
        this.deeper9.push(item)
      }
    },
    deeperTracks2(item,d,num){
      item.images = d.images
      item.type ='deepertracks2'
      if (num === 1){
        this.deeper1.push(item)
      } else if (num === 2){
        this.deeper2.push(item)
      } else if (num === 22){
        this.deeper22.push(item)
      } else if (num === 23){
        this.deeper23.push(item)
      } else if (num === 3){
        this.deeper3.push(item)
      } else if (num === 32){
        this.deeper32.push(item)
      } else if (num === 33){
        this.deeper33.push(item)
      } else if (num === 4){
        this.deeper4.push(item)
      } else if (num === 5){
        this.deeper5.push(item)
      } else if (num === 6){
        this.deeper6.push(item)
      } else if (num === 7){
        this.deeper7.push(item)
      } else if (num === 8){
        this.deeper8.push(item)
      }else if (num === 9){
        this.deeper9.push(item)
      }
    },
    seedArtist(item,num) {
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + item['id'] + '&limit=50&offset=0&market=UA',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) => {
            let data = []
            data.tracks = response.data['tracks']
            data.type = 'seed_artists'
            console.log(data)
            if (num === 1){
              this.deeper1.push(data)
            } else if (num === 2){
              this.deeper2.push(data)
            } else if (num === 22){
              this.deeper22.push(data)
            } else if (num === 23){
              this.deeper23.push(data)
            } else if (num === 3){
              this.deeper3.push(data)
            } else if (num === 32){
              this.deeper32.push(data)
            } else if (num === 33){
              this.deeper33.push(data)
            } else if (num === 4){
              this.deeper4.push(data)
            } else if (num === 5){
              this.deeper5.push(data)
            } else if (num === 6){
              this.deeper6.push(data)
            } else if (num === 7){
              this.deeper7.push(data)
            } else if (num === 8){
              this.deeper8.push(data)
            }else if (num === 9){
              this.deeper9.push(item)
            }
          })
          .catch()
    },
    seedTracks(item,num) {
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + item['id'] + '&limit=50&offset=0&market=UA',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) => {
            let data = []
            data.tracks = response.data['tracks']
            data.type = 'seed_tracks'
            console.log(data)
            if (num === 1){
              this.deeper1.push(data)
            } else if (num === 2){
              this.deeper2.push(data)
            } else if (num === 22){
              this.deeper22.push(data)
            } else if (num === 23){
              this.deeper23.push(data)
            } else if (num === 3){
              this.deeper3.push(data)
            } else if (num === 32){
              this.deeper32.push(data)
            } else if (num === 33){
              this.deeper33.push(data)
            } else if (num === 4){
              this.deeper4.push(data)
            } else if (num === 5){
              this.deeper5.push(data)
            } else if (num === 6){
              this.deeper6.push(data)
            } else if (num === 7){
              this.deeper7.push(data)
            } else if (num === 8){
              this.deeper8.push(data)
            }else if (num === 9){
              this.deeper9.push(item)
            }
          })
          .catch()
    },
    fetchPlaylists(){
      axios.request({
        url:'https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.listplaylists = response.data['items']
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchInit:function(event){
      console.log('167'  + event.currentTarget.id)
      let id = event.currentTarget.id
      axios.request({
        url:'https://api.spotify.com/v1/playlists/' + id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            console.log(response.data)
            this.playinfo.push(response.data)
            this.playlists = response.data['tracks']['items']
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchArtist(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=short_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    console.log('247' + response.data)
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    items[i].tracks = tracks
                    newarr.push(items[i])

                  })
            }
            this.topartist = newarr
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchArtist2(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=medium_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchArtist3(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchApi(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.items = response.data['items']
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchApi2(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.itemsm = response.data['items']
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchApi3(){
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.itemsl = response.data['items']
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchAlbums(){
      axios.request({
        url: 'https://api.spotify.com/v1/me/albums',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchTracks(offset){
      axios.request({
        url: 'https://api.spotify.com/v1/me/tracks?offset=' + offset + '&limit=50',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.savedtracks.push(...response.data['items'])
            if (response.data['items'].length > 0){
              this.fetchTracks(offset += 50)
            }

          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchNR(offset){
      axios.request({
        url: 'https://api.spotify.com/v1/browse/new-releases?limit=20&offset=' + offset,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })

    },
    getNewrelease(newarr,offset){
        axios.request({
          url:'https://api.spotify.com/v1/albums?ids=' + newarr ,
          method: 'get',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
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
            .catch(error =>{
              if (error.response.status){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      },
    fetchFA(){
      axios.request({
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['artists']['items']
            for (let i=0;i <  items.length;i++){
              console.log('237 ' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=UA&limit=10',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    items[i].tracks = tracks
                    newarr.push(items[i])

                  })
            }
            this.followedartists = newarr
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchSpotPlaylists(offset){
      axios.request({
        url:'https://api.spotify.com/v1/users/spotify/playlists?fields=items(name,id)&limit=50&offset=' + offset,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.spotplaylists.push(...response.data['items'])
            if (response.data['items'].length > 0){
              this.fetchSpotPlaylists(offset+=50)
            }
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    SpotInit:function(event){
      console.log('167'  + event.currentTarget.id)
      let id = event.currentTarget.id
      axios.request({
        url:'https://api.spotify.com/v1/playlists/' + id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            console.log(response.data)
            this.sptinfo.push(response.data)
            this.sptplaylists = response.data['tracks']['items']
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    refreshplaylists(rid){
      // let value = rid
      // let refreshIcon = rid.replace('refresh_', 'icon_')
      // let refreshButton = document.getElementById(value)
      // refreshIcon.class("class", "refresh-start")
      // refreshButton.removeAttribute("class")
      // refreshButton.disabled = true
      let id = rid.replace('refresh_','')
      // refreshButton.setAttribute("class", "refresh-end")
      // refreshButton.disabled = false
       axios.request({
          url:'https://api.spotify.com/v1/playlists/' + id,
          method: 'get',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              console.log(response.data)
              this.playinfo = []
              this.playinfo.push(response.data)
              this.playlists = response.data['tracks']['items']
            })
           .catch(error =>{
             if (error.response.status){
               axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                 console.log(response.data)
                 let new_token = response.data['new_token']
                 document.cookie ='access_token=' + new_token
               })
             }
           })
      },
    search(e){
        if (e.target.value) {
          let value = e.target.value
          console.log(value)

          axios.request({
            url: 'https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5',
            method: 'get',
            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
          })
              .then((response) => {
                console.log(response.data)
                this.tracks = []
                this.artists = []
                this.albums = []
                this.splaylists = []
                let albums = response.data['albums']['items']
                let artists = response.data['artists']['items']
                let playlists = response.data['playlists']['items']
                this.tracks = response.data['tracks']['items']

                console.log(albums)
                console.log(artists)
                console.log(playlists)
                let newarr
                for (let i = 0; i < albums.length; i++) {
                  console.log('237' + albums[i].id)
                  axios.request({
                    url: 'https://api.spotify.com/v1/albums/' + albums[i].id + '/tracks?market=UA&limit=10',
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                  })
                      .then((response) => {
                        console.log('247' + response.data)
                        let tracks = response.data['items']
                        if (tracks[0]['preview_url']) {
                          albums[i].preview_url = tracks[0]['preview_url']
                        }
                        albums[i].items = tracks
                        newarr.push(albums[i])

                      })
                }
                this.albums = newarr

                let artarr = []
                for (let i = 0; i < artists.length; i++) {
                  console.log('237' + artists[i].id)
                  axios.request({
                    url: 'https://api.spotify.com/v1/artists/' + artists[i].id + '/top-tracks?market=UA',
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                  })
                      .then((response) => {
                        console.log('247' + response.data)
                        let tracks = response.data['tracks']
                        if (tracks[0]['preview_url']) {
                          artists[i].preview_url = tracks[0]['preview_url']
                        }
                        artists[i].tracks = tracks
                        artarr.push(artists[i])

                      })
                }
                this.artists = artarr
                let playlist = []
                for (let i = 0; i < playlists.length; i++) {
                  console.log('237' + playlists[i].id)
                  axios.request({
                    url: 'https://api.spotify.com/v1/playlists/' + playlists[i].id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                  })
                      .then((response) => {
                        console.log(response.data['tracks'])
                        let tracks = response.data['tracks']
                        if (tracks['items'][0]['track']['preview_url']) {
                          playlists[i].preview_url = tracks['items'][0]['track']['preview_url']
                        }
                        playlists[i].tracks = tracks
                        playlist.push(playlists[i])

                      })
                }
                this.splaylists = playlist
                console.log(this.splaylists)

              })


    }},
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
  },
  mounted() {
    // localStorage.setItem('access_token')
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
