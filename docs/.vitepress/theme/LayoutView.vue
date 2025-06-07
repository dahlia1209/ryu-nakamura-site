<script setup lang="ts">
import HeaderItem from '../../src/components/HeaderItem.vue'
import FooterItem from '../../src/components/FooterItem.vue'
import NotificationToast from '../../src/components/NotificationToast.vue'
import NotFoundView from './NotFoundView.vue'
import { useData,Content,useRoute } from 'vitepress'
import { onBeforeMount, onMounted, watchEffect,ref, computed,watch } from 'vue'


import { useAuthStore } from '../../src/stores/auth'
import { useUserStore } from '../../src/stores/user'
import { useSiteStore } from '../../src/stores/site'
import { useContentStore } from '../../src/stores/content'

const authStore = useAuthStore()
const userStore = useUserStore()
const siteStore = useSiteStore()
const route = useRoute()
const { page } = useData()

const localStore=(()=>{
  /*state*/
  const searchParams=ref(new URLSearchParams())
  const message=ref("")

  /*getter*/
  const getRegistrationCompleted=computed(()=>searchParams.value.has('registration','completed'))
  const getPurchasedCompleted=computed(()=>searchParams.value.has('purchased','completed'))
  const getNotificationFlag=computed(()=>[getRegistrationCompleted.value,getPurchasedCompleted.value].some(x=>x===true))
  const getPath=computed(()=>route.path)
  
  /*action*/
  const updateMessage=()=>{
    if(getRegistrationCompleted.value) message.value="会員登録ありがとうございます！"
    else if(getPurchasedCompleted.value) message.value="ご購入ありがとうございます！"
  }


  //戻り値
return {
  state:{
    searchParams,
    message,
  },
  getters:{
    getRegistrationCompleted,
    getPurchasedCompleted,
    getNotificationFlag,
    getPath,
  },
  actions:{
    updateMessage
  }
}
})()

onMounted(async ()=>{
  try {
    localStore.state.searchParams.value = new URLSearchParams(window.location.search);
    localStore.actions.updateMessage()
    await authStore.authService.initialize()
    await authStore.checkAuthStatus();
    if (authStore.userInfo) userStore.updateUserFromAccountInfo(authStore.userInfo)
  } catch (error) {
    console.error("initialize error:",error)
  }finally{
    siteStore.isLoading=false
  }
})

watch(
  [localStore.getters.getPath]
  ,([newA],[oldA])=>{
    localStore.state.searchParams.value = new URLSearchParams(window.location.search);
    localStore.actions.updateMessage()
})
</script>

<template >
  <header >
    <HeaderItem />
  </header>
  <main  @click="siteStore.closeMenu()">
    <NotificationToast v-if="localStore.getters.getNotificationFlag.value" :type="'success'" :message="localStore.state.message.value" />
    <NotFoundView v-if="page.isNotFound" />
    <Content v-else />
  </main>
  <footer >
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