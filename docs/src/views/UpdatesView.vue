<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'
import { getMergedUpdates } from '../data/updates'
import type { UpdateType } from '../models/update'

const updates = getMergedUpdates()

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
  <div class="updates-container">
    <HomeHeadline :headline="new Headline('updates', '更新情報')" />
    <p class="intro-text">新着記事・アプリの更新・お知らせをまとめて掲載しています。</p>

    <ul class="updates-list">
      <li v-for="(update, index) in updates" :key="index" class="update-row">
        <div class="update-date">{{ formatDate(update.date) }}</div>
        <div class="update-body">
          <span class="type-badge" :class="update.type">{{ typeLabel[update.type] }}</span>
          <a v-if="update.link" :href="update.link" class="update-title">{{ update.title }}</a>
          <span v-else class="update-title">{{ update.title }}</span>
          <p class="update-description">{{ update.description }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.updates-container {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  margin-bottom: 30px;
}

.intro-text {
  margin-bottom: 10px;
}

.updates-list {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.update-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid #eee;
}

.update-date {
  color: #888;
  font-size: 0.85rem;
  padding-top: 3px;
}

.update-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
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
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-heading);
  text-decoration: none;
}

a.update-title:hover {
  color: var(--vp-c-green-3);
}

.update-description {
  margin: 2px 0 0;
  color: var(--color-text);
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .update-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
