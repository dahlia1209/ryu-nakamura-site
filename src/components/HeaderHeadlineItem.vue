<script setup lang="ts" >
import {onMounted} from 'vue'
import {Headline} from '@/models/page'
import { useSiteStore } from '@/stores/site'

const props = defineProps<{
  contents: Headline[],
}>()

const siteStore = useSiteStore()

const closeMenu = () => {
  siteStore.isMenuOpen=false
};

</script>

<template>
  <nav class="contents">
    <ul>
      <li v-for="content in props.contents" :key="content.id">
        <RouterLink :to='content.link??"/"' :class="content.id" @click="closeMenu" >
          {{ content.display  }}
        </RouterLink>
      </li>
    </ul>
</nav>
</template>

<style scoped>
.contents{
    
}

ul{
  display: flex;
  list-style: none;
  padding: 0; 
}

li{
  padding: 0 10px;
}



</style>