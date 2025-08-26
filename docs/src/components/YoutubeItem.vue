<script setup lang="ts">
import { Content, PreviewContent } from '../models/content';
import { withBase, useData, useRouter } from 'vitepress'
import { YouTubeVideoData, type YoutubeContent, type MediaType, XTrendData, NewsContents, type XContent, type XCategories } from '../models/report'


const { theme } = useData()
const router = useRouter()

const props = defineProps<{
  content: YoutubeContent
  rank:number
}>();

// Format date to human-readable
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Format currency to Japanese Yen
function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    currencyDisplay: 'symbol'
  }).format(price);
}

const formatViews = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="content-card">
    <div class="image-container">
      <img :src="content.thumbnail" :alt="content.title">
    </div>

    <div class="content-info">
      <div class= 'ranking-number'>
              {{rank}}
            </div>
      <h3>{{ content.title }}</h3>
      <div class="description">{{ content.description }}</div>

      <div class="video-info">
        <span class="views">{{ content.views.toLocaleString() }} 回視聴</span>
        <span class="publish-time">{{ formatViews(content.publishedAt.toISOString()) }}</span>
      </div>

      <div class="action-buttons">
        <a :href="content.url" target="_blank" rel="noopener noreferrer" class="details-button" >
          <img src="https://nakamurast20250505.blob.core.windows.net/root/content-image/2001.webp" alt="logo" class="logo">
        </a>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  height: 100%;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.image-container {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.content-card:hover .image-container img {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.content-info {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 12px 0;
  color: var(--color-heading);
  font-size: 1.3rem;
  line-height: 1.4;
  height: calc(1.4em * 3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  margin-bottom: 15px;
  color: var(--color-text);
  line-height: 1.4;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: calc(1.4em * 4);
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.85rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #555;
}

.publish-date {
  color: #666;
}

.price-section {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2D3E50;
}

.action-buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  cursor: pointer;
}

.video-info {
  display: flex;
  align-items: center;
  color: #999;
}

.views {
  font-weight: bold;
  color: #666;
  flex: 1;
}

.publish-time {
  color: #888;
  flex: 1;
}

.details-button{
  padding: 8px 12px;
  display: flex;
}

.note-link {
  background-color: #f0f0f0;
  color: black;
}

.note-icon {
  display: inline-block;
  vertical-align: middle;
  width: 72px;
}

.details-button {
  background-color: #f0f0f0; 
  color: white;
}


.note-link:hover,
.details-button:hover {
  opacity: 0.9;
}

.ranking-number,
.ranking-number-10 {
  font-size: 2em;
  font-weight: bold;
  color: #3498db;
  min-width: 60px;
  text-align: center;
}
.logo{
  width: 120px;
}
</style>