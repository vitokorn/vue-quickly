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
      <input class="inp"
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
.playlist-selector {
  width: 100%;
}

.head {
  margin-bottom: 16px;
}

.inp {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.inp:focus {
  outline: none;
  border-color: var(--active-tab);
  box-shadow: 0 0 0 3px rgba(240, 55, 165, 0.1);
}

.sp {
  margin-bottom: 24px;
}

.pl {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hr-line-dashed {
  padding: 8px 16px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.hr-line-dashed:hover {
  background: rgba(240, 55, 165, 0.1);
  border-color: var(--active-tab);
  transform: translateY(-2px);
}

.hr-line-dashed.activetab {
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.3);
}
</style>
