<template>
  <div v-if="track.preview_url && d.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeperTracks2',{item:track,d:d,num:num,sib:'deep_albums'}); this.$store.dispatch('queuein',track)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }">
    <audio preload="auto" v-bind:src="track.preview_url"></audio>
  </div>
  <div v-else-if="!track.preview_url && d.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="this.$store.dispatch('deeperTracks2',{item:track,d:d,num:num,sib:'deep_albums'}); this.$store.dispatch('queuein',track)" v-bind:style="{ 'background-image': 'url(' + d.images[0].url + ')' }" style="opacity: .5">
    <audio preload="none"></audio>
  </div>
  <div v-else-if="track.preview_url && !d.images[0]" tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)" v-on:click="this.$store.dispatch('deeperTracks2',{item:track,d:d,num:num,sib:'deep_albums'}); this.$store.dispatch('queuein',track)">
    <audio preload="auto" v-bind:src="track.preview_url"></audio>
  </div>
  <div v-else tabindex="0" class="itemImg itemImg-xs  itemImg-search" v-on:click="this.$store.dispatch('deeperTracks2',{item:track,d:d,num:num,sib:'deep_albums'}); this.$store.dispatch('queuein',track)" style="opacity: .5">
    <audio preload="none"></audio>
  </div>
  <div class="title" v-on:click="this.$store.dispatch('deeperTracks2',{item:track,d:d,num:num,sib:'deep_albums'}); this.$store.dispatch('queuein',track)"  ><div>{{track.name}}</div></div>

</template>

<script>
export default {
  name: "AlbumTrackList",
  props:['d','track','num']
}
</script>

<style scoped>

</style>