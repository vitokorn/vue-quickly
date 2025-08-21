<script setup>
import { ref, computed } from 'vue'

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
    <div class="head">
      <input class="inp py-3"
             type="text"
             v-model="searchTerm"
             @input="handleSearch"
             :placeholder="placeholder"
             :title="title">
    </div>

    <!-- Playlist Selection -->
    <div class="sp">
      <div class="pl justify-content-center">
        <template v-for="item of filteredPlaylists" :key="item.id">
          <div :id="item.id"
               @click="handlePlaylistSelect(item.id, $event)"
               class="hr-line-dashed"
               :class="selectedPlaylist === item.id ? 'activetab' : ''">
            {{ item.name }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
