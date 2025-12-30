<script lang="ts" setup>
import { onMounted } from 'vue';
import {Headline} from '../models/page'

const props = defineProps<{
  headline:Headline
}>()

const emit = defineEmits<{
  inputBy: [Headline]
}>()

onMounted(()=>{
  emit('inputBy',props.headline)
})

</script>

<template>
<h2 v-if="props.headline.headtag=='h2'" :id="props.headline.id" v-html="props.headline.display"></h2>
<h1 v-else-if="props.headline.headtag=='h1'" :id="props.headline.id" v-html="props.headline.display"></h1>

</template>

<style scoped>
h2 {
  border-left: 5px solid var(--vp-c-green-3);
  padding-left: 10px;
}
h1 {
  border-left: 5px solid var(--vp-c-green-3);
  padding-left: 10px;
}
</style>