<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {Headline} from '@/models/page'
import HeaderHeadlineItem from './HeaderHeadlineItem.vue'
import { useSiteStore } from '@/stores/site'
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'

const siteStore = useSiteStore()
const authStore = useAuthStore()

const isLoading = ref(false)

const toggleMenu = () => {
  siteStore.isMenuOpen=!siteStore.isMenuOpen
};

const closeMenu = () => {
  siteStore.isMenuOpen=false
};

const handleLoginClick = async () => {
  if (authStore.isLoggedIn) {
    // ログアウト処理
    await authStore.logout()
  } else {
    // ログイン処理
    isLoading.value = true
    try {
      await authStore.login()
      
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      isLoading.value = false
    }
  }
}

// const loginButtonText = computed(() => {
//   if (isLoading.value) return 'ログイン中...'
//   return authStore.isLoggedIn ? '' : 'ログイン'
// })

const getToken=async ()=>{
  const token=await authStore.getToken()
  console.log("token",token)
}

const color=computed(()=>authStore.isLoggedIn ? '#e74c3c' : '#06C755')

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

    <button v-if="authStore.isLoggedIn" class="login-button" @click="handleLoginClick" :disabled="isLoading">
      <img src="/src/assets/user_icon.svg" class="user_icon" alt="user_icon">
    </button>
    <button v-else @click="handleLoginClick" class="login-button" :disabled="isLoading">
      ログイン
    </button>
    <button @click="getToken" >
      トークン
    </button>

    <button v-if="siteStore.isMobile" class="menu-button" @click="toggleMenu" aria-label="メニューを開く">
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
  background-color: v-bind('color');
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