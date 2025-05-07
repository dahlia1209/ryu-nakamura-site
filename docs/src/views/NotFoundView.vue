<script setup lang="ts">
import { ref } from 'vue';
import HomeHeadline from '../components/HomeHeadline.vue';
import { Headline } from '../models/page';

const suggestions = ref([
  { text: 'トップページに戻る', link: '/' },
  { text: 'コンテンツを見る', link: '/contents' },
  { text: 'お問い合わせ', link: '/contact' }
]);

</script>

<template>
  <div class="not-found-view">
    <HomeHeadline :headline="new Headline('not-found', 'ページが見つかりません')" />
    
    <div class="not-found-content">
     
      <p class="error-message">
        お探しのページは見つかりませんでした。URLが正しいかご確認ください。
      </p>
      
      <div class="suggestions">
        <h3>お役立ちリンク</h3>
        <ul>
          <li v-for="(suggestion, index) in suggestions" :key="index">
            <!-- <RouterLink :to="suggestion.link">{{ suggestion.text }}</RouterLink> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  width: 100%;
  padding-bottom: 40px;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: #41b883;
  line-height: 1;
  margin-bottom: 20px;
  opacity: 0.6;
}

.error-illustration {
  margin: 20px 0;
}

.error-message {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 500px;
}

.suggestions {
  margin-top: 20px;
  text-align: center;
}

.suggestions h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: var(--color-heading);
}

.suggestions ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.suggestions li {
  margin: 5px;
}

.suggestions a {
  display: inline-block;
  padding: 10px 20px;
  background-color: #41b883;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.suggestions a:hover {
  background-color: #3aa876;
}

@media (max-width: 767px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-illustration svg {
    width: 140px;
    height: 140px;
  }
  
  .error-message {
    font-size: 1.1rem;
  }
  
  .suggestions ul {
    flex-direction: column;
    gap: 10px;
  }
}
</style>