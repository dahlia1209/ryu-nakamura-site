<script setup lang="ts">
import { Content, PreviewContent } from '../models/content';
import { withBase, useData, useRouter } from 'vitepress'
import { type MediaType, XTrendData, NewsContents, type XContent, type CategoryType } from '../models/report'


const { theme } = useData()
const router = useRouter()

const props = defineProps<{
  contents: XContent[]
  category: CategoryType
}>();

const getDisplayName = () => {
  if (props.category == "longest_trending") {
    return "長時間トレンド"
  } else if (props.category == "max_tweets") {
    return "最大ポスト数"
  } else if (props.category == "new_trends") {
    return "新しいトレンド"
  } else {
    return "アクティブトレンド"
  }
}

</script>

<template>
  <div class="item-container">
    <h3>{{ getDisplayName() }}</h3>
    <div class="content-card">
      <div v-for="content in contents" :key="content.id" class="x-item">
        <div class="content-info">
          <div class='ranking-number'>{{ content.rank }}</div>
          <div class="news-content">
            <div class="news-title">
              {{ content.trend }}
            </div>
            <div class="news-meta" >
              <span class="trend-info">{{ content.info }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-container {
  display: flex;
  flex-direction: column;
}

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
  padding: 5px;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
}

h3 {
  margin: 0 0 12px 0;
  color: var(--color-heading);
  font-size: 1.3rem;
  line-height: 1.4;
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

.details-button,
.note-link {
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

.news-title {
  font-size: 1.1em;
  font-weight: bold;
  line-height: 1.4;
  height: calc(1.4em * 2);
  color: #333;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: justify;
}

.x-item {
  display: flex;
  align-items: center;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
  text-decoration: none;
  color: inherit;
}
</style>