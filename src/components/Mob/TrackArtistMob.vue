<template>
  <div class="trackartist card2" style="gap: 16px;text-align: left" v-bind:key="'ta'+index">
    <template v-for="(ta,index) in d">
      <div v-if="ta.type==='artist'" class="recartist card2" v-bind:id="'art'+ta.id" v-bind:key="index"  style="width: 100%;gap: 16px;text-align: left">
        <div class="con3" v-if="ta.preview_url && ta.images[0]" style="text-align: left;" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" v-on:click="this.$store.dispatch('click',{event:$event})">{{ta.name}}
          <audio preload="auto" v-bind:src="ta.preview_url"></audio>
        </div>
        <div class="con3" v-else-if="!ta.preview_url && ta.images[0]" style="text-align: left; opacity: .5" v-bind:style="{ 'background-image': 'url(' + ta.images[0].url + ')' }" >{{ta.name}}
          <audio></audio>
        </div>
        <div class="con3" v-else-if="ta.preview_url && !ta.images[0]" style="text-align: left;" v-on:click="this.$store.dispatch('click',{event:$event})">{{ta.name}}
          <audio preload="auto" v-bind:src="ta.preview_url"></audio>
        </div>
        <div class="con3" v-else style="text-align: left; opacity: .5" >{{ta.name}}
          <audio></audio>
        </div>
        <div >{{ta.name}}
          <div>{{ta['followers']['total'] + ' followers'}}</div>
          <div style="display: flex">
            <template v-for="(g,index) in ta['genres']">
              <div v-if="g === ta['genres'][ta['genres'].length - 1]" v-on:click="this.$store.dispatch('thesoundofmob',{name:g,num:num,sib:'trackartist',child:false,parent:item})" style="margin-left: 4px;" v-bind:key="'2'+index">{{g}}</div>
              <div v-else-if="g === ta['genres'][ta['genres'].length - 2]" v-bind:key="'3'+index" v-on:click="this.$store.dispatch('thesoundofmob',{name:g,num:num,sib:'trackartist',child:false,parent:item})">{{g}} &</div>
              <div v-else v-bind:key="'4'+index" v-on:click="this.$store.dispatch('thesoundofmob',{name:g,num:num,sib:'trackartist',child:false,parent:item})">{{g}},</div>
            </template>
          </div>
          <div style="color: rgb(240, 55, 165);" v-on:click="this.$store.dispatch('seedArtistM',{item:ta,num:num,sib:'trackartist',parent:item})">Recommended artists songs based on this</div>
          <div><button class="button"><a class="linkresset" v-bind:href="ta['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
            Follow<input type="checkbox" v-if="ta.followed" @click.once="this.$store.dispatch('followArtist',{artist:ta,event:$event})"  checked v-model="ta.followed">
            <input type="checkbox" v-else @click.once="this.$store.dispatch('followArtist',{artist:ta,event:$event})" v-model="ta.followed">
          </div>
        </div>
      </div>
      <div v-if="ta.type==='top_tracks'" class="break" v-bind:key="index" >Top tracks</div>
      <div v-if="ta.type==='top_tracks'" v-bind:key="index" tabindex="0" class="top-tracks card2">
        <div v-for="(tt,index) in ta['tracks']" v-bind:key="index">
          <div v-if="tt.preview_url && tt.album.images[0]" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" v-on:click="this.$store.dispatch('click',{event:$event}),this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio v-bind:src="tt.preview_url"></audio>
          </div>
          <div v-else-if="!tt.preview_url && tt.album.images[0]" class="con3" v-bind:style="{ 'background-image': 'url(' + tt.album.images[0].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio></audio>
          </div>
          <div v-else-if="tt.preview_url && !tt.album.images[0]" class="con3" v-on:click="this.$store.dispatch('click',{event:$event}),this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio v-bind:src="tt.preview_url"></audio>
          </div>
          <div v-else class="con3" style="opacity: .5" v-on:click="this.$store.dispatch('deeperTracksM',{item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id,parent:item}); this.$store.dispatch('queuein',tt)">{{tt.name}}
            <audio></audio>
          </div>
        </div>
      </div>
      <div v-if="ta.type==='albums' && ta.length > 0" class="break" v-bind:key="index" >Albums</div>
      <div v-if="ta.type==='single' && ta.length > 0" class="break" v-bind:key="index" >Single</div>
      <div v-if="ta.type==='appears_on' && ta.length > 0" class="break" v-bind:key="index" >Appears on</div>
      <div v-if="ta.type==='albums' && ta.length > 0 || ta.type==='single' && ta.length > 0 || ta.type==='appears_on' && ta.length > 0" v-bind:key="index" tabindex="0" class="card2">
        <div v-for="(a,index) in ta" v-bind:key="index">
          <div v-if="a.preview_url && a.images[0]" class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item}),this.$store.dispatch('click',{event:$event})" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }">{{a.name}}
            <audio preload="auto" v-bind:src="a.preview_url"></audio>
          </div>
          <div v-else-if="!a.preview_url && a.images[0]" class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item})" v-bind:style="{ 'background-image': 'url(' + a.images[0].url + ')' }" style="opacity: .5">{{a.name}}
            <audio></audio>
          </div>
          <div v-else-if="a.preview_url && !a.images[0]" class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item}),this.$store.dispatch('click',{event:$event})">{{a.name}}
            <audio preload="auto" v-bind:src="a.preview_url"></audio>
          </div>
          <div v-else class="con3" v-on:click="this.$store.dispatch('deeperAlbumMob',{item:a,num:num,child:'art' + d[0].id,search:false,parent:item})" style="opacity: .5">{{a.name}}
            <audio></audio>
          </div>
        </div>
      </div>
      <div v-if="ta.type==='related-artists' && ta.length > 0" class="break" v-bind:key="index" >Related Artist</div>
      <div v-if="ta.type==='related-artists' && ta.length > 0"  v-bind:key="index" class="card2">
        <div v-for="(r,index) in ta" v-bind:key="index">
          <div v-if="r.preview_url && r.images[0]" tabindex="0" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="background-repeat: no-repeat; background-size: cover;" v-on:click="this.$store.dispatch('click',{event:$event}),this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio preload="auto" v-bind:src="r.preview_url"></audio>
          </div>
          <div v-else-if="!r.preview_url && r.images[0]" class="img-xs" v-bind:style="{ 'background-image': 'url(' + r.images[0].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio></audio>
          </div>
          <div v-else-if="r.preview_url && !r.images[0]" tabindex="0" class="img-xs" v-on:click="this.$store.dispatch('click',{event:$event}),this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio preload="auto" v-bind:src="r.preview_url"></audio>
          </div>
          <div v-else class="img-xs" style="opacity: .5" v-on:click="this.$store.dispatch('deeperartist',{item:r,track:ta[index],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <audio></audio>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "track-artist",
  props: ['d','num','item']
}
</script>

<style scoped>

</style>