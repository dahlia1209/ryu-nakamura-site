<script setup lang="ts">
import HeaderItem from '../../src/components/HeaderItem.vue'
import FooterItem from '../../src/components/FooterItem.vue'
import NotFoundView from './NotFoundView.vue'
import { useData,Content,useRoute } from 'vitepress'
import { onBeforeMount, onMounted, watchEffect } from 'vue'


import { useAuthStore } from '../../src/stores/auth'
import { useUserStore } from '../../src/stores/user'
import { useSiteStore } from '../../src/stores/site'

const authStore = useAuthStore()
const userStore = useUserStore()
const siteStore = useSiteStore()
const { page } = useData()

onMounted(async ()=>{
  await authStore.authService.initialize()
  await authStore.checkAuthStatus();
  if (authStore.userInfo) userStore.updateUserFromAccountInfo(authStore.userInfo)
  
})

</script>

<template>
  <header>
    <HeaderItem />
  </header>
  <main @click="siteStore.closeMenu()">
    <NotFoundView v-if="page.isNotFound" />
    <Content v-else />
  </main>
  <footer>
    <FooterItem />
  </footer>
  <div v-if="siteStore.isAccountMenuOpen" class="outside-menu" @click="siteStore.closeMenu()"></div>
</template>

<style >
main,
header {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  width: 100%;
}

main {
  background-color: white;
  color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  z-index: 10;
  
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
  z-index: 20;
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

.header-area{
  height: 70px;
  width: 100%;
}

.outside-menu{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 15;
}
</style>