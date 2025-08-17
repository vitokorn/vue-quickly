<template>
  <MobileLayout @search="handleSearch">
    <!-- Home Tab Content -->
    <template #home>
      <div class="home-content">
        <h2>Welcome Home</h2>
        <p>Your personalized music dashboard</p>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>Recent Tracks</h3>
            <p>Continue where you left off</p>
          </div>
          <div class="feature-card">
            <h3>Top Artists</h3>
            <p>Your favorite musicians</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Discover Tab Content -->
    <template #discover>
      <div class="discover-content">
        <h2>Discover New Music</h2>
        <p>Find your next favorite song</p>
        <div class="discovery-options">
          <button class="discovery-btn">Browse Genres</button>
          <button class="discovery-btn">New Releases</button>
          <button class="discovery-btn">Trending</button>
        </div>
      </div>
    </template>

    <!-- Library Tab Content -->
    <template #library>
      <div class="library-content">
        <h2>Your Library</h2>
        <p>All your saved music in one place</p>
        <div class="library-sections">
          <div class="library-item">
            <h3>Playlists</h3>
            <p>Your curated collections</p>
          </div>
          <div class="library-item">
            <h3>Liked Songs</h3>
            <p>All your favorite tracks</p>
          </div>
          <div class="library-item">
            <h3>Albums</h3>
            <p>Complete albums you love</p>
          </div>
        </div>
      </div>
    </template>
  </MobileLayout>
</template>

<script setup>
import MobileLayout from '../components/layout/MobileLayout.vue'

const handleSearch = (query) => {
  console.log('Search query:', query)
  // Handle search functionality here
}
</script>

<style scoped>
.home-content,
.discover-content,
.library-content {
  padding: 20px 0;
}

.home-content h2,
.discover-content h2,
.library-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-align: center;
}

.home-content p,
.discover-content p,
.library-content p {
  font-size: 16px;
  color: #a0a0a0;
  margin: 0 0 30px 0;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.feature-card p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}

.discovery-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.discovery-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.discovery-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.library-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.library-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.library-item h3 {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.library-item p {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0;
}
</style>
