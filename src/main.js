import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import { preferred } from './mixins/prefMixin.js'
import { initializeMusicStore } from './utils/initializeMusicStore.js'

// Initialize theme
function initializeTheme() {
    const theme = preferred()
    localStorage.setItem('user-theme', theme)
    document.documentElement.className = theme
}

// Set theme on app initialization
initializeTheme()

const pinia = createPinia()
const app = createApp(App)
app
    .use(pinia)
    .mount('#app')

// Initialize music store after app is mounted
initializeMusicStore().then(success => {
    if (success) {
        console.log('Music store initialization completed')
    } else {
        console.warn('Music store initialization failed')
    }
})
