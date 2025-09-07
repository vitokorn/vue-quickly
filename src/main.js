import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import { preferred } from './mixins/prefMixin.js'

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
