<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import { useOrderStore } from '../stores/order';
import { useSiteStore } from '../stores/site';
import { useRouter } from 'vitepress';
import HomeHeadline from '../components/HomeHeadline.vue';
import { Headline } from '../models/page';
import ContentItem from '../components/ContentItem.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { Order } from '../models/order';
import { Content,PreviewContent } from '../models/content';
import { data } from '../data/contents.data'

const authStore = useAuthStore();
const userStore = useUserStore();
const orderStore = useOrderStore();
const siteStore = useSiteStore();
const router = useRouter();

const localStore=(()=>{
  /*state*/
  const isFetched=ref(false);
  const error = ref<string | null>(null);
  const purchasedOrders = ref<Order[]>([]);
  const contents = ref<PreviewContent[]>([]);

  /*getter*/
  const getIsSiteLoading=computed(()=>siteStore.isLoading)
  const getIsAuthenticated=computed(()=>authStore.userInfo!=null)
  const getIsGuest=computed(()=>userStore.user==null)
  const getIsFetchReady=computed(()=>[!getIsSiteLoading.value,getIsAuthenticated.value,!getIsGuest.value].every(x=>x===true))

  /*action*/
  async function fetchPurchasedOrders() {
    if (!authStore.isAuthenticated || !userStore.user) {
      return;
    }
    try {
      error.value = null;
      purchasedOrders.value = await orderStore.service.getPurchasedOrders(
        authStore.getAccessToken,
        userStore.user.id
      );
      const titleNo= purchasedOrders.value.map(x=>x.content.titleNo)
      contents.value=data.contents.filter(x=>titleNo.includes(x.title_no))
    } catch (err) {
      console.error('Error fetching purchased orders:', err);
      error.value = err instanceof Error ? err.message : '購入記事の取得中にエラーが発生しました。';
    } finally {
      isFetched.value=true
    }
  }
  
  //戻り値
return {
  state:{
    error,
    purchasedOrders,
    contents,
    isFetched,
  },
  getters:{
    getIsSiteLoading,
    getIsAuthenticated,
    getIsGuest,
    getIsFetchReady
  },
  actions:{
    fetchPurchasedOrders
  }
}
})()

onMounted( async ()=>{
  if (localStore.getters.getIsFetchReady.value){
    await localStore.actions.fetchPurchasedOrders();
  }
})

watch(
  [localStore.getters.getIsSiteLoading,localStore.getters.getIsAuthenticated,localStore.getters.getIsGuest]
  ,async ([newA,newB,newC],[oldA,oldB,oldC]) =>{
  if(newA){
    return
  } else if(!newB){
    return
  }else if(newC){
    return
  }else{
    await localStore.actions.fetchPurchasedOrders();
  }
})

</script>

<template>
  <div class="purchased-view" >
    <HomeHeadline :headline="new Headline('purchased-articles', '購入済み記事一覧')" />
    <LoadingSpinner v-if="!localStore.state.isFetched.value" />
    
    <div v-else-if="!authStore.isAuthenticated" class="not-authenticated">
      <p>この機能を利用するには、ログインが必要です。</p>
      <!-- <button @click="router.go('/')" class="return-button">トップページに戻る</button> -->
    </div>
    <div v-else-if="localStore.state.error.value" class="error-message">
      <p>{{ localStore.state.error.value }}</p>
      <button @click="localStore.actions.fetchPurchasedOrders()" class="retry-button">再試行</button>
    </div>
    
    <div v-else-if="localStore.state.contents.value.length === 0" class="no-purchases">
      <p>購入済みの記事はまだありません。</p>
      <button @click="router.go('/contents')" class="view-contents-button">コンテンツ一覧を見る</button>
    </div>
    
    <div v-else class="purchased-contents">
      <p class="intro-text">購入済みの記事一覧です。クリックすると記事の詳細ページに移動します。</p>
      
      <div class="content-grid">
        <ContentItem 
          v-for="content in localStore.state.contents.value" 
          :key="content.id" 
          :content="content" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.purchased-view {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  margin-bottom: 30px;
}

.not-authenticated,
.no-purchases,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.return-button,
.retry-button,
.view-contents-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #41b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.return-button:hover,
.retry-button:hover,
.view-contents-button:hover {
  background-color: #389f70;
}

.error-message {
  color: #e74c3c;
}

.intro-text {
  margin-bottom: 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}
</style>