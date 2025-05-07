<script setup lang="ts">
import ContentsList from '../components/HomeContents.vue'
import HomeHeadline from '../components/HomeHeadline.vue'
import HomeTable from '../components/HomeTable.vue'
import {Headline} from '../models/page'
import { useContentStore } from '../stores/content';
import WorkItem from '../components/WorkItem.vue'
import ContentItem from '../components/ContentItem.vue';
import {ref} from 'vue'

const contentStore = useContentStore();

const utility=(()=>{
  const headlines=ref<Headline[]>([])
  const calculateAge=(birthDate: string)=>{
    const today: Date = new Date();
    const birth: Date = new Date(birthDate);
    let age: number = today.getFullYear() - birth.getFullYear();
    const monthDiff: number = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const pushHeadline=(elem:Headline)=>{
    headlines.value.push(elem)
  }

  //返り値
  return{
    calculateAge,
    pushHeadline,
    headlines
  }
})()

</script>

<template>
  <div class="home">
    <!-- <h1 class="title">トップページ</h1> -->
    <!-- <HomeHeadline :headline="new Headline('contents','目次')" @input-by="utility.pushHeadline" />
    <div class="description">
      <ContentsList :contents="utility.headlines.value" />
    </div> -->
    <HomeHeadline :headline="new Headline('purpose','本サイトの目的')" @input-by="utility.pushHeadline" />
    <div class="description">
      本サイトは個人開発アプリやデジタルコンテンツの紹介・販売を目的としています。<br>
      
    </div>
    <HomeHeadline :headline="new Headline('works','事業内容')" @input-by="utility.pushHeadline" />
    <div class="description">
      <p>下記のアプリケーションやデジタルコンテンツの開発・販売を実施しています。</p>
      <strong>
        <p>■アプリケーション</p>
      </strong>
      現在公開中のアプリケーションです。
      <div class="works-grid">
      <WorkItem 
        v-for="item in contentStore.workItems" 
        :key="item.id"
        :project="item"
      />
    </div>
    <strong>
        <p>■デジタルコンテンツ</p>
      </strong>
      現在公開中のコンテンツ一覧です。
        <div class="content-grid">
      <ContentItem 
        v-for="content in contentStore.contentItems" 
        :key="content.titleNo" 
        :content="content" 
      />
    </div>
    </div>
    <HomeHeadline :headline="new Headline('contact','お問い合わせ')" @input-by="utility.pushHeadline" />
    <div class="description">
      <a href="/contact">お問い合わせフォーム</a>または<a href="mailto:dahlia1209@gmail.com">dahlia1209@gmail.com</a>宛へご連絡ください
      
    </div>
    <HomeHeadline :headline="new Headline('owner','事業者情報')" @input-by="utility.pushHeadline" />
    <div class="description">
      <HomeTable />
    </div>
    <HomeHeadline :headline="new Headline('profile','自己紹介')" @input-by="utility.pushHeadline" />
    <div class="description">
      <ul>
        <li>名前：中村龍 (ナカムラ リュウ)</li>
        <li>生年月日：1994年12月9日 ({{ utility.calculateAge('1994-12-09') }}歳)</li>
        <li>最終学歴：明治大学政治経済学部経済学科 卒業</li>
        <li>職歴：
          <ul>
            <li>2017年4月 Winテクノロジ株式会社(現SCSK Minoriソリューションズ株式会社) 入社</li>
            <li>2021年2月 Winテクノロジ株式会社 退社</li>
            <li>2021年3月 株式会社VSN(<a href="https://www.akkodis.co.jp/" target="_blank"
                rel="noopener noreferrer">AKKODiSコンサルティング株式会社</a>) 入社</li>
            <li>{{ new Date().getFullYear() }}年{{ (new Date().getMonth()) + 1 }}月 現職</li>
          </ul>
        </li>
      </ul>
    </div>
    <HomeHeadline :headline="new Headline('revision','更新履歴')" @input-by="utility.pushHeadline" />
    <div class="description">
      <ul>
        <li>2025/03/01 新規作成</li>
      </ul>
    </div>
    <div class="bottom"></div>

  </div>
</template>

<style scoped>
.home {
  flex-direction: column;
  padding: 0 30px;
}

.bottom{
  padding: 0 0 20px 0;
}

.description{
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
    th, td {
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
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}
</style>