<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '@/models/page'
</script>

<template>
  <div class="transaction-law-view">
    <HomeHeadline :headline="new Headline('transaction-law', '特定商取引法に基づく表記')" />
    
    <div class="law-content">
      <p class="introduction">特定商取引法（特定商取引に関する法律）に基づく表記は以下の通りです。</p>
      
      <table class="transaction-table">
        <tbody>
          <tr>
            <th>販売事業者</th>
            <td>
              <p>屋号：中村システムエンジニアリング事業所</p>
              <p>事業主名：中村 龍</p>
            </td>
          </tr>
          <tr>
            <th>所在地</th>
            <td>〒101-0024 東京都千代田区神田和泉町1番地6-16ヤマトビル405</td>
          </tr>
          <tr>
            <th>連絡先</th>
            <td>
              <p>メールアドレス: <a href="mailto:dahlia1209@gmail.com">dahlia1209@gmail.com</a></p>
              <p>※お問い合わせは上記メールアドレスにお願いいたします。</p>
            </td>
          </tr>
          <tr>
            <th>商品代金以外に必要な費用</th>
            <td>
              <p>商品により消費税がかかります。</p>
              <p>デジタルコンテンツに関しては、インターネット接続料およびデバイスの通信料は購入者のご負担となります。</p>
            </td>
          </tr>
          <tr>
            <th>お支払い方法</th>
            <td>
              <p>クレジットカード決済（Visa、Mastercard、American Express、JCB）</p>
              <p>※決済手続きはStripeを利用しています。</p>
            </td>
          </tr>
          <tr>
            <th>商品の引渡し時期</th>
            <td>
              <p>デジタルコンテンツ：決済完了後、即時アクセス可能となります。</p>
              <p>コンサルティングサービス等：個別に合意した納期に従います。</p>
            </td>
          </tr>
          <tr>
            <th>返品・キャンセルについて</th>
            <td>
              <p>デジタルコンテンツ：性質上、購入後の返品・キャンセルはお受けできません。</p>
              <p>コンサルティングサービス等：サービス提供開始前であれば、キャンセル可能です。ただし、既に作業を開始している場合は、進捗状況に応じた料金が発生する場合があります。</p>
            </td>
          </tr>
          <tr>
            <th>表現及び商品に関する注意書き</th>
            <td>
              <p>当サイトに掲載している商品やサービスの情報、価格等は、予告なく変更される場合があります。</p>
              <p>また、コンテンツの効果には個人差があり、結果を保証するものではありません。</p>
            </td>
          </tr>
          <tr>
            <th>重要なお知らせ</th>
            <td>
              <p class="warning-text">※現在、クレジットカード決済システムはテスト実装中です。実際に購入手続きを行わないでください。</p>
              <p>コンテンツを閲覧されたい場合は、各コンテンツページに記載されているnoteのURLからご購入ください。</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.transaction-law-view {
  width: 100%;
  padding-bottom: 40px;
}

.law-content {
  margin-top: 20px;
  line-height: 1.7;
}

.introduction {
  margin-bottom: 20px;
}

.transaction-table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 30px;
}

.transaction-table th, 
.transaction-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  vertical-align: top;
}

.transaction-table th {
  background-color: #f2f2f2;
  width: 25%;
  font-weight: 600;
  color: #333;
}

.transaction-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.transaction-table p {
  margin: 0 0 8px 0;
}

.transaction-table p:last-child {
  margin-bottom: 0;
}

a {
  color: #41b883;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .transaction-table th {
    width: 35%;
  }
}

@media (max-width: 480px) {
  .transaction-table th,
  .transaction-table td {
    display: block;
    width: 100%;
  }
  
  .transaction-table th {
    border-bottom: none;
    padding-bottom: 5px;
  }
  
  .transaction-table td {
    border-top: none;
    padding-top: 5px;
  }
  
  .transaction-table tr {
    border-bottom: 2px solid #ddd;
  }
}

.warning-text {
  color: #e74c3c;
  font-weight: bold;
}
</style>