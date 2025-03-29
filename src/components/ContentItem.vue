<script setup lang="ts">
import { ContentItem } from '@/models/content';

const props = defineProps<{
  content: ContentItem
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
</script>

<template>
  <div class="content-card">
    <div class="image-container">
      <img 
        :src="content.imageUrl" 
        :alt="content.title"
        onerror="this.src='/placeholder.jpg'"
      >
      <div v-if="content.isFeatured" class="featured-badge">おすすめ</div>
    </div>
    
    <div class="content-info">
      <h3>{{ content.title }}</h3>
      
      <p class="description">{{ content.previewContent }}</p>
      
      <div class="meta-info">
        <div class="tags">
          <span v-for="(tag, index) in content.tags" :key="index" class="tag">
            {{ tag }}
          </span>
        </div>
        <div class="publish-date">{{ formatDate(content.publishDate) }}</div>
      </div>
      
      <div class="price-section">
        <div class="price">{{ formatPrice(content.price) }}</div>
      </div>
      
      <div class="action-buttons">
        <RouterLink :to="`/column/${content.id}`" class="details-button">
          詳細を見る
        </RouterLink>
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
}

.description {
  margin-bottom: 15px;
  color: var(--color-text);
  line-height: 1.6;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  justify-content: center;
}

.details-button {
  background-color: #41b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  display: block;
  text-align: center;
  transition: background-color 0.3s;
  width: 100%;
}

.details-button:hover {
  background-color: #389f70;
}
</style>