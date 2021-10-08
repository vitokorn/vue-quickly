<template>
  <ul class="tabs">
    <li id="option1">
      <a id="playlistlist" v-on:click="switchTabs" v-on:click.self.once="fetchPlaylists($event,0)">Playlists</a>
      <div style="display: block;width: 95%">
        <div id="yourplaylists" class="con2" style="display: block;">
          <div class="rel"><button class="btn" v-on:click="reloadpl"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
          </div>
          <div class="pl" style="justify-content: center;">
            <template  v-for="(item,index) of listplaylists" >
              <div v-bind:id="item.id" v-bind:key="index" v-on:click="fetchInit" class="hr-line-dashed">{{ item.name }}</div>
            </template>
          </div>
          <div class="play" v-for="(item,index) of playlists" v-bind:id="'p' + item.id" v-bind:key="index">
            <div class="con2" >
              <div class="con4">{{item.name}}</div>
              <button class="btn" v-on:click="reloader(1,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
              <div style="width: 60%;display: flex;align-items: center;">{{item.description}}<button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                Follow<input type="checkbox" v-if="item.followed" @click.once="followPlaylist(item,$event)"  checked v-model="item.followed">
                <input type="checkbox" v-else @click.once="followPlaylist(item,$event)" v-model="item.followed"></div>
              <div v-if="item.images" class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
            </div>
            <div class="con2" style="display: flex;color: black" v-bind:key="index">
              <template v-if="item.tracks">
                <template v-for="(pl,ind) of item['tracks']['items']" >
                  <div v-bind:id="pl.id" v-bind:key="ind" v-if="pl.track.preview_url" tabindex="0" class="con3" v-on:click="deeper(pl,1,$event),click($event)" v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }" >{{lists(pl['track']['artists'])}} - {{pl.track.name}}
                    <audio preload="none" v-bind:src="pl.track.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" v-bind:key="ind" class="con3" v-bind:style="{ 'background-image': 'url(' + pl.track.album.images[0].url + ')' }" v-on:click="deeper(pl,1,$event)" style="opacity: .5">{{lists(pl['track']['artists'])}} - {{pl.track.name}}
                    <audio preload="none"></audio>
                  </div>
                </template>
              </template>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper1">
              <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('yourplaylists',art,d,1,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('yourplaylists',d,1,'pl','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    <!--                  <button v-else-if="d.followed === true" class="button" @click.once="followTrack(d)">Remove track</button>-->
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('yourplaylists',art,d,1,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('yourplaylists',art,d,1,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(1,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks">
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('yourplaylists',s,1,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('yourplaylists',s,1,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="index">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('yourplaylists',ta,1,'trackartist')">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('yourplaylists',tt,1,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('yourplaylists',tt,1,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,1,'art' + d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,1,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,1,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,1,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,1,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,1,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;"  v-on:click="deeperartist('yourplaylists',r,ta[index],1,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('yourplaylists',r,ta[index],1,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('yourplaylists',art,d,1,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('yourplaylists',d.track,1,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('yourplaylists',art,d,1,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('yourplaylists',art,d,1,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('yourplaylists',art,d,1,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('yourplaylists',d,1,'playlisttrack','d' + d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('yourplaylists',art,d,1,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('yourplaylists',art,d,1,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'" >
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:click="deeperTracks2('yourplaylists',track,d,1,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('yourplaylists',track,d,1,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(1,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('yourplaylists',s,1,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('yourplaylists',s,1,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </li>
    <li id="option2">
      <a id="ta" v-on:click="switchTabs" v-on:click.self.once="fetchArtist">Top artists</a>
      <div>
        <div style="display: flex;">
          <span id="topartists" v-on:click="switchArtist(1)" v-on:click.self.once="fetchArtist">Last month</span>
          <button class="btn" v-on:click="reloadartists(1,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
          <span id="topartists6" v-on:click="switchArtist(2)" style="margin-left: 12px" v-on:click.self.once="fetchArtist2">Last 6 month</span>
          <button class="btn" v-on:click="reloadartists(2,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
          <span id="topartistsall" v-on:click="switchArtist(3)" style="margin-left: 12px" v-on:click.self.once="fetchArtist3">All time</span>
          <button class="btn" v-on:click="reloadartists(3,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
        </div>
        <div id="topartist" class="con2" style="display: flex;color: black;width: auto;">
          <div class="trackbody" v-for="(item,index) of topartist" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:click="deeperartist('topartist',item,item.tracks,2,true),click($event)" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" >{{item.name}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-on:click="deeperartist('topartist',item,item.tracks,2,true)" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper2" >
              <div v-if="d.type==='pl'" v-bind:key="index"  style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:click="click">{{d.track.name}}
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.track.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartist',art,d,2,false,'pl'),click($event)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartist',d[index],2,'pl')">Recommended songs based on this</span>
                  <div>
                    <button class="button"><a class="linkresset" v-bind:href="d['track']['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="(art,index) in d.track.artists" v-bind:key="index" v-on:click="deeperartist('topartist',art,d,2),click($event)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                  <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                </div>
              </div>
              <div v-else-if="d.type==='seed_tracks'" v-bind:key="index" class="seed_tracks card2" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(2,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('topartist',s,2,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" v-bind:id="d.id" v-bind:key="index" class="trackartist card2" style="gap: 16px;text-align: left">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art' + ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta.genres}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('topartist',ta,2,'trackartist','art' +d[index].id)">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                        <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('topartist',tt,2,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('topartist',tt,2,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,2,'art' +d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,2,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,2,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,2,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,2,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,2,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="related card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url && r.images[0].url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('topartist',r,ta[index],2,false,'trackartist','art'+d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;" v-bind:id="'d'+d.id">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartist',art,d,2,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartist',d,2,'playlisttrack','d'+d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('topartist',art,d,2,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('topartist',art,d,2,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else-if="d.type ==='deepertracks2'" >
                <div class="playlisttrack card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;" v-bind:key="index" v-bind:id="'d'+d.id">
                  <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartist',art,d,2,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartist',d,2,'playlisttrack','d'+d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('topartist',art,d,2,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('topartist',art,d,2,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else-if="d.type ==='deeperalbum'">
                <div class="deep_albums card2" v-bind:key="index" v-bind:id="'alb'+d.id">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                    <template v-for="(art,index) in d.artists">
                      <div v-bind:key="index" style="margin-left: 4px; margin-right: 4px; cursor: pointer;display: flex;align-items: center" v-on:click="deeperartist('topartist',art,d,2,false,'deep_albums')">{{art.name}}</div>
                    </template>
                    <div>{{d.release_date}}</div>
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:click="deeperTracks2('topartist',track,d,2,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('topartist',track,d,2,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(2,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('topartist',s,2),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div id="topartist6" class="con2" style="display: flex;color: black;width: auto;">
          <div class="trackbody" v-for="(item,index) of topartist6" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3" v-on:click="deeperartist('topartist6',item,item.tracks,22,true),click($event)"  v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper22" >
              <div v-if="d.type==='pl'"  v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:click="click">{{d.track.name}}
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.track.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartist6',art,d,22,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('pl',d[index],22,'pl')">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['track']['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="(art,index) in d.track.artists" v-bind:key="index" v-on:click="deeperartist('topartist6',art,d,22)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                  <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                </div>
              </div>
              <div v-else-if="d.type==='seed_tracks'" v-bind:key="index" class="seed_tracks card2" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(22,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks">
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('topartist6',s,22,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('topartist6',s,22,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" v-bind:id="d.id" v-bind:key="index" class="trackartist card2" style="gap: 16px;text-align: left">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art' + ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }">{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('topartist6',ta,22,'trackartist','art' + d[index].id)">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                        <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('topartist6',tt,22,false,'trackartist','art'+ d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('topartist6',tt,22,false,'trackartist','art'+ d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,22,'art' + d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,22,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,22,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,22,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,22,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,22,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="related card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url && r.images[0].url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('topartist6',r,ta[index],22,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('topartist6',r,ta[i],22,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartist6',art,d,22,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartist6',d,22,'playlisttrack','d'+d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('topartist6',art,d,22,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('topartist6',art,d,22,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartist6',art,d,22,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartist6',d,22,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('topartist6',art,d,22,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('topartist6',art,d,22,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'">
                <div class="deep_albums card2" v-bind:key="index" v-bind:id="'alb'+d.id">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:click="deeperTracks2('topartist6',track,d,22,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('topartist6',track,d,22,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(22,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('topartist6',s,22,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('topartist6',s,22,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div id="topartista" class="con2" style="display: flex;color: black;width: auto;">
          <template v-for="(item,index) of topartista" >
            <div v-if="item.preview_url" tabindex="0" v-bind:key="index" class="con3" v-on:click="deeperartist('topartista',item,item.tracks,23,true),click($event)"   v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }">{{item.name}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:key="index" v-on:click="deeperartist('topartista',item,item.tracks,23,true)" v-bind:style="{ 'background-image': 'url(' + item.images[1].url + ')' }" style="opacity: .5">{{item.name}}
              <audio preload="none"></audio>
            </div>
          </template>
          <template v-for="(d,index) in deeper23" >
            <div v-if="d.type==='pl'"  v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:click="click">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;margin-left: 10px;">
                <div>{{d.track.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartista',art,d,23,false,'pl')">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartista',d[index],23,'pl')">Recommended songs based on this</span>
                <div>
                  <button class="button"><a class="linkresset" v-bind:href="d['track']['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                </div>
              </div>
              <div class="artist-cirle con3" v-for="(art,index) in d.track.artists" v-bind:key="index" v-on:click="deeperartist('topartista',art,d,23)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" v-bind:key="index" class="seed_tracks card2" v-bind:id="d.id">
              <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(23,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
              <div class="card2">
                <template v-for="(s,index) in d.tracks">
                  <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('topartista',s,23,false,'seed_tracks'),click($event)">{{s.name}}
                    <audio preload="none" v-bind:src="s.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('topartista',s,23,false,'seed_tracks')">{{s.name}}
                    <audio preload="none"></audio>
                  </div>
                </template>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" v-bind:id="d.id" v-bind:key="index" class="trackartist card2" style="gap: 16px;text-align: left">
              <template v-for="(ta,index) in d">
                <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art' + ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                  <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }">{{ta.name}}
                    <audio></audio>
                  </div>
                  <div >{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('topartista',ta,23,'trackartist','art' + d[index].id)">Recommended artists songs based on this</div>
                    <div>
                      <button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                  <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                    <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('topartista',tt,23,false,'trackartist','art'+ d[0].id),click($event)">{{tt.name}}
                      <audio v-bind:src="tt.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('topartista',tt,23,false,'trackartist','art'+ d[0].id)">{{tt.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                  <div v-for="(alb,index) in ta" v-bind:key="index">
                    <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,23,'art' + d[0].id),click($event)">{{alb.name}}
                      <audio v-bind:src="alb.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(alb,23,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                  <div v-for="(s,index) in ta" v-bind:key="index">
                    <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,23,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                      <audio v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(s,23,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>

                <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                  <div v-for="(a,index) in ta" v-bind:key="index">
                    <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,23,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                      <audio v-bind:src="a.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(a,23,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                <div v-if="ta.type==='related-artists'" v-bind:key="index" class="related card2">
                  <div v-for="(r,index) in ta" v-bind:key="index">
                    <div v-if="r.preview_url && r.images[0].url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('topartista',r,ta[index],23,false,'trackartist','art' + d[0].id),click($event)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('topartista',r,ta[i],23,false,'trackartist','art' + d[0].id)">
                      <audio></audio>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <template v-else-if="d.type ==='deepertracks'">
              <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartista',art,d,23,false,'playlisttrack')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartista',d,23,'playlisttrack','d'+d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('topartista',art,d,23,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('topartista',art,d,23,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none" ></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
            </template>
            <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
              <div class="playlisttrack card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none" ></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('topartista',art,d,23,false,'playlisttrack')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('topartista',d,23,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('topartista',art,d,23,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('topartista',art,d,23,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
            </div>
            <template v-else-if="d.type ==='deeperalbum'">
              <div class="deep_albums card2" v-bind:key="index" v-bind:id="'alb'+d.id">
                <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                  <div>Released {{d.release_date}}</div>
                  <div>By {{lists(d.artists)}}</div>
                  Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                  <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                </div>
                <div style="display: block;" class="trackList">Tracks
                  <div v-for="(track,index) in d.tracks" v-bind:key="index">
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('topartista',track,d,23,false,'deep_albums'),click($event)">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none" v-bind:src="track.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('topartista',track,d,23,false,'deep_albums')">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none" v-bind:src="track.preview_url"></audio>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
              <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(23,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
              <div class="card2">
                <template v-for="(s,index) in d.tracks" >
                  <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('topartista',s,23,false,'seed_artists'),click($event)">{{s.name}}
                    <audio preload="none" v-bind:src="s.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('topartista',s,23,false,'seed_artists')">{{s.name}}
                    <audio preload="none"></audio>
                  </div>
                </template>
              </div>
            </div>
          </template>
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
      <a v-on:click="switchTabs" id="tt" v-on:click.self.once="fetchApi">Top tracks</a>
      <div>
        <div style="display: flex;">
          <span id="toptracks" v-on:click="switchTracks(1)" v-on:click.self.once="fetchApi">Last month</span>
          <button class="btn" v-on:click="reloadtracks(1,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
          <span id="toptrackssix" v-on:click="switchTracks(2)" v-on:click.self.once="fetchApi2" style="margin-left: 12px">Last 6 month</span>
          <button class="btn" v-on:click="reloadtracks(2,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
          <span id="toptracksall" v-on:click="switchTracks(3)" v-on:click.self.once="fetchApi3" style="margin-left: 12px">All time</span>
          <button class="btn" v-on:click="reloadtracks(3,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
        </div>
        <div id="toptrack" class="con2" style="display: flex;color: black;width: auto;">
          <div class="trackbody" v-for="(item,index) of items" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3" v-on:click="deeper(item,3,$event),click($event)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">{{lists(item.artists)}} - {{item.name}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-on:click="deeper(item,3,$event);" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}} - {{item.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper3">
              <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrack',art,d,3,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrack',d,3,'pl','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrack',art,d,3,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrack',art,d,3,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none" ></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(3,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrack',s,3,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrack',s,3,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="index">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('toptrack',ta,3,'trackartist')">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrack',tt,3,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrack',tt,3,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,3,'art' + d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,3,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,3,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,3,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,3,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,3,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index">Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;"  v-on:click="deeperartist('toptrack',r,ta[index],3,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('toptrack',r,ta[index],3,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrack',art,d,3,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrack',d.track,3,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrack',art,d,3,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrack',art,d,3,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrack',art,d,3,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrack',d,3,'playlisttrack','d' + d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrack',art,d,3,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrack',art,d,3,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'" >
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('toptrack',track,d,3,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('toptrack',track,d,3,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(3,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrack',s,3,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrack',s,3,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div id="toptrack6" class="con2" style="display: flex;color: black;width: auto;" >
          <div class="trackbody" v-for="(item,index) of itemsm" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3" v-on:click="deeper(item,32,$event),click($event)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}} - {{item.name}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-on:click="deeper(item,32,$event);" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}} - {{item.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper32">
              <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrack6',art,d,32,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrack6',d,32,'pl','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrack6',art,d,32,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrack6',art,d,32,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none" ></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(32,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrack6',s,32,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrack6',s,32,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="index">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('toptrack6',ta,32,'trackartist')">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrack6',tt,32,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrack6',tt,32,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,32,'art' + d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,32,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,32,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,32,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,32,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,32,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;"  v-on:click="deeperartist('toptrack6',r,ta[index],32,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('toptrack6',r,ta[index],32,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none" ></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrack6',art,d,32,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrack6',d.track,32,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrack6',art,d,32,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrack6',art,d,32,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none" ></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrack6',art,d,32,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrack6',d,32,'playlisttrack','d' + d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <div class="artist-cirle con3" v-for="art in d.artists" v-bind:key="art.id" v-on:click="deeperartist('toptrack6',art,d,32,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrack6',art,d,32,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrack6',art,d,32,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'" >
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('toptrack6',track,d,32,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('toptrack6',track,d,32,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(32,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrack6',s,32,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrack6',s,32,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div id="toptrackall" class="con2" style="display: flex;color: black;width: auto;" >
          <div class="trackbody" v-for="(item,index) of itemsl" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3"  v-on:click="deeper(item,33,$event),click($event)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.artists)}} - {{item.name}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-on:click="deeper(item,33,$event);" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.artists)}} - {{item.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper33">
              <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrackall',art,d,33,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrackall',d,33,'pl','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrackall',art,d,33,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrackall',art,d,33,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none" ></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(33,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrackall',s,33,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrackall',s,33,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="index">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('toptrackall',ta,33,'trackartist')">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrackall',tt,33,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrackall',tt,33,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,33,'art' + d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,33,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,33,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" >{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,33,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,33,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" >{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,33,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('toptrackall',r,ta[index],33,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('toptrackall',r,ta[index],33,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrackall',art,d,33,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrackall',d.track,33,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrackall',art,d,33,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrackall',art,d,33,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('toptrackall',art,d,33,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('toptrackall',d,33,'playlisttrack','d' + d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('toptrackall',art,d,33,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('toptrackall',art,d,33,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'" >
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('toptrackall',track,d,33,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('toptrackall',track,d,33,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(33,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('toptrackall',s,33,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('toptrackall',s,33,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
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
      <a v-on:click="switchTabs" id="sa" v-on:click.self.once="fetchAlbums">Saved albums</a>
      <div>
        <div id="savedalbum" class="con2" >
          <div class="albumbody" v-for="(item,index) of savedalbums" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3" v-on:click="deeperAlbum(item,4),click($event)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" >{{lists(item.album.artists)}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">{{lists(item.album.artists)}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack" style="width: 100%;">
            <template v-for="(d,index) in deeper4">
              <div v-if="d.type==='pl'" class="playlisttrack card2" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:click="click">{{d.track.name}}
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.track.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('savedalbum',art,d,4)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('savedalbum',d.track,4)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['track']['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="(art,index) in d.track.artists" v-bind:key="index" v-on:click="deeperartist('savedalbum',art,d,4)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                  <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                </div>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(4,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('savedalbum',s,4),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" v-bind:key="index" class="trackartist card2" style="gap: 16px;text-align: left">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('savedalbum',ta,4)">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('savedalbum',tt,4),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,4),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,4)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,4),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,4)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,4),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" >{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,4)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('savedalbum',r,ta[index],4),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'" >
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('savedalbum',art,d,4)">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d.track,4)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <div class="artist-cirle con3" v-for="(art,index) in d.artists" v-bind:key="index" v-on:click="deeperartist('savedalbum',art,d,4)" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </div>
              </template>
              <template v-else-if="d.type ==='deepertracks2'">
                <div class="playlisttrack card2" v-bind:key="index" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('savedalbum',art,d,4)">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,4)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <div class="artist-cirle con3" v-for="(art,index) in d.artists" v-bind:key="index" v-on:click="deeperartist('savedalbum',art,d,4)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </div>
              </template>
              <template v-else-if="d.type ==='deeperalbum'">
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.album.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[1].url + ')' }" style="opacity: .5">{{d.album.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.album.name}}
                    <div>Released {{d.album.release_date}}</div>
                    <div>By {{lists(d.album.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.album.tracks.items" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.album.images[1].url + ')' }"  v-on:click="deeperTracks2('savedalbum',track,d.album,4,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.album.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('savedalbum',track,d.album,4,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(4,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('savedalbum',s,4),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </li>
    <li id="option5">
      <a v-on:click="switchTabs" id="st" v-on:click.self.once="fetchTracks(0)">Saved tracks</a>
      <div>
        <div id="savedtrack" class="con2">
          <div class="albumbody" v-for="(item,index) of savedtracks" v-bind:key="index">
            <div v-if="item.track.preview_url" tabindex="0" class="con3" v-on:click="deeper(item,5,$event),click($event)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item.track.artists)}} - {{item.track.name}}
              <audio preload="none" v-bind:src="item.track.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeper(item,5,$event)">{{lists(item.track.artists)}} - {{item.track.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper5">
              <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('savedtrack',art,d,5,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('savedtrack',d,5,'pl','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('savedtrack',art,d,5,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('savedtrack',art,d,5,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none" ></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(5,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks">
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('savedtrack',s,5,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('savedtrack',s,5,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="index">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('savedtrack',ta,5,'trackartist')">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('savedtrack',tt,5,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('savedtrack',tt,5,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,5,'art' + d[0].id),click($event)" >{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,5,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,5,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" >{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,5,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,5,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" >{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,5,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('savedtrack',r,ta[index],5,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('savedtrack',r,ta[index],5,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('savedtrack',art,d,5,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('savedtrack',d.track,5,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('savedtrack',art,d,5,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('savedtrack',art,d,5,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none" ></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('savedtrack',art,d,5,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('savedtrack',d,5,'playlisttrack','d' + d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('savedtrack',art,d,5,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('savedtrack',art,d,5,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'" >
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:click="deeperTracks2('savedtrack',track,d,5,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('savedtrack',track,d,5,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(5,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('savedtrack',s,5,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('savedtrack',s,5,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </li>
    <li id="option6">
      <a v-on:click="switchTabs" id="fa" v-on:click.self.once="fetchFA">Followed artists</a>
      <div>
        <div style="display: flex;"><button class="btn" v-on:click="reloadartists(4,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
        <div id="followedartist" style="width: 95%;" class="con2">
          <div class="fabody" v-for="(item,index) of followedartists" v-bind:key="index">
            <div v-if="item.preview_url" tabindex="0" class="con3" v-on:click="deeperartist('followedartist',item,item.tracks,6,true),click($event)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{item.name}}
              <audio preload="none" v-bind:src="item.preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3"  v-on:click="deeperartist('followedartist',item,item.tracks,6,true)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">{{item.name}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper6" >
              <div v-if="d.type==='pl'" v-bind:key="index"  style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:click="click">{{d.track.name}}
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.track.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('followedartist',art,d,6,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('followedartist',d[index],6,'pl')">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['track']['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="(art,index) in d.track.artists" v-bind:key="index" v-on:click="deeperartist('followedartist',art,d,6,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                  <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                </div>
              </div>
              <div v-else-if="d.type==='seed_tracks'" v-bind:key="index" class="seed_tracks card2" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(6,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('followedartist',s,6,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" v-bind:id="d.id" v-bind:key="index" class="trackartist card2" style="gap: 16px;text-align: left">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art' + ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta.genres}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('followedartist',ta,6,'trackartist','art' +d[index].id)">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                        <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('followedartist',tt,6,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('followedartist',tt,6,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,6,'art' +d[0].id),click($event)" >{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,6,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,6,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,6,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,6,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,6,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists' && ta.length > 0" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists' && ta.length > 0" v-bind:key="index" class="related card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url && r.images[0].url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('followedartist',r,ta[index],6,false,'trackartist','art'+d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('followedartist',r,ta[index],6,false,'trackartist','art'+d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;" v-bind:id="'d'+d.id">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('followedartist',art,d,6,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('followedartist',d,6,'playlisttrack','d'+d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('followedartist',art,d,6,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('followedartist',art,d,6,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else-if="d.type ==='deepertracks2'" >
                <div class="playlisttrack card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;" v-bind:key="index" v-bind:id="'d'+d.id">
                  <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('followedartist',art,d,6,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('followedartist',d,6,'playlisttrack','d'+d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('followedartist',art,d,6,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('followedartist',art,d,6,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else-if="d.type ==='deeperalbum'">
                <div class="deep_albums card2" v-bind:key="index" v-bind:id="'alb'+d.id">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>By </div>
                    <template v-for="(art,index) in d.artists">
                      <div v-bind:key="index" style="margin-left: 4px; margin-right: 4px; cursor: pointer;display: flex;align-items: center" v-on:click="deeperartist('followedartist',art,d,6,false,'deep_albums')">{{art.name}}</div>
                    </template>
                    <div>Released {{d.release_date}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('followedartist',track,d,6,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('followedartist',track,d,6,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(6,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('followedartist',s,6),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </li>
    <li id="option7">
      <a v-on:click="switchTabs" id="nr" v-on:click.self.once="fetchNR(0)">New releases</a>
      <div style="display: block;width: 95%">
        <div id="newrelease" class="con2">
          <div class="newbody" v-for="(item,index) of newreleases" v-bind:key="index">
            <div v-if="item.tracks.items[0].preview_url" tabindex="0" class="con3" v-on:click="deeper(item,7,$event),click($event)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" >{{lists(item.artists)}} - {{item.name}}
              <audio preload="none" v-bind:src="item.tracks.items[0].preview_url"></audio>
            </div>
            <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5" v-on:click="deeper(item,7,$event)">{{lists(item.artists)}}
              <audio preload="none"></audio>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper7">
              <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('newrelease',art,d,7,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('newrelease',d,7,'pl','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('newrelease',art,d,7,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('newrelease',art,d,7,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none" ></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(7,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks">
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('newrelease',s,7,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('newrelease',s,7,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="index">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('newrelease',ta,7,'trackartist')">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('newrelease',tt,7,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('newrelease',tt,7,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,7,'art' + d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,7,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,7,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,7,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,7,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" >{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,7,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('newrelease',r,ta[index],7,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('newrelease',r,ta[index],7,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('newrelease',art,d,7,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('newrelease',d.track,7,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('newrelease',art,d,7,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('newrelease',art,d,7,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('newrelease',art,d,7,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('newrelease',d,7,'playlisttrack','d' + d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('newrelease',art,d,7,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('newrelease',art,d,7,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'" >
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('newrelease',track,d,7,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('newrelease',track,d,7,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(7,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks">
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('newrelease',s,7,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('newrelease',s,7,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </li>
    <li id="option8">
      <a v-on:click="switchTabs" id="spt" v-on:click.self.once="fetchSpotPlaylists(0)" >Spotify playlists</a>
      <div style="display: block;width: 95%">
        <div id="sptplaylists" class="con2" style="display: block;width: 95%;">
          <div class="head">
            <input class="inp" type="text" v-on:keyup="filterres"
                   placeholder="Please enter a search term.." title="Type in a name">

          </div >
          <div class="sp" style="display: block">
            <div class="pl" style="justify-content: center;">
              <template v-for="item of spotplaylists" >
                <div v-bind:id="item.id" v-on:click="SpotInit" v-bind:key="item.id" class="hr-line-dashed">{{ item.name }}</div>
              </template>
            </div>
          </div>
          <div class="play" v-for="(item,index) of sptplaylists" v-bind:id="'s' + item.id" v-bind:key="index">
            <div class="con2" >
              <div class="con4">{{item.name}}</div>
              <button class="btn" v-on:click="reloader(9,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
              <div style="width: 60%;display: flex;align-items: center;">{{item.description}}<button class="button"><a class="linkresset" v-bind:href="item['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                Follow<input type="checkbox" v-if="item.followed" @click.once="followPlaylist(item,$event)"  checked v-model="item.followed">
                <input type="checkbox" v-else @click.once="followPlaylist(item,$event)" v-model="item.followed"></div>
              <div v-if="item.images" class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }"></div>
            </div>
            <div class="con2" style="display: flex;color: black">
              <template v-if="item.tracks">
                <template v-for="(spl,index) of item['tracks']['items']" >
                  <div v-bind:id="spl.id" v-bind:key="index" v-if="spl.track.preview_url" tabindex="0" class="con3" v-on:click="deeper(spl,9,$event),click($event)" v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }" >{{lists(spl['track']['artists'])}} - {{spl.track.name}}
                    <audio preload="none" v-bind:src="spl.track.preview_url"></audio>
                  </div>
                  <div v-bind:id="spl.id" v-else tabindex="0" v-bind:key="index" class="con3" v-on:click="deeper(spl,9,$event)" v-bind:style="{ 'background-image': 'url(' + spl.track.album.images[0].url + ')' }" style="opacity: .5">{{lists(spl['track']['artists'])}} - {{spl.track.name}}
                    <audio preload="none"></audio>
                  </div>
                </template>
              </template>
            </div>
          </div>
          <div class="rectrack">
            <template v-for="(d,index) in deeper9">
              <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('sptplaylists',art,d,9,false,'pl')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('sptplaylists',d,9,'pl','d'+ d.id)">Recommended songs based on this</span>
                  <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                  </div>
                </div>
                <template v-for="(art,index) in d.artists">
                  <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('sptplaylists',art,d,9,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                  <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('sptplaylists',art,d,9,false,'pl')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                    <audio preload="none" ></audio>
                    <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                  </div>
                </template>
              </div>
              <div v-else-if="d.type==='seed_tracks'" class="seed_tracks card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(9,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('sptplaylists',s,9,false,'seed_tracks'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('sptplaylists',s,9,false,'seed_tracks')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="d.type==='trackartist'" class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="index">
                <template v-for="(ta,index) in d">
                  <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
                    <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                      <audio v-bind:src="ta.preview_url"></audio>
                    </div>
                    <div class="con3" v-else style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
                      <audio></audio>
                    </div>
                    <div >{{ta.name}}
                      <div>{{ta['followers']['total'] + ' followers'}}</div>
                      <div>{{ta['genres']}}</div>
                      <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('sptplaylists',ta,9,'trackartist')">Recommended artists songs based on this</div>
                      <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                        Follow<input type="checkbox" v-if="ta.followed" @click.once="followArtist(ta,$event)"  checked v-model="ta.followed">
                        <input type="checkbox" v-else @click.once="followArtist(ta,$event)" v-model="ta.followed">
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
                  <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
                    <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                      <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('sptplaylists',tt,9,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                        <audio v-bind:src="tt.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('sptplaylists',tt,9,false,'trackartist','art' + d[0].id)">{{tt.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
                  <div v-if="ta.type==='albums' && ta.length > 0" v-bind:key="index" tabindex="0" class="album card2">
                    <div v-for="(alb,index) in ta" v-bind:key="index">
                      <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,9,'art' + d[0].id),click($event)">{{alb.name}}
                        <audio v-bind:src="alb.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(alb,9,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
                  <div v-if="ta.type==='single' && ta.length > 0" v-bind:key="index" tabindex="0" class="single card2">
                    <div v-for="(s,index) in ta" v-bind:key="index">
                      <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,9,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                        <audio v-bind:src="s.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(s,9,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>

                  <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
                  <div v-if="ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="appear card2">
                    <div v-for="(a,index) in ta" v-bind:key="index">
                      <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,9,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                        <audio v-bind:src="a.preview_url"></audio>
                      </div>
                      <div v-else class="con3" v-on:click="deeperAlbum(a,9,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                  <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index" >Related Artist</div>
                  <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                    <div v-for="(r,index) in ta" v-bind:key="index">
                      <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('sptplaylists',r,ta[index],9,false,'trackartist','art' + d[0].id),click($event)">
                        <audio v-bind:src="r.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="deeperartist('sptplaylists',r,ta[index],9,false,'trackartist','art' + d[0].id)">
                        <audio></audio>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else-if="d.type ==='deepertracks'">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" v-bind:key="index" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('sptplaylists',art,d,9,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('sptplaylists',d.track,9,'playlisttrack','d'+ d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('sptplaylists',art,d,9,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('sptplaylists',art,d,9,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </template>
              <div v-else-if="d.type ==='deepertracks2'" v-bind:key="index">
                <div class="playlisttrack card2" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                  <div class="con3" v-if="d.preview_url" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div class="con3" v-else v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none" ></audio>
                  </div>
                  <div style="width: 50%;text-align: left;margin-left: 10px;">
                    <div>{{d.name}}</div>
                    <div style="display: flex; align-items: center;"><p>By </p>
                      <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                        <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('sptplaylists',art,d,9,false,'playlisttrack')">{{art.name}}</div>
                      </div>
                    </div>
                    <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('sptplaylists',d,9,'playlisttrack','d' + d.id)">Recommended songs based on this</span>
                    <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                      Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                      <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                    </div>
                  </div>
                  <template v-for="(art,index) in d.artists">
                    <div class="artist-cirle con3" v-if="d.preview_url" v-bind:key="index" v-on:click="deeperartist('sptplaylists',art,d,9,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                      <audio preload="none" v-bind:src="d.preview_url"></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                    <div class="artist-cirle con3" v-else v-bind:key="index" v-on:click="deeperartist('sptplaylists',art,d,9,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
                      <audio preload="none" ></audio>
                      <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-else-if="d.type ==='deeperalbum'" >
                <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                  <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                    <audio preload="none" v-bind:src="d.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                    <audio preload="none"></audio>
                  </div>
                  <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                    <div>Released {{d.release_date}}</div>
                    <div>By {{lists(d.artists)}}</div>
                    Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                    <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                  </div>
                  <div style="display: block;" class="trackList">Tracks
                    <div v-for="(track,index) in d.tracks" v-bind:key="index">
                      <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  v-on:click="deeperTracks2('sptplaylists',track,d,9,false,'deep_albums'),click($event)">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                      <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5" v-on:click="deeperTracks2('sptplaylists',track,d,9,false,'deep_albums')">
                        <div class="trackTitle">{{track.name}}</div>
                        <audio preload="none" v-bind:src="track.preview_url"></audio>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
                <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(9,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
                <div class="card2">
                  <template v-for="(s,index) in d.tracks" >
                    <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('sptplaylists',s,9,false,'seed_artists'),click($event)">{{s.name}}
                      <audio preload="none" v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="deeperTracks('sptplaylists',s,9,false,'seed_artists')">{{s.name}}
                      <audio preload="none"></audio>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </li>
    <li id="srch" class="srch"><a style="padding: 15px;"><input class="inp" v-on:keyup="search"></a>
      <div id="search" style="width: 100%">
        <div style="display: flex;height: auto; flex-flow: row wrap;">
          <div style="width: 50%">
            <div class="stitle">Songs</div>
            <div v-for="(item,index) in tracks" class="playable-search" v-on:click="parentClick" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="deeperTracks('search',item,10,true),click($event)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="deeperTracks('search',item,10,true)" v-bind:style="{ 'background-image': 'url(' + item.album.images[0].url + ')' }" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="deeperTracks('search',item,10,true)" ><div >{{item.name}}</div></div>
            </div>
          </div>
          <div style="width: 50%">
            <div class="stitle">Artists</div>
            <div v-for="(item,index) in artists" class="playable-search" v-on:click="parentClick" v-bind:key="index">
              <div v-if="item.tracks[0].preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="deeperartist('search',item,item.tracks,10,true),click($event)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="none" v-bind:src="item.tracks[0].preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="deeperartist('search',item,item.tracks,10,true)" >{{item.name}}</div>
            </div>
          </div>
          <div style="width: 50%">
            <div class="stitle">Albums</div>
            <div v-for="(item,index) in albums" class="playable-search" v-on:click="parentClick" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="deeperAlbum(item,10,false,true),click($event)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="none" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="deeperAlbum(item,10,false,true)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="deeperAlbum(item,10,false,true)">{{item.name}}</div>
            </div>
          </div>
          <div style="width: 50%">
            <div class="stitle">Playlists</div>
            <div v-for="(item,index) in splaylists" class="playable-search" v-on:click="parentClick" v-bind:key="index">
              <div v-if="item.preview_url" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="playl(item),click($event)" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }">
                <audio preload="none" v-bind:src="item.preview_url"></audio>
              </div>
              <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-bind:style="{ 'background-image': 'url(' + item.images[0].url + ')' }" v-on:click="playl(item)" style="opacity: .5">
                <audio preload="none"></audio>
              </div>
              <div class="title" v-on:click="playl(item)">{{item.name}}</div>
            </div>
          </div>
        </div>
        <div class="rectrack">
          <template v-for="(d,index) in deepers" >
            <div v-if="d.type==='pl'" v-bind:key="index" class="playlisttrack card2" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
              <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }" v-on:click="click">{{d.track.name}}
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
              </div>
              <div style="width: 50%;text-align: left;margin-left: 10px;">
                <div>{{d.track.name}}</div>
                <div style="display: flex; align-items: center;"><p>By </p>
                  <div v-for="(art,index) in d.track.artists" v-bind:key="index" style="display: flex;align-items: center">
                    <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,10)">{{art.name}}</div>
                  </div>
                </div>
                <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('search',d.track,10,'playlisttrack')">Recommended songs based on this</span>
                <div><button class="button"><a class="linkresset" v-bind:href="d['track']['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                  Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">
                  <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">
                </div>
              </div>
              <div class="artist-cirle con3" v-for="(art,index) in d.track.artists" v-bind:key="index" v-on:click="deeperartist(art,d,10)" v-bind:style="{ 'background-image': 'url(' + d.track.album.images[0].url + ')' }">
                <audio preload="none" v-bind:src="d.track.preview_url"></audio>
                <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_tracks'" v-bind:key="index" v-bind:id="d.id" class="seed_tracks card2">
              <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadST(10,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
              <div class="card2">
                <template v-for="(s,index) in d.tracks" >
                  <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('search',s,10,false,'seed_tracks'),click($event)">{{s.name}}
                    <audio preload="none" v-bind:src="s.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" v-on:click="deeperTracks('search',s,10,false,'seed_tracks')" style="opacity: .5">{{s.name}}
                    <audio preload="none"></audio>
                  </div>
                </template>
              </div>
            </div>
            <div v-else-if="d.type==='trackartist'" v-bind:key="index" class="trackartist card2" style="gap: 16px;text-align: left">
              <template v-for="(ta,index) in d" >
                <div v-if="ta.type==='artist'" v-bind:key="index" class="recartist card2" v-bind:id="'art'+ta.id" style="width: 100%;gap: 16px;text-align: left">
                  <div class="con3" v-if="ta.preview_url" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="click">{{ta.name}}
                    <audio v-bind:src="ta.preview_url"></audio>
                  </div>
                  <div >{{ta.name}}
                    <div>{{ta['followers']['total'] + ' followers'}}</div>
                    <div>{{ta['genres']}}</div>
                    <div style="color: rgb(240, 55, 165);" v-on:click="seedArtist('search',ta,10,'trackartist','art'+ta.id)">Recommended artists songs based on this</div>
                    <div>
                      <button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index">Top tracks</div>
                <div v-if="ta.type==='top_tracks'" tabindex="0" v-bind:key="index" class="top-tracks card2">
                  <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
                    <div v-if="tt.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="deeperTracks('search',tt,10,false,'trackartist','art' + d[0].id),click($event)">{{tt.name}}
                      <audio v-bind:src="tt.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5">{{tt.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='albums'" class="break" v-bind:key="index">Albums</div>
                <div v-if="ta.type==='albums'" tabindex="0" v-bind:key="index" class="album card2">
                  <div v-for="(alb,index) in ta" v-bind:key="index">
                    <div v-if="alb.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" v-on:click="deeperAlbum(alb,10,'art' + d[0].id),click($event)">{{alb.name}}
                      <audio v-bind:src="alb.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(alb,10)" v-bind:style="{ 'background-image': 'url(' + alb.images[0].url + ')' }" style="opacity: .5">{{alb.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='single'" v-bind:key="index" class="break" >Single</div>
                <div v-if="ta.type==='single'" v-bind:key="index" tabindex="0" class="single card2">
                  <div v-for="(s,index) in ta" v-bind:key="index">
                    <div v-if="s.preview_url" class="con3" v-on:click="deeperAlbum(s,10,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }">{{s.name}}
                      <audio v-bind:src="s.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(s,10,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + s.images[0].url + ')' }" style="opacity: .5">{{s.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>

                <div v-if="ta.type==='appears_on'" v-bind:key="index" class="break" >Appears on</div>
                <div v-if="ta.type==='appears_on'" v-bind:key="index" tabindex="0" class="appear card2">
                  <div v-for="(a,index) in ta" v-bind:key="index">
                    <div v-if="a.preview_url" class="con3" v-on:click="deeperAlbum(a,10,'art' + d[0].id),click($event)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
                      <audio v-bind:src="a.preview_url"></audio>
                    </div>
                    <div v-else class="con3" v-on:click="deeperAlbum(a,10,'art' + d[0].id)" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
                      <audio></audio>
                    </div>
                  </div>
                </div>
                <div v-if="ta.type==='related-artists'" class="break" v-bind:key="index">Related Artist</div>
                <div v-if="ta.type==='related-artists'" v-bind:key="index" class="card2">
                  <div v-for="(r,index) in ta" v-bind:key="index">
                    <div v-if="r.preview_url" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="deeperartist('search',r,ta[index],10,'trackartist','art' + d[0].id),click($event)">
                      <audio v-bind:src="r.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5">
                      <audio></audio>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <template v-else-if="d.type ==='deepertracks'" >
              <div class="playlisttrack card2" v-bind:key="index" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist('search',art,d,10,false,'playlisttrack')">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks('search',d,10,'playlisttrack','d'+d.id)">Recommended songs based on this</span>
                  <div>
                    <button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="(art,index) in d.artists" v-bind:key="index" v-on:click="deeperartist('search',art,d,10,false,'playlisttrack')" v-bind:style="{ 'background-image': 'url(' + d.album.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                </div>
              </div>
            </template>
            <template v-else-if="d.type ==='deepertracks2'">
              <div class="playlisttrack card2" v-bind:key="index" v-bind:id="'d'+d.id" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
                <div class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div style="width: 50%;text-align: left;margin-left: 10px;">
                  <div>{{d.name}}</div>
                  <div style="display: flex; align-items: center;"><p>By </p>
                    <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
                      <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="deeperartist(art,d,10)">{{art.name}}</div>
                    </div>
                  </div>
                  <span style="color: rgb(240, 55, 165);" v-on:click="seedTracks(d,10)">Recommended songs based on this</span>
                  <div>
                    <button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
                  </div>
                </div>
                <div class="artist-cirle con3" v-for="(art,index) in d.artists" v-bind:key="index" v-on:click="deeperartist(art,d,10)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                  <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
                </div>
              </div>
            </template>
            <template v-else-if="d.type ==='deeperalbum'">
              <div class="deep_albums card2" v-bind:id="'alb'+d.id" v-bind:key="index">
                <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                  <div>Released {{d.release_date}}</div>
                  <div>By {{lists(d.artists)}}</div>
                  Save<input type="checkbox" v-if="d.followed" @click.once="followAlbum(d,$event)"  checked v-model="d.followed">
                  <input type="checkbox" v-else @click.once="followAlbum(d,$event)" v-model="d.followed">
                </div>
                <div style="display: block;" class="trackList">Tracks
                  <div v-for="(track,index) in d.tracks" v-bind:key="index">
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('search',track,d,10,false,'deep_albums'),click($event)">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none" v-bind:src="track.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none"></audio>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-else-if="d.type ==='deeperalbum2'" v-bind:key="index">
              <div class="deep_albums card2" >
                <div v-if="d.preview_url" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" v-on:click="click">{{d.name}}
                  <audio preload="none" v-bind:src="d.preview_url"></audio>
                </div>
                <div v-else tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" style="opacity: .5">{{d.name}}
                  <audio preload="none"></audio>
                </div>
                <div style="margin-left: 4px; margin-right: 4px;">{{d.name}}
                  <div>Released {{d.release_date}}</div>
                  <div>By {{lists(d.artists)}}</div>
                </div>
                <div style="display: block;" class="trackList">Tracks
                  <div v-for="(track,index) in d.items" v-bind:key="index">
                    <div v-if="track.preview_url" class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }" v-on:click="deeperTracks2('search',track,d,10,false,'deep_albums2'),click($event)">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none" v-bind:src="track.preview_url"></audio>
                    </div>
                    <div v-else class="img-xs" v-bind:style="{ 'background-image': 'url(' + d.images[1].url + ')' }"  style="opacity: .5">
                      <div class="trackTitle">{{track.name}}</div>
                      <audio preload="none"></audio>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="d.type==='seed_artists'" class="seed_artists card2" v-bind:key="index" v-bind:id="d.id">
              <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="reloadSA(9,d.id,d.name)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
              <div class="card2">
                <template v-for="(s,index) in d.tracks" >
                  <div v-if="s.preview_url" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:click="deeperTracks('search',s,10,false,'seed_artists'),click($event)">{{s.name}}
                    <audio preload="none" v-bind:src="s.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5">{{s.name}}
                    <audio preload="none"></audio>
                  </div>
                </template>
              </div>
            </div>
            <div v-else-if="d.type==='playlist'" class="playlist card2" v-bind:key="index" v-bind:id="'p' + d.id">
              <div class="con2">
                <div class="con4">{{d.name}}</div>
                <button class="btn" v-on:click="reloader(10,$event)"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button>
                <div style="width: 60%;display: flex;align-items: center;">{{d.description}}</div>
                <div class="con4" style="background-repeat: no-repeat;background-size: cover;" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }"></div>
              </div>
              <div class="con2" style="display: flex;color: black">
                <div class="trackbody" v-for="(item,index) of d['tracks']['items']" v-bind:key="index">
                  <div v-bind:id="item.id" v-if="item.track.preview_url" tabindex="0" class="con3" v-on:click="deeper(item,10,$event),click($event)($event)" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" >{{lists(item['track']['artists'])}} - {{item.track.name}}
                    <audio preload="none" v-bind:src="item.track.preview_url"></audio>
                  </div>
                  <div v-else tabindex="0" class="con3" v-on:click="deeper(item,10,$event);" v-bind:style="{ 'background-image': 'url(' + item.track.album.images[0].url + ')' }" style="opacity: .5">{{lists(item['track']['artists'])}} - {{item.track.name}}
                    <audio preload="none"></audio>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </li>
  </ul>

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
      taactivetab:null,
      ttactivetab:null,
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
      currentpl:null,
      currentspl:null,
      searchtimer:null,
      currenttrack:null
    }
  },
  methods: {
    polygon(item,d,num){
      console.log(item)
      console.log(d)
      console.log(num)
    },
    playl(item){
      let pls = document.querySelectorAll('#search> .rectrack > div')
      for (let i = 0; i < pls.length; i++) {
        if (document.getElementById('p'+  item.id) !=null && pls[i].id === document.getElementById('p'+ item.id).id){
          document.getElementById('p'+  item.id).style.display = 'block'
        }else {
          pls[i].style.display = 'none'
        }
      }
      item.type = 'playlist'
      let indexing = this.deepers.indexOf(item)
      if (indexing === -1){
        this.deepers.push(item)
      }
    },
    deeper: function(item,num,event){
      // console.log(item)
      let target = event.target
      if (num === 10){
        let allTracks = document.querySelectorAll(".rectrack > div:not(.playlist)");
        if (allTracks != null) {
          for (let i = 0; i < allTracks.length; i++) {
            // eslint-disable-next-line no-empty
            if (document.getElementById('d'+  item.id) !=null && allTracks[i].id === document.getElementById('d'+ item.id).id){

            } else{
              allTracks[i].style.display = 'none'
            }


          }

        }
      } else {
        let allTracks = document.querySelectorAll(".rectrack > div");
        if (allTracks != null) {
          for (let i = 0; i < allTracks.length; i++) {
            // eslint-disable-next-line no-empty
            if (document.getElementById('d'+  item.id) !=null && allTracks[i].id === document.getElementById('d'+ item.id).id){

            } else{
              allTracks[i].style.display = 'none'
            }


          }

        }
      }
      if (document.getElementById('d'+ item.id) !==null){
        document.getElementById('d'+ item.id).style.display = 'flex'
        return
      }
      let tracktrack = []
      tracktrack = item
      tracktrack.type = 'pl'
      if(num !== 1 && num !==5)
        axios.request({
          url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id,
          method: 'get',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              tracktrack.followed = response.data[0]
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      if (num === 1){
        if (document.getElementById('d'+ item.track.id) !==null){
          document.getElementById('d'+ item.track.id).style.display = 'flex'
          let child = target.parentElement.children
          for (let i = 0; i < child.length; i++) {
            if (child[i] === target){
              child[i].className = 'con3 selected'
            } else{
              child[i].className = 'con3'
            }
          }
          return
        }
        let tt = []
        tt = item.track
        tt.type = 'pl'
        // console.log(tt)
        // console.log(item.track.id)
        let child = target.parentElement.children
        for (let i = 0; i < child.length; i++) {
          if (child[i] === target){
            child[i].className = 'con3 selected'
          } else{
            child[i].className = 'con3'
          }
        }
        axios.request({
          url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.track.id,
          method: 'get',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              tt.followed = response.data[0]
              let indexing = this.deeper1.indexOf(tt)
              if (indexing === -1){
                this.deeper1.push(tt)
                // setTimeout(() => {
                //   window.scrollTo({
                //     top:(document.getElementById('d'+ tt.id)).offsetTop,
                //     behavior:'smooth'});
                // }, 10);
              }
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
        // console.log(tracktrack)
        // console.log(this.deeper1)
      } else if (num === 2){
        let indexing = this.deeper2.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper2.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper2)
      } else if (num === 22){
        let indexing = this.deeper22.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper22.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper22)
      } else if (num === 23){
        let indexing = this.deeper23.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper23.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper23)
      } else if (num === 3){
        let indexing = this.deeper3.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper3.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper3)
      } else if (num === 32){
        let indexing = this.deeper32.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper32.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper32)
      } else if (num === 33){
        let indexing = this.deeper33.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper33.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper33)
      } else if (num === 4){
        let indexing = this.deeper4.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper4.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper4)
      } else if (num === 5){
        if (document.getElementById('d'+ item.track.id) !==null){
          document.getElementById('d'+ item.track.id).style.display = 'flex'
          let child = target.parentElement.children
          for (let i = 0; i < child.length; i++) {
            if (child[i] === target){
              child[i].className = 'con3 selected'
            } else{
              child[i].className = 'con3'
            }
          }
          return
        }
        let tt = []
        tt = item.track
        tt.type = 'pl'
        let child = target.parentElement.children
        for (let i = 0; i < child.length; i++) {
          if (child[i] === target){
            child[i].className = 'con3 selected'
          } else{
            child[i].className = 'con3'
          }
        }
        axios.request({
          url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + tt.id,
          method: 'get',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              tt.followed =  response.data[0]
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
        // console.log(item.track)
        let indexing = this.deeper5.indexOf(tt)
        if (indexing === -1){
          this.deeper5.push(tt)
        }
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('d'+ tt.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        // console.log(this.deeper5)
      } else if (num === 6){
        let indexing = this.deeper6.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper6.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper6)
      } else if (num === 7){
        tracktrack.preview_url = item.tracks.items[0].preview_url
        let indexing = this.deeper7.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper7.push(tracktrack)
        }
        // console.log(this.deeper7)
      } else if (num === 8){
        let indexing = this.deeper8.indexOf(tracktrack)
        if (indexing === -1){
          this.deeper8.push(tracktrack)
        }
        // console.log(tracktrack)
        // console.log(this.deeper8)
      } else if (num === 9){
        if (document.getElementById('d'+ item.track.id) !==null){
          document.getElementById('d'+ item.track.id).style.display = 'flex'
          let child = target.parentElement.children
          for (let i = 0; i < child.length; i++) {
            if (child[i] === target){
              child[i].className = 'con3 selected'
            } else{
              child[i].className = 'con3'
            }
          }
          return
        }
        let tt = []
        tt = item.track
        tt.type = 'pl'
        let child = target.parentElement.children
        for (let i = 0; i < child.length; i++) {
          if (child[i] === target){
            child[i].className = 'con3 selected'
          } else{
            child[i].className = 'con3'
          }
        }
        let indexing = this.deeper9.indexOf(tt)
        if (indexing === -1){
          this.deeper9.push(tt)
        }
        // console.log(tt)
        // console.log(this.deeper9)
      } else if (num === 10){
        let indexing = this.deepers.indexOf(tracktrack)
        if (indexing === -1){
          this.deepers.push(tracktrack)
        }
        // console.log(this.deepers)
      }
      // if (num !== 1 && num !==5){
      //   setTimeout(() => {
      //     window.scrollTo({
      //       top:(document.getElementById('d'+ tracktrack.id)).offsetTop,
      //       behavior:'smooth'});
      //   }, 10);
      // }
    },
    deeperartist: async function (pointer,item,track,num,flag,sib,related){
      let trackartist = []
      trackartist.type = 'trackartist'
      // console.log(item.id)
      // console.log(item)
      // console.log(track)
      // if (document.getElementById('art'+ item.id)){
      //   document.getElementById('art'+ item.id).style.display = 'flex'
      //
      // } else if (document.getElementById('art6'+ item.id)){
      //   document.getElementById('art6'+ item.id).style.display = 'flex'
      //
      // } else if (document.getElementById('artall'+ item.id)){
      //   document.getElementById('artall'+ item.id).style.display = 'flex'
      //
      // } else if (document.getElementById('fa'+ item.id)){
      //   document.getElementById('fa'+ item.id).style.display = 'flex'
      //
      // } else if (document.getElementById('tt'+ item.id)){
      //   document.getElementById('tt'+ item.id).parentElement.style.display = 'flex'
      //
      // } else if (document.getElementById('tt6'+ item.id)){
      //   document.getElementById('tt6'+ item.id).parentElement.style.display = 'flex'
      //
      // } else if (document.getElementById('ta'+ item.id)){
      //   document.getElementById('ta'+ item.id).parentElement.style.display = 'flex'
      //
      // }
      let all = document.querySelectorAll('#'+pointer +'> .rectrack > div')
      let alltop = document.querySelectorAll('#'+pointer +'> .rectrack > div.' + sib)
      let last = document.querySelector('#'+pointer +'> .rectrack > div.trackartist > div[id="art' + item.id + '"]')
      //  console.log(last)
      // console.log(item.id)
      if (flag === true){
        // console.log(item.id)
        if (all.length !==0 && all.length !==0){
          for (let i=0;i < all.length;i++){
            // console.log(all[i])
            if (last !== null && all[i].firstChild.id === last.id && last.id === item.id){
              last.parentElement.style.display = 'block'
            } else {
              // console.log(all[i])
              all[i].style.display = 'none'
            }
          }
        }
      }else if (alltop.length!==0 && alltop[alltop.length-1].nextElementSibling!== null) {
        let par = alltop[alltop.length-1].nextElementSibling
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }
      } else if (related){

        let par = document.getElementById(related).parentElement.nextElementSibling
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }}
      if (last !== null && last.id === 'art' + item.id){
        if (document.getElementById('art'+ item.id)){
          document.getElementById('art'+ item.id).parentElement.style.display = 'flex'}
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('art'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
      }
      await this.deeperArtistself(item,track).then(result => trackartist.push(result))
      await this.deeperArtisttt(item).then(tt => trackartist.push(tt))
      await this.deeperArtistAlbums(item).then(album => trackartist.push(album))
      await this.deeperArtistSingle(item).then(single => trackartist.push(single))
      await this.deeperArtistAppear(item).then(appear => trackartist.push(appear))
      await this.deeperArtistRelated(item).then(related => trackartist.push(related))
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
      } else if (num === 10){
        this.deepers.push(trackartist)
      }
      // setTimeout(() => {
      //   window.scrollTo({
      //     top:(document.getElementById('art'+ item.id)).offsetTop,
      //     behavior:'smooth'});
      // }, 10);
      // console.log(trackartist)
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
            axios.request({
              url:'https://api.spotify.com/v1/me/following/contains?type=artist&ids=' + item.id,
              method: 'get',
              headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                  trackartist.followed = response.data[0]
                })
                .catch(error =>{
                  if (error.response.status === 401){
                    axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                      // console.log(response.data)
                      let new_token = response.data['new_token']
                      document.cookie ='access_token=' + new_token
                    })
                  }
                })
            if (track[0] != null && track[0].preview_url){
              trackartist.preview_url = track[0].preview_url
            } else if (track.preview_url){
              trackartist.preview_url = track.preview_url}
            if (trackartist.images.length !== 0 && trackartist.images[0] !== undefined && trackartist.images[0].url !==null){
              return trackartist
            } else{
              trackartist.images[0] = 'url("")'
              return trackartist
            }
            // } else if (item.preview_url){
            //   trackartist.preview_url = item.preview_url
            // }

          })
          .catch(error =>{
            // console.log(error)
            // console.log(error.response.data)
            if (error.response.status === 401){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperArtisttt(item){
      // top tracks
      return axios.request({
        url:'https://api.spotify.com/v1/artists/' + item.id + '/top-tracks?limit=10&market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let tt = []
            tt = response.data
            tt.type = 'top_tracks'
            // console.log(tt)
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
            let arr = response.data['items']
            // console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.length;i++){
              // console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    // console.log(333)
                    // console.log(response.data)
                    arr[i].tracks = tracks
                    if (tracks[0]['preview_url']){
                      arr[i].preview_url = tracks[0]['preview_url']
                    }
                    if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                      newarr.push(arr[i])
                    } else{
                      arr[i].images[0] = 'url("")'
                      newarr.push(arr[i])
                    }

                  })
            }
            newarr.type = 'albums'
            // console.log(newarr)
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
            let arr = response.data['items']
            // this.deeper1.push(data)
            for (let i=0;i <  arr.length;i++){
              // console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    // console.log(333)
                    // console.log(response.data)
                    arr[i].tracks = tracks
                    if (tracks[0]['preview_url']){
                      arr[i].preview_url = tracks[0]['preview_url']
                    }
                    if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                      single.push(arr[i])
                    } else{
                      arr[i].images[0] = 'url("")'
                      single.push(arr[i])
                    }

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
            let arr = response.data['items']
            // console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.length;i++){
              // console.log('237 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + arr[i].id + '/tracks',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    let tracks = response.data['items']
                    arr[i].tracks = tracks
                    // console.log(333)
                    // console.log(response.data)
                    if (tracks[0]['preview_url']){
                      arr[i].preview_url = tracks[0]['preview_url']
                    }
                    // console.log(response.data['items'])
                    // console.log(response.data['items'].length)
                    // console.log(arr[i])
                    if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                      // console.log(arr[i].images[0])
                      appears.push(arr[i])
                    } else{
                      arr[i].images[0] = 'url("")'
                      appears.push(arr[i])
                    }

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
            let arr = response.data['artists']
            // console.log(444)
            // console.log(arr)
            // this.deeper1.push(data)
            for (let i=0;i <  arr.length;i++){
              // console.log('447 ' + arr.items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + arr[i].id + '/top-tracks?market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    // console.log(response.data['tracks'])
                    // console.log(response.data['tracks'].length)
                    // console.log(arr[i])
                    let tracks = response.data['tracks']
                    if (tracks.length!==0 && tracks[0]['preview_url']){
                      arr[i].preview_url = tracks[0]['preview_url']
                    }
                    if (arr[i].images.length!==0 && arr[i].images!==null && arr[i].images[0]!==undefined && arr[i].images[0].url !==null){
                      relatedartist.push(arr[i])
                    } else{
                      arr[i].images[0] = 'url("")'
                      relatedartist.push(arr[i])
                    }

                  })
              // if (i===11){
              //   break
              // }
            }
            fin = relatedartist
            fin.type = 'related-artists'
            // console.log(3451)
            // console.log(fin)
            return fin
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
            }
          })
    },
    deeperAlbum(item,num,child,search){
      item.type ='deeperalbum'
      // console.log(item.id)
      if (child){
        let par = document.getElementById(child).parentElement.nextElementSibling
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }}
      if (search===true){
        let albs = document.querySelectorAll('#search> .rectrack > div')
        for (let i = 0; i < albs.length; i++) {
          if (document.getElementById('alb'+  item.id) !=null && albs[i].id === document.getElementById('alb'+ item.id).id){
            document.getElementById('alb'+  item.id).style.display = 'block'
          }else {
            albs[i].style.display = 'none'
          }
        }
      }
      if (num !== 4 && document.getElementById('alb' + item.id)){
        document.getElementById('alb' + item.id).style.display = 'flex'
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('alb'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
      }
      if (num !== 4){
        axios.request({
          url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
          method: 'get',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              item.followed = response.data[0]
              if (num === 1){
                let indexing = this.deeper1.indexOf(item)
                if (indexing === -1){
                  this.deeper1.push(item)
                }
              } else if (num === 2){
                let indexing = this.deeper2.indexOf(item)
                if (indexing === -1){
                  this.deeper2.push(item)
                }
              } else if (num === 22){
                let indexing = this.deeper22.indexOf(item)
                if (indexing === -1){
                  this.deeper22.push(item)
                }
              } else if (num === 23){
                let indexing = this.deeper23.indexOf(item)
                if (indexing === -1){
                  this.deeper23.push(item)
                }
              } else if (num === 3){
                let indexing = this.deeper3.indexOf(item)
                if (indexing === -1){
                  this.deeper3.push(item)
                }
              } else if (num === 32){
                let indexing = this.deeper32.indexOf(item)
                if (indexing === -1){
                  this.deeper32.push(item)
                }
              } else if (num === 33){
                let indexing = this.deeper33.indexOf(item)
                if (indexing === -1){
                  this.deeper33.push(item)
                }
              } else if (num === 5){
                let indexing = this.deeper5.indexOf(item)
                if (indexing === -1){
                  this.deeper5.push(item)
                }
              } else if (num === 6){
                let indexing = this.deeper6.indexOf(item)
                if (indexing === -1){
                  this.deeper6.push(item)
                }
              } else if (num === 7){
                let indexing = this.deeper7.indexOf(item)
                if (indexing === -1){
                  this.deeper7.push(item)
                }
              } else if (num === 8){
                let indexing = this.deeper8.indexOf(item)
                if (indexing === -1){
                  this.deeper8.push(item)
                }
              } else if (num === 9){
                let indexing = this.deeper9.indexOf(item)
                if (indexing === -1){
                  this.deeper9.push(item)
                }
              } else if (num === 10){
                let indexing = this.deepers.indexOf(item)
                if (indexing === -1){
                  this.deepers.push(item)
                }
              }
              // setTimeout(() => {
              //   window.scrollTo({
              //     top:(document.getElementById('alb'+ item.id)).offsetTop,
              //     behavior:'smooth'});
              // }, 100);
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      }

      if (num === 4){
        if (item.album){
          axios.request({
            url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.album.id,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
          })
              .then((response) =>{
                item.followed = response.data[0]
                item.id = item.album.id
                let albs = document.querySelectorAll(".rectrack > div")
                for (let i=0;i < albs.length; i++){
                  if (albs[i].id === 'alb' + item.album.id){
                    albs[i].style.display = 'flex'
                  } else{
                    albs[i].style.display = 'none'
                  }
                }
                let indexing = this.deeper4.indexOf(item)
                if (indexing === -1){
                  this.deeper4.push(item)
                }
              })
              .catch(error =>{
                if (error.response.status === 401){
                  axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                    // console.log(response.data)
                    let new_token = response.data['new_token']
                    document.cookie ='access_token=' + new_token
                  })
                }
              })

        } else{
          if (document.getElementById('alb' + item.id)){
            document.getElementById('alb' + item.id).style.display = 'flex'
            return
          }
          let indexing = this.deeper4.indexOf(item)
          if (indexing === -1){
            this.deeper4.push(item)
          }
        }
      }
    },
    deeperAlbum2(item){
      item.type ='deeperalbum2'
      axios.request({
        url:'https://api.spotify.com/v1/me/albums/contains?ids=' + item.id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            item.followed = response.data[0]
          })
          .catch(error =>{
            if (error.response.status === 401){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
      // setTimeout(() => {
      //   window.scrollTo({
      //     top:(document.getElementById('alb'+ item.id)).offsetTop,
      //     behavior:'smooth'});
      // }, 10);
      // console.log(item)
    },
    deeperTracks(pointer,item,num,flag,sib,child){
      item.type ='deepertracks'
      // console.log(item)
      // console.log(flag)
      // console.log(sib)
      let all = document.querySelectorAll('#'+ pointer +'> .rectrack > div')
      if (child){
        let par = document.getElementById(child).parentElement.nextElementSibling
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }}else if (sib) {
        let alltop = document.querySelectorAll('#'+ pointer +'> .rectrack > div.' + sib)
        let current = alltop[alltop.length-1].nextElementSibling
        while (current != null) {
          // console.log(current)
          current.style.display = 'none'
          if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none'){
            current = current.nextElementSibling
          } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none'){
            current = current.nextElementSibling.nextElementSibling
          } else if (current.nextElementSibling === null){
            current = null
          }

        }
        let newall = Array.from(all)
        let track = newall.indexOf(document.getElementById('d'+item.id))
        let album = newall.indexOf(alltop[alltop.length-1])
        // console.log(track)
        if (track!== -1 && track < album){
          alltop[alltop.length-1].insertAdjacentElement('afterend', document.getElementById('d'+item.id));
          // all.parentNode.insertBefore(newall[album],newall[track])
        }} else  if (flag === true){
        if (all.length !==0 && all.length !==0){
          for (let i=0;i < all.length;i++){
            all[i].style.display = 'none'
          }
        }}
      if (document.getElementById('d'+item.id)){
        document.getElementById('d'+item.id).style.display = 'flex'
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('d'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
      }
      axios.request({
        url:'https://api.spotify.com/v1/me/tracks/contains?ids=' + item.id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            item.followed = response.data[0]
          })
          .catch(error =>{
            if (error.response.status === 401){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
      if (num === 1){
        let indexing = this.deeper1.indexOf(item)
        if (indexing === -1){
          this.deeper1.push(item)
        }
      } else if (num === 2){
        let indexing = this.deeper2.indexOf(item)
        if (indexing === -1){
          this.deeper2.push(item)
        }
      } else if (num === 22){
        let indexing = this.deeper22.indexOf(item)
        if (indexing === -1){
          this.deeper22.push(item)
        }
      } else if (num === 23){
        let indexing = this.deeper23.indexOf(item)
        if (indexing === -1){
          this.deeper23.push(item)
        }
      } else if (num === 3){
        let indexing = this.deeper3.indexOf(item)
        if (indexing === -1){
          this.deeper3.push(item)
        }
      } else if (num === 32){
        let indexing = this.deeper32.indexOf(item)
        if (indexing === -1){
          this.deeper32.push(item)
        }
      } else if (num === 33){
        let indexing = this.deeper33.indexOf(item)
        if (indexing === -1){
          this.deeper33.push(item)
        }
      } else if (num === 4){
        let indexing = this.deeper4.indexOf(item)
        if (indexing === -1){
          this.deeper4.push(item)
        }
      } else if (num === 5){
        let indexing = this.deeper5.indexOf(item)
        if (indexing === -1){
          this.deeper5.push(item)
        }
      } else if (num === 6){
        let indexing = this.deeper6.indexOf(item)
        if (indexing === -1){
          this.deeper6.push(item)
        }
      } else if (num === 7){
        let indexing = this.deeper7.indexOf(item)
        if (indexing === -1){
          this.deeper7.push(item)
        }
      } else if (num === 8){
        let indexing = this.deeper8.indexOf(item)
        if (indexing === -1){
          this.deeper8.push(item)
        }
      } else if (num === 9){
        let indexing = this.deeper9.indexOf(item)
        if (indexing === -1){
          this.deeper9.push(item)
        }
      } else if (num === 10){
        let indexing = this.deepers.indexOf(item)
        if (indexing === -1){
          this.deepers.push(item)
        }
      }
      // setTimeout(() => {
      //   window.scrollTo({
      //     top:(document.getElementById('alb'+ item.id)).offsetTop,
      //     behavior:'smooth'});
      // }, 10);
    },
    deeperTracks2(pointer,item,d,num,flag,sib,child){
      item.images = d.images
      item.type ='deepertracks2'
      let all = document.querySelectorAll('#'+ pointer + '> .rectrack > div')
      if (child){
        let par = document.getElementById(child).parentElement.nextElementSibling
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }}else if (sib) {
        let alltop = document.querySelectorAll('#'+ pointer + '> .rectrack > div.' + sib)
        let current = alltop[alltop.length-1].nextElementSibling
        while (current != null) {
          // console.log(current)
          current.style.display = 'none'
          if (current.nextElementSibling !== null && current.nextElementSibling.style.display !== 'none'){
            current = current.nextElementSibling
          } else if (current.nextElementSibling !== null && current.nextElementSibling.style.display === 'none'){
            current = current.nextElementSibling.nextElementSibling
          } else if (current.nextElementSibling === null){
            current = null
          }

        }
        let newall = Array.from(all)
        let track = newall.indexOf(document.getElementById('d'+item.id))
        let album = newall.indexOf(alltop[alltop.length-1])
        // console.log(track)
        if (track!== -1 && track < album){
          alltop[alltop.length-1].insertAdjacentElement('afterend', document.getElementById('d'+item.id));
          // all.parentNode.insertBefore(newall[album],newall[track])
        }}
      if (document.getElementById('d'+item.id)){
        document.getElementById('d'+item.id).style.display = 'flex'
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('d'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
      }
      if (num === 1){
        let indexing = this.deeper1.indexOf(item)
        if (indexing === -1){
          this.deeper1.push(item)
        }
      } else if (num === 2){
        let indexing = this.deeper2.indexOf(item)
        if (indexing === -1){
          this.deeper2.push(item)
        }
      } else if (num === 22){
        let indexing = this.deeper22.indexOf(item)
        if (indexing === -1){
          this.deeper22.push(item)
        }
      } else if (num === 23){
        let indexing = this.deeper23.indexOf(item)
        if (indexing === -1){
          this.deeper23.push(item)
        }
      } else if (num === 3){
        let indexing = this.deeper3.indexOf(item)
        if (indexing === -1){
          this.deeper3.push(item)
        }
      } else if (num === 32){
        let indexing = this.deeper32.indexOf(item)
        if (indexing === -1){
          this.deeper32.push(item)
        }
      } else if (num === 33){
        let indexing = this.deeper33.indexOf(item)
        if (indexing === -1){
          this.deeper33.push(item)
        }
      } else if (num === 4){
        let indexing = this.deeper4.indexOf(item)
        if (indexing === -1){
          this.deeper4.push(item)
        }
      } else if (num === 5){
        let indexing = this.deeper5.indexOf(item)
        if (indexing === -1){
          this.deeper5.push(item)
        }
      } else if (num === 6){
        let indexing = this.deeper6.indexOf(item)
        if (indexing === -1){
          this.deeper6.push(item)
        }
      } else if (num === 7){
        let indexing = this.deeper7.indexOf(item)
        if (indexing === -1){
          this.deeper7.push(item)
        }
      } else if (num === 8){
        let indexing = this.deeper8.indexOf(item)
        if (indexing === -1){
          this.deeper8.push(item)
        }
      } else if (num === 9){
        let indexing = this.deeper9.indexOf(item)
        if (indexing === -1){
          this.deeper9.push(item)
        }
      } else if (num === 10){
        let indexing = this.deepers.indexOf(item)
        if (indexing === -1){
          this.deepers.push(item)
        }
      }
      // setTimeout(() => {
      //   window.scrollTo({
      //     top:(document.getElementById('d'+ item.id)).offsetTop,
      //     behavior:'smooth'});
      // }, 10);
    },
    seedArtist(pointer,item,num,sib,child) {
      let alltop = document.querySelectorAll('#'+ pointer +'> .rectrack > div.' + sib)
      // console.log(child)
      if (child){
        let par = document.getElementById(child).parentElement.nextElementSibling
        // console.log(par)
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }} else if (sib!==false && alltop[alltop.length-1].nextElementSibling!== null) {
        let par = alltop[alltop.length-1].nextElementSibling
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }
      }
      if(document.getElementById('sa'+item.id)){
        document.getElementById('sa'+item.id).style.display = 'flex'
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('sa'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
      }
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + item['id'] + '&limit=50&offset=0&market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) => {
            let data = []
            data.tracks = response.data['tracks']
            data.type = 'seed_artists'
            data.id = 'sa' + item.id
            data.name = item.name
            // console.log(data)
            if (num === 1){
              let indexing = this.deeper1.indexOf(data)
              if (indexing === -1){
                this.deeper1.push(data)
              }
            } else if (num === 2){
              let indexing = this.deeper2.indexOf(data)
              if (indexing === -1){
                this.deeper2.push(data)
              }
            } else if (num === 22){
              let indexing = this.deeper22.indexOf(data)
              if (indexing === -1){
                this.deeper22.push(data)
              }
            } else if (num === 23){
              let indexing = this.deeper23.indexOf(data)
              if (indexing === -1){
                this.deeper23.push(data)
              }
            } else if (num === 3){
              let indexing = this.deeper3.indexOf(data)
              if (indexing === -1){
                this.deeper3.push(data)
              }
            } else if (num === 32){
              let indexing = this.deeper32.indexOf(data)
              if (indexing === -1){
                this.deeper32.push(data)
              }
            } else if (num === 33){
              let indexing = this.deeper33.indexOf(data)
              if (indexing === -1){
                this.deeper33.push(data)
              }
            } else if (num === 4){
              let indexing = this.deeper4.indexOf(data)
              if (indexing === -1){
                this.deeper4.push(data)
              }
            } else if (num === 5){
              let indexing = this.deeper5.indexOf(data)
              if (indexing === -1){
                this.deeper5.push(data)
              }
            } else if (num === 6){
              let indexing = this.deeper6.indexOf(data)
              if (indexing === -1){
                this.deeper6.push(data)
              }
            } else if (num === 7){
              let indexing = this.deeper7.indexOf(data)
              if (indexing === -1){
                this.deeper7.push(data)
              }
            } else if (num === 8){
              let indexing = this.deeper8.indexOf(data)
              if (indexing === -1){
                this.deeper8.push(data)
              }
            }else if (num === 9){
              let indexing = this.deeper9.indexOf(data)
              if (indexing === -1){
                this.deeper9.push(data)
              }
            } else if (num === 10){
              let indexing = this.deepers.indexOf(data)
              if (indexing === -1){
                this.deepers.push(data)
              }
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('sa'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
          })
          .catch()
    },
    seedTracks(pointer,item,num,sib,child) {
      let alltop = document.querySelectorAll('#'+ pointer+ '> .rectrack > div.' + sib)
      // console.log(alltop)
      // console.log(sib)
      // console.log(child)
      if (child){
        let par = document.getElementById(child).nextElementSibling
        // console.log(par)
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }} else if (sib!==false && alltop[alltop.length-1].nextElementSibling!== null) {
        let par = alltop[alltop.length-1].nextElementSibling
        while (par != null) {
          par.style.display = 'none'
          if (par.nextElementSibling !== null && par.nextElementSibling.style.display !== 'none'){
            par = par.nextElementSibling
          } else if (par.nextElementSibling !== null && par.nextElementSibling.style.display === 'none'){
            par = par.nextElementSibling.nextElementSibling
          } else if (par.nextElementSibling === null){
            par = null
          }
        }
      }
      if(document.getElementById('st'+item.id)){
        document.getElementById('st'+item.id).style.display = 'flex'
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('st'+ item.id)).offsetTop,
        //     behavior:'smooth'});
        // }, 10);
        return
      }
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + item['id'] + '&limit=50&offset=0&market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) => {
            let data = []
            // console.log(response.data['tracks'])
            data.tracks = response.data['tracks']
            data.type = 'seed_tracks'
            data.id = 'st' + item.id
            data.name = item.name
            // console.log(data)
            if (num === 1){
              let indexing = this.deeper1.indexOf(data)
              if (indexing === -1){
                this.deeper1.push(data)
              }
            } else if (num === 2){
              let indexing = this.deeper2.indexOf(data)
              if (indexing === -1){
                this.deeper2.push(data)
              }
            } else if (num === 22){
              let indexing = this.deeper22.indexOf(data)
              if (indexing === -1){
                this.deeper22.push(data)
              }
            } else if (num === 23){
              let indexing = this.deeper23.indexOf(data)
              if (indexing === -1){
                this.deeper23.push(data)
              }
            } else if (num === 3){
              let indexing = this.deeper3.indexOf(data)
              if (indexing === -1){
                this.deeper3.push(data)
              }
            } else if (num === 32){
              let indexing = this.deeper32.indexOf(data)
              if (indexing === -1){
                this.deeper32.push(data)
              }
            } else if (num === 33){
              let indexing = this.deeper33.indexOf(data)
              if (indexing === -1){
                this.deeper33.push(data)
              }
            } else if (num === 4){
              let indexing = this.deeper4.indexOf(data)
              if (indexing === -1){
                this.deeper4.push(data)
              }
            } else if (num === 5){
              let indexing = this.deeper5.indexOf(data)
              if (indexing === -1){
                this.deeper5.push(data)
              }
            } else if (num === 6){
              let indexing = this.deeper6.indexOf(data)
              if (indexing === -1){
                this.deeper6.push(data)
              }
            } else if (num === 7){
              let indexing = this.deeper7.indexOf(data)
              if (indexing === -1){
                this.deeper7.push(data)
              }
            } else if (num === 8){
              let indexing = this.deeper8.indexOf(data)
              if (indexing === -1){
                this.deeper8.push(data)
              }
            }else if (num === 9){
              let indexing = this.deeper9.indexOf(data)
              if (indexing === -1){
                this.deeper9.push(data)
              }
            } else if (num === 10){
              let indexing = this.deepers.indexOf(data)
              if (indexing === -1){
                this.deepers.push(data)
              }
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('st'+ item.id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
          })
          .catch()
    },
    reloadSA(num,id,name){
      // let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
      // document.querySelector('#' + id).insertAdjacentHTML("afterend",div)
      // let target = event.target
      // target.className = 'refresh-start'
      // setTimeout(() => {
      //   target.className = 'refresh-end'
      // },1000)
      if (num === 1){
        let sa = this.deeper1.findIndex((deeper1) => {return deeper1.id === id})
        this.deeper1.splice(sa, 9e9)
      } else if (num === 2){
        let sa = this.deeper2.findIndex((deeper2) => {return deeper2.id === id})
        this.deeper2.splice(sa, 9e9)
      } else if (num === 22){
        let sa = this.deeper22.findIndex((deeper22) => {return deeper22.id === id})
        this.deeper22.splice(sa, 9e9)
      } else if (num === 23){
        let sa = this.deeper23.findIndex((deeper23) => {return deeper23.id === id})
        this.deeper23.splice(sa, 9e9)
      } else if (num === 3){
        let sa = this.deeper3.findIndex((deeper3) => {return deeper3.id === id})
        this.deeper3.splice(sa, 1)
      } else if (num === 32){
        let sa = this.deeper32.findIndex((deeper32) => {return deeper32.id === id})
        this.deeper32.splice(sa, 9e9)
      } else if (num === 33){
        let sa = this.deeper33.findIndex((deeper33) => {return deeper33.id === id})
        this.deeper33.splice(sa, 9e9)
      } else if (num === 4){
        let sa = this.deeper4.findIndex((deeper4) => {return deeper4.id === id})
        this.deeper4.splice(sa, 9e9)
      } else if (num === 5){
        let sa = this.deeper5.findIndex((deeper5) => {return deeper5.id === id})
        this.deeper5.splice(sa, 9e9)
      } else if (num === 6){
        let sa = this.deeper6.findIndex((deeper6) => {return deeper6.id === id})
        this.deeper6.splice(sa, 9e9)
      } else if (num === 7){
        let sa = this.deeper7.findIndex((deeper7) => {return deeper7.id === id})
        this.deeper7.splice(sa, 9e9)
      } else if (num === 8){
        let sa = this.deeper8.findIndex((deeper8) => {return deeper8.id === id})
        this.deeper8.splice(sa, 9e9)
      }else if (num === 9){
        let sa = this.deeper9.findIndex((deeper9) => {return deeper9.id === id})
        this.deeper9.splice(sa, 9e9)
      } else if (num === 10){
        let sa = this.deepers.findIndex((deepers) => {return deepers.id === id})
        this.deepers.splice(sa, 9e9)
      }
      // console.log(id.replace('sa',''))
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_artists=' + id.replace('sa','') + '&limit=50&offset=0&market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) => {
            let data = []
            // console.log(response.data['tracks'])
            data.tracks = response.data['tracks']
            data.type = 'seed_artists'
            data.id = id
            data.name = name
            // console.log(data)
            if (num === 1){
              let indexing = this.deeper1.indexOf(data)
              if (indexing === -1){
                this.deeper1.push(data)
              }
            } else if (num === 2){
              let indexing = this.deeper2.indexOf(data)
              if (indexing === -1){
                this.deeper2.push(data)
              }
            } else if (num === 22){
              let indexing = this.deeper22.indexOf(data)
              if (indexing === -1){
                this.deeper22.push(data)
              }
            } else if (num === 23){
              let indexing = this.deeper23.indexOf(data)
              if (indexing === -1){
                this.deeper23.push(data)
              }
            } else if (num === 3){
              let indexing = this.deeper3.indexOf(data)
              if (indexing === -1){
                this.deeper3.push(data)
              }
            } else if (num === 32){
              let indexing = this.deeper32.indexOf(data)
              if (indexing === -1){
                this.deeper32.push(data)
              }
            } else if (num === 33){
              let indexing = this.deeper33.indexOf(data)
              if (indexing === -1){
                this.deeper33.push(data)
              }
            } else if (num === 4){
              let indexing = this.deeper4.indexOf(data)
              if (indexing === -1){
                this.deeper4.push(data)
              }
            } else if (num === 5){
              let indexing = this.deeper5.indexOf(data)
              if (indexing === -1){
                this.deeper5.push(data)
              }
            } else if (num === 6){
              let indexing = this.deeper6.indexOf(data)
              if (indexing === -1){
                this.deeper6.push(data)
              }
            } else if (num === 7){
              let indexing = this.deeper7.indexOf(data)
              if (indexing === -1){
                this.deeper7.push(data)
              }
            } else if (num === 8){
              let indexing = this.deeper8.indexOf(data)
              if (indexing === -1){
                this.deeper8.push(data)
              }
            }else if (num === 9){
              let indexing = this.deeper9.indexOf(data)
              if (indexing === -1){
                this.deeper9.push(data)
              }
            } else if (num === 10){
              let indexing = this.deepers.indexOf(data)
              if (indexing === -1){
                this.deepers.push(data)
              }
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById(id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
          })
          .catch()
    },
    reloadST(num,id,name){
      // let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
      // document.querySelector('#' + id).insertAdjacentHTML("afterend",div)
      // let target = event.target
      // target.className = 'refresh-start'
      // setTimeout(() => {
      //   target.className = 'refresh-end'
      // },1000)
      if (num === 1){
        let st = this.deeper1.findIndex((deeper1) => {return deeper1.id === id})
        this.deeper1.splice(st, 9e9)
        // this.deeper1.splice(st, 1)
      } else if (num === 2){
        let st = this.deeper2.findIndex((deeper2) => {return deeper2.id === id})
        this.deeper2.splice(st, 9e9)
      } else if (num === 22){
        let st = this.deeper22.findIndex((deeper22) => {return deeper22.id === id})
        this.deeper22.splice(st, 9e9)
      } else if (num === 23){
        let st = this.deeper23.findIndex((deeper23) => {return deeper23.id === id})
        this.deeper23.splice(st, 9e9)
      } else if (num === 3){
        let st = this.deeper3.findIndex((deeper3) => {return deeper3.id === id})
        this.deeper3.splice(st, 9e9)
      } else if (num === 32){
        let st = this.deeper32.findIndex((deeper32) => {return deeper32.id === id})
        this.deeper32.splice(st, 9e9)
      } else if (num === 33){
        let st = this.deeper33.findIndex((deeper33) => {return deeper33.id === id})
        this.deeper33.splice(st, 9e9)
      } else if (num === 4){
        let st = this.deeper4.findIndex((deeper4) => {return deeper4.id === id})
        this.deeper4.splice(st, 9e9)
      } else if (num === 5){
        let st = this.deeper5.findIndex((deeper5) => {return deeper5.id === id})
        this.deeper5.splice(st, 9e9)
      } else if (num === 6){
        let st = this.deeper6.findIndex((deeper6) => {return deeper6.id === id})
        this.deeper6.splice(st, 9e9)
      } else if (num === 7){
        let st = this.deeper7.findIndex((deeper7) => {return deeper7.id === id})
        this.deeper7.splice(st, 9e9)
      } else if (num === 8){
        let st = this.deeper8.findIndex((deeper8) => {return deeper8.id === id})
        this.deeper8.splice(st, 9e9)
      }else if (num === 9){
        let st = this.deeper9.findIndex((deeper9) => {return deeper9.id === id})
        this.deeper9.splice(st, 9e9)
      } else if (num === 10){
        let st = this.deepers.findIndex((deepers) => {return deepers.id === id})
        this.deepers.splice(st, 9e9)
      }
      // console.log(id.replace('st',''))
      axios.request({
        url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + id.replace('st','') + '&limit=50&offset=0&market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) => {
            let data = []
            data.tracks = response.data['tracks']
            data.type = 'seed_tracks'
            data.id = id
            data.name = name
            // console.log(data)
            if (num === 1){
              let indexing = this.deeper1.indexOf(data)
              if (indexing === -1){
                this.deeper1.push(data)
              }
            } else if (num === 2){
              let indexing = this.deeper2.indexOf(data)
              if (indexing === -1){
                this.deeper2.push(data)
              }
            } else if (num === 22){
              let indexing = this.deeper22.indexOf(data)
              if (indexing === -1){
                this.deeper22.push(data)
              }
            } else if (num === 23){
              let indexing = this.deeper23.indexOf(data)
              if (indexing === -1){
                this.deeper23.push(data)
              }
            } else if (num === 3){
              let indexing = this.deeper3.indexOf(data)
              if (indexing === -1){
                this.deeper3.push(data)
              }
            } else if (num === 32){
              let indexing = this.deeper32.indexOf(data)
              if (indexing === -1){
                this.deeper32.push(data)
              }
            } else if (num === 33){
              let indexing = this.deeper33.indexOf(data)
              if (indexing === -1){
                this.deeper33.push(data)
              }
            } else if (num === 4){
              let indexing = this.deeper4.indexOf(data)
              if (indexing === -1){
                this.deeper4.push(data)
              }
            } else if (num === 5){
              let indexing = this.deeper5.indexOf(data)
              if (indexing === -1){
                this.deeper5.push(data)
              }
            } else if (num === 6){
              let indexing = this.deeper6.indexOf(data)
              if (indexing === -1){
                this.deeper6.push(data)
              }
            } else if (num === 7){
              let indexing = this.deeper7.indexOf(data)
              if (indexing === -1){
                this.deeper7.push(data)
              }
            } else if (num === 8){
              let indexing = this.deeper8.indexOf(data)
              if (indexing === -1){
                this.deeper8.push(data)
              }
            }else if (num === 9){
              let indexing = this.deeper9.indexOf(data)
              if (indexing === -1){
                this.deeper9.push(data)
              }
            } else if (num === 10){
              let indexing = this.deepers.indexOf(data)
              if (indexing === -1){
                this.deepers.push(data)
              }
            }
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById(id)).offsetTop,
            //     behavior:'smooth'});
            // }, 10);
          })
          .catch()
    },
    fetchPlaylists(event,offset){
      // let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
      // event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      axios.request({
        url:'https://api.spotify.com/v1/me/playlists?fields=items(name,id)&limit=50&offset=' + offset,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.listplaylists.push(...response.data['items'])
            if (response.data['items'].length > 0){
              this.fetchPlaylists(event,offset+=50)
            }
            // document.getElementById("loader").remove()
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
      // console.log('167 '  + event.currentTarget.id)
      let id = event.currentTarget.id
      let allTracks = document.querySelectorAll("#yourplaylists > .rectrack > div");
      if (allTracks != null) {
        for (let i = 0; i < allTracks.length; i++) {
          allTracks[i].style.display = 'none'
        }
      }
      let pl = document.querySelectorAll('#yourplaylists > div:not(.rectrack,.pl,.rel)')
      for (let i=0;i <  pl.length;i++){
        pl[i].style.display = 'none'

      }
      if (document.getElementById('p'+ id)){
        // console.log(document.getElementById('p'+ id))
        document.getElementById('p'+ id).style.display = 'block'
        // console.log(this.currentpl)
        if (this.currentpl){
          this.currentpl.className = 'hr-line-dashed'
          this.currentpl = document.getElementById(id)
          this.currentpl.className = 'hr-line-dashed activetab'
        } else {
          this.currentpl = document.getElementById(id)
          this.currentpl.className = 'hr-line-dashed activetab'
        }
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('p'+ id)).offsetTop,
        //     behavior:'smooth'});
        // },10)
        return
      }
      axios.request({
        url:'https://api.spotify.com/v1/playlists/' + id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            // console.log(response.data)
            let data = response.data
            axios.request({
              url:'https://api.spotify.com/v1/playlists/'+ id + '/followers/contains?ids=' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
              method: 'get',
              headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                  data.followed = response.data[0]
                  this.playlists.push(data)
                  if (this.currentpl){
                    this.currentpl.className = 'hr-line-dashed'
                    this.currentpl = document.getElementById(id)
                    this.currentpl.className = 'hr-line-dashed activetab'
                  } else {
                    this.currentpl = document.getElementById(id)
                    this.currentpl.className = 'hr-line-dashed activetab'
                  }
                })
            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('p'+ id)).offsetTop,
            //     behavior:'smooth'});
            // },1000)
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchArtist(event){
      if (event.target.parentElement.id === 'option2'){
        let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
        event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      } else {
        let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
        event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      }
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=short_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            // console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              // console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    // console.log('247' + response.data)
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    items[i].tracks = tracks
                    newarr.push(items[i])

                  })
            }
            this.topartist = newarr
            document.getElementById("loader").remove()
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchArtist2(event){
      let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
      event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=medium_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            // console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              // console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
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
            this.topartist6 = newarr
            document.getElementById("loader").remove()
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchArtist3(event){
      let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
      event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      axios.request({
        url:'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            // console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              // console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/artists/' + items[i].id + '/top-tracks?market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    // console.log('247' + response.data)
                    let tracks = response.data['tracks']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    items[i].tracks = tracks
                    newarr.push(items[i])

                  })
            }
            this.topartista = newarr
            document.getElementById("loader").remove()
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    switchArtist(num){
      if (num === 1){
        document.getElementById('topartist').style.display = 'flex'
        document.getElementById('topartists').className = 'activetab'
        document.getElementById('topartist6').style.display = 'none'
        document.getElementById('topartists6').className = ''
        document.getElementById('topartista').style.display = 'none'
        document.getElementById('topartistsall').className = ''
        this.taactivetab = document.getElementById('topartist')
      } else if (num === 2){
        document.getElementById('topartist').style.display = 'none'
        document.getElementById('topartists').className = ''
        document.getElementById('topartist6').style.display = 'flex'
        document.getElementById('topartists6').className = 'activetab'
        document.getElementById('topartista').style.display = 'none'
        document.getElementById('topartistsall').className = ''
        this.taactivetab = document.getElementById('topartist6')
      } else if (num === 3){
        document.getElementById('topartist').style.display = 'none'
        document.getElementById('topartists').className = ''
        document.getElementById('topartist6').style.display = 'none'
        document.getElementById('topartists6').className = ''
        document.getElementById('topartista').style.display = 'flex'
        document.getElementById('topartistsall').className = 'activetab'
        this.taactivetab = document.getElementById('topartista')
      }
    },
    fetchApi(event){
      if (event.target.parentElement.id === 'option3'){
        let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
        event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      } else {
        let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
        event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      }
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.items = response.data['items']
            document.getElementById("loader").remove()
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchApi2(event){
      let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
      event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.itemsm = response.data['items']
            document.getElementById("loader").remove()
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    fetchApi3(event){
      let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
      event.target.parentElement.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      axios.request({
        url:'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            this.itemsl = response.data['items']
            document.getElementById("loader").remove()
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    switchTracks(num){
      if (num === 1){
        document.getElementById('toptrack').style.display = 'flex'
        document.getElementById('toptracks').className = 'activetab'
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackssix').className = ''
        document.getElementById('toptrackall').style.display = 'none'
        document.getElementById('toptracksall').className = ''
        this.ttactivetab = document.getElementById('toptrack')
      } else if (num === 2){
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptracks').className = ''
        document.getElementById('toptrack6').style.display = 'flex'
        document.getElementById('toptrackssix').className = 'activetab'
        document.getElementById('toptrackall').style.display = 'none'
        document.getElementById('toptracksall').className = ''
        this.ttactivetab = document.getElementById('toptrack6')
      } else if (num === 3){
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptracks').className = ''
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackssix').className = ''
        document.getElementById('toptrackall').style.display = 'flex'
        document.getElementById('toptracksall').className = 'activetab'
        this.ttactivetab = document.getElementById('toptrackall')
      }
    },
    switchTabs(event){
      let target = event.target
      if (target.id === 'playlistlist'){
        document.getElementById('playlistlist').className = 'tabs_target'
        document.getElementById('playlistlist').nextElementSibling.style.height = 'auto'
        document.getElementById('ta').className = ''
        document.getElementById('ta').nextElementSibling.style.height = 0
        document.getElementById('tt').className = ''
        document.getElementById('tt').nextElementSibling.style.height = 0
        document.getElementById('sa').className = ''
        document.getElementById('sa').nextElementSibling.style.height = 0
        document.getElementById('st').className = ''
        document.getElementById('st').nextElementSibling.style.height = 0
        document.getElementById('fa').className = ''
        document.getElementById('fa').nextElementSibling.style.height = 0
        document.getElementById('nr').className = ''
        document.getElementById('nr').nextElementSibling.style.height = 0
        document.getElementById('spt').className = ''
        document.getElementById('spt').nextElementSibling.style.height = 0
      } else if (target.id === 'ta'){
        document.getElementById('playlistlist').className = ''
        document.getElementById('playlistlist').nextElementSibling.style.height = 0
        document.getElementById('ta').className = 'tabs_target'
        document.getElementById('ta').nextElementSibling.style.height = 'auto'
        document.getElementById('tt').className = ''
        document.getElementById('tt').nextElementSibling.style.height = 0
        document.getElementById('sa').className = ''
        document.getElementById('sa').nextElementSibling.style.height = 0
        document.getElementById('st').className = ''
        document.getElementById('st').nextElementSibling.style.height = 0
        document.getElementById('fa').className = ''
        document.getElementById('fa').nextElementSibling.style.height = 0
        document.getElementById('nr').className = ''
        document.getElementById('nr').nextElementSibling.style.height = 0
        document.getElementById('spt').className = ''
        document.getElementById('spt').nextElementSibling.style.height = 0
      } else if (target.id === 'tt'){
        document.getElementById('playlistlist').className = ''
        document.getElementById('playlistlist').nextElementSibling.style.height = 0
        document.getElementById('ta').className = ''
        document.getElementById('ta').nextElementSibling.style.height = 0
        document.getElementById('tt').className = 'tabs_target'
        document.getElementById('tt').nextElementSibling.style.height = 'auto'
        document.getElementById('sa').className = ''
        document.getElementById('sa').nextElementSibling.style.height = 0
        document.getElementById('st').className = ''
        document.getElementById('st').nextElementSibling.style.height = 0
        document.getElementById('fa').className = ''
        document.getElementById('fa').nextElementSibling.style.height = 0
        document.getElementById('nr').className = ''
        document.getElementById('nr').nextElementSibling.style.height = 0
        document.getElementById('spt').className = ''
        document.getElementById('spt').nextElementSibling.style.height = 0
      } else if (target.id === 'sa'){
        document.getElementById('playlistlist').className = ''
        document.getElementById('playlistlist').nextElementSibling.style.height = 0
        document.getElementById('ta').className = ''
        document.getElementById('ta').nextElementSibling.style.height = 0
        document.getElementById('tt').className = ''
        document.getElementById('tt').nextElementSibling.style.height = 0
        document.getElementById('sa').className = 'tabs_target'
        document.getElementById('sa').nextElementSibling.style.height = 'auto'
        document.getElementById('st').className = ''
        document.getElementById('st').nextElementSibling.style.height = 0
        document.getElementById('fa').className = ''
        document.getElementById('fa').nextElementSibling.style.height = 0
        document.getElementById('nr').className = ''
        document.getElementById('nr').nextElementSibling.style.height = 0
        document.getElementById('spt').className = ''
        document.getElementById('spt').nextElementSibling.style.height = 0
      } else if (target.id === 'st'){
        document.getElementById('playlistlist').className = ''
        document.getElementById('playlistlist').nextElementSibling.style.height = 0
        document.getElementById('ta').className = ''
        document.getElementById('ta').nextElementSibling.style.height =0
        document.getElementById('tt').className = ''
        document.getElementById('tt').nextElementSibling.style.height = 0
        document.getElementById('sa').className = ''
        document.getElementById('sa').nextElementSibling.style.height = 0
        document.getElementById('st').className = 'tabs_target'
        document.getElementById('st').nextElementSibling.style.height = 'auto'
        document.getElementById('fa').className = ''
        document.getElementById('fa').nextElementSibling.style.height = 0
        document.getElementById('nr').className = ''
        document.getElementById('nr').nextElementSibling.style.height = 0
        document.getElementById('spt').className = ''
        document.getElementById('spt').nextElementSibling.style.height = 0
      } else if (target.id === 'fa'){
        document.getElementById('playlistlist').className = ''
        document.getElementById('playlistlist').nextElementSibling.style.height = 0
        document.getElementById('ta').className = ''
        document.getElementById('ta').nextElementSibling.style.height = 0
        document.getElementById('tt').className = ''
        document.getElementById('tt').nextElementSibling.style.height = 0
        document.getElementById('sa').className = ''
        document.getElementById('sa').nextElementSibling.style.height = 0
        document.getElementById('st').className = ''
        document.getElementById('st').nextElementSibling.style.height = 0
        document.getElementById('fa').className = 'tabs_target'
        document.getElementById('fa').nextElementSibling.style.height = 'auto'
        document.getElementById('nr').className = ''
        document.getElementById('nr').nextElementSibling.style.height = 0
        document.getElementById('spt').className = ''
        document.getElementById('spt').nextElementSibling.style.height = 0
      } else if (target.id === 'nr'){
        document.getElementById('playlistlist').className = ''
        document.getElementById('playlistlist').nextElementSibling.style.height = 0
        document.getElementById('ta').className = ''
        document.getElementById('ta').nextElementSibling.style.height = 0
        document.getElementById('tt').className = ''
        document.getElementById('tt').nextElementSibling.style.height = 0
        document.getElementById('sa').className = ''
        document.getElementById('sa').nextElementSibling.style.height = 0
        document.getElementById('st').className = ''
        document.getElementById('st').nextElementSibling.style.height = 0
        document.getElementById('fa').className = ''
        document.getElementById('fa').nextElementSibling.style.height = 0
        document.getElementById('nr').className = 'tabs_target'
        document.getElementById('nr').nextElementSibling.style.height = 'auto'
        document.getElementById('spt').className = ''
        document.getElementById('spt').nextElementSibling.style.height = 0
      } else if (target.id === 'spt'){
        document.getElementById('playlistlist').className = ''
        document.getElementById('playlistlist').nextElementSibling.style.height = 0
        document.getElementById('ta').className = ''
        document.getElementById('ta').nextElementSibling.style.height = 0
        document.getElementById('tt').className = ''
        document.getElementById('tt').nextElementSibling.style.height = 0
        document.getElementById('sa').className = ''
        document.getElementById('sa').nextElementSibling.style.height = 0
        document.getElementById('st').className = ''
        document.getElementById('st').nextElementSibling.style.height = 0
        document.getElementById('fa').className = ''
        document.getElementById('fa').nextElementSibling.style.height = 0
        document.getElementById('nr').className = ''
        document.getElementById('nr').nextElementSibling.style.height = 0
        document.getElementById('spt').className = 'tabs_target'
        document.getElementById('spt').nextElementSibling.style.height = 'auto'
      }
    },
    fetchAlbums(event){
      let div = "<div id='loader' class='loading waitingForConnection'>Loading<span>.</span><span>.</span><span>.</span></div>"
      event.target.nextElementSibling.insertAdjacentHTML("afterbegin",div)
      axios.request({
        url: 'https://api.spotify.com/v1/me/albums',
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            let newarr = []
            let items =response.data['items']
            // console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              // console.log('237' + items[i].id)
              axios.request({
                url:'https://api.spotify.com/v1/albums/' + items[i].album.id + '/tracks?market=UA&limit=10',
                method: 'get',
                headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
              })
                  .then((response) =>{
                    // console.log('247' + response.data)
                    let tracks = response.data['items']
                    if (tracks[0]['preview_url']){
                      items[i].preview_url = tracks[0]['preview_url']
                    }
                    newarr.push(items[i])

                  })
            }
            this.savedalbums = newarr
            document.getElementById("loader").remove()
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
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
                // console.log(response.data)
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
            let items = response.data['albums']['items']
            // console.log('235' + items[0].id)
            for (let i=0;i <  items.length;i++){
              newarr.push(items[i].id)
            }
            this.getNewrelease(newarr,offset)
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
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
            // console.log('452 ' + this.newreleases)
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
                // console.log(response.data)
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
              // console.log('237 ' + items[i].id)
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
                // console.log(response.data)
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
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
    },
    SpotInit:function(event){
      // console.log('167'  + event.currentTarget.id)
      let id = event.currentTarget.id
      let allTracks = document.querySelectorAll("#sptplaylists > .rectrack > div");
      if (allTracks != null) {
        for (let i = 0; i < allTracks.length; i++) {
          allTracks[i].style.display = 'none'
        }
      }
      let pl = document.querySelectorAll('#sptplaylists > div:not(.rectrack,.pl,.head,.sp)')
      for (let i=0;i <  pl.length;i++){
        pl[i].style.display = 'none'

      }
      if (document.getElementById('s'+ id)){
        document.getElementById('s'+ id).style.display = 'block'
        if (this.currentspl){
          this.currentspl.className = 'hr-line-dashed'
          this.currentspl = document.getElementById(id)
          this.currentspl.className = 'hr-line-dashed activetab'
        } else {
          this.currentspl = document.getElementById(id)
          this.currentspl.className = 'hr-line-dashed activetab'
        }
        // setTimeout(() => {
        //   window.scrollTo({
        //     top:(document.getElementById('s'+ id)).offsetTop,
        //     behavior:'smooth'});
        // },10)
        return
      }
      axios.request({
        url:'https://api.spotify.com/v1/playlists/' + id,
        method: 'get',
        headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
      })
          .then((response) =>{
            // console.log(response.data)
            let data = response.data
            axios.request({
              url:'https://api.spotify.com/v1/playlists/'+ id + '/followers/contains?ids=' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
              method: 'get',
              headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
            })
                .then((response) =>{
                  data.followed = response.data[0]
                  this.sptplaylists.push(data)
                  if (this.currentspl){
                    this.currentspl.className = 'hr-line-dashed'
                    this.currentspl = document.getElementById(id)
                    this.currentspl.className = 'hr-line-dashed activetab'
                  } else {
                    this.currentspl = document.getElementById(id)
                    this.currentspl.className = 'hr-line-dashed activetab'
                  }
                })


            // setTimeout(() => {
            //   window.scrollTo({
            //     top:(document.getElementById('s'+ id)).offsetTop,
            //     behavior:'smooth'});
            // },1000)
          })
          .catch(error =>{
            if (error.response.status){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
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
            // console.log(response.data)
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
      // console.log(window.location.href)
      clearTimeout(this.searchtimer)
      this.searchtimer = setTimeout(() => {


        if (e.target.value) {
          let value = e.target.value
          // console.log(value)

          axios.request({
            url: 'https://api.spotify.com/v1/search/?q=' + value + '&type=album,artist,playlist,track&limit=5',
            method: 'get',
            headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
          })
              .then((response) => {
                // console.log(response.data)
                this.tracks = []
                this.artists = []
                this.albums = []
                this.splaylists = []
                let albums = response.data['albums']['items']
                let artists = response.data['artists']['items']
                let playlists = response.data['playlists']['items']
                this.tracks = response.data['tracks']['items']

                // console.log(albums)
                // console.log(artists)
                // console.log(playlists)
                // console.log(response.data['tracks']['items'])
                let albarr = []
                for (let i = 0; i < albums.length; i++) {
                  // console.log('237' + albums[i].id)
                  axios.request({
                    url: 'https://api.spotify.com/v1/albums/' + albums[i].id + '/tracks?market=UA&limit=10',
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                  })
                      .then((response) => {
                        console.log(response.data)
                        let tracks = response.data['items']
                        if (tracks[0]['preview_url']) {
                          albums[i].preview_url = tracks[0]['preview_url']
                        }
                        albums[i].tracks = tracks
                        albarr.push(albums[i])
                        console.log(albums)
                      })
                }this.albums = albarr

                let artarr = []
                for (let i = 0; i < artists.length; i++) {
                  // console.log('237' + artists[i].id)
                  axios.request({
                    url: 'https://api.spotify.com/v1/artists/' + artists[i].id + '/top-tracks?market=' + document.cookie.replace(/(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                  })
                      .then((response) => {
                        console.log(response.data)
                        let tracks = response.data['tracks']
                        if (tracks[0]['preview_url']) {
                          artists[i].preview_url = tracks[0]['preview_url']
                        }
                        artists[i].tracks = tracks
                        artarr.push(artists[i])

                      })
                }
                this.artists = artarr
                // console.log(this.artists)
                let playlist = []
                for (let i = 0; i < playlists.length; i++) {
                  // console.log('237' + playlists[i].id)
                  axios.request({
                    url: 'https://api.spotify.com/v1/playlists/' + playlists[i].id,
                    method: 'get',
                    headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
                  })
                      .then((response) => {
                        // console.log(response.data['tracks'])
                        let tracks = response.data['tracks']
                        if (tracks['items'][0]['track']['preview_url']) {
                          playlists[i].preview_url = tracks['items'][0]['track']['preview_url']
                        }
                        playlists[i].tracks = tracks
                        playlist.push(playlists[i])

                      })
                }
                this.splaylists = playlist
                // console.log(this.splaylists)

              }).catch(error =>{
            if (error.response.status === 401){
              axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                // console.log(response.data)
                let new_token = response.data['new_token']
                document.cookie ='access_token=' + new_token
              })
            }
          })
        }
        if (window.location.hash !=='#srch'){
          window.location.hash = "srch"
        }
      }, 1000);
    },
    filterres(event){
      let input = event.target
      let filter = input.value.toUpperCase();
      let pl = document.querySelectorAll('#sptplaylists > div:not(.rectrack,.head) > div');

      for (let i=0; i<pl.length; i++){
        if(pl[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
          pl[i].style.display = "block";
        }
        else{
          pl[i].style.display = "none";
        }
      }
    },
    reloader(num,event){
      // console.log(id)
      // console.log(num)
      // console.log(event.target)
      // console.log(this.playlists)
      let parent = event.target.parentNode.parentNode.parentNode
      let target = event.target
      // console.log(target)
      target.className = 'refresh-start'
      if (num ===1){
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#yourplaylists > div.pl').insertAdjacentHTML("afterend",div)
        // console.log(document.getElementById('loader'))
        let nid = parent.id.replace('p','')
        // console.log(nid)
        // let sea = this.playlists.find((playlists) => {return playlists.id === nid})
        let sea = this.playlists.findIndex((playlists) => {return playlists.id === nid})
        this.playlists.splice(sea, 1)
        document.getElementById('p'+ nid).remove()
        // console.log(this.playlists)
        let test = {}
        let currentTarget = {}
        currentTarget.id = nid
        test.currentTarget = currentTarget
        // console.log(test)
        setTimeout(() => {
          this.fetchInit(test)
          document.getElementById("reloader").remove()
        },1000)
        // console.log(sea)
      } else if (num === 9){
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#sptplaylists > div.pl').insertAdjacentHTML("afterend",div)
        let nid = parent.id.replace('s','')
        // console.log(nid)
        let sea = this.sptplaylists.findIndex((sptplaylists) => {return sptplaylists.id === nid})
        this.sptplaylists.splice(sea, 1)
        let test = {}
        let currentTarget = {}
        currentTarget.id = nid
        test.currentTarget = currentTarget
        setTimeout(() => {
          this.SpotInit(test)
          document.getElementById("reloader").remove()
        },1000)
      }
      setTimeout(() => {
        target.className = 'refresh-end'
      },1000)
      // if (id.startsWith('art')){
      //   let cid = id.replace('art','')
      //   if (num===1){
      //     let deeper1 = this.deeper1
      //     deeper1.find(deeper1 => item => item.id === cid)
      //   } else if (num ===2){
      //     let deeper2 = this.deeper2
      //     deeper2.find(deeper2 => item => item.id === cid)
      //   }
      // }
      // if (num === 1){
      //   let indexing = this.deeper1.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper1.push(data)
      //   }
      // } else if (num === 2){
      //   let indexing = this.deeper2.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper2.push(data)
      //   }
      // } else if (num === 22){
      //   let indexing = this.deeper22.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper22.push(data)
      //   }
      // } else if (num === 23){
      //   let indexing = this.deeper23.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper23.push(data)
      //   }
      // } else if (num === 3){
      //   let indexing = this.deeper3.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper3.push(data)
      //   }
      // } else if (num === 32){
      //   let indexing = this.deeper32.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper32.push(data)
      //   }
      // } else if (num === 33){
      //   let indexing = this.deeper33.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper33.push(data)
      //   }
      // } else if (num === 4){
      //   let indexing = this.deeper4.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper4.push(data)
      //   }
      // } else if (num === 5){
      //   let indexing = this.deeper5.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper5.push(data)
      //   }
      // } else if (num === 6){
      //   let indexing = this.deeper6.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper6.push(data)
      //   }
      // } else if (num === 7){
      //   let indexing = this.deeper7.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper7.push(data)
      //   }
      // } else if (num === 8){
      //   let indexing = this.deeper8.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper8.push(data)
      //   }
      // }else if (num === 9){
      //   let indexing = this.deeper9.indexOf(data)
      //   if (indexing === -1){
      //     this.deeper9.push(data)
      //   }
      // } else if (num === 10){
      //   let indexing = this.deepers.indexOf(data)
      //   if (indexing === -1){
      //     this.deepers.push(data)
      //   }
      // }
    },
    reloadpl(event){
      let target = event.target
      target.className = 'refresh-start'
      this.listplaylists = []
      this.playlists = []
      let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
      document.querySelector('#yourplaylists').insertAdjacentHTML("afterbegin",div)
      setTimeout(() => {
        let ne = {}
        ne.target = document.getElementById('playlistlist')
        this.fetchPlaylists(ne,0)
        document.getElementById("reloader").remove()
        target.className = 'refresh-end'
      },1000)
    },
    reloadartists(num,event){
      let target = event.target
      // console.log(target.previousSibling)
      target.className = 'refresh-start'
      if (num === 1){
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#topartist').insertAdjacentHTML("afterbegin",div)
        this.topartist = []
        setTimeout(() => {
          let event = {}
          event.target = document.querySelector('#topartists')
          this.fetchArtist(event)
          document.getElementById("reloader").remove()
          target.className = 'refresh-end'
        },1000)
      } else if (num === 2){
        this.topartist6 = []
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#topartist6').insertAdjacentHTML("afterbegin",div)
        setTimeout(() => {
          let event = {}
          event.target = document.querySelector('#topartists6')
          this.fetchArtist2(event)
          document.getElementById("reloader").remove()
          target.className = 'refresh-end'
        },1000)
      } else if (num === 3){
        this.topartista = []
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#topartista').insertAdjacentHTML("afterbegin",div)
        setTimeout(() => {
          let event = {}
          event.target = document.querySelector('#topartistsall')
          this.fetchArtist3(event)
          document.getElementById("reloader").remove()
          target.className = 'refresh-end'
        },1000)
      } else if (num === 4){
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#topartist').insertAdjacentHTML("afterbegin",div)
        this.followedartists = []
        setTimeout(() => {
          this.fetchFA()
          document.getElementById("reloader").remove()
          target.className = 'refresh-end'
        },1000)

      }
      if (num === 1){
        document.getElementById('topartist').style.display = 'flex'
        document.getElementById('topartists').className = 'activetab'
        document.getElementById('topartist6').style.display = 'none'
        document.getElementById('topartists6').className = ''
        document.getElementById('topartista').style.display = 'none'
        document.getElementById('topartistsall').className = ''
        this.taactivetab = document.getElementById('topartist')
      } else if (num === 2){
        document.getElementById('topartist').style.display = 'none'
        document.getElementById('topartists').className = ''
        document.getElementById('topartist6').style.display = 'flex'
        document.getElementById('topartists6').className = 'activetab'
        document.getElementById('topartista').style.display = 'none'
        document.getElementById('topartistsall').className = ''
        this.taactivetab = document.getElementById('topartist6')
      } else if (num === 3){
        document.getElementById('topartist').style.display = 'none'
        document.getElementById('topartists').className = ''
        document.getElementById('topartist6').style.display = 'none'
        document.getElementById('topartists6').className = ''
        document.getElementById('topartista').style.display = 'flex'
        document.getElementById('topartistsall').className = 'activetab'
        this.taactivetab = document.getElementById('topartista')
      }
    },
    reloadtracks(num,event){
      let target = event.target
      // console.log(target.previousSibling)
      target.className = 'refresh-start'
      if (num === 1){
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#toptrack').insertAdjacentHTML("afterbegin",div)
        this.items = []
        setTimeout(() => {
          let event = {}
          event.target = document.querySelector('#toptracks')
          this.fetchApi(event)
          document.getElementById("reloader").remove()
          target.className = 'refresh-end'
        },1000)
      } else if (num === 2){
        this.itemsm = []
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#toptrack6').insertAdjacentHTML("afterbegin",div)
        setTimeout(() => {
          let event = {}
          event.target = document.querySelector('#toptrackssix')
          this.fetchApi2(event)
          document.getElementById("reloader").remove()
          target.className = 'refresh-end'
        },1000)
      } else if (num === 3){
        this.itemsl = []
        let div = "<div id='reloader' class='loading waitingForConnection'>Reloading<span>.</span><span>.</span><span>.</span></div>"
        document.querySelector('#toptrackall').insertAdjacentHTML("afterbegin",div)
        setTimeout(() => {
          let event = {}
          event.target = document.querySelector('#toptracksall')
          this.fetchApi3(event)
          document.getElementById("reloader").remove()
          target.className = 'refresh-end'
        },1000)
      }
      if (num === 1){
        document.getElementById('toptrack').style.display = 'flex'
        document.getElementById('toptracks').className = 'activetab'
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackssix').className = ''
        document.getElementById('toptrackall').style.display = 'none'
        document.getElementById('toptracksall').className = ''
        this.ttactivetab = document.getElementById('toptrack')
      } else if (num === 2){
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptracks').className = ''
        document.getElementById('toptrack6').style.display = 'flex'
        document.getElementById('toptrackssix').className = 'activetab'
        document.getElementById('toptrackall').style.display = 'none'
        document.getElementById('toptracksall').className = ''
        this.ttactivetab = document.getElementById('toptrack6')
      } else if (num === 3){
        document.getElementById('toptrack').style.display = 'none'
        document.getElementById('toptracks').className = ''
        document.getElementById('toptrack6').style.display = 'none'
        document.getElementById('toptrackssix').className = ''
        document.getElementById('toptrackall').style.display = 'flex'
        document.getElementById('toptracksall').className = 'activetab'
        this.ttactivetab = document.getElementById('toptrackall')
      }
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
    click: function (event){
      let target = event.target
      let audios = target.lastChild
      if (this.currentTrack !=null && this.currentTrack !==audios){
        this.currentTrack.pause()
      }
      if (audios.paused === false) {
        audios.pause()
      } else
        audios.play()
      this.currentTrack = audios
    },
    parentClick: function (event){
      let target = event.target
      let audios = target.firstChild.lastChild
      if (this.currentTrack !=null && this.currentTrack !==audios){
        this.currentTrack.pause()
      }
      if (audios.paused === false) {
        audios.pause()
      } else
        audios.play()
      this.currentTrack = audios
    },
    parentmouseLeave: function (event){
      let target = event.target
      // console.log(target)
      let audios = target.firstChild.lastChild
      // console.log(audios)
      if (audios){
        audios.pause()
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
    followPlaylist(playlist,event){
      event.target.disabled = true
      if (playlist.followed === false) {
        axios.request({
          url:'https://api.spotify.com/v1/playlists/' + playlist.id + '/followers',
          method: 'put',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then(() =>{
              playlist.followed = true
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      } else {
        axios.request({
          url:'https://api.spotify.com/v1/playlists/' + playlist.id + '/followers',
          method: 'delete',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then(() =>{
              playlist.followed = false
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      }
    },
    followArtist(artist,event){
      event.target.disabled = true
      if (artist.followed === false) {
        axios.request({
          url:'https://api.spotify.com/v1/me/following?type=artist&ids=' + artist.id,
          method: 'put',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              if (response.status === 204){
                artist.followed = true
              }
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  //  console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      } else {
        axios.request({
          url:'https://api.spotify.com/v1/me/following?type=artist&ids=' + artist.id,
          method: 'delete',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              if (response.status === 204){
                artist.followed = false
              }
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      }
    },
    followAlbum(album,event){
      // console.log(album.followed)
      event.target.disabled = true
      if (album.followed === false) {
        axios.request({
          url:'https://api.spotify.com/v1/me/albums?ids=' + album.id,
          method: 'put',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              if (response.status ===200){
                album.followed = true
              }
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      } else {
        axios.request({
          url:'https://api.spotify.com/v1/me/albums?ids=' + album.id,
          method: 'delete',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              if (response.status ===200) {
                album.followed = false
              }
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      }
    },
    followTrack(track,event){
      event.target.disabled = true
      if (track.followed === false) {
        axios.request({
          url:'https://api.spotify.com/v1/me/tracks?ids=' + track.id,
          method: 'put',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              if (response.status ===200){
                track.followed = true
              }
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      } else {
        axios.request({
          url:'https://api.spotify.com/v1/me/tracks?ids=' + track.id,
          method: 'delete',
          headers: {'Authorization': 'Bearer ' + document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}
        })
            .then((response) =>{
              if (response.status ===200){
                track.followed = false
              }
            })
            .catch(error =>{
              if (error.response.status === 401){
                axios.get('/spotify/refresh_token/' + document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")).then((response) =>{
                  // console.log(response.data)
                  let new_token = response.data['new_token']
                  document.cookie ='access_token=' + new_token
                })
              }
            })
      }
    },
    paginate(array,page_size,page_number){
      return array.slice((page_number -1) * page_size,page_number * page_size)
    }
  },
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
