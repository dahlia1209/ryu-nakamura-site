---
title: Mining Log
description: Mining Log
---
<script setup lang="ts">
import { useBlockchainService } from './src/services/blockchainService';
import { computed, onMounted, ref, watchEffect } from 'vue'

const blockchainService = useBlockchainService();

const miningLog=ref<string[]>([])

onMounted(async ()=>{
    miningLog.value=await blockchainService.getMiningLog()
})
</script>

<div v-for="l in miningLog">
    {{ l }}
</div>


