<template>
  <div 
    class="modern-card"
    :class="{ 
      'selected': selected,
      'playable': playable,
      'half-opacity': halfOpacity 
    }"
    :style="{ 
      'background-image': backgroundImage ? `url(${backgroundImage})` : 'none'
    }"
    @click="$emit('click', $event)"
    @mouseover="$emit('mouseover', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    tabindex="0"
  >
    <div class="card-overlay">
      <div class="card-content">
        <slot></slot>
      </div>
      <div class="card-actions" v-if="showActions">
        <button class="action-btn play-btn" @click.stop="$emit('play')">
          ▶️
        </button>
        <button class="action-btn queue-btn" @click.stop="$emit('queue')">
          ➕
        </button>
      </div>
    </div>
    <audio v-if="audioSrc" preload="auto" :src="audioSrc"></audio>
  </div>
</template>

<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false
  },
  playable: {
    type: Boolean,
    default: true
  },
  halfOpacity: {
    type: Boolean,
    default: false
  },
  backgroundImage: {
    type: String,
    default: null
  },
  audioSrc: {
    type: String,
    default: null
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click', 'mouseover', 'mouseleave', 'play', 'queue'])
</script>

<style scoped>
.modern-card {
  width: 128px;
  height: 128px;
  border-radius: 16px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-card:hover::before {
  opacity: 1;
}

.modern-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.modern-card.selected {
  border: 3px solid var(--active-tab);
  box-shadow: 0 0 25px rgba(240, 55, 165, 0.5);
}

.modern-card.half-opacity {
  opacity: 0.6;
}

.card-overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
}

.card-content {
  color: white;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.card-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.modern-card:hover .card-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.play-btn:hover {
  background: var(--active-tab);
  color: white;
}

.queue-btn:hover {
  background: #4caf50;
  color: white;
}

/* Focus styles for accessibility */
.modern-card:focus {
  outline: 2px solid var(--active-tab);
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-card {
    width: 100px;
    height: 100px;
    border-radius: 12px;
  }
  
  .card-content {
    font-size: 11px;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .modern-card {
    width: 80px;
    height: 80px;
    border-radius: 10px;
  }
  
  .card-content {
    font-size: 10px;
    -webkit-line-clamp: 3;
  }
  
  .action-btn {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
}
</style>
