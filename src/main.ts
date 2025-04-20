import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const initApp = async () => {
    try {
      const authStore = useAuthStore(pinia)
      await authStore.authService.initialize()
      app.mount('#app')
    } catch (error) {
      console.error('Failed to initialize application:', error)
      // エラーが発生した場合でもアプリをマウント
      app.mount('#app')
    }
  }

  initApp()