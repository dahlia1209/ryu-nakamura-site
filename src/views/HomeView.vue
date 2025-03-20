<script setup lang="ts">
import ContentsList from '../components/HomeContents.vue'
import HomeHeadline from '../components/HomeHeadline.vue'
import HomeTable from '../components/HomeTable.vue'
import {Headline} from '@/models/page'
import {ref} from 'vue'

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
    <h1 class="title">トップページ</h1>
    <HomeHeadline :headline="new Headline('contents','目次')" @input-by="utility.pushHeadline" />
    <div class="description">
      <ContentsList :contents="utility.headlines.value" />
    </div>
    <HomeHeadline :headline="new Headline('purpose','本サイトの目的')" @input-by="utility.pushHeadline" />
    <div class="description">
      ご一緒にお仕事させていただける方を探しています。<br>
      {{ new Date().getFullYear() }}年{{ (new Date().getMonth()) + 1 }}月現在、
      ご提供可能なサービスは検討中ですが、ご相談事項がありましたら
      <a href="mailto:dahlia1209@gmail.com">dahlia1209@gmail.com</a>宛にご連絡ください。<br>
      スポット(週最大20時間程度)での対応であればご検討可能です。<br>
    </div>
    <HomeHeadline :headline="new Headline('works','活動内容')" @input-by="utility.pushHeadline" />
    <div class="description">
      これまでWebアプリケーションの開発、保守運用業務を中心に経験してきました。<br>
      個人開発でWeb麻雀も作成しており、下記リンクで公開しています。<br>
      <a href="https://webmajiang.ryu-nakamura.com/" target="_blank"
      rel="noopener noreferrer">https://webmajiang.ryu-nakamura.com/</a><br>
      ※未完成のため打牌や副露、アガリ等の基本的な操作しか実装できていません。<br><br>
      
      下記リンクのgithubでソースコードを公開しています。<br>
      <a href="https://github.com/dahlia1209" target="_blank"
        rel="noopener noreferrer">https://github.com/dahlia1209</a>
    </div>
    <HomeHeadline :headline="new Headline('contact','お問い合わせ')" @input-by="utility.pushHeadline" />
    <div class="description">
      下記メールアドレス宛へご連絡ください<br>
      <a href="mailto:dahlia1209@gmail.com">dahlia1209@gmail.com</a><br>
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
/* h2 {
  border-left: 5px solid #008000;
  padding-left: 10px;
} */

.home {
  flex-direction: column;
}
.bottom{
  padding: 0 0 20px 0;
}

.description{
  padding-top: 20px;
  padding-bottom: 20px;
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
</style>