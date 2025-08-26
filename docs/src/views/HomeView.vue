<script setup lang="ts">
import ContentsList from '../components/HomeContents.vue'
import HomeHeadline from '../components/HomeHeadline.vue'
import HomeTable from '../components/HomeTable.vue'
import { Headline } from '../models/page'
import { useContentStore } from '../stores/content';
import WorkItem from '../components/WorkItem.vue'
import ContentItem from '../components/ContentItem.vue';
import YoutubeItem from '../components/YoutubeItem.vue';
import XItem from '../components/XItem.vue';
import { ref, useTemplateRef, onMounted, watchEffect, computed } from 'vue'
import { useRouter, useRoute } from 'vitepress'
import { data } from '../data/contents.data'
import { YouTubeVideoData, type YoutubeContent, type MediaType, XTrendData, NewsContents, type XContent, type XCategories, type CategoryType } from '../models/report'


const contentStore = useContentStore();
const route = useRoute()

const localStore = (() => {
  /* state */
  const headlines = ref<Headline[]>([])
  const leftBtn1 = useTemplateRef<HTMLButtonElement>("left-button1")
  const rightBtn1 = useTemplateRef<HTMLButtonElement>("right-button1")
  const contentGrid1 = useTemplateRef<HTMLButtonElement>("content-grid1")
  const leftBtn2 = useTemplateRef<HTMLButtonElement>("left-button2")
  const rightBtn2 = useTemplateRef<HTMLButtonElement>("right-button2")
  const contentGrid2 = useTemplateRef<HTMLButtonElement>("content-grid2")
  const leftBtn3 = useTemplateRef<HTMLButtonElement>("left-button3")
  const rightBtn3 = useTemplateRef<HTMLButtonElement>("right-button3")
  const contentGrid3 = useTemplateRef<HTMLButtonElement>("content-grid3")
  const xContents = ref(new NewsContents('X', 'https://nakamurast20250505.blob.core.windows.net/root/content-image/2002.webp', []))
  const youtubeContents = ref(new NewsContents('youtube', 'https://nakamurast20250505.blob.core.windows.net/root/content-image/2001.webp', []))

  /* getter */


  /* action */
  const pushHeadline = (elem: Headline) => {
    headlines.value.push(elem)
  }

  const calculateAge = (birthDate: string) => {
    const today: Date = new Date();
    const birth: Date = new Date(birthDate);
    let age: number = today.getFullYear() - birth.getFullYear();
    const monthDiff: number = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const updateButtons = (leftBtn: HTMLButtonElement | null, rightBtn: HTMLButtonElement | null, btnContainer: HTMLElement | null) => {
    if (leftBtn && rightBtn && btnContainer) {
      const isAtStart = btnContainer.scrollLeft <= 0;
      const isAtEnd = btnContainer.scrollLeft >= btnContainer.scrollWidth - btnContainer.clientWidth - 10;
      leftBtn.disabled = isAtStart;
      rightBtn.disabled = isAtEnd;
    }
  }

  const scrollContents = (leftBtn: HTMLButtonElement | null, rightBtn: HTMLButtonElement | null, btnContainer: HTMLElement | null, scrollAmount: number) => {
    if (leftBtn && rightBtn && btnContainer) {
      btnContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      updateButtons(leftBtn, rightBtn, btnContainer)
    }
  }

  const loadTodayNews = async () => {
    try {
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
      // localStore.state.error.value = null
    } catch (err) {
      // localStore.state.error.value = 'ニュースの取得に失敗しました'
      console.error('Error loading today news:', err)
    } finally {
      // localStore.state.loading.value = false
    }
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

  const getXContents = (type: CategoryType) => {
    return xContents.value.contents.filter(x => x.category == type) as XContent[]
  }

  

  //返り値
  return {
    state: {
      headlines,
      youtubeContents,
      xContents,
      leftBtn1,
      rightBtn1,
      contentGrid1,
      leftBtn2,
      rightBtn2,
      contentGrid2,
      leftBtn3,
      rightBtn3,
      contentGrid3,

    },
    getter: {

    },
    action: {
      calculateAge,
      pushHeadline,
      updateButtons,
      scrollContents,
      loadTodayNews,
      formatLastUpdated,
      getXContents
    },
  }
})()

onMounted(async () => {
  await localStore.action.loadTodayNews()
  localStore.action.updateButtons(localStore.state.leftBtn1.value, localStore.state.rightBtn1.value, localStore.state.contentGrid1.value)
  localStore.action.updateButtons(localStore.state.leftBtn2.value, localStore.state.rightBtn2.value, localStore.state.contentGrid2.value)
  localStore.action.updateButtons(localStore.state.leftBtn3.value, localStore.state.rightBtn3.value, localStore.state.contentGrid3.value)
})

</script>

<template>
  <div class="home">
    <HomeHeadline :headline="new Headline('purpose', '本サイトの目的')" @input-by="localStore.action.pushHeadline" />
    <div class="description">
      本サイトは個人開発アプリやデジタルコンテンツの紹介・販売を目的としています。<br>
    </div>


    <HomeHeadline :headline="new Headline('works', '事業内容')" @input-by="localStore.action.pushHeadline" />
    <div class="description">
      <h3>■デジタルコンテンツ</h3>
      <p>現在公開中のコンテンツ一覧です。</p>
      <div class="content-grid-container scroll-btn-container">
        <button class="scroll-btn scroll-left" ref="left-button1"
          @click="localStore.action.scrollContents(localStore.state.leftBtn1.value, localStore.state.rightBtn1.value, localStore.state.contentGrid1.value, -320)">‹</button>
        <button class="scroll-btn scroll-right" ref="right-button1"
          @click="localStore.action.scrollContents(localStore.state.leftBtn1.value, localStore.state.rightBtn1.value, localStore.state.contentGrid1.value, 320)">›</button>
        <div class="content-grid" ref="content-grid1"
          @scroll="localStore.action.updateButtons(localStore.state.leftBtn1.value, localStore.state.rightBtn1.value, localStore.state.contentGrid1.value)">
          <ContentItem v-for="content in data.contents" :key="content.title_no" :content="content"
            class="content-item" />
        </div>
      </div>

      <h3>■アプリケーション</h3>
      <p>現在公開中のアプリケーションです。</p>
      <div class="works-grid">
        <WorkItem v-for="item in contentStore.workItems" :key="item.id" :project="item" />
      </div>

      <h3>■最新トレンド</h3>
      <div class="youtube-description-container">
        <p>YouTubeの注目動画</p>
        <p class="last-updated">　最終更新日時: {{
          localStore.action.formatLastUpdated(localStore.state.youtubeContents.value.lastUpdated ?? null) }}</p>
      </div>
      <div class="content-grid-container scroll-btn-container">
        <button class="scroll-btn scroll-left" ref="left-button2"
          @click="localStore.action.scrollContents(localStore.state.leftBtn2.value, localStore.state.rightBtn2.value, localStore.state.contentGrid2.value, -320)">‹</button>
        <button class="scroll-btn scroll-right" ref="right-button2"
          @click="localStore.action.scrollContents(localStore.state.leftBtn2.value, localStore.state.rightBtn2.value, localStore.state.contentGrid2.value, 320)">›</button>
        <div class="content-grid" ref="content-grid2"
          @scroll="localStore.action.updateButtons(localStore.state.leftBtn2.value, localStore.state.rightBtn2.value, localStore.state.contentGrid2.value)">
          <YoutubeItem v-for="(item, index) in localStore.state.youtubeContents.value.contents" :key="item.id"
            :content="item" :rank="index + 1" />
        </div>
      </div>
      <div class="x-description-container">
        <p>Xのトレンドリスト</p>
        <div class="last-updated">　最終更新日時: {{
          localStore.action.formatLastUpdated(localStore.state.xContents.value.lastUpdated ?? null) }}</div>
      </div>
      <div class="content-grid-container scroll-btn-container">
        <button class="scroll-btn scroll-left" ref="left-button3"
          @click="localStore.action.scrollContents(localStore.state.leftBtn3.value, localStore.state.rightBtn3.value, localStore.state.contentGrid3.value, -320)">‹</button>
        <button class="scroll-btn scroll-right" ref="right-button3"
          @click="localStore.action.scrollContents(localStore.state.leftBtn3.value, localStore.state.rightBtn3.value, localStore.state.contentGrid3.value, 320)">›</button>
        <div class="content-grid" ref="content-grid3"
          @scroll="localStore.action.updateButtons(localStore.state.leftBtn3.value, localStore.state.rightBtn3.value, localStore.state.contentGrid3.value,)">
          <XItem
            v-for="(categoryType, index) in (['longest_trending', 'max_tweets', 'new_trends', 'popular_active'] as CategoryType[])"
            :key="index" :category="categoryType" :contents="localStore.action.getXContents(categoryType)" />
        </div>
      </div>

    </div>



  </div>
</template>

<style scoped>
.home {
  flex-direction: column;
  padding: 0 30px;
  margin-bottom: 30px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

caption {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 10px;
}

thead {
  background-color: #333;
  color: white;
}

tfoot {
  background-color: #f2f2f2;
  font-weight: bold;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.works-grid {
  display: grid;
  gap: 30px;
  margin-top: 20px;
  padding-bottom: 40px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-bottom: 50px;
}

.content-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 300px;
  gap: 25px;
  margin-bottom: 50px;
  overflow-x: auto;
}

.scroll-btn-container {
  position: relative;
}

.scroll-btn {
  position: absolute;
  top: 30%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.scroll-left {
  left: 10px;
}

.scroll-right {
  right: 10px;
}

.scroll-btn:hover {
  background: white;
  transform: translateY(-10%) scale(1.1);
}

.scroll-btn:disabled {
  opacity: 0;
  cursor: not-allowed;
  transform: translateY(-10%) scale(0.9);
}

.last-updated {
  margin-bottom: 30px;
  color: #888;
  font-size: 0.9em;
  font-style: italic;
}

.youtube-description-container,
.x-description-container {
  display: flex;
  flex-direction: column;
}
</style>