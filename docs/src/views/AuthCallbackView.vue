<script setup lang="ts">
import LoadingSpinner from '../components/LoadingSpinner.vue'
import HomeTable from '../components/HomeTable.vue'
import {Headline} from '../models/page'
import {onMounted, ref,watch} from 'vue'
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

  /*getter*/
  
  /*action*/


  //戻り値
return {
  state:{
    params
  },
  getters:{
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
  [()=>siteStore.isLoading,()=>authStore.userInfo,()=>userStore.user]
  ,async ([newA,newB,newC],[oldA,oldB,oldC]) =>{
  if(newA){
    return
  } else if(!newB){
    router.go(localStore.state.params.value);
  }else if(!newC){
    router.go(localStore.state.params.value);
  }else{
    try {
      await userStore.service.upsertUser(authStore.getAccessToken, newC);
      router.go(localStore.state.params.value);
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