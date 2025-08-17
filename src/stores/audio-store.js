import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentTrack: null,
    audioPreview: true,
    restartSongOnHover: false,
    unplayableTracks: true,
    openLinks: true,
    // Mobile-specific audio state
    mobileCurrentAudio: null,
    mobileCurrentTrackId: null,
    mobileIsPlaying: false
  }),

  getters: {
    isAudioEnabled: (state) => state.audioPreview,
    shouldRestartOnHover: (state) => state.restartSongOnHover
  },

  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track
    },

    setAudioPreview(enabled) {
      this.audioPreview = enabled
    },

    setRestartSongOnHover(enabled) {
      this.restartSongOnHover = enabled
    },

    setUnplayableTracks(enabled) {
      this.unplayableTracks = enabled
    },

    setOpenLinks(enabled) {
      this.openLinks = enabled
    },

    // Audio control methods
    playAudio(audioElement) {
      if (!this.audioPreview || !audioElement) return
      
      if (this.currentTrack && this.currentTrack !== audioElement) {
        this.pauseAudio(this.currentTrack)
      }
      
      audioElement.play()
      this.currentTrack = audioElement
    },

    pauseAudio(audioElement) {
      if (!audioElement) return
      
      audioElement.pause()
      if (this.restartSongOnHover) {
        audioElement.currentTime = 0
      }
    },

    handleAudioClick(event) {
      const target = event.target
      const audio = target.lastChild || target
      
      if (!audio || typeof audio.play !== 'function') return
      
      if (this.currentTrack && this.currentTrack !== audio) {
        this.pauseAudio(this.currentTrack)
      }
      
      if (audio.paused === false) {
        this.pauseAudio(audio)
      } else {
        this.playAudio(audio)
      }
    },

    handleAudioHover(event) {
      const target = event.target
      const audio = target.lastChild || target
      
      if (!this.audioPreview || !audio || typeof audio.play !== 'function') return
      
      audio.play()
    },

    handleAudioLeave(event) {
      const target = event.target
      const audio = target.lastChild || target
      
      if (!this.audioPreview || !audio || typeof audio.pause !== 'function') return
      
      this.pauseAudio(audio)
    },

    // Parent element audio controls
    handleParentAudioClick(event) {
      const target = event.target
      const audio = target.firstChild?.lastChild
      
      if (!this.audioPreview || !audio) return
      
      if (this.currentTrack && this.currentTrack !== audio) {
        this.pauseAudio(this.currentTrack)
      }
      
      if (audio.paused === false) {
        this.pauseAudio(audio)
      } else {
        this.playAudio(audio)
      }
    },

    handleParentAudioHover(event) {
      const target = event.target
      const audio = target.firstChild?.lastChild
      
      if (!this.audioPreview || !audio) return
      
      audio.play()
    },

    handleParentAudioLeave(event) {
      const target = event.target
      const audio = target.firstChild?.lastChild
      
      if (!this.audioPreview || !audio) return
      
      this.pauseAudio(audio)
    },

    // Special click handler for specific layouts
    handleSpecialClick(event) {
      const target = event.target
      const audio = target.parentElement?.parentElement?.firstElementChild?.lastChild
      
      if (!this.audioPreview || !audio) return
      
      if (this.currentTrack && this.currentTrack !== audio) {
        this.pauseAudio(this.currentTrack)
      }
      
      if (audio.paused === false) {
        this.pauseAudio(audio)
      } else {
        this.playAudio(audio)
      }
    },

    // Search click handler
    handleSearchClick(event) {
      const target = event.target
      const audio = target.parentElement?.firstChild?.lastChild
      
      if (!this.audioPreview || !audio) return
      
      if (this.currentTrack && this.currentTrack !== audio) {
        this.pauseAudio(this.currentTrack)
      }
      
      if (audio.paused === false) {
        this.pauseAudio(audio)
      } else {
        this.playAudio(audio)
      }
    },

    // Stop all audio
    stopAllAudio() {
      if (this.currentTrack) {
        this.pauseAudio(this.currentTrack)
        this.currentTrack = null
      }
    },

    // Mobile-specific audio methods
    mobilePlayTrack(trackId, previewUrl) {
      // Stop current mobile audio if playing
      this.mobileStopCurrentAudio()
      
      if (!previewUrl) {
        console.log('No preview URL available for this track')
        return
      }

      // Create new audio instance
      this.mobileCurrentAudio = new Audio(previewUrl)
      this.mobileCurrentTrackId = trackId
      
      this.mobileCurrentAudio.addEventListener('ended', () => {
        this.mobileIsPlaying = false
        this.mobileCurrentTrackId = null
      })

      this.mobileCurrentAudio.play()
      this.mobileIsPlaying = true
    },

    mobileStopCurrentAudio() {
      if (this.mobileCurrentAudio) {
        this.mobileCurrentAudio.pause()
        this.mobileCurrentAudio.currentTime = 0
        this.mobileCurrentAudio = null
      }
      this.mobileIsPlaying = false
      this.mobileCurrentTrackId = null
    },

    mobileToggleTrack(trackId, previewUrl) {
      if (this.mobileCurrentTrackId === trackId && this.mobileIsPlaying) {
        // Stop current track
        this.mobileStopCurrentAudio()
      } else {
        // Play new track
        this.mobilePlayTrack(trackId, previewUrl)
      }
    },

    mobileIsTrackPlaying(trackId) {
      return this.mobileCurrentTrackId === trackId && this.mobileIsPlaying
    }
  }
})
