<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import WorkItem from '../components/WorkItem.vue'
import { Headline } from '../models/page'
import { useContentStore } from '../stores/content';
import ContentItem from '../components/ContentItem.vue';

const contentStore = useContentStore();

</script>

<template>
  <div class="works-container">
    <HomeHeadline :headline="new Headline('contents', 'コンテンツ一覧')" />
    <div class="intro-text">
      <p>現在公開中の記事コンテンツを紹介します。</p>
    </div>
    <div class="content-grid">
      <ContentItem v-for="content in contentStore.contentItems" :key="content.titleNo" :content="content" />
    </div>

    <HomeHeadline :headline="new Headline('my-works', '制作アプリ一覧')" />
    <div class="works-description">
      これまでに個人で開発してきたアプリを紹介します。
    </div>
    <div class="works-grid">
      <WorkItem v-for="item in contentStore.workItems" :key="item.id" :project="item" />
    </div>
  </div>

</template>

<style scoped>
.works-container {
  display: flex;
  flex-direction: column;
  padding: 0 30px;

}

.works-description {
}

.works-grid {
  display: grid;
  gap: 30px;
  margin-top: 20px;
  padding-bottom: 40px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.column-view {
  width: 100%;
  padding-bottom: 40px;
}

.alert-message {
  display: flex;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-left: 5px solid #e0a800;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  align-items: center;
}

.alert-icon {
  font-size: 24px;
  margin-right: 15px;
  flex-shrink: 0;
}

.alert-content h3 {
  margin: 0 0 8px 0;
  color: #856404;
  font-size: 1.1rem;
}

.alert-content p {
  margin: 5px 0;
  color: #856404;
}

.alert-content strong {
  font-weight: 600;
}

.intro-text {
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}


@media (max-width: 768px) {
  .works-grid {
    grid-template-columns: 1fr;
  }
}
</style>