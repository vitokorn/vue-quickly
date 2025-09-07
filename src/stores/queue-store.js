import { defineStore } from 'pinia'
import { spotifyApi } from '../services/spotifyApi.js'
import {artistUtils} from "../utils/artistUtils.js";

export const useQueueStore = defineStore('queue', {
  state: () => ({
    queue: localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')).length : 0,
    queueArr: localStorage.getItem('queue') ? JSON.parse(localStorage.getItem('queue')) : [],
    queueModal: false
  }),

  getters: {
    getQueue: (state) => state.queue,
    getQueueArr: (state) => state.queueArr,
    isQueueModalOpen: (state) => state.queueModal
  },

  actions: {
    setQueue(queue) {
      this.queue = queue
    },

    setQueueArr(queueArr) {
      this.queueArr = queueArr
    },

    setQueueModal(open) {
      this.queueModal = open
    },

    // Add track to queue
    addToQueue(track) {
      const current = localStorage.getItem('queue')
      const newQue = {
        id: track.id,
        name: track.name,
        artists: track.artists || track.album?.artists || [], // Store the original artists array with fallback
        image: track.album?.images?.[0] || track.images?.[0],
        preview_url: track.preview_url || track.previewUrl || track?.track?.preview_url || track?.items?.[0].preview_url
      }

      // Only format artist names if artists array exists and is not empty
      if (newQue.artists && newQue.artists.length > 0) {
        newQue.artists = this.formatArtistNames(newQue.artists)
      } else {
        newQue.artists = 'Unknown Artist'
      }

      let arr = current ? JSON.parse(current) : []

      const existingIndex = arr.findIndex(item => item.id === track.id)
      if (existingIndex === -1) {
        arr.push(newQue)
        localStorage.setItem('queue', JSON.stringify(arr))
        this.setQueue(arr.length)
        this.setQueueArr(arr)
      }
    },

    // Remove track from queue
    removeFromQueue(id) {
      const que = JSON.parse(localStorage.getItem('queue')) || []
      const index = que.findIndex(item => item.id === id)

      if (index > -1) {
        que.splice(index, 1)
        if (que.length === 0) {
          localStorage.removeItem('queue')
          this.setQueueArr([])
          this.setQueue(0)
        } else {
          localStorage.setItem('queue', JSON.stringify(que))
          this.setQueueArr(que)
          this.setQueue(que.length)
        }
      }
    },

    // Save queue to Spotify
    async saveQueue() {
      if (!this.queueArr || this.queueArr.length === 0) return

      try {
        if (this.queueArr.length > 50) {
          // Handle large queues in batches
          for (let i = 0; i < this.queueArr.length; i += 49) {
            const batch = this.queueArr.slice(i, i + 49)
            const trackIds = batch.map(track => track.id).join(',')
            await spotifyApi.request(`/me/tracks?ids=${trackIds}`, { method: 'PUT' })
          }
        } else {
          const trackIds = this.queueArr.map(track => track.id).join(',')
          await spotifyApi.request(`/me/tracks?ids=${trackIds}`, { method: 'PUT' })
        }

        // Clear queue after successful save
        this.clearQueue()
      } catch (error) {
        console.error('Failed to save queue:', error)
        throw error
      }
    },

    // Save queue to specific playlist
    async saveQueueToPlaylist(playlistId) {
      if (!this.queueArr || this.queueArr.length === 0) return

      try {
        const trackIds = this.queueArr.map(track => track.id)
        await spotifyApi.addTracksToPlaylist(playlistId, trackIds)
        return true
      } catch (error) {
        console.error('Failed to save queue to playlist:', error)
        throw error
      }
    },

    // Clear queue
    clearQueue() {
      localStorage.removeItem('queue')
      this.setQueue(0)
      this.setQueueArr([])
    },

    // Get queue from localStorage
    loadQueue() {
      const queue = localStorage.getItem('queue')
      if (queue) {
        const queueArr = JSON.parse(queue)
        this.setQueue(queueArr.length)
        this.setQueueArr(queueArr)
      } else {
        this.setQueue(0)
        this.setQueueArr([])
      }
    },

    // Check if track is in queue
    isInQueue(trackId) {
      if (!this.queueArr || this.queueArr.length === 0) return false
      return this.queueArr.some(track => track.id === trackId)
    },

    // Get queue count
    getQueueCount() {
      return this.queue || 0
    },
    formatArtistNames(artists) {
      if (!artists || !Array.isArray(artists) || artists.length === 0) {
        return 'Unknown Artist'
      }
      return artistUtils.formatArtistNamesSimple(artists)
    }
  },
})
