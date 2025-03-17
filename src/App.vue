<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import HeaderItem from './components/HeaderItem.vue'

</script>
  
<template>
  <header>
    <HeaderItem />
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>

main,header{
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  width: 100%;
}

main{
  background-color: white;
  padding-top: 70px;
}

header{
  height: 70px;
  position: fixed;
  top: 0;
  width: 100%; 
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9); 
}

header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0; 
  height: 8px; 
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15) inset;
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  main,header {
    background-color: #000;
  }
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
