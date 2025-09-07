<template>
  <div v-if="isVisible" class="welcome-modal-overlay" @click="handleOverlayClick">
    <div class="welcome-modal" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h1 class="modal-title">Welcome back!</h1>
        <p class="modal-subtitle">Just a reminder... this website plays (lots of) music.</p>
      </div>

      <!-- Interactive Instructions -->
      <div class="interactive-instructions">
        <div class="instruction-column">
          <div class="instruction-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 12L3 21V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="instruction-text">
            <span class="instruction-label">Hover</span>
            <span class="instruction-description">to listen</span>
          </div>
        </div>

        <div class="instruction-column">
          <div class="instruction-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="instruction-text">
            <span class="instruction-label">Click</span>
            <span class="instruction-description">to dig deeper</span>
          </div>
        </div>

        <div class="instruction-column">
          <div class="instruction-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="instruction-text">
            <span class="instruction-label">Save</span>
            <span class="instruction-description">to build your collection</span>
          </div>
        </div>
      </div>

      <!-- Introductory Text -->
      <div class="intro-text">
        <p class="intro-paragraph">
          Start with <strong>something you know</strong>, like your top tracks or favorite playlist.
          Or a <strong>Spotify recommendation</strong>, like Discover Weekly or Release Radar.
          Or a <strong>completely random</strong> genre or artist... whatever strikes your fancy.
        </p>
        <p class="intro-paragraph highlight">
          Then follow your ears to find new music you love.
        </p>
      </div>

      <!-- Call to Action Button -->
      <div class="cta-section">
        <button class="cta-button" @click="handleJumpIn">
          JUMP IN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleJumpIn = () => {
  emit('close')
}

const handleOverlayClick = () => {
  emit('close')
}
</script>

<style scoped>
.welcome-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.welcome-modal {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  margin-bottom: 32px;
}

.modal-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 18px;
  color: #f037a5;
  margin: 0;
  font-weight: 500;
}

.interactive-instructions {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.instruction-column {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.instruction-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  color: #000;
  transition: all 0.3s ease;
}

.instruction-icon:hover {
  background: rgba(240, 55, 165, 0.1);
  transform: scale(1.05);
}

.instruction-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.instruction-label {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}

.instruction-description {
  font-size: 14px;
  color: #000;
  opacity: 0.8;
}

.intro-text {
  margin-bottom: 32px;
}

.intro-paragraph {
  font-size: 16px;
  line-height: 1.6;
  color: #000;
  margin: 0 0 16px 0;
}

.intro-paragraph:last-child {
  margin-bottom: 0;
}

.intro-paragraph strong {
  font-weight: 700;
  color: #000;
}

.intro-paragraph.highlight {
  color: #f037a5;
  font-weight: 500;
}

.cta-section {
  text-align: center;
}

.cta-button {
  background: #f037a5;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(240, 55, 165, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-button:hover {
  background: #e91e63;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(240, 55, 165, 0.4);
}

.cta-button:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-modal {
    padding: 24px;
    margin: 20px;
  }

  .modal-title {
    font-size: 28px;
  }

  .modal-subtitle {
    font-size: 16px;
  }

  .interactive-instructions {
    flex-direction: column;
    gap: 20px;
  }

  .instruction-column {
    flex-direction: row;
    text-align: left;
    gap: 16px;
  }

  .instruction-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .cta-button {
    width: 100%;
    padding: 14px 24px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .welcome-modal {
    padding: 20px;
  }

  .modal-title {
    font-size: 24px;
  }

  .intro-paragraph {
    font-size: 14px;
  }
}

/* Dark mode support */
:root.dark .welcome-modal {
  background: #2a2e2f;
  color: #fff;
}

:root.dark .modal-title,
:root.dark .instruction-label,
:root.dark .intro-paragraph,
:root.dark .intro-paragraph strong {
  color: #fff;
}

:root.dark .instruction-description {
  color: #fff;
  opacity: 0.7;
}

:root.dark .instruction-icon {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:root.dark .instruction-icon:hover {
  background: rgba(240, 55, 165, 0.2);
}
</style>
