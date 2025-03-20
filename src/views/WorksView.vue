<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import WorkItem from '../components/WorkItem.vue'
import { Headline } from '@/models/page'
import { WorkProject } from '@/models/work'
import { ref } from 'vue'


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
        v-for="project in [
          {
            id: 1,
            title: 'Web麻雀',
            description: '個人開発したWebベースの麻雀ゲームです。基本的な麻雀操作（打牌、副露、アガリなど）を実装しています。',
            imageUrl: '/1431764.jpg', 
            techStack: ['Vue.js', 'TypeScript','Python'],
            projectUrl: 'https://webmajiang.ryu-nakamura.com/',
            githubUrl: 'https://github.com/dahlia1209/WebMajiang-client'
          } as WorkProject,
        ]" 
        :key="project.id"
        :project="project"
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
}

@media (max-width: 768px) {
  .works-grid {
    grid-template-columns: 1fr;
  }
}
</style>