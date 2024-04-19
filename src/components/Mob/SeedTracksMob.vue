<script setup>
import {useDMStore} from "../../stores/dm-store";
import {Lists} from "../../common/lists";
import {computed, ref} from "vue";
import SortTracks from "../SortTracks.vue";

const props = defineProps(['d', 'num', 'item'])
const store = useDMStore()
const selected = ref()
const selectedSTSortOption = ref("")

const sortedSTItems = computed(() => {
  const itemsCopy = [...props.d.tracks];
  switch (selectedSTSortOption.value) {
    case 'track':
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'album':
      return itemsCopy.sort((a, b) => a.album.name.localeCompare(b.album.name));
    case 'artist':
      return itemsCopy.sort((a, b) => a.artists[0].name.localeCompare(b.artists[0].name));
    case 'popularity':
      return itemsCopy.sort((a, b) => a.popularity > b.popularity);
    case 'release_date':
      return itemsCopy.sort((a, b) => a.album.release_date.localeCompare(b.album.release_date));
    case 'duration':
      return itemsCopy.sort((a, b) => a.duration_ms > b.duration_ms);
    default:
      return itemsCopy; // Default (unsorted) state
  }
})

function setActive(id) {
  selected.value = id
}
</script>
<template>
  <div class="seed_tracks card2" v-bind:id="d.id">
    <div>Recommended songs based on {{ d.name }}
      <button class="btn" v-on:click="store.reloadST({num:num,id:d.id,name:d.name })"><img class="refresh-end"
                                                                                           src="../../assets/refresh-icon.png"
                                                                                           alt=""></button>
      <div @click="store.backToTop(d.parentId)">Back to top</div>
      <sort-tracks v-model="selectedSTSortOption"/>
    </div>
    <div class="card2">
      <template v-for="(s,index) in sortedSTItems">
        <div v-if="s.preview_url && s.album.images[0]" class="con3" v-bind:key="index"
             v-bind:style="{ 'background-image': 'url(' + s.album.images[0].url + ')' }"
             v-on:click="setActive(s.id);store.click($event);store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else-if="!s.preview_url && s.album.images[0] && store.unplayable_tracks" tabindex="0" class="con3 half-opacity" v-bind:key="'2'+index"
             v-bind:style="{ 'background-image': 'url(' + s.album.images[1].url + ')' }"
             v-on:click="setActive(s.id);store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="none"></audio>
        </div>
        <div v-else-if="s.preview_url && !s.album.images[0]" class="con3" v-bind:key="'3'+index"
             v-on:click="setActive(s.id);store.click($event);store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',child:false,parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="auto" v-bind:src="s.preview_url"></audio>
        </div>
        <div v-else-if="store.unplayable_tracks" tabindex="0" class="con3 half-opacity" v-bind:key="'4'+index"
             v-on:click="setActive(s.id);store.deeperTracksM({item:s,num:num,flag:false,sib:'seed_tracks',parent:d.id}); store.queuein(s)">
          {{Lists.Ls(d.artists)}} - {{ s.name }}
          <audio preload="none"></audio>
        </div>
      </template>
    </div>
  </div>
</template>


<style scoped>

</style>