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
        <p>当サイトでは、お問い合わせやサービスのご依頼の際に、お名前、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は、以下の目的で利用いたします。</p>
        <ul>
          <li>お問い合わせに対する回答</li>
          <li>サービス提供に関する連絡・打ち合わせ</li>
          <li>請求書等の発行</li>
        </ul>
      </section>
      
      <section>
        <h3>2. 個人情報の第三者提供</h3>
        <p>当サイトでは、お客様からお預かりした個人情報を、お客様の同意を得ることなく第三者に提供することはございません。ただし、以下の場合には、お客様の同意なく個人情報を開示することがあります。</p>
        <ul>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要がある場合</li>
          <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
          <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
        </ul>
      </section>
      
      <section>
        <h3>3. 個人情報の安全管理</h3>
        <p>当サイトでは、個人情報の漏洩、紛失、改ざんなどを防ぐため、適切なセキュリティ対策を実施しています。また、個人情報を取り扱う従業者に対して、個人情報保護についての教育を行っています。</p>
      </section>
      
      <section>
        <h3>4. Cookieの使用</h3>
        <p>当サイトでは、一部のコンテンツでCookieを使用しています。Cookieとは、ウェブサイトを利用したときに、ブラウザーとサーバーとの間で送受信した利用履歴や入力内容などを、お客様のコンピューターにファイルとして保存しておく仕組みです。</p>
        <p>当サイトでは、以下の目的でCookieを使用します。</p>
        <ul>
          <li>ウェブサイトの利便性向上</li>
          <li>アクセス解析（当サイトでは、Google Analyticsを利用しています）</li>
        </ul>
        <p>お客様はブラウザーの設定により、Cookieの受け取りを拒否することができます。ただし、その場合、当サイトの一部の機能が利用できなくなる可能性があります。</p>
      </section>
      
      <section>
        <h3>5. プライバシーポリシーの変更</h3>
        <p>当サイトは、必要に応じて本プライバシーポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。</p>
      </section>
      
      <section>
        <h3>6. お問い合わせ</h3>
        <p>当サイトの個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。</p>
        <div class="contact-info">
          <p>中村システムエンジニアリング事業所</p>
          <p>メールアドレス: <a href="mailto:dahlia1209@gmail.com">dahlia1209@gmail.com</a></p>
        </div>
      </section>
      
      <div class="policy-footer">
        <p>制定日: 2025年3月1日</p>
        <p>最終更新日: 2025年3月28日</p>
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

.contact-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}

.policy-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}
</style>