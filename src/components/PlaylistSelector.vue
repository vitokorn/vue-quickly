<script setup>
import {ref, computed} from 'vue'
import RefreshButton from "./RefreshButton.vue";
import {useMusicStore} from "../stores/music-store.js";
import {storeToRefs} from "pinia";

const props = defineProps({
  playlists: {
    type: Array,
    default: () => []
  },
  selectedPlaylist: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Please enter a search term..'
  },
  title: {
    type: String,
    default: 'Type in a name'
  }
})

const emit = defineEmits(['playlist-select', 'search'])

const searchTerm = ref('')
const musicStore = useMusicStore()
const { currentServiceType } = storeToRefs(musicStore)

const filteredPlaylists = computed(() => {
  if (!searchTerm.value) {
    return props.playlists
  }
  return props.playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const handlePlaylistSelect = (playlist, event) => {
  emit('playlist-select', playlist, event)
}

const handleSearch = (event) => {
  searchTerm.value = event.target.value
  emit('search', event)
}
</script>

<template>
  <div class="playlist-selector">
    <!-- Search Header -->
    <h3 v-if="title === 'Genres Playlists'">{{currentServiceType === 'spotify' ? '[by everynoise.com]' : ''}}</h3>
    <div class="p-2 flex-between-center">
      <div class="grid-2-1">
        <h4>{{title}}</h4>
        <div class="ps-2">
          <RefreshButton :on-click="() => musicStore.fetchPlaylists(0)"/>
        </div>
      </div>
      <input class="playlist-search py-2 me-2"
             type="text"
             v-model="searchTerm"
             @input="handleSearch"
             :placeholder="placeholder"
             :title="title">
    </div>

    <!-- Playlist Selection -->
    <div class="playlists grid-auto-columns py-2 my-2">
      <template v-for="item of filteredPlaylists" :key="item.id">
        <div :id="item.id"
             @click="handlePlaylistSelect(item, $event)"
             class="hr-line-dashed flex-center p-3"
             :class="selectedPlaylist === item.id ? 'active_tab' : ''">
          {{ item.name }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
