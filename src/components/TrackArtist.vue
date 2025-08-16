<script setup>
import {useDMStore} from "../stores/dm-store";
import {ref, computed} from "vue";
import {useMediaDisplay} from "../composables/useMediaDisplay";

const props = defineProps(['d', 'num'])
const store = useDMStore()
const selected = ref()

// Helper function to get media display for any item
function getMediaDisplay(item) {
  return useMediaDisplay(computed(() => item))
}

function setActive(id) {
  selected.value = id
}
</script>

<template>
  <div class="modern-track-artist">
    <template v-for="(ta, index) in d" :key="index">
      <!-- Artist Section -->
      <div v-if="ta.type==='artist'" class="artist-section" :id="'art'+ta.id">
        <div class="artist-header">
          <!-- Artist Cover -->
          <div :class="['artist-cover', getMediaDisplay(ta).displayClass.value]"
               :style="getMediaDisplay(ta).backgroundStyle.value"
               @mouseover="getMediaDisplay(ta).hasPreview.value && store.mouseOver($event)"
               @mouseleave="getMediaDisplay(ta).hasPreview.value && store.mouseLeave($event)">
            <div class="cover-overlay">
              <div class="artist-name">{{ ta.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(ta).audioPreload.value" :src="getMediaDisplay(ta).audioSrc.value"></audio>
          </div>

          <!-- Artist Info -->
          <div class="artist-info">
            <h2 class="artist-title">{{ ta.name }}</h2>
            <div class="artist-stats">
              <span class="followers-count">{{ ta['followers']['total'].toLocaleString() }} followers</span>
            </div>

            <!-- Genres -->
            <div class="genres-section">
              <div class="genres-list">
                <template v-for="(g, gIndex) in ta['genres']" :key="'genre-'+gIndex">
                  <span v-if="ta['genres'].length > 1 && ta['genres'].length - 1 === gIndex" class="separator">&</span>
                  <span v-if="ta['genres'].length >= 2 && ta['genres'].length - 1 !== gIndex && gIndex !== 0" class="separator">,</span>
                  <button class="genre-tag"
                          @click="store.thesoundof({name:g,num:num,sib:'trackartist',child:false})">
                    {{ g }}
                  </button>
                </template>
              </div>
            </div>

            <!-- Actions -->
            <div class="artist-actions">
              <button class="recommend-btn"
                      @click="store.seedArtist({item:ta,num:num,sib:'trackartist'})">
                <span class="btn-icon">🎵</span>
                Recommended artists songs based on this
              </button>

              <a class="spotify-link"
                 :href="ta['external_urls']['spotify']"
                 target="_blank"
                 rel="noopener">
                <span class="link-icon">🎧</span>
                Open in Spotify
              </a>

              <div class="follow-section">
                <span class="follow-label">Follow</span>
                <label class="follow-checkbox">
                  <input type="checkbox"
                         v-if="ta.followed"
                         @click.once="store.followArtist({artist:ta,event:$event})"
                         checked
                         v-model="ta.followed">
                  <input type="checkbox"
                         v-else
                         @click.once="store.followArtist({artist:ta,event:$event})"
                         v-model="ta.followed">
                  <span class="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Tracks Section -->
      <div v-if="ta.type==='top_tracks'" class="section-header">
        <h3 class="section-title">Top tracks</h3>
      </div>

      <div v-if="ta.type==='top_tracks'" class="tracks-grid">
        <div v-for="(tt, ttIndex) in ta['tracks']" :key="ttIndex">
          <div :class="['track-card', getMediaDisplay(tt).displayClass.value, selected === tt.id ? 'selected' : '']"
               :style="getMediaDisplay(tt).backgroundStyle.value"
               @mouseover="getMediaDisplay(tt).hasPreview.value && store.mouseOver($event)"
               @mouseleave="getMediaDisplay(tt).hasPreview.value && store.mouseLeave($event)"
               @click="setActive(tt.id);store.deeperTracks({item:tt,num:num,flag:false,sib:'trackartist',child:'art' + d[0].id}); store.queuein(tt)">
            <div class="track-overlay">
              <div class="track-name">{{ tt.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(tt).audioPreload.value" :src="getMediaDisplay(tt).audioSrc.value"></audio>
          </div>
        </div>
      </div>

      <!-- Albums Section -->
      <div v-if="ta.type==='albums' && ta.length > 0" class="section-header">
        <h3 class="section-title">Albums</h3>
      </div>

      <div v-if="ta.type==='single' && ta.length > 0" class="section-header">
        <h3 class="section-title">Single</h3>
      </div>

      <div v-if="ta.type==='appears_on' && ta.length > 0" class="section-header">
        <h3 class="section-title">Appears on</h3>
      </div>

      <div v-if="ta.type==='albums' && ta.length > 0 || ta.type==='single' && ta.length > 0 || ta.type==='appears_on' && ta.length > 0"
           class="albums-grid">
        <div v-for="(a, aIndex) in ta" :key="aIndex">
          <div :class="['album-card', getMediaDisplay(a).displayClass.value, selected === a.id ? 'selected' : '']"
               :style="getMediaDisplay(a).backgroundStyle.value"
               @click="setActive(a.id);store.deeperAlbum({item:a,num:num,child:'art' + d[0].id,search:false})"
               @mouseover="getMediaDisplay(a).hasPreview.value && store.mouseOver($event)"
               @mouseleave="getMediaDisplay(a).hasPreview.value && store.mouseLeave($event)">
            <div class="album-overlay">
              <div class="album-name">{{ a.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(a).audioPreload.value" :src="getMediaDisplay(a).audioSrc.value"></audio>
          </div>
        </div>
      </div>

      <!-- Related Artists Section -->
      <div v-if="ta.type==='related-artists' && ta.length > 0" class="section-header">
        <h3 class="section-title">Related Artists</h3>
      </div>

      <div v-if="ta.type==='related-artists' && ta.length > 0" class="related-artists-grid">
        <div v-for="(r, rIndex) in ta" :key="rIndex">
          <div :class="['related-artist-card', getMediaDisplay(r).displayClass.value, selected === r.id ? 'selected' : '']"
               :style="getMediaDisplay(r).backgroundStyle.value"
               @mouseover="getMediaDisplay(r).hasPreview.value && store.mouseOver($event)"
               @mouseleave="getMediaDisplay(r).hasPreview.value && store.mouseLeave($event)"
               @click="setActive(r.id);store.deeperartist({item:r,track:ta[rIndex],num:num,flag:false,sib:'trackartist',related:'art' + d[0].id})">
            <div class="artist-overlay">
              <div class="artist-name">{{ r.name }}</div>
            </div>
            <audio :preload="getMediaDisplay(r).audioPreload.value" :src="getMediaDisplay(r).audioSrc.value"></audio>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.modern-track-artist {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.artist-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.artist-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.artist-header {
  display: flex;
  gap: 24px;
  padding: 24px;
}

.artist-cover {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.artist-cover:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.artist-cover.unplayable {
  opacity: 0.6;
}

.artist-cover.no-image {
  background: linear-gradient(135deg, rgba(240, 55, 165, 0.1), rgba(233, 30, 99, 0.1));
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
}

.artist-name {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}

.artist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.artist-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--title-color);
  margin: 0;
  line-height: 1.2;
}

.artist-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.followers-count {
  font-size: 16px;
  color: var(--search-color);
  opacity: 0.8;
  font-weight: 500;
}

.genres-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.genres-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.separator {
  font-size: 14px;
  color: var(--search-color);
  opacity: 0.6;
}

.genre-tag {
  background: rgba(240, 55, 165, 0.1);
  border: 1px solid rgba(240, 55, 165, 0.2);
  border-radius: 20px;
  padding: 6px 12px;
  color: var(--active-tab);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.genre-tag:hover {
  background: rgba(240, 55, 165, 0.2);
  transform: translateY(-1px);
}

.artist-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.recommend-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--active-tab), #e91e63);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(240, 55, 165, 0.3);
}

.recommend-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(240, 55, 165, 0.4);
}

.btn-icon {
  font-size: 16px;
}

.spotify-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(29, 185, 84, 0.3);
}

.spotify-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
}

.link-icon {
  font-size: 16px;
}

.follow-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.follow-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--title-color);
}

.follow-checkbox {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.follow-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkmark {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.follow-checkbox input[type="checkbox"]:checked + .checkmark {
  background: var(--active-tab);
  border-color: var(--active-tab);
}

.follow-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.section-header {
  padding: 0 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--title-color);
  margin: 0;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.tracks-grid,
.albums-grid,
.related-artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0px;
  padding: 0 24px;
}

.track-card,
.album-card,
.related-artist-card {
  position: relative;
  height: 120px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 120px;
}

.track-card:hover,
.album-card:hover,
.related-artist-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.track-card.selected,
.album-card.selected,
.related-artist-card.selected {
  border: 3px solid var(--active-tab);
  box-shadow: 0 0 20px rgba(240, 55, 165, 0.4);
}

.track-card.unplayable,
.album-card.unplayable,
.related-artist-card.unplayable {
  opacity: 0.6;
}

.track-card.no-image,
.album-card.no-image,
.related-artist-card.no-image {
  background: linear-gradient(135deg, rgba(240, 55, 165, 0.1), rgba(233, 30, 99, 0.1));
}

.track-overlay,
.album-overlay,
.artist-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 16px;
  color: white;
}

.track-name,
.album-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .artist-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .artist-cover {
    width: 160px;
    height: 160px;
    align-self: center;
  }

  .artist-title {
    font-size: 24px;
  }

  .artist-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .recommend-btn,
  .spotify-link {
    width: 100%;
    justify-content: center;
  }

  .tracks-grid,
  .albums-grid,
  .related-artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0px;
    padding: 0 20px;
  }

  .track-card,
  .album-card,
  .related-artist-card {
    height: 100px;
  }
}

@media (max-width: 480px) {
  .modern-track-artist {
    gap: 12px;
  }

  .artist-header {
    padding: 16px;
  }

  .artist-cover {
    width: 120px;
    height: 120px;
  }

  .artist-title {
    font-size: 20px;
  }

  .tracks-grid,
  .albums-grid,
  .related-artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0px;
    padding: 0 16px;
  }

  .track-card,
  .album-card,
  .related-artist-card {
    height: 80px;
  }

  .track-overlay,
  .album-overlay,
  .artist-overlay {
    padding: 12px;
  }

  .track-name,
  .album-name {
    font-size: 12px;
  }
}

/* Dark mode support */
:root.dark .artist-section {
  background: rgba(42, 46, 47, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .section-title {
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .checkmark {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

:root.dark .genre-tag {
  background: rgba(240, 55, 165, 0.2);
  border-color: rgba(240, 55, 165, 0.3);
}

:root.dark .track-card.no-image,
:root.dark .album-card.no-image,
:root.dark .related-artist-card.no-image {
  background: linear-gradient(135deg, rgba(240, 55, 165, 0.2), rgba(233, 30, 99, 0.2));
}
</style>
