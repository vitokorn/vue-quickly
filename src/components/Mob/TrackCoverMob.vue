<template>
  <div class="con3" v-if="d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:click="this.$store.dispatch('click',{event:$event})">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div class="con3" v-else-if="!d.preview_url && cover" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" style="opacity: .5">{{d.name}}
  </div>
  <div class="con3" v-else-if="d.preview_url && !cover" v-on:click="this.$store.dispatch('click',{event:$event})">{{d.name}}
    <audio preload="auto" v-bind:src="d.preview_url"></audio>
  </div>
  <div class="con3" v-else style="opacity: .5">{{d.name}}
  </div>
</template>

<script>
export default {
  name: "TrackCover",
  props:['d','cover']
}
</script>

<style scoped>

</style>