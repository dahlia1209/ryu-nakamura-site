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
import { data } from '../data/contents.data'

const contentStore = useContentStore();
const route = useRoute()

const localStore = (() => {
  /* state */
  const headlines = ref<Headline[]>([])


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

  //返り値
  return {
    state: {
      headlines,
    },
    getter: {

    },
    action: {
      calculateAge,
      pushHeadline,
    },
  }
})()

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
      <div class="content-grid scroll-container">
        <ContentItem v-for="content in data.contents" :key="content.title_no" :content="content" class="content-item" />
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

/* .scroll-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 20px 0;
  margin: 20px 0;
  border-radius: 10px;
  background: #f8f9fa;
  scrollbar-width: thin;
  scrollbar-color: #667eea #e9ecef;
} */

/* .scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #e9ecef;
  border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #5a67d8, #6b46c1);
} */

/* .content-item {
  display: inline-block;
  width: 280px;
  height: 200px;
  margin: 0 15px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  vertical-align: top;
  white-space: normal;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
} */

/* .content-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.content-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}  */
</style>