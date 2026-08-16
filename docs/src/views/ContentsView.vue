<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'
import ContentItem from '../components/ContentItem.vue';
import { data } from '../data/contents.data'

</script>

<template>
  <div class="works-container">
    <HomeHeadline :headline="new Headline('contents', 'コンテンツ一覧')" />
    <div class="intro-text">
      <p>現在公開中の記事コンテンツを紹介します。購入すると全文をお読みいただけます。</p>
    </div>
    <div class="content-grid">
      <ContentItem v-for="content in data.contents" :key="content.title_no" :content="content" />
    </div>
  </div>

</template>

<style scoped>
.works-container {
  display: flex;
  flex-direction: column;
  padding: 0 30px;

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

</style>