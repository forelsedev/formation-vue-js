import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAccountStore } from './stores/account'

const app = createApp(App)
app.use(createPinia())

// Reconnexion automatique avant la première navigation
await useAccountStore().restore()

app.use(router)
app.mount('#app')
