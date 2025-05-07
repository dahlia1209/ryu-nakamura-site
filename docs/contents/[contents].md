---
title: test
---

<script setup lang="ts">
import ContentDetailView from '../src/views/ContentDetailView.vue'
import {useRoute,useData } from 'vitepress'

const { params } = useData()
const route=useRoute()

</script>
<ContentDetailView />
<style module>


</style>