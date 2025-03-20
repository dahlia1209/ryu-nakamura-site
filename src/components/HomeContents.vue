<script setup lang="ts" >
import {onMounted} from 'vue'
import {Headline} from '@/models/page'

const props = defineProps<{
  contents: Headline[],
}>()

</script>

<template>
<ul v-for="(content) in props.contents" :key="content.id">
    <li><a :href="content.link">{{content.display}}</a></li>
</ul>
</template>