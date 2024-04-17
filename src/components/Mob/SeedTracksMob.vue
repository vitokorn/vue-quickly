<script setup>
import {useDMStore} from "../../stores/dm-store";
import {Lists} from "../../common/lists";

const props = defineProps(['d', 'num', 'item'])
const store = useDMStore()
</script>
<template>
  <div class="seed_tracks card2" v-bind:id="d.id">
    <div>Recommended songs based on {{ d.name }}
      <button class="btn" v-on:click="store.reloadST({num:num,id:d.id,name:d.name })"><img class="refresh-end"
                                                                                           src="../../assets/refresh-icon.png"
                                                                                           alt=""></button>
      <div @click="store.backToTop(d.parentId)">Back to top</div>
    </div>
    <div class="card2">
      <template v-for="(s,index) in d.tracks">
        <div v-if="s.preview_url && s.album.images[0]" class="con3" v-bind:key="index"
             v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }"
             v-on:click="store.click($event);store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else-if="!s.preview_url && s.album.images[0] && store.unplayable_tracks" tabindex="0" class="con3 half-opacity" v-bind:key="'2'+index"
             v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }"
             v-on:click="store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="none"></audio>
        </div>
        <div v-else-if="s.preview_url && !s.album.images[0]" class="con3" v-bind:key="'3'+index"
             v-on:click="store.click($event);store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity" v-bind:key="'4'+index"
             v-on:click="store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="none"></audio>
        </div>
      </template>
    </div>
  </div>
</template>


<style scoped>

</style>