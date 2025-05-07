<script setup lang="ts">
defineProps<{
  pageName: string
}>()
</script>

<template>
  <div class="under-construction">
    <div class="container">
      <div class="icon">
        <img src="/src/assets/maintenance.svg" alt="maintenance">
      </div>
      <h2 class="title">{{ pageName }}ページは準備中です</h2>
      <p class="message">現在このページは開発中です。近日公開予定ですので、しばらくお待ちください。</p>
      <div class="home-link">
        <!-- <RouterLink to="/" class="btn">トップページに戻る</RouterLink> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.under-construction {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 60vh;
  width: 100%;
}

.container {
  max-width: 600px;
  text-align: center;
}

.icon {
  margin-bottom: 30px;
}

.construction-icon {
  width: 80px;
  height: 80px;
  fill: #2D3E50;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2D3E50;
}

.message {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

.home-link {
  margin-top: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #41b883;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #3aa876;
}

/* @media (prefers-color-scheme: dark) {
  .construction-icon {
    fill: #f8f8f8;
  }
  
  .title {
    color: #f8f8f8;
  }
  
  .message {
    color: #e8e8e8;
  }
} */
</style>