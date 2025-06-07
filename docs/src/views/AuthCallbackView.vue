<script setup lang="ts">
import LoadingSpinner from '../components/LoadingSpinner.vue'
import HomeTable from '../components/HomeTable.vue'
import {Headline} from '../models/page'
import {onMounted, ref,watch,computed} from 'vue'
import {useRoute,useRouter} from 'vitepress'
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth'
import { useSiteStore } from '../stores/site'
import { User } from '../models/user';

const route=useRoute()
const router=useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const siteStore = useSiteStore()

const localStore=(()=>{
  /*state*/
  const params=ref('/')
  const getIsSiteLoading=computed(()=>siteStore.isLoading)
  const getIsAuthenticated=computed(()=>authStore.userInfo!=null)
  const getIsGuest=computed(()=>userStore.user==null)
  const getIsFetchReady=computed(()=>[!getIsSiteLoading.value,getIsAuthenticated.value,!getIsGuest.value].every(x=>x===true))
  

  /*getter*/
  
  /*action*/


  //戻り値
return {
  state:{
    params
  },
  getters:{
    getIsSiteLoading,
    getIsAuthenticated,
    getIsGuest,
    getIsFetchReady,
  },
  actions:{

  }
}
})()

onMounted(async ()=>{
  const params = new URLSearchParams(window.location.search);
  localStore.state.params.value=params.get('path')||'/'
})

watch(
  [localStore.getters.getIsSiteLoading,localStore.getters.getIsAuthenticated,localStore.getters.getIsGuest]
  ,async ([newA,newB,newC],[oldA,oldB,oldC]) =>{
  if(newA){
    return
  } else if(!newB){
    router.go(localStore.state.params.value);
  }else if(newC){
    router.go(localStore.state.params.value);
  }else{
    try {
      const user=await userStore.service.upsertUser(authStore.getAccessToken, userStore.user!);
      const targetUrl = new URL(localStore.state.params.value, import.meta.env.VITE_FRONT_URL);
      if (user.createdAt ) targetUrl.searchParams.set('registration', 'completed');
      router.go(targetUrl.pathname + targetUrl.search);
    } catch (error) {
      
      router.go(localStore.state.params.value);
    }
  }
})

</script>

<template>
  <div class="callback">
    <LoadingSpinner />
  </div>
</template>

<style scoped>

</style>