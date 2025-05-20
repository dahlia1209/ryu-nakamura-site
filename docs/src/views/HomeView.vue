<script setup lang="ts">
import ContentsList from '../components/HomeContents.vue'
import HomeHeadline from '../components/HomeHeadline.vue'
import HomeTable from '../components/HomeTable.vue'
import { Headline } from '../models/page'
import { useContentStore } from '../stores/content';
import WorkItem from '../components/WorkItem.vue'
import ContentItem from '../components/ContentItem.vue';
import { ref } from 'vue'
import { useRouter, useRoute } from 'vitepress'

const contentStore = useContentStore();
const route = useRoute()

const utility = (() => {
  const headlines = ref<Headline[]>([])
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

  const pushHeadline = (elem: Headline) => {
    headlines.value.push(elem)
  }

  //返り値
  return {
    calculateAge,
    pushHeadline,
    headlines
  }
})()

</script>

<template>
  <div class="home">
    <HomeHeadline :headline="new Headline('purpose', '本サイトの目的')" @input-by="utility.pushHeadline" />
    <div class="description">
      本サイトは個人開発アプリやデジタルコンテンツの紹介・販売を目的としています。<br>
    </div>


    <HomeHeadline :headline="new Headline('works', '事業内容')" @input-by="utility.pushHeadline" />
    <div class="description">
      <h3>■デジタルコンテンツ</h3>
      <p>現在公開中のコンテンツ一覧です。</p>
      <div class="content-grid">
        <ContentItem v-for="content in contentStore.contentItems" :key="content.titleNo" :content="content" />
      </div>

      <h3>■アプリケーション</h3>
      <p>現在公開中のアプリケーションです。</p>
      <div class="works-grid">
        <WorkItem v-for="item in contentStore.workItems" :key="item.id" :project="item" />
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}
</style>