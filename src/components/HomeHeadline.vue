<script lang="ts" setup>
import { onMounted } from 'vue';
import {Headline} from '@/models/page'

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
<h2 :id="props.headline.id">{{ props.headline.display }}</h2>

</template>

<style scoped>
h2 {
  border-left: 5px solid #008000;
  padding-left: 10px;
}
</style>