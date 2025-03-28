<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {Headline} from '@/models/page'
import HeaderHeadlineItem from './HeaderHeadlineItem.vue'
import { useSiteStore } from '@/stores/site'

const siteStore = useSiteStore()

const toggleMenu = () => {
  siteStore.isMenuOpen=!siteStore.isMenuOpen
};

const closeMenu = () => {
  siteStore.isMenuOpen=false
};

</script>

<template>
    <div class="wrapper">
        <a class="logo" href="/">
            Ryu Nakamura
        </a>

        <button v-if="siteStore.isMobile" class="menu-button" @click="toggleMenu" aria-label="メニューを開く">
            <span v-for="i in [1,2,3]" :key="i"  :class="['bar',{ 'open': siteStore.isMenuOpen }]"></span>
        </button>

        <HeaderHeadlineItem :class="[
                {'hidden':[siteStore.isMobile ,!siteStore.isMenuOpen].every(x=>x===true)},
                {'sp-headline':[siteStore.isMobile ,siteStore.isMenuOpen].every(x=>x===true)}
            ]" :contents="[
                new Headline('home','ホーム','/'),
                new Headline('service','作品','/works'),
                new Headline('service','サービス','/service'),
                new Headline('column','コラム','/column'),
                new Headline('contact','お問い合わせ','/contact'),
            ]" />
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

/* header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
} */
</style>