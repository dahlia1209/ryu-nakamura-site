<script setup lang="ts">
import { ref, onMounted, onUnmounted,watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useSiteStore } from '@/stores/site'
import { useAuthStore } from '@/stores/auth'
import HelloWorld from './components/HelloWorld.vue'
import HeaderItem from './components/HeaderItem.vue'
import FooterItem from './components/FooterItem.vue'

const siteStore = useSiteStore()
const authStore = useAuthStore()

const updateIsMobile=()=>{
  siteStore.isMobile=window.innerWidth < 768
}

onMounted(()=>{
  updateIsMobile();
  window.addEventListener('resize',updateIsMobile);
  authStore.checkAuthStatus();
})

onUnmounted(()=>{
  window.removeEventListener('resize',updateIsMobile)
})

watch(() => authStore.isLoggedIn, (newVal) => {
  console.log('Auth state changed:', newVal ? 'Logged in' : 'Logged out');
})

</script>
  
<template>
  <div class="app-container">
    <header>
      <HeaderItem />
    </header>
    <main :class="{'open':siteStore.isMenuOpen}">
      <RouterView />
    </main>
    <FooterItem />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
}

main,
header {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  width: 100%;
}

main {
  background-color: white;
  color: rgba(0, 0, 0, 0.75);
  padding-top: 70px;
}

main.open {
  background-color: rgba(0, 0, 0, 0.75);
  transition: background-color 0.2s ease;
}

header {
  height: 70px;
  position: fixed;
  top: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
}

header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15) inset;
  pointer-events: none;
}

/* @media (prefers-color-scheme: dark) {

  main,
  header {
    background-color: #000;
    color: white;
  }
} */

@media (max-width: 767px) {
  header {
    padding: 0 15px;
  }

  main {
    padding: 70px 15px 0;
  }
}
</style>