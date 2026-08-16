<script setup lang="ts">
import { Headline } from '../models/page'
import { useAuthStore } from '../stores/auth'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user';
import { useSiteStore } from '../stores/site';
import { User } from '../models/user';
import { useRouter,useRoute } from 'vitepress'

const router = useRouter()
const route = useRoute()
// const siteStore = useSiteStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const siteStore = useSiteStore()

const localStore = (() => {
  /*state*/
  const isLoading = ref(false)
  const error = ref<string | null>(null);
  let closeMenuTimer: number | null = null;

  /*getter*/
  const color = computed(() => authStore.isLoggedIn ? '#e74c3c' : '#06C755')
  const getAccountName=computed(()=> {
    if (!userStore.user) return "NoName"
    else return userStore.user.email.slice(0,2)
  })
  const getUserName=computed(()=> {
    if (!userStore.user) return "ユーザー"
    // メールアドレスの@より前の部分をユーザー名として使用
    else return userStore.user.email.split('@')[0]
  })

  /*action*/
  const handleLoginClick = async () => {
    if (authStore.isLoggedIn && authStore.userInfo) {
      return
    } else {
      // ログイン処理
      isLoading.value = true
      try {
        const response = await authStore.authService.login(route.path)
      } catch (error) {
        console.error('Login failed:', error)
      } finally {
        isLoading.value = false
      }
    }
  }

  const handleSignupClick = async () => {
    // 新規会員登録処理
    isLoading.value = true
    try {
      const response = await authStore.authService.signup(route.path)
    } catch (error) {
      console.error('Signup failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleAccountClick = async () => {
    if (authStore.isLoggedIn && authStore.userInfo) {
      // ログアウト処理
      await authStore.authService.logout(authStore.userInfo)
    }
  }

  const handleMouseEnter = () => {
    // タイマーがあればキャンセル
    if (closeMenuTimer) {
      clearTimeout(closeMenuTimer)
      closeMenuTimer = null
    }
    siteStore.openAccountMenu()
  }

  const handleMouseLeave = () => {
    // 200ms後にメニューを閉じる（マウス移動の猶予を与える）
    closeMenuTimer = setTimeout(() => {
      siteStore.closeAccountMenu()
      closeMenuTimer = null
    }, 200) as unknown as number
  }

  const cleanup = () => {
    if (closeMenuTimer) {
      clearTimeout(closeMenuTimer)
      closeMenuTimer = null
    }
  }

  /*return */
  return {
    state: {
      isLoading,
    },
    getters: {
      color,
      getAccountName,
      getUserName
    },
    actions: {
      handleLoginClick,
      handleSignupClick,
      handleAccountClick,
      handleMouseEnter,
      handleMouseLeave,
      cleanup,
    }
  }
})()

onMounted(async ()=>{
})

onUnmounted(() => {
  localStore.actions.cleanup()
})

</script>

<template>
  <div class="wrapper">
    <a href="/" class="logo" @click="siteStore.closeMenu();">
      Ryu Nakamura
    </a>

    <nav class="navbar">
      <ul class="nav-links" :class="{ 'nav-active': siteStore.isMenuOpen }">
        <li @click="siteStore.closeMenu(); " ><a href="/apps" class="header-menu">アプリ</a></li>
        <li @click="siteStore.closeMenu(); " ><a href="/contents" class="header-menu">記事</a></li>
        <li @click="siteStore.closeMenu(); " ><a href="/updates" class="header-menu">更新情報</a></li>
        <li @click="siteStore.closeMenu(); " ><a href="/about" class="header-menu">プロフィール</a></li>
        <li @click="siteStore.closeMenu(); " ><a href="/contact" class="header-menu">お問い合わせ</a></li>

        <!-- モバイル用の認証ボタン -->
        <li v-if="!authStore.isLoggedIn" class="mobile-auth-buttons">
          <button @click="siteStore.closeMenu();localStore.actions.handleLoginClick()" class="mobile-login-button"
            :disabled="localStore.state.isLoading.value">
            ログイン
          </button>
          <button @click="siteStore.closeMenu();localStore.actions.handleSignupClick()" class="mobile-signup-button"
            :disabled="localStore.state.isLoading.value">
            新規会員登録
          </button>
        </li>
      </ul>
      <div class="burger" @click="siteStore.toggleMenu()"
        :class="{ 'toggle': siteStore.isMenuOpen }">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div>
    </nav>

    <div class="header-right">
      <div v-if="siteStore.isLoading">

      </div>
      <div v-else-if="authStore.isLoggedIn"
        class="account-container"
        @mouseenter="localStore.actions.handleMouseEnter()"
        @mouseleave="localStore.actions.handleMouseLeave()">
        <button  class="account-icon"
          :disabled="localStore.state.isLoading.value" >
          {{ localStore.getters.getAccountName.value.toUpperCase() }}
      </button>
        <div class="dropdown-menu"
          v-if="siteStore.isAccountMenuOpen"
          @mouseenter="localStore.actions.handleMouseEnter()"
          @mouseleave="localStore.actions.handleMouseLeave()">
            <!-- User Profile Section -->
            <div class="user-profile-section">
              <div class="user-avatar">
                {{ localStore.getters.getAccountName.value.toUpperCase() }}
              </div>
              <div class="user-details">
                <div class="user-name">{{ localStore.getters.getUserName.value }}</div>
                <div class="user-email">{{ userStore.user?.email || '' }}</div>
              </div>
            </div>

            <!-- Main Menu Section -->
            <div class="menu-section">
              <div class="menu-item" @click="siteStore.closeAccountMenu();router.go('/purchased')">
                <span class="icon">📚</span>購入したコンテンツ
              </div>
              <div class="menu-item" @click="siteStore.closeAccountMenu();router.go('/contents')">
                <span class="icon">🔍</span>コンテンツを探す
              </div>
            </div>

            <!-- Account Settings Section -->
            <div class="menu-section">
              <div class="menu-item" @click="siteStore.closeAccountMenu();router.go('/purchased')">
                <span class="icon">💳</span>購入履歴
              </div>
            </div>

            <!-- Support & Logout Section -->
            <div class="menu-section">
              <div class="menu-item" @click="siteStore.closeAccountMenu();router.go('/contact')">
                <span class="icon">❓</span>ヘルプ・サポート
              </div>
              <div class="menu-item" @click="siteStore.closeAccountMenu();localStore.actions.handleAccountClick()">
                <span class="icon">🚪</span>ログアウト
              </div>
            </div>
        </div>
      </div>
      <div v-else class="auth-buttons-container">
        <button @click="localStore.actions.handleLoginClick()" class="login-button"
          :disabled="localStore.state.isLoading.value">
          ログイン
        </button>
        <button @click="localStore.actions.handleSignupClick()" class="signup-button"
          :disabled="localStore.state.isLoading.value">
          新規会員登録
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container styles */
.wrapper {
  display: flex;
  place-items: flex-start;
  flex-direction: row;
  padding: 10px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

/* Logo styling */
.logo {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--vp-c-green-3);
  cursor: pointer;
}

/* Header right section */
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Navigation styles */
.nav-links {
  display: flex;
  list-style: none;
  
}

.nav-links li {
  margin-left: 20px;
  cursor: pointer;
  color: var(--vp-c-green-3);
  font-size: 0.9rem;
}


/* Auth buttons container */
.auth-buttons-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* モバイル用認証ボタン（デフォルトでは非表示） */
.mobile-auth-buttons {
  display: none;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}

/* モバイル用ログインボタン */
.mobile-login-button {
  width: 100%;
  color: var(--vp-c-text-1);
  border-radius: 4px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid var(--vp-c-divider);
  background-color: transparent;
  font-weight: 600;
  font-size: 16px;
}

.mobile-login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mobile-login-button:hover:not(:disabled) {
  background-color: var(--vp-c-bg-soft);
}

/* モバイル用新規会員登録ボタン */
.mobile-signup-button {
  width: 100%;
  color: white;
  border-radius: 4px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid var(--vp-c-bg-green);
  background-color: var(--vp-c-bg-green);
  font-weight: 600;
  font-size: 16px;
}

.mobile-signup-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mobile-signup-button:hover:not(:disabled) {
  background-color: #05b048;
}

/* Login button styles (Udemy-inspired) */
.login-button {
  color: var(--vp-c-text-1);
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
  background-color: transparent;
  font-weight: 600;
  font-size: 14px;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-button:hover:not(:disabled) {
  background-color: var(--vp-c-bg-soft);
}

/* Signup button styles (Udemy-inspired) */
.signup-button {
  color: white;
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid var(--vp-c-bg-green);
  white-space: nowrap;
  background-color: var(--vp-c-bg-green);
  font-weight: 600;
  font-size: 14px;
}

.signup-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-button:hover:not(:disabled) {
  background-color: #05b048;
}

.user_icon {
  width: 20px;
  border: 1px;
}

.navbar {
  margin-left: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}
.nav-links a.header-menu  {
  cursor: pointer;
  color: var(--vp-c-green-3);
  font-size: 0.9rem;
}
.nav-links a.header-menu:hover  {
  opacity: 0.7;
  color: var(--vp-c-green-3);
}

.nav-links a:hover {
  color: #4285f4;
}

.burger {
  display: none;
  cursor: pointer;
}

.burger div {
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 5px;
  transition: all 0.3s ease;
}

@media screen and (max-width: 768px) {
  .nav-links {
    position: fixed;
    right: 0;
    height: calc(100vh - 70px);
    top: 50px;
    background-color: var(--vp-c-white);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.5s ease;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
    visibility: hidden;
  }

  .nav-links li {
    margin: 10px 0;
    font-size: 1.2rem;
    color: var(--vp-c-green-3);
  }

  .burger {
    display: block;
  }

  .nav-active {
    opacity: 1;
    visibility: visible;
  }

  /* モバイルでヘッダー右側の認証ボタンを非表示 */
  .header-right .auth-buttons-container {
    display: none;
  }

  /* モバイルでハンバーガーメニュー内の認証ボタンを表示 */
  .mobile-auth-buttons {
    display: flex;
    width: 90%;
  }

  /* モバイルでのドロップダウンメニュー調整 */
  .dropdown-menu {
    width: 260px;
    max-width: calc(100vw - 32px);
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-email {
    font-size: 11px;
  }

  .menu-item {
    padding: 10px 14px;
    font-size: 13px;
  }
}

@media screen and (max-width: 480px) {
  /* 480px以下では特に追加の調整は不要（768pxのメディアクエリが適用される） */
}

.toggle .line1 {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.toggle .line2 {
  opacity: 0;
}

.toggle .line3 {
  transform: rotate(45deg) translate(-5px, -6px);
}


.account-container {
  display: flex;
  position: relative;
  align-items: center; 
  justify-content: center;
}
        
.account-icon{
  width: 40px;
  height: 40px;
  border-color: transparent;
  border-radius: 50%;
  background-color: var(--vp-c-green-3);
  color: var(--vp-c-white);
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
}

.account-icon:hover{
  opacity: 0.8;
}


.account-container:hover {
  
}

.dropdown-menu {
  position: absolute;
  top: 130%;
  right: 0;
  background-color: var(--vp-c-bg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  width: 280px;
  overflow: hidden;
  z-index: 1000;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* メニュー表示時のアニメーション */
.dropdown-menu {
  animation: fadeInDown 0.2s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* User Profile Section */
.user-profile-section {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--vp-c-green-3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  color: var(--vp-c-text-1);
  font-weight: 700;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Menu Sections */
.menu-section {
  border-bottom: 1px solid var(--vp-c-divider);
}

.menu-section:last-child {
  border-bottom: none;
}

.menu-item {
  display: flex;
  padding: 12px 16px;
  align-items: center;
  gap: 12px;
  color: var(--vp-c-text-1);
  transition: background-color 0.2s;
  cursor: pointer;
  font-size: 14px;
}

.menu-item .icon {
  font-size: 18px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.menu-item:active {
  background-color: var(--vp-c-divider);
}

</style>

<style module>

</style>