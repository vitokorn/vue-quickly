<script setup>
import {ref, computed} from 'vue'
import RefreshButton from "./RefreshButton.vue";
import {useSpotifyStore} from "../stores/spotify-store.js";

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
const spotifyStore = useSpotifyStore()

const filteredPlaylists = computed(() => {
  if (!searchTerm.value) {
    return props.playlists
  }
  return props.playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const handlePlaylistSelect = (playlistId, event) => {
  emit('playlist-select', playlistId, event)
}

const handleSearch = (event) => {
  searchTerm.value = event.target.value
  emit('search', event)
}
</script>

<template>
  <div class="playlist-selector">
    <!-- Search Header -->
    <div class="p-2" style="display: flex;justify-content: center;align-items: center;">
      <input class="playlist-search py-2 me-2"
             type="text"
             v-model="searchTerm"
             @input="handleSearch"
             :placeholder="placeholder"
             :title="title">
      <RefreshButton :on-click="() => spotifyStore.fetchPlaylists(0)"/>
    </div>

    <!-- Playlist Selection -->
    <div class="playlists grid-auto-columns py-2">
      <template v-for="item of filteredPlaylists" :key="item.id">
        <div :id="item.id"
             @click="handlePlaylistSelect(item.id, $event)"
             class="hr-line-dashed flex-center p-3"
             :class="selectedPlaylist === item.id ? 'activetab' : ''">
          {{ item.name }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
