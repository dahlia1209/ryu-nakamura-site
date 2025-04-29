<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {Headline} from '@/models/page'
import HeaderHeadlineItem from './HeaderHeadlineItem.vue'
import { useSiteStore } from '@/stores/site'
import { useAuthStore } from '@/stores/auth'
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user';
import { User } from '@/models/user';
import { useRoute, useRouter } from 'vue-router';

const siteStore = useSiteStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const route = useRoute();
const router = useRouter();

const localStore=(()=>{
  /*state*/
  const isLoading = ref(false)
  const error = ref<string | null>(null);

  /*getter*/
  const color=computed(()=>authStore.isLoggedIn ? '#e74c3c' : '#06C755')

  /*action*/
  const toggleMenu = () => {
  siteStore.isMenuOpen=!siteStore.isMenuOpen
};

const handleLoginClick = async () => {
  if (authStore.isLoggedIn &&authStore.userInfo) {
    // ログアウト処理
    await authStore.authService.logout(authStore.userInfo)
  } else {
    // ログイン処理
    isLoading.value = true
    try {
      const response=await authStore.authService.login()
      authStore.updateAuthStatus(response)
      const user=getUser()
      await upsertUser(user)
      router.go(0)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      isLoading.value = false
    }
  }
}

function getUser(){
  if (!authStore.userInfo) throw new Error(`ユーザ情報が取得できません。`);
  const user=User.fromAccountInfo(authStore.userInfo)
  user.lastLogin=new Date()
  return user
}

async function upsertUser(user:User) {
    try {
      const response = await userStore.service.upsertUser(authStore.getAccessToken,user);
    } catch (err) {
      console.error('Error fetching content:', err);
      error.value = err instanceof Error ? err.message : 'コンテンツの取得中にエラーが発生しました。';
    } finally {
      isLoading.value = false;
    }
  };


  /*return */
  return{
    state:{
      isLoading
    },
    getters:{
      color
    },
    actions:{
      toggleMenu,
      handleLoginClick,
      upsertUser
    }
  }
})()

// onMounted(async ()=>{
//   await authStore.checkAuthStatus();
// })
</script>

<template>
    <div class="wrapper">
        <a class="logo" href="/">
            Ryu Nakamura
        </a>
        

        <HeaderHeadlineItem :class="[
                {'hidden':[siteStore.isMobile ,!siteStore.isMenuOpen].every(x=>x===true)},
                {'sp-headline':[siteStore.isMobile ,siteStore.isMenuOpen].every(x=>x===true)}
            ]" :contents="[
                new Headline('service','コンテンツ','/contents'),
                new Headline('service','サービス','/service'),
                new Headline('contact','お問い合わせ','/contact'),
            ]" />
        
    </div>
    <div class="header-right">

    <button v-if="authStore.isLoggedIn" class="login-button" @click="localStore.actions.handleLoginClick()" :disabled="localStore.state.isLoading.value">
      <img src="/src/assets/user_icon.svg" class="user_icon" alt="user_icon">
    </button>
    <button v-else @click="localStore.actions.handleLoginClick()" class="login-button" :disabled="localStore.state.isLoading.value">
      ログイン
    </button>
    <button v-if="siteStore.isMobile" class="menu-button" @click="localStore.actions.toggleMenu()" aria-label="メニューを開く">
      <span v-for="i in [1, 2, 3]" :key="i" :class="['bar', { 'open': siteStore.isMenuOpen }]"></span>
    </button>
  </div>
</template>

<style scoped>
.wrapper{
    display: flex;
    place-items: flex-start;
    flex-direction: row;
    padding: 10px 0;
    width: 100%;
    align-items: center;
    justify-content: space-between;
}

.logo{
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
}

.menu-button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 202;  /* 最も高いz-indexを設定 */
  position: relative;  /* z-indexを有効にするため */
}

.bar {
  width: 100%;
  height: 3px;
  background-color: var(--color-text);
  transition: all 0.3s ease;
  border-radius: 2px;
}

.bar.open:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.bar.open:nth-child(2) {
  opacity: 0;
}

.bar.open:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.hidden{
    display: none
}

.sp-headline {
  position: absolute;
  top: 60px; /* ヘッダーの高さに合わせて調整 */
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 5;
  padding: 20px 0;
  animation: slideDown 0.3s ease-in-out;
}

/* ヘッダー右側のコンテナ */
.header-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

/* ログインボタンのスタイル */
.login-button {
    background-color: #06C755;
    color: white;
    border-radius: 30px;
    padding: 6px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 0;
    white-space: nowrap;
}

.login-button:hover {
    opacity: 0.8;
}
/* ユーザー情報表示用スタイル追加 */
.user-info {
  margin-right: 15px;
  font-size: 0.9rem;
  color: #333;
}

.login-button {
  background-color: v-bind('localStore.getters.color.value');
  color: white;
  border-radius: 30px;
  padding: 6px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 0;
  white-space: nowrap;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-button:hover:not(:disabled) {
  opacity: 0.8;
}

.user_icon{
  width: 20px;
  border: 1px ;
}
</style>