<script setup lang="ts">
import { Headline } from '../models/page'
import { useAuthStore } from '../stores/auth'
import { ref, computed, onMounted } from 'vue'
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

  /*getter*/
  const color = computed(() => authStore.isLoggedIn ? '#e74c3c' : '#06C755')
  const getAccountName=computed(()=> {
    if (!userStore.user) return "NoName"
    else return userStore.user.email.slice(0,2)
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

  const handleAccountClick = async () => {
    if (authStore.isLoggedIn && authStore.userInfo) {
      // ログアウト処理
      await authStore.authService.logout(authStore.userInfo)
    } 
  }


  /*return */
  return {
    state: {
      isLoading,
    },
    getters: {
      color,
      getAccountName
    },
    actions: {
      handleLoginClick,
      handleAccountClick,
    }
  }
})()

onMounted(async ()=>{
})

</script>

<template>
  <div class="wrapper">
    <a class="logo" @click="siteStore.closeMenu(); router.go('/')">
      Ryu Nakamura
    </a>

    <nav class="navbar">
      <ul class="nav-links" :class="{ 'nav-active': siteStore.isMenuOpen }">
        <li @click="siteStore.closeMenu(); router.go('/today-news')">トレンド</li>
        <li @click="siteStore.closeMenu(); router.go('/contents')">コンテンツ</li>
        <li @click="siteStore.closeMenu(); router.go('/about')">プロフィール</li>
        <li @click="siteStore.closeMenu(); router.go('/contact')">お問い合わせ</li>
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
      <div v-else-if="authStore.isLoggedIn" class="account-container"  @click.stop="siteStore.toggleAccountMenu()">
        <button  class="account-icon" 
          :disabled="localStore.state.isLoading.value" >
          {{ localStore.getters.getAccountName.value.toUpperCase() }}
      </button>
        <div class="dropdown-menu" v-if="siteStore.isAccountMenuOpen" >
            <div class="menu-item" @click.stop="siteStore.closeMenu();router.go('/purchased')"><span class="icon"></span>購入記事</div>
            <!-- <div class="menu-item"><span class="icon"></span>プロフィール編集</div> -->
            <div class="menu-item" @click.stop="localStore.actions.handleAccountClick()"><span class="icon"></span>ログアウト</div>
        </div>
      </div>
      <div v-else class="login-container">
        <button  @click="localStore.actions.handleLoginClick()" class="login-button"
          :disabled="localStore.state.isLoading.value">
          ログイン
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


/* Login button styles */
.login-button {
  color: white;
  border-radius: 30px;
  padding: 6px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 0;
  white-space: nowrap;
  background-color: var(--vp-c-bg-green);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-button:hover:not(:disabled) {
  opacity: 0.8;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 200px;
}

.menu-item {
  display: flex;
  padding: 10px;
  align-items: center;
  color: var(--vp-c-green-1);
  transition: background-color 0.2s;
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--vp-c-gray-3);
}

</style>

<style module>

</style>