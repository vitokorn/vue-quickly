<template>
  <div class="item-container">
    <div v-if="preview_url && cover" tabindex="0" class="con3" v-on:click.self="func,this.$store.dispatch('specialClick',$event)" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" ><template v-if="artists">{{lists(artists)}} - {{name}}</template><template v-else>{{name}}</template></div>
    <div v-else-if="cover && !preview_url" tabindex="0" class="con3" v-bind:style="{ 'background-image': 'url(' + cover.url + ')' }" v-on:click.self="func" style="opacity: .5"><template v-if="artists">{{lists(artists)}} - {{name}}</template><template v-else>{{name}}</template></div>
    <div v-else-if="!cover && preview_url" class="con3" v-on:click.self="func,this.$store.dispatch('specialClick',$event)"><template v-if="artists">{{lists(artists)}} - {{name}}</template><template v-else>{{name}}</template></div>
    <div v-else class="con3" v-on:click.self="func" style="opacity: .5"><template v-if="artists">{{lists(artists)}} - {{name}}</template><template v-else>{{name}}</template></div>
    <rec-track-m :num:="num" :item="item"></rec-track-m>
    <audio v-if="preview_url" preload="none" v-bind:src="preview_url"></audio>
  </div>
</template>

<script>
import {Lists} from "@/common/lists";
import RecTrackM from "./RecTrackM";
export default {
  name: "ItemContainer",
  components: {RecTrackM},
  props:['pl','func','num','preview_url','cover','artists','name','item'],
  methods:{
    lists(artists){
      console.log(artists)
      return Lists.Ls(artists)
    }
  }
}
</script>

<style scoped>

</style>