<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import WorkItem from '../components/WorkItem.vue'
import { Headline } from '@/models/page'
import { WorkProject } from '@/models/work'
import { ref } from 'vue'
import { useContentStore } from '@/stores/content';
import ContentItem from '../components/ContentItem.vue';

const contentStore = useContentStore();

</script>

<template>
  <div class="works-container">
    <HomeHeadline :headline="new Headline('my-works', '制作物一覧')" />
    
    <div class="works-description">
      これまでに個人で開発してきた作品を紹介します。
      各プロジェクトの詳細については、リンク先をご確認ください。
    </div>
    
    <div class="works-grid">
      <WorkItem 
        v-for="item in contentStore.workItems" 
        :key="item.id"
        :project="item"
      />
    </div>
    <HomeHeadline :headline="new Headline('contents', '販売コンテンツ一覧')" />
    <div class="alert-message">
      <div class="alert-icon">⚠️</div>
      <div class="alert-content">
        <h3>テスト環境のお知らせ</h3>
        <p>現在、コンテンツ販売はテスト段階であり、掲載されているコンテンツは実際には存在しません。</p>
        <p>決済機能もテスト用に設定されていますので、<strong>誤って購入しないようご注意ください</strong>。</p>
      </div>
    </div>
    
    <div class="intro-text">
      <p>プログラミングやクラウド技術に関する有料コンテンツを提供しています。</p>
      <p>各コンテンツは技術記事、ガイド、チュートリアルなどのフォーマットで、実践的な知識とスキルを身につけることができます。</p>
    </div>
        <div class="content-grid">
      <ContentItem 
        v-for="content in contentStore.contentItems" 
        :key="content.id" 
        :content="content" 
      />
    </div>
  </div>

</template>

<style scoped>
.works-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.works-description {
  margin: 20px 0 30px;
  line-height: 1.6;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
  padding-bottom: 40px;
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
  margin: 20px 0 30px;
  line-height: 1.6;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}


@media (max-width: 768px) {
  .works-grid {
    grid-template-columns: 1fr;
  }
}
</style>