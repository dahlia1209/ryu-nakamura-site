<script setup lang="ts">
import { Headline } from '../models/page'
import { useAuthStore } from '../stores/auth'
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user';
import { User } from '../models/user';
// import { useRoute, useRouter } from 'vue-router';
import { useRouter } from 'vitepress'

const router = useRouter()
// const siteStore = useSiteStore()
const authStore = useAuthStore()
const userStore = useUserStore()

const localStore = (() => {
  /*state*/
  const isLoading = ref(false)
  const error = ref<string | null>(null);
  const isMenuOpen = ref(false)


  /*getter*/
  const color = computed(() => authStore.isLoggedIn ? '#e74c3c' : '#06C755')

  /*action*/
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  };

  const closeMenu = () => isMenuOpen.value = false

  const handleLoginClick = async () => {
    if (authStore.isLoggedIn && authStore.userInfo) {
      // ログアウト処理
      await authStore.authService.logout(authStore.userInfo)
    } else {
      // ログイン処理
      isLoading.value = true
      try {
        const response = await authStore.authService.login()
        authStore.updateAuthStatus(response)
        const user = getUser()
        await upsertUser(user)
        // router.go()
      } catch (error) {
        console.error('Login failed:', error)
      } finally {
        isLoading.value = false
      }
    }
  }

  function getUser() {
    if (!authStore.userInfo) throw new Error(`ユーザ情報が取得できません。`);
    const user = User.fromAccountInfo(authStore.userInfo)
    user.lastLogin = new Date()
    return user
  }

  async function upsertUser(user: User) {
    try {
      const response = await userStore.service.upsertUser(authStore.getAccessToken, user);
    } catch (err) {
      console.error('Error fetching content:', err);
      error.value = err instanceof Error ? err.message : 'コンテンツの取得中にエラーが発生しました。';
    } finally {
      isLoading.value = false;
    }
  };


  /*return */
  return {
    state: {
      isLoading,
      isMenuOpen,
      closeMenu
    },
    getters: {
      color
    },
    actions: {
      toggleMenu,
      handleLoginClick,
      upsertUser,
      closeMenu
    }
  }
})()

onMounted(async ()=>{

})

</script>

<template>
  <div class="wrapper">
    <a class="logo" @click="localStore.actions.closeMenu(); router.go('/')">
      Ryu Nakamura
    </a>

    <nav class="navbar">
      <ul class="nav-links" :class="{ 'nav-active': localStore.state.isMenuOpen.value }">
        <li @click="localStore.actions.closeMenu(); router.go('/contents')">コンテンツ</li>
        <li @click="localStore.actions.closeMenu(); router.go('/service')">サービス</li>
        <li @click="localStore.actions.closeMenu(); router.go('/contact')">お問い合わせ</li>
      </ul>
      <div class="burger" @click="localStore.actions.toggleMenu()"
        :class="{ 'toggle': localStore.state.isMenuOpen.value }">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
      </div>
    </nav>

    <div class="header-right">
  
      <button v-if="authStore.isLoggedIn" class="login-button" @click="localStore.actions.handleLoginClick()"
        :disabled="localStore.state.isLoading.value">
        <img src="/src/assets/user_icon.svg" class="user_icon" alt="user_icon">
      </button>
      <button v-else @click="localStore.actions.handleLoginClick()" class="login-button"
        :disabled="localStore.state.isLoading.value">
        ログイン
      </button>
      <!-- <button v-if="siteStore.isMobile" class="menu-button" @click="localStore.actions.toggleNav()" aria-label="メニューを開く">
        <span v-for="i in [1, 2, 3]" :key="i" :class="['bar', { 'open': siteStore.isMenuOpen }]"></span>
      </button> -->
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
    z-index: 20;
    visibility: visible;
  }

  /* @keyframes navLinkFade {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  } */
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
</style>