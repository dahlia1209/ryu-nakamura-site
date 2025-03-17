<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {Headline} from '@/models/page'
import HeaderHeadlineItem from './HeaderHeadlineItem.vue'

</script>

<template>
    <div class="wrapper">
        <a class="logo" href="/">
            Ryu Nakamura
        </a>
        <HeaderHeadlineItem :contents="[
            new Headline('home','ホーム','/'),
            new Headline('service','サービス','/service'),
            new Headline('service','作品','/works'),
            new Headline('column','コラム','/column'),
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