<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'
import { YouTubeVideoData, type YoutubeContent, type MediaType, XTrendData, NewsContents, type XContent ,type XCategories} from '../models/report'
import { useContentStore } from '../stores/content'

const contentStore = useContentStore();

const localStore = (() => {
  /*state*/
  const xContents = ref(new NewsContents('X', 'https://nakamurast20250505.blob.core.windows.net/root/content-image/2002.webp', []))
  const youtubeContents = ref(new NewsContents('youtube', 'https://nakamurast20250505.blob.core.windows.net/root/content-image/2001.webp', []))
  const activeTab = ref<MediaType>('youtube')
  const loading = ref(true)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const headlines = ref<Headline[]>([])
  const pushHeadline = (elem: Headline) => {
    headlines.value.push(elem)
  }
  /*getter*/
  const getNewsContents = computed(() => {
    if (activeTab.value == "X") {
      return youtubeContents.value.lastUpdated ?? null
    }else if(activeTab.value == "youtube"){
      return xContents.value.lastUpdated ?? null
    }else{
      throw Error
    }
  })

  /*action*/
  const loadTodayNews = async () => {
    try {
      localStore.state.loading.value = true

      // YouTubeデータとXトレンドデータを並行取得
      const [youtubeResult, xTrendsResult] = await Promise.all([
        contentStore.reportService.getYoutubeVideoReportWithMetadata(),
        contentStore.reportService.getXTrendWithMetadata()
      ])
      // YouTubeデータをMediaContentフォーマットに変換
      const youtubeJsonData: YouTubeVideoData[] = youtubeResult.data
      const youTubeVideoData = youtubeJsonData.map(x => YouTubeVideoData.fromData(x))
      const youtubeItems: YoutubeContent[] = youTubeVideoData.map(video => video.toYoutubeContent())

      const xJsonData: XTrendData[] = xTrendsResult.data
      const xTrendData = xJsonData.map(x => XTrendData.fromData(x))
      const xItems: XContent[] = xTrendData.map(x => x.toXContent())

      youtubeContents.value.contents = youtubeItems
      youtubeContents.value.lastUpdated = youtubeResult.lastModified ?? undefined
      xContents.value.contents = xItems
      xContents.value.lastUpdated = xTrendsResult.lastModified ?? undefined
      localStore.state.error.value = null
    } catch (err) {
      localStore.state.error.value = 'ニュースの取得に失敗しました'
      console.error('Error loading today news:', err)
    } finally {
      localStore.state.loading.value = false
    }
  }


  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return ''
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getCategorizedTrends = () => {
    const trends = localStore.state.xContents.value.contents
    const categories = [
      { name: 'longest_trending', displayName: '長時間トレンド', items: [] } as XCategories,
      { name: 'max_tweets', displayName: '最大ツイート数', items: [] }as XCategories,
      { name: 'new_trends', displayName: '新しいトレンド', items: [] }as XCategories,
      { name: 'popular_active', displayName: '人気・アクティブ', items: [] }as XCategories,
    ]

    trends.forEach(trend => {
      const category = categories.find(cat => cat.name === trend.category)
      if (category) {
        category.items.push(trend)
      }
    })

    return categories.filter(cat => cat.items.length > 0)
  }

  return {
    state: {
      activeTab,
      loading,
      error,
      lastUpdated,
      youtubeContents,
      xContents,

    },
    getter: {
      getNewsContents
    },
    action: {
      loadTodayNews,
      formatTime,
      formatLastUpdated,
      pushHeadline,
      headlines,
      getCategorizedTrends
    },
  }
})()


onMounted(async () => {
  localStore.action.loadTodayNews()
})
</script>

<template>
  <div class="today-news">
    <HomeHeadline :headline="new Headline('today-news', '今日のトレンド')" @input-by="localStore.action.pushHeadline" />

    <div class="description">
      各メディアのトレンドをお届けします。
    </div>

    <div v-if="localStore.getter.getNewsContents.value" class="last-updated">
      最終更新: {{ localStore.action.formatLastUpdated(localStore.getter.getNewsContents.value) }}
    </div>

    <div v-if="localStore.state.loading.value" class="loading">
      <div class="spinner"></div>
      <p>ニュースを読み込み中...</p>
    </div>

    <div v-else-if="localStore.state.error.value" class="error">
      <p>{{ localStore.state.error.value }}</p>
      <button @click="localStore.action.loadTodayNews()" class="retry-button">
      </button>
    </div>

    <div v-else class="news-container">
      <!-- タブナビゲーション -->
      <div class="tab-navigation">
        <button @click="localStore.state.activeTab.value = 'youtube'"
          :class="['tab-button', { active: localStore.state.activeTab.value === 'youtube' }]">
          <img v-if="localStore.state.youtubeContents.value.mediaLogoSrc"
            :src="localStore.state.youtubeContents.value.mediaLogoSrc" alt="YouTube" class="tab-image" />
        </button>
        <button @click="localStore.state.activeTab.value = 'X'"
          :class="['tab-button', { active: localStore.state.activeTab.value === 'X' }]">
          <img v-if="localStore.state.xContents.value.mediaLogoSrc" :src="localStore.state.xContents.value.mediaLogoSrc"
            alt="X" class="tab-image" />
        </button>
      </div>

      <!-- ニュースリスト -->
      <div class="news-list">
        <div v-if="localStore.state.activeTab.value === 'youtube'" class="news-content-container">
          <a v-for="(item, index) in localStore.state.youtubeContents.value.contents" :key="item.id" :href="item.url"
            target="_blank" rel="noopener noreferrer" class="news-item">
            <div :class="[index + 1 < 10 ? 'ranking-number' : 'ranking-number-10']">
              {{ index + 1 }}
            </div>
            <div class="news-thumbnail">
              <img :src="item.thumbnail" :alt="item.title" />
            </div>
            <div class="news-content">
              <div class="news-title">
                {{ item.title }}
              </div>
              <div class="news-meta">
                <span class="views">{{ item.views.toLocaleString() }} 回視聴</span>
                <span class="publish-time">{{ localStore.action.formatTime(item.publishedAt.toISOString()) }}</span>
              </div>
            </div>
          </a>
        </div>
        <div v-if="localStore.state.activeTab.value === 'X'" class="news-content-container">
          <div v-for="category in localStore.action.getCategorizedTrends()" :key="category.name" class="trend-category">
            <h3 class="category-title">{{ category.displayName }}</h3>
            <a v-for="item in category.items" :key="item.id" :href="item.url"
              target="_blank" rel="noopener noreferrer" class="news-item">
              <div :class="[item.rank < 10 ? 'ranking-number' : 'ranking-number-10']">
                {{ item.rank }}
              </div>

              <div class="news-content">
                <div class="news-title">
                  {{ item.trend }}
                </div>
                <div class="news-meta" v-if="item.info">
                  <span class="trend-info">{{ item.info }}</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trend-category {
  margin-bottom: 30px;
}

.category-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.trend-info {
  color: #666;
  font-size: 0.9em;
}
.today-news {
  flex-direction: column;
  padding: 0 30px;
  margin-bottom: 30px;
}

.description {
  margin-bottom: 15px;
  color: #666;
  font-size: 1.1em;
}

.last-updated {
  margin-bottom: 30px;
  color: #888;
  font-size: 0.9em;
  text-align: right;
  font-style: italic;
}

.loading {
  text-align: center;
  padding: 60px 0;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 40px 0;
  color: #e74c3c;
}

.retry-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-button:hover {
  background: #c0392b;
}

.news-container {
  margin-bottom: 40px;
}

/* タブナビゲーション */
.tab-navigation {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
  justify-content: center;
  flex: 1;
}

.tab-button:hover {
  color: #333;
  background: #f8f9fa;
}

.tab-button.active {
  color: #3498db;
  border-bottom-color: #3498db;
  font-weight: bold;
}

.tab-image {
  max-width: 100%;
  max-height: 40px;
  object-fit: contain;
}

/* ニュースリスト */
.news-list {
  display: flex;
  flex-direction: row;
}

.news-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.news-item:hover {
  background: #f8f9fa;
}

.news-item:hover .news-title {
  color: #3498db;
  text-decoration: underline;
}

.news-item:last-child {
  border-bottom: none;
}

.ranking-number,
.ranking-number-10 {
  font-size: 2em;
  font-weight: bold;
  color: #3498db;
  min-width: 60px;
  text-align: center;
}

.news-item:nth-child(1) .ranking-number {
  color: #f39c12;
}

.news-item:nth-child(2) .ranking-number {
  color: #95a5a6;
}

.news-item:nth-child(3) .ranking-number {
  color: #cd7f32;
}

.news-thumbnail {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  overflow: hidden;
  border-radius: 6px;
}

.news-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  font-size: 1.1em;
  font-weight: bold;
  line-height: 1.4;
  color: #333;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: justify;
}

.news-meta {
  display: flex;
  align-items: center;
  font-size: 0.8em;
  color: #999;
}

.views {
  font-weight: bold;
  color: #666;
  flex: 2;
}

.publish-time {
  color: #888;
  flex: 1;
}

.refresh-section {
  text-align: center;
  margin-top: 40px;
}

.refresh-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.3s ease;
}

.refresh-button:hover:not(:disabled) {
  background: #2980b9;
}

.refresh-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .today-news {
    padding: 0 10px;
  }

  .tab-navigation {
    gap: 10px;
  }

  .tab-button {
    padding: 12px 16px;
  }

  .news-item {
    flex-direction: row;
    text-align: center;
    gap: 5px;
    padding: 5px
  }

  .ranking-number {
    min-width: auto;
  }

  .ranking-number-10 {
    min-width: auto;
    font-size: 1em;
  }

  .news-meta {
    justify-content: start;
  }
}


/* 準備中セクション */
.coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
}

.coming-soon-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 40px;
  border: 2px dashed #dee2e6;
  max-width: 400px;
}

.coming-soon-icon {
  font-size: 3em;
  margin-bottom: 20px;
}

.coming-soon h3 {
  margin: 0 0 15px 0;
  font-size: 1.5em;
  color: #666;
}

.coming-soon p {
  margin: 0;
  color: #888;
  font-size: 1.1em;
}

.news-content-container {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.twitter-item {
  padding: 20px 15px;
}

.twitter-item .news-content {
  margin-left: 10px;
}
</style>