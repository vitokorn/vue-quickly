<template>
  <div class="seed_tracks card2" v-bind:key="'st'+index" v-bind:id="d.id">
    <div>Recommended songs based on {{d.name}}<button class="btn" v-on:click="this.$store.dispatch('reloadST',{num:num,id:d.id,name:d.name })"><img class="refresh-end" src="@/assets/refresh-icon.png" alt=""></button></div>
    <div class="card2">
      <template v-for="(s,index) in d.tracks">
        <div v-if="s.preview_url && s.album.images[0]" class="con3" v-bind:key="index" v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeperTracks',{item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.track}); this.$store.dispatch('queuein',s)">{{s.name}}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else-if="!s.preview_url && s.album.images[0]" tabindex="0" class="con3" v-bind:key="'2'+index" v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }" style="opacity: .5" v-on:click="this.$store.dispatch('deeperTracks',{item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.track}); this.$store.dispatch('queuein',s)">{{s.name}}
          <audio preload="none"></audio>
        </div>
        <div v-else-if="s.preview_url && !s.album.images[0]" class="con3" v-bind:key="'3'+index" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeperTracks',{item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.track}); this.$store.dispatch('queuein',s)">{{s.name}}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else tabindex="0" class="con3" v-bind:key="'4'+index" style="opacity: .5" v-on:click="this.$store.dispatch('deeperTracksM',{item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.track}); this.$store.dispatch('queuein',s)">{{s.name}}
          <audio preload="none"></audio>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "seed-tracks",
  props: ['d','num']
}
</script>

<style scoped>

</style>