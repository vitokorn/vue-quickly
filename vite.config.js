import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/spotify': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/lastfm': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/apple': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/deezer': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
