<script setup lang="ts">
// WorkItem.vue - 個別の作品カードコンポーネント

interface WorkProject {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  projectUrl?: string;
  githubUrl?: string;
}

const props = defineProps<{
  project: WorkProject
}>();
</script>

<template>
  <div class="work-card">
    <div class="image-container">
      <!-- 画像がない場合のフォールバック処理 -->
      <img 
        :src="project.imageUrl" 
        :alt="project.title"
      >
    </div>
    
    <div class="work-content">
      <h3>{{ project.title }}</h3>
      
      <p class="description">{{ project.description }}</p>
      
      <div class="tech-stack">
        <span v-for="(tech, index) in project.techStack" :key="index" class="tech-tag">
          {{ tech }}
        </span>
      </div>
      
      <div class="links">
        <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank" class="project-link">
          サイトを見る
        </a>
        <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="github-link">
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.work-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.image-container {
  height: 200px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.work-card:hover .image-container img {
  transform: scale(1.05);
}

.work-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 10px 0;
  color: var(--color-heading);
  font-size: 1.4rem;
}

.description {
  margin-bottom: 15px;
  color: var(--color-text);
  flex-grow: 1;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tech-tag {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #555;
}

.links {
  display: flex;
  gap: 10px;
}

.project-link, .github-link {
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.project-link {
  background-color: #41b883; /* Vue.jsの緑 */
  color: white;
}

.github-link {
  background-color: #24292e; /* GitHubカラー */
  color: white;
}

.project-link:hover, .github-link:hover {
  opacity: 0.9;
}

/* @media (prefers-color-scheme: dark) {
  .work-card {
    background-color: var(--vt-c-black-soft);
  }
  
  .tech-tag {
    background-color: var(--vt-c-black-mute);
    color: var(--vt-c-text-dark-2);
  }
} */
</style>