<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'
</script>

<template>
  <div class="privacy-policy-view">
    <HomeHeadline :headline="new Headline('privacy-policy', 'プライバシーポリシー')" />
    
    <div class="policy-content">
      <section>
        <h3>1. 個人情報の利用目的</h3>
        <p>当サイトでは、お問い合わせやサービスのご依頼、また当サイトが提供するアプリケーションのご利用の際に、お名前、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は、以下の目的で利用いたします。</p>
        <ul>
          <li>お問い合わせに対する回答</li>
          <li>サービス提供に関する連絡・打ち合わせ</li>
          <li>請求書等の発行</li>
        </ul>
      </section>

      <section>
        <h3>2. 取得する個人情報の項目</h3>
        <p>当サイトでは、以下の情報を取得する場合があります。</p>
        <ul>
          <li>お名前、メールアドレス等、お問い合わせの際にご入力いただく情報</li>
          <li>Cookie、アクセスログ、IPアドレス等の閲覧・利用に関する情報</li>
        </ul>
      </section>

      <section>
        <h3>3. 個人情報の第三者提供・外部委託</h3>
        <p>当サイトでは、お客様からお預かりした個人情報を、お客様の同意を得ることなく第三者に提供することはございません。ただし、以下の場合には、お客様の同意なく個人情報を開示することがあります。</p>
        <ul>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要がある場合</li>
          <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
          <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
        </ul>
        <p>また、当サイトはアクセス解析等の目的で外部サービス（Google Analytics等）に個人情報の取り扱いを委託することがあります。委託先に対しては、個人情報を適切に管理するよう必要な監督を行います。</p>
      </section>

      <section>
        <h3>4. 個人情報の安全管理</h3>
        <p>当サイトでは、個人情報の漏洩、紛失、改ざんなどを防ぐため、適切なセキュリティ対策を実施しています。また、個人情報を取り扱う従業者に対して、個人情報保護についての教育を行っています。</p>
      </section>

      <section>
        <h3>5. Cookieの使用</h3>
        <p>当サイトでは、一部のコンテンツでCookieを使用しています。Cookieとは、ウェブサイトを利用したときに、ブラウザーとサーバーとの間で送受信した利用履歴や入力内容などを、お客様のコンピューターにファイルとして保存しておく仕組みです。</p>
        <p>当サイトでは、以下の目的でCookieを使用します。</p>
        <ul>
          <li>ウェブサイトの利便性向上</li>
          <li>アクセス解析（当サイトでは、Google Analyticsを利用しています）</li>
        </ul>
        <p>お客様はブラウザーの設定により、Cookieの受け取りを拒否することができます。ただし、その場合、当サイトの一部の機能が利用できなくなる可能性があります。Google Analyticsによるデータ収集を無効にしたい場合は、Googleが提供する<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">オプトアウトアドオン</a>をご利用いただけます。</p>
      </section>

      <section>
        <h3>6. アプリ内購入について</h3>
        <p>当サイトが公開するiOS向けアプリケーションにおいてアプリ内購入（App内課金）をご利用いただく場合、決済処理はApple Inc.が提供するApp Storeの仕組みを通じて行われ、氏名、購入履歴、決済情報等はApple社によって取り扱われます。これらの情報の取り扱いについては、<a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple社のプライバシーポリシー</a>が適用され、当サイトが直接これらの決済情報を取得・保有することはありません。</p>
      </section>

      <section>
        <h3>7. 個人情報の開示・訂正・削除等の請求</h3>
        <p>お客様は、当サイトが保有する自己の個人情報について、開示、訂正、追加、削除、利用停止等を求めることができます。ご希望の場合は、下記のお問い合わせ先までご連絡ください。ご本人確認の上、法令に従い合理的な範囲で速やかに対応いたします。</p>
      </section>

      <section>
        <h3>8. プライバシーポリシーの変更</h3>
        <p>当サイトは、必要に応じて本プライバシーポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。</p>
      </section>

      <section>
        <h3>9. お問い合わせ</h3>
        <p>当サイトの個人情報の取り扱いに関するお問い合わせは、<a href="/contact">お問い合わせフォーム</a>よりご連絡ください。</p>
      </section>

      <div class="policy-footer">
        <p>制定日: 2025年3月1日</p>
        <p>最終更新日: 2026年9月27日</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy-view {
  padding: 30px;
}

.policy-content {
  margin-top: 20px;
  line-height: 1.7;
}

section {
  margin-bottom: 30px;
}

h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: var(--color-heading);
  position: relative;
  padding-left: 12px;
}

h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #41b883;
  border-radius: 2px;
}

ul {
  padding-left: 20px;
  margin-top: 10px;
}

li {
  margin-bottom: 8px;
}

.policy-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}
</style>