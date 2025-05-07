<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'
</script>

<template>
  <div class="transaction-law-view">
    <HomeHeadline :headline="new Headline('transaction-law', '特定商取引法に基づく表記')" />
    
    <div class="law-content">
      <p class="introduction">特定商取引法に基づく表記は以下の通りです。</p>
      
      <table class="transaction-table">
        <tbody>
          <tr>
            <th>販売事業者</th>
            <td>
              <p>中村 龍</p>
            </td>
          </tr>
          <tr>
            <th>代表責任者</th>
            <td>
              <p>中村 龍</p>
            </td>
          </tr>
          <tr>
            <th>所在地</th>
            <td>〒101-0024 東京都千代田区神田和泉町1番地6-16ヤマトビル405</td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>
              <p>非公開</p>
              <p>※ご請求時に開示いたします</p>
            </td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>
              <p><a href="mailto:dahlia1209@gmail.com">dahlia1209@gmail.com</a></p>
            </td>
          </tr>
          <tr>
            <th>商品販売価格</th>
            <td>
              <p>デジタルコンテンツ：各商品ページに記載の金額</p>
            </td>
          </tr>
          <tr>
            <th>商品代金以外に必要な料金</th>
            <td>
              <p>デジタルコンテンツ：なし</p>
              <p>※各商品ページに記載の金額を請求します</p>
            </td>
          </tr>
          <tr>
            <th>支払方法</th>
            <td>
              <p>クレジットカード決済（Visa、Mastercard、American Express、JCB）</p>
              <p>※決済手続きはStripeを利用しています。</p>
            </td>
          </tr>
          <tr>
            <th>支払時期</th>
            <td>
              <p>クレジットカード決済：注文時に直ちに処理されます。</p>
            </td>
          </tr>
          <tr>
            <th>商品の引渡時期</th>
            <td>
              <p>デジタルコンテンツ：ご注文完了後、即時アクセス可能となります。</p>
            </td>
          </tr>
          <tr>
            <th>返品・キャンセルについて</th>
            <td>
              <p>デジタルコンテンツ：商品の性質上、購入後の返品・キャンセルはお受けできません。</p>
            </td>
          </tr>
          <tr>
            <th>表現及び商品に関する注意書き</th>
            <td>
              <p>当サイトに掲載している商品やサービスの情報、価格等は、予告なく変更される場合があります。</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.transaction-law-view {
  padding: 30px;
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