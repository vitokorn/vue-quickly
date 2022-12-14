<template>
  <div v-if="d.preview_url && cover" class="con3" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div v-else-if="!d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" tabindex="0" class="con3" style="opacity: .5">{{d.name}}
    <audio preload="none"></audio>
  </div>
  <div v-else-if="d.preview_url && !cover" class="con3" v-on:mouseover="this.$store.dispatch('mouseOver',$event)" v-on:mouseleave="this.$store.dispatch('mouseLeave',$event)">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div v-else tabindex="0" class="con3" style="opacity: .5">{{d.name}}
    <audio preload="none"></audio>
  </div>
</template>

<script>
export default {
  name: "AlbumCover",
  props:['d','cover']
}
</script>

<style scoped>

</style>