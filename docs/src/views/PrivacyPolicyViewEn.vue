<script setup lang="ts">
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'
</script>

<template>
  <div class="privacy-policy-view">
    <HomeHeadline :headline="new Headline('privacy-policy', 'Privacy Policy')" />

    <div class="policy-content">
      <section>
        <h3>1. Purpose of Use of Personal Information</h3>
        <p>This website may ask you to register personal information such as your name and email address when you make an inquiry, request a service, or use an application provided by this website. This personal information is used for the following purposes.</p>
        <ul>
          <li>To respond to inquiries</li>
          <li>To communicate and coordinate regarding service provision</li>
          <li>To issue invoices, etc.</li>
        </ul>
      </section>

      <section>
        <h3>2. Information We Collect</h3>
        <p>This website may collect the following information.</p>
        <ul>
          <li>Information you enter when making an inquiry, such as your name and email address</li>
          <li>Information related to browsing and use, such as cookies, access logs, and IP addresses</li>
        </ul>
      </section>

      <section>
        <h3>3. Disclosure to Third Parties and Outsourcing</h3>
        <p>This website will not disclose personal information entrusted to us by customers to third parties without the customer's consent, except in the following cases.</p>
        <ul>
          <li>Where required by law</li>
          <li>Where necessary to protect a person's life, body, or property</li>
          <li>Where particularly necessary for improving public health or promoting the sound development of children</li>
          <li>Where necessary to cooperate with a national or local government agency, or a party entrusted by such an agency, in carrying out affairs prescribed by law</li>
        </ul>
        <p>This website may also outsource the handling of personal information to external services (such as Google Analytics) for purposes such as access analysis. We provide necessary supervision to ensure that such contractors manage personal information appropriately.</p>
      </section>

      <section>
        <h3>4. Security Management of Personal Information</h3>
        <p>This website implements appropriate security measures to prevent the leakage, loss, or falsification of personal information. We also provide training on personal information protection to employees who handle personal information.</p>
      </section>

      <section>
        <h3>5. Use of Cookies</h3>
        <p>This website uses cookies in some of its content. A cookie is a mechanism for storing usage history and input information exchanged between your browser and our server as a file on your computer when you use a website.</p>
        <p>This website uses cookies for the following purposes.</p>
        <ul>
          <li>To improve the convenience of the website</li>
          <li>For access analysis (this website uses Google Analytics)</li>
        </ul>
        <p>You can refuse to accept cookies through your browser settings. However, in that case, some functions of this website may become unavailable. If you wish to disable data collection by Google Analytics, you can use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">opt-out add-on</a> provided by Google.</p>
      </section>

      <section>
        <h3>6. In-App Purchases</h3>
        <p>When you use in-app purchases in an iOS application published by this website, the payment processing is handled through Apple Inc.'s App Store, and your name, purchase history, and payment information are handled by Apple. The handling of this information is governed by <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple's Privacy Policy</a>, and this website does not directly collect or retain this payment information.</p>
      </section>

      <section>
        <h3>7. Requests for Disclosure, Correction, or Deletion of Personal Information</h3>
        <p>You may request disclosure, correction, addition, deletion, or suspension of use of your own personal information held by this website. If you wish to make such a request, please contact us using the information below. After verifying your identity, we will respond promptly within a reasonable scope in accordance with applicable law.</p>
      </section>

      <section>
        <h3>8. Changes to This Privacy Policy</h3>
        <p>This website may change the content of this Privacy Policy as necessary. The revised Privacy Policy shall take effect from the time it is posted on this website.</p>
      </section>

      <section>
        <h3>9. Contact Us</h3>
        <p>If you have any inquiries regarding the handling of personal information on this website, please contact us via our <a href="/contact">contact form</a>.</p>
      </section>

      <div class="policy-footer">
        <p>Established: March 1, 2025</p>
        <p>Last updated: September 27, 2026</p>
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
