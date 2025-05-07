<script setup lang="ts">
import { Content } from '../models/content';
import { withBase, useData,useRouter } from 'vitepress'

const { theme } = useData()
const router=useRouter()

const props = defineProps<{
  content: Content
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
      >
    </div>
    
    <div class="content-info">
      <h3>{{ content.title }}</h3>
      
      <div class="description">{{ content.contentText }}</div>
      
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
        <a :href="(`/contents/${content.titleNo}`)" class="details-button">
          詳細を見る
        </a>
        <a v-if="content.noteUrl" :href="content.noteUrl" target="_blank" class="note-link">
          <img src="../assets/logo/note_logo.svg" alt="note_logo" class="note-icon">
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
  gap: 10px;
  cursor: pointer;
}

/* .details-button {
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
} */

/* .details-button:hover {
  background-color: #389f70;
} */

.details-button, .note-link {
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
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
  background-color: #41b883; 
  color: white;
}


.note-link:hover,.details-button:hover {
  opacity: 0.9;
}


</style>