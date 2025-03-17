<script setup lang="ts" >
import {onMounted} from 'vue'
import {Headline} from '@/models/page'

const props = defineProps<{
  contents: Headline[],
}>()

onMounted(()=>{
  console.log('contents',props.contents)
})

</script>

<template>
  <nav class="contents">
    <ul>
      <li v-for="content in contents" :key="content.id">
        <RouterLink :to='content.link??"/"' :class="content.id">
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