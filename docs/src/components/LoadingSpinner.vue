<script lang="ts" setup>

</script>

<template>
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>読み込み中...</p>
    </div>
</template>

<style scoped>

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #41b883;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>