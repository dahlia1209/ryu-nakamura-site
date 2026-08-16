<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import WorkItem from '../components/WorkItem.vue'
import { Headline } from '../models/page'
import { useContentStore } from '../stores/content';

const contentStore = useContentStore();
</script>

<template>
  <div class="apps-container">
    <HomeHeadline :headline="new Headline('apps', 'アプリ一覧')" />
    <div class="intro-text">
      <p>これまでに個人で開発してきた、無料で使えるWebアプリを紹介します。</p>
    </div>
    <div class="works-grid">
      <WorkItem v-for="item in contentStore.workItems" :key="item.id" :project="item" />
    </div>
  </div>
</template>

<style scoped>
.apps-container {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
}

.intro-text {
}

.works-grid {
  display: grid;
  gap: 30px;
  margin-top: 20px;
  padding-bottom: 40px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .works-grid {
    grid-template-columns: 1fr;
  }
}
</style>
