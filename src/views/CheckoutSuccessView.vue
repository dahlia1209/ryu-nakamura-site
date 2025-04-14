<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { CheckoutSessionStatus } from '@/models/content';

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();

const isLoading = ref(true);
const error = ref<string | null>(null);
const sessionData = ref<CheckoutSessionStatus | null>(null);

onMounted(async () => {
  // Get session_id from URL query parameter
  const sessionId = route.query.session_id as string;
  
  if (!sessionId) {
    error.value = 'セッションIDが見つかりません。';
    isLoading.value = false;
    return;
  }
  
  try {
    // Fetch session data from API
    const data = await contentStore.checkoutService.getSessionStatus(sessionId);
    sessionData.value = data;
    console.log("sessionData.value",sessionData.value)
    isLoading.value = false;
  } catch (err) {
    console.error('Error fetching session data:', err);
    error.value = '購入情報の取得中にエラーが発生しました。';
    isLoading.value = false;
  }
});

// Handle return to home
function goToHome() {
  router.push('/');
}

// Handle view content
function viewContentLibrary() {
  router.push('/contents');
}
</script>

<template>
  <div class="checkout-success">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>購入情報を確認中...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h1>エラーが発生しました</h1>
      <p>{{ error }}</p>
      <div class="action-buttons">
        <button @click="goToHome" class="home-button">トップページに戻る</button>
      </div>
    </div>
    
    <div v-else-if="sessionData && sessionData.payment_status === 'paid'" class="success-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <h1>購入が完了しました！</h1>
      <p class="success-message">ご購入ありがとうございます。コンテンツにアクセスするためのリンクをメールでお送りしました。</p>
      
      <div class="order-details">
        <h2>購入情報</h2>
        <div class="order-info">
          <div class="info-row">
            <span>注文ID:</span>
            <span>{{ sessionData.id }}</span>
          </div>
          <div class="info-row">
            <span>金額:</span>
            <span>{{ new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(sessionData.amount_total) }}</span>
          </div>
          <div class="info-row">
            <span>メールアドレス:</span>
            <span>{{ sessionData.customer_email }}</span>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="viewContentLibrary" class="library-button">コンテンツ一覧に戻る</button>
        <button @click="goToHome" class="home-button">トップページに戻る</button>
      </div>
      
      <div class="next-steps">
        <h3>次のステップ</h3>
        <ul>
          <li>ご登録いただいたメールアドレスに購入確認メールが送信されています。</li>
          <li>メールに記載されたリンクからコンテンツにアクセスできます。</li>
          <li>ご不明な点がありましたら、お問い合わせページからご連絡ください。</li>
        </ul>
      </div>
    </div>
    
    <div v-else class="pending-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <h1>処理中...</h1>
      <p>お支払いは処理中です。しばらくしてから再度ご確認ください。</p>
      <div class="action-buttons">
        <button @click="viewContentLibrary" class="library-button">コンテンツ一覧に戻る</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-success {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.loading-state,
.error-state,
.success-state,
.pending-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #41b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

svg {
  margin-bottom: 20px;
}

.success-state svg {
  color: #41b883;
}

.error-state svg {
  color: #e74c3c;
}

.pending-state svg {
  color: #f39c12;
}

h1 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--color-heading);
}

.success-message {
  font-size: 1.1rem;
  margin-bottom: 30px;
  color: #2D3E50;
  max-width: 600px;
}

.order-details {
  background-color: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  margin: 30px 0;
  width: 100%;
  max-width: 500px;
}

.order-details h2 {
  margin-bottom: 15px;
  font-size: 1.3rem;
  color: var(--color-heading);
  text-align: left;
}

.order-info {
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.info-row span:first-child {
  min-width: 120px; /* ラベルの最小幅を設定 */
  flex-shrink: 0; /* ラベルを縮小しない */
}

.info-row span:last-child {
  word-break: break-all; /* 長い文字列を折り返す */
  overflow-wrap: break-word; /* 単語の途中でも折り返す */
  text-align: right; /* 右揃え */
  flex: 1; /* 余白を埋める */
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin: 30px 0;
}

.library-button,
.home-button {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
  font-size: 1rem;
}

.library-button {
  background-color: #41b883;
  color: white;
}

.library-button:hover {
  background-color: #389f70;
}

.home-button {
  background-color: #f0f0f0;
  color: #333;
}

.home-button:hover {
  background-color: #e0e0e0;
}

.next-steps {
  margin-top: 20px;
  background-color: #f0f7f4;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #41b883;
  text-align: left;
  width: 100%;
  max-width: 600px;
}

.next-steps h3 {
  margin-bottom: 15px;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.next-steps ul {
  padding-left: 20px;
  margin: 0;
}

.next-steps li {
  margin-bottom: 10px;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .library-button,
  .home-button {
    width: 100%;
  }
}
</style>