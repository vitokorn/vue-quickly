import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    viewMode: 'list', // 'list' or 'grid'
  }),

  getters: {
    getViewMode: (state) => state.viewMode,
    isGridView: (state) => state.viewMode === 'grid',
    isListView: (state) => state.viewMode === 'list',
  },

  actions: {
    setViewMode(mode) {
      if (mode === 'list' || mode === 'grid') {
        this.viewMode = mode
      }
    },

    toggleViewMode() {
      this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'
    },
  }
})
