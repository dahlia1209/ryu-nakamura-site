<script setup lang="ts" >
import {onMounted} from 'vue'
import {Headline} from '@/models/page'

const props = defineProps<{
  contents: Headline[],
}>()

onMounted(()=>{
  console.log('contents',props.contents)
})

// onMounted(()=>{
//     //サブ関数
//     const _validateProps=()=>{
//         if (props.links.length!=props.displays.length) throw new Error(`引数が正しくありません。要素数が一致しません。links:${props.links.length},text:${props.displays.length}`)
//     }

//     //メイン処理
//     _validateProps()
// })

</script>

<template>
<ul v-for="(content) in props.contents" :key="content.id">
    <li><a :href="content.link">{{content.display}}</a></li>
</ul>
</template>