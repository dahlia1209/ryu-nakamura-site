<script setup lang="ts">
import { ref, computed } from 'vue';
import HomeHeadline from '../components/HomeHeadline.vue';
import ContentItem from '../components/ContentItem.vue';
import { Headline } from '@/models/page';
import { useContentStore } from '@/stores/content';

const contentStore = useContentStore();
const searchQuery = ref('');
const selectedCategory = ref('');

// Get all categories
const categories = computed(() => {
  const categorySet = new Set<string>();
  contentStore.contentItems.forEach(item => categorySet.add(item.category));
  return Array.from(categorySet);
});

// Filter content based on search and category
const filteredContent = computed(() => {
  let filtered = contentStore.contentItems;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(item => item.category === selectedCategory.value);
  }
  
  return filtered;
});

// Reset filters
function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
}
</script>

<template>
  <div class="column-view">
    <HomeHeadline :headline="new Headline('column-page', 'コラム・コンテンツ')" />
    
    <div class="intro-text">
      <p>プログラミングやクラウド技術に関する有料コンテンツを提供しています。</p>
      <p>各コンテンツは技術記事、ガイド、チュートリアルなどのフォーマットで、実践的な知識とスキルを身につけることができます。</p>
    </div>
    
    <!-- Filter controls -->
    <div class="filter-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="タイトル、説明、タグで検索..."
          class="search-input"
        >
      </div>
      
      <div class="category-filter">
        <label for="category-select">カテゴリ:</label>
        <select id="category-select" v-model="selectedCategory" class="category-select">
          <option value="">すべて</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <button @click="resetFilters" class="reset-button">
        フィルターをリセット
      </button>
    </div>
    
    <!-- Results count -->
    <div class="results-info">
      <p>{{ filteredContent.length }}件のコンテンツが見つかりました</p>
    </div>
    
    <!-- Content grid -->
    <div class="content-grid">
      <ContentItem 
        v-for="content in filteredContent" 
        :key="content.id" 
        :content="content" 
      />
    </div>
    
    <!-- No results message -->
    <div v-if="filteredContent.length === 0" class="no-results">
      <p>条件に一致するコンテンツが見つかりませんでした。</p>
      <button @click="resetFilters" class="reset-button">フィルターをリセット</button>
    </div>
  </div>
</template>

<style scoped>
.column-view {
  width: 100%;
  padding-bottom: 40px;
}

.intro-text {
  margin: 20px 0 30px;
  line-height: 1.6;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.95rem;
}

.reset-button {
  background-color: #e0e0e0;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #d0d0d0;
}

.results-info {
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.no-results {
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
}

.no-results p {
  margin-bottom: 15px;
  color: #666;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .category-select, 
  .search-input {
    width: 100%;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>