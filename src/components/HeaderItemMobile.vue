<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Headline } from '@/models/page';
import { useSiteStore } from '@/stores/site'

// const isMenuOpen = ref(false);
const siteStore = useSiteStore()

const toggleMenu = () => {
  // isMenuOpen.value = !isMenuOpen.value;
  siteStore.isMenuOpen=!siteStore.isMenuOpen
};

const closeMenu = () => {
  // isMenuOpen.value = false;
  siteStore.isMenuOpen=false
};

const menuItems = [
  new Headline('home', 'ホーム', '/'),
  new Headline('service', 'サービス', '/service'),
  new Headline('works', '作品', '/works'),
  new Headline('column', 'コラム', '/column'),
];
</script>

<template>
  <div class="mobile-header">
    <div class="header-content">
      <a class="logo" href="/" @click="closeMenu">
        Ryu Nakamura
      </a>
      <button class="menu-button" @click="toggleMenu" aria-label="メニューを開く">
        <span class="bar" :class="{ 'open': siteStore.isMenuOpen }"></span>
        <span class="bar" :class="{ 'open': siteStore.isMenuOpen }"></span>
        <span class="bar" :class="{ 'open': siteStore.isMenuOpen }"></span>
      </button>
    </div>
    
    <div class="menu-overlay" :class="{ 'open': siteStore.isMenuOpen }" @click="closeMenu"></div>
    
    <nav class="mobile-nav" :class="{ 'open': siteStore.isMenuOpen }">
      <ul>
        <li v-for="item in menuItems" :key="item.id">
          <RouterLink :to="item.link ?? '/'" @click="closeMenu">
            {{ item.display }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.mobile-header {
  width: 100%;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
}

.logo {
  font-size: 1.4rem;
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

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 200;  /* より高いz-indexを設定してコンテンツの上に表示 */
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.menu-overlay.open {
  visibility: visible;
  opacity: 1;
}

.mobile-nav {
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 100vh;
  background-color: white;
  z-index: 201;  /* オーバーレイより高いz-indexを設定 */
  transition: right 0.3s ease;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.mobile-nav.open {
  right: 0;
}

.mobile-nav ul {
  list-style: none;
  padding: 70px 0 0 0;
  margin: 0;
}

.mobile-nav li {
  padding: 0;
  border-bottom: 1px solid #eee;
}

.mobile-nav li a {
  display: block;
  padding: 15px 20px;
  color: var(--color-text);
  text-decoration: none;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;
}

.mobile-nav li a:hover,
.mobile-nav li a.router-link-active {
  background-color: #f5f5f5;
}

/* @media (prefers-color-scheme: dark) {
  .mobile-nav {
    background-color: var(--color-background);
  }
  
  .mobile-nav li {
    border-bottom: 1px solid #333;
  }
  
  .mobile-nav li a:hover,
  .mobile-nav li a.router-link-active {
    background-color: #333;
  }
  
  .menu-button .bar {
    background-color: var(--color-text);
  }
} */
</style>