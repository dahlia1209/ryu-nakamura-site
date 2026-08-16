<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'
import { useContentStore } from '../stores/content';
import WorkItem from '../components/WorkItem.vue'
import ContentItem from '../components/ContentItem.vue';
import { data } from '../data/contents.data'
import { getMergedUpdates } from '../data/updates'
import type { UpdateType } from '../models/update'

const contentStore = useContentStore();

const recentUpdates = getMergedUpdates().slice(0, 5)
const recentApps = contentStore.workItems.slice(0, 3)
const recentContents = data.contents.slice(0, 3)

const typeLabel: Record<UpdateType, string> = {
  article: '記事',
  app: 'アプリ',
  notice: 'お知らせ',
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}
</script>

<template>
  <div class="home">
    <HomeHeadline :headline="new Headline('purpose', 'Webアプリと技術記事', 'h1')" />
    <p class="hero-lede">
      個人開発したWebアプリを無料で公開しているほか、プログラミングやクラウド技術に関する記事コンテンツを購入制で提供しています。
    </p>

    <section class="section">
      <HomeHeadline :headline="new Headline('updates', '更新情報')" />
      <ul class="updates-list">
        <li v-for="(update, index) in recentUpdates" :key="index" class="update-row">
          <span class="update-date">{{ formatDate(update.date) }}</span>
          <span class="type-badge" :class="update.type">{{ typeLabel[update.type] }}</span>
          <a v-if="update.link" :href="update.link" class="update-title">{{ update.title }}</a>
          <span v-else class="update-title">{{ update.title }}</span>
        </li>
      </ul>
      <a href="/updates" class="more-link">更新情報をすべて見る &rarr;</a>
    </section>

    <section class="section">
      <HomeHeadline :headline="new Headline('apps', 'アプリ')" />
      <p class="section-lede">無料で使えるWebアプリです。</p>
      <div class="apps-grid">
        <WorkItem v-for="item in recentApps" :key="item.id" :project="item" />
      </div>
      <a href="/apps" class="more-link">アプリ一覧を見る &rarr;</a>
    </section>

    <section class="section">
      <HomeHeadline :headline="new Headline('contents', '記事')" />
      <p class="section-lede">購入制の技術記事です。</p>
      <div class="contents-grid">
        <ContentItem v-for="content in recentContents" :key="content.title_no" :content="content" />
      </div>
      <a href="/contents" class="more-link">記事一覧を見る &rarr;</a>
    </section>

    <section class="section cta-section">
      <p>個人事業主として、Webアプリケーション開発や技術コンサルティングのご相談を承っています。</p>
      <div class="cta-links">
        <a href="/about" class="cta-link">プロフィールを見る</a>
        <a href="/contact" class="cta-link cta-link-primary">お問い合わせ</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  margin-bottom: 30px;
}

.hero-lede {
  color: var(--color-text);
  max-width: 60ch;
  margin: 0 0 10px;
}

.section {
  margin-top: 40px;
}

.section-lede {
  margin: 0 0 10px;
}

.more-link {
  display: inline-block;
  margin-top: 16px;
  color: var(--vp-c-green-3);
  font-weight: 600;
  text-decoration: none;
}

.more-link:hover {
  opacity: 0.75;
}

.apps-grid,
.contents-grid {
  display: grid;
  gap: 25px;
  margin-top: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.updates-list {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.update-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
}

.update-date {
  color: #888;
  font-size: 0.85rem;
  min-width: 110px;
}

.type-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}

.type-badge.article {
  background-color: #f5ecd9;
  color: #a8752c;
}

.type-badge.app {
  background-color: #e5eef8;
  color: #2f6fb0;
}

.type-badge.notice {
  background-color: #e3efe8;
  color: var(--vp-c-green-3);
}

.update-title {
  color: var(--color-heading);
  text-decoration: none;
  font-weight: 500;
}

a.update-title:hover {
  color: var(--vp-c-green-3);
}

.cta-section {
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.cta-links {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.cta-link {
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid var(--vp-c-green-3);
  color: var(--vp-c-green-3);
}

.cta-link-primary {
  background-color: var(--vp-c-green-3);
  color: white;
}

.cta-link:hover {
  opacity: 0.85;
}

@media (max-width: 640px) {
  .update-date {
    min-width: auto;
  }
}
</style>
