<script setup lang="ts">
// FooterItem.vue - フッターコンポーネント
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="footer-content">
      <div class="footer-links">
        <RouterLink to="/privacy-policy">プライバシーポリシー</RouterLink>
        <RouterLink to="/contact">お問い合わせ</RouterLink>
      </div>
      <div class="copyright">
        &copy; {{ currentYear }} 中村システムエンジニアリング事業所. All Rights Reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;
  background-color: #f4f2ee;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0;
  margin-top: 40px;
}

.footer-content {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.footer-links a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #41b883;
}

.copyright {
  font-size: 0.85rem;
  color: #666;
}

@media (max-width: 767px) {
  .footer-content {
    padding: 0 15px;
  }
}
</style>