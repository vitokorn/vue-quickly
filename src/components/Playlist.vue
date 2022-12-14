<template>
  <div v-if="d.type==='pl'" v-bind:key="index" v-bind:id="'d'+d.id" class="card2 plls" style="display: flex; margin-top: 12px; margin-bottom: 6px;">
    <div class="con3" v-if="d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)">{{d.name}}
      <audio preload="auto" v-bind:src="d.preview_url"></audio>
    </div>
    <div class="con3" v-else-if="!d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" style="opacity: .5">{{d.name}}
      <audio preload="none"></audio>
    </div>
    <div class="con3" v-else-if="d.preview_url && !cover" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)">{{d.name}}
      <audio preload="auto" v-bind:src="d.preview_url"></audio>
    </div>
    <div class="con3" v-else style="opacity: .5">{{d.name}}
      <audio preload="none"></audio>
    </div>
    <div style="width: 50%;text-align: left;margin-left: 10px;">
      <div>{{d.name}}</div>
      <div style="display: flex; align-items: center;"><p>By </p>
        <div v-for="(art,index) in d.artists" v-bind:key="index" style="display: flex;align-items: center">
          <div style="margin-left: 4px; margin-right: 4px; cursor: pointer;" v-on:click="this.$store.dispatch('deeperartist',{item:art,track:d,num:num,flag:false,sib:'plls'})">{{art.name}}</div>
        </div>
      </div>
      <span style="color: rgb(240, 55, 165);" v-if="num !== 7" v-on:click="this.$store.dispatch('seedTracks',{item:d,num:num,sib:'pl',child:'d'+ d.id})">Recommended songs based on this</span>
      <div><button class="button"><a class="linkresset" v-bind:href="d['external_urls']['spotify']" target="_blank">Open in Spotify</a></button>
<!--        Save<input type="checkbox" v-if="d.followed" @click.once="followTrack(d,$event)"  checked v-model="d.followed">-->
<!--        <input type="checkbox" v-else @click.once="followTrack(d,$event)" v-model="d.followed">-->
      </div>
    </div>
    <template v-for="(art,index) in d.artists">
      <div class="artist-cirle con3" v-if="d.preview_url && cover" v-bind:key="index" v-on:click="this.$store.dispatch('deeperartist',{item:art,track:d,num:num,flag:false,sib:'plls'})" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }">
        <audio preload="auto" v-bind:src="d.preview_url"></audio>
        <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
      <div class="artist-cirle con3" v-else-if="!d.preview_url && cover" v-bind:key="'2'+index" v-on:click="this.$store.dispatch('deeperartist',{item:art,track:d,num:num,flag:false,sib:'plls'})" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" style="opacity: .5">
        <audio preload="none"></audio>
        <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
      <div class="artist-cirle con3" v-else-if="d.preview_url && !cover" v-bind:key="'3'+index" v-on:click="this.$store.dispatch('deeperartist',{item:art,track:d,num:num,flag:false,sib:'plls'})">
        <audio preload="auto" v-bind:src="d.preview_url"></audio>
        <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
      <div class="artist-cirle con3" v-else v-bind:key="'4'+index" v-on:click="this.$store.dispatch('deeperartist',{item:art,track:d,num:num,flag:false,sib:'plls'})" style="opacity: .5">
        <audio preload="none"></audio>
        <div style="float: left; position: absolute; font-size: 0.7em;">{{art.name}}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props:['d','index','num','cover'],
  // eslint-disable-next-line vue/multi-word-component-names
  name: "playlist"
}
</script>

<style scoped>

</style>