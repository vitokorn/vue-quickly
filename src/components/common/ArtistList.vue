<script setup>
import { artistUtils } from '../../utils/artistUtils'

const props = defineProps({
  artists: {
    type: Array,
    required: true
  },
  selectedItem: {
    type: String,
    default: null
  },
  onArtistClick: {
    type: Function,
    required: true
  },
  onArtistHover: {
    type: Function,
    default: null
  },
  onArtistLeave: {
    type: Function,
    default: null
  },
  onGenreClick: {
    type: Function,
    default: null
  },
  onSeedArtist: {
    type: Function,
    default: null
  },
  onFollowArtist: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['artist-click', 'artist-hover', 'artist-leave', 'genre-click', 'seed-artist', 'follow-artist'])

const handleArtistClick = (artist, event) => {
  if (props.onArtistClick) {
    props.onArtistClick(artist, event)
  }
  emit('artist-click', artist, event)
}

const handleArtistHover = (event) => {
  if (props.onArtistHover) {
    props.onArtistHover(event)
  }
  emit('artist-hover', event)
}

const handleArtistLeave = (event) => {
  if (props.onArtistLeave) {
    props.onArtistLeave(event)
  }
  emit('artist-leave', event)
}

const handleGenreClick = (genre, event) => {
  if (props.onGenreClick) {
    props.onGenreClick(genre, event)
  }
  emit('genre-click', genre, event)
}

const handleSeedArtist = (artist, event) => {
  if (props.onSeedArtist) {
    props.onSeedArtist(artist, event)
  }
  emit('seed-artist', artist, event)
}

const handleFollowArtist = (artist, event) => {
  if (props.onFollowArtist) {
    props.onFollowArtist(artist, event)
  }
  emit('follow-artist', artist, event)
}

const hasPreview = (artist) => {
  return artistUtils.hasPreview(artist)
}

const hasImage = (artist) => {
  return artistUtils.hasImage(artist)
}

const getArtistImage = (artist) => {
  return artist.images?.[0]?.url
}
</script>

<template>
  <div class="artist-list">
    <template v-for="(artist, index) in artists" :key="artist.id || index">
      <div 
        class="recartist card2 text-left artist-item"
        :id="`art${artist.id}`"
        style="width: 100%; gap: 16px;"
      >
        <!-- Artist image with preview -->
        <div 
          v-if="hasPreview(artist) && hasImage(artist)"
          class="con3 text-left artist-image"
          :style="{ backgroundImage: `url(${getArtistImage(artist)})` }"
          @mouseover="handleArtistHover"
          @mouseleave="handleArtistLeave"
        >
          {{ artist.name }}
          <audio preload="auto" :src="artist.preview_url"></audio>
        </div>

        <!-- Artist image without preview -->
        <div 
          v-else-if="!hasPreview(artist) && hasImage(artist)"
          class="con3 text-left artist-image half-opacity"
          :style="{ backgroundImage: `url(${getArtistImage(artist)})` }"
        >
          {{ artist.name }}
          <audio></audio>
        </div>

        <!-- Artist without image but with preview -->
        <div 
          v-else-if="hasPreview(artist) && !hasImage(artist)"
          class="con3 text-left artist-image"
          @mouseover="handleArtistHover"
          @mouseleave="handleArtistLeave"
        >
          {{ artist.name }}
          <audio preload="auto" :src="artist.preview_url"></audio>
        </div>

        <!-- Artist without image and preview -->
        <div 
          v-else
          class="con3 text-left artist-image half-opacity"
        >
          {{ artist.name }}
          <audio></audio>
        </div>

        <!-- Artist details -->
        <div class="artist-details">
          <div class="artist-name">{{ artist.name }}</div>
          <div class="artist-followers">{{ artist.followers?.total || 0 }} followers</div>
          
          <!-- Genres -->
          <div class="artist-genres display-flex">
            <template v-for="(genre, genreIndex) in artist.genres" :key="`genre-${genreIndex}`">
              <div 
                v-if="artist.genres.length > 1 && artist.genres.length - 1 === genreIndex" 
                class="me-2"
              >
                &
              </div>
              <div 
                v-if="artist.genres.length >= 2 && artist.genres.length - 1 !== genreIndex && genreIndex !== 0" 
                class="me-2"
              >
                ,
              </div>
              <div
                class="me-2 genre-tag"
                @click="handleGenreClick(genre, $event)"
              >
                {{ genre }}
              </div>
            </template>
          </div>

          <!-- Seed artist button -->
          <div 
            class="light-washed-rose seed-artist-btn"
            @click="handleSeedArtist(artist, $event)"
          >
            Recommended artists songs based on this
          </div>

          <!-- Actions -->
          <div class="artist-actions">
            <button class="button">
              <a 
                class="linkresset" 
                :href="artist.external_urls?.spotify" 
                target="_blank"
              >
                Open in Spotify
              </a>
            </button>
            
            <div class="follow-section">
              <span>Follow</span>
              <input 
                type="checkbox" 
                :checked="artist.followed"
                @click.once="handleFollowArtist(artist, $event)"
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.artist-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.artist-item {
  display: flex;
  align-items: flex-start;
}

.artist-image {
  cursor: pointer;
  transition: all 0.2s ease;
}

.artist-image:hover {
  transform: scale(1.02);
}

.artist-details {
  flex: 1;
}

.artist-name {
  font-weight: bold;
  margin-bottom: 8px;
}

.artist-followers {
  color: var(--pl-color);
  margin-bottom: 8px;
}

.artist-genres {
  margin-bottom: 8px;
}

.genre-tag {
  cursor: pointer;
  color: var(--link-color);
  text-decoration: underline;
}

.genre-tag:hover {
  opacity: 0.8;
}

.seed-artist-btn {
  cursor: pointer;
  margin-bottom: 8px;
}

.seed-artist-btn:hover {
  opacity: 0.8;
}

.artist-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.follow-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.half-opacity {
  opacity: 0.7;
}
</style>

