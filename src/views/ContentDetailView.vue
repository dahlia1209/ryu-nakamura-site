<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { ContentItem } from '@/models/content';

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();

// Form data
const email = ref('');
const name = ref('');
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const checkoutUrl = ref<string | null>(null);

// Get content based on route param
const content = computed<ContentItem | undefined>(() => {
  const contentId = parseInt(route.params.id as string);
  return contentStore.getContentById(contentId);
});

// Format price
const formattedPrice = computed(() => {
  if (!content.value) return '';
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    currencyDisplay: 'symbol'
  }).format(content.value.price);
});

// Format date
const formattedDate = computed(() => {
  if (!content.value) return '';
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(content.value.publishDate);
});

// Redirect if content not found
onMounted(() => {
  if (!content.value) {
    router.push('/column');
  }
  
  // Check if there was a cancelled checkout
  if (route.query.checkout_cancelled) {
    error.value = 'お支払いがキャンセルされました。再度お試しください。';
  }
});

// Watch for route query changes
watch(() => route.query, (newQuery) => {
  if (newQuery.checkout_cancelled) {
    error.value = 'お支払いがキャンセルされました。再度お試しください。';
  }
});

// Handle checkout process
async function handleCheckout() {
  if (!content.value || !email.value) return;
  
  try {
    isSubmitting.value = true;
    error.value = null;
    
    // Build success and cancel URLs (use absolute URLs with origin)
    const origin = window.location.origin;
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/column/${content.value.id}?checkout_cancelled=true`;
    
    // Call content store to create checkout session
    const result = await contentStore.purchaseContent(
      content.value.id,
      email.value,
      successUrl,
      cancelUrl
    );
    
    // If successful, redirect to Stripe checkout
    if (result && result.url) {
      checkoutUrl.value = result.url;
      window.location.href = result.url;
    } else {
      error.value = '決済ページの作成に失敗しました。もう一度お試しください。';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '決済処理中にエラーが発生しました。';
    console.error('Checkout error:', err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div v-if="content" class="content-detail">
    <div class="back-link">
      <RouterLink to="/column">&larr; コラム一覧に戻る</RouterLink>
      
      <div v-if="route.query.checkout_cancelled" class="checkout-cancelled">
        お支払いがキャンセルされました。再度お試しください。
      </div>
    </div>
    
    <div class="content-header">
      <h1>{{ content.title }}</h1>
      <div class="content-meta">
        <div class="publish-date">公開日: {{ formattedDate }}</div>
        <div class="tags">
          <span v-for="(tag, index) in content.tags" :key="index" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
      
      <div class="featured-image">
        <img :src="content.imageUrl" :alt="content.title">
      </div>
    </div>
    
    <div class="content-body">
      <section class="content-description">
        <h2>概要</h2>
        <p>{{ content.description }}</p>
      </section>
      
      <section class="content-preview">
        <h2>プレビュー</h2>
        <div class="preview-content">
          <p>{{ content.previewContent }}</p>
          <div class="preview-overlay">
            <div class="overlay-text">
              購入すると全文をご覧いただけます
            </div>
          </div>
        </div>
      </section>
      
      <section class="purchase-section">
        <div class="price-card">
          <h2>コンテンツを購入する</h2>
          <div class="price">{{ formattedPrice }}</div>
          <p class="price-description">お支払いは一回のみです。購入後、コンテンツに無期限でアクセスできます。</p>
          
          <form @submit.prevent="handleCheckout" class="checkout-form">
            <div class="form-group">
              <label for="email">メールアドレス <span class="required">*</span></label>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                required
                placeholder="example@email.com"
                :disabled="isSubmitting"
              >
              <p class="form-help">購入確認とコンテンツへのアクセス情報をお送りします。</p>
            </div>
            
            <div class="form-group">
              <label for="name">お名前（任意）</label>
              <input 
                id="name" 
                v-model="name" 
                type="text"
                placeholder="山田 太郎"
                :disabled="isSubmitting"
              >
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button 
              type="submit" 
              class="purchase-button" 
              :disabled="isSubmitting || !email"
            >
              <span v-if="isSubmitting">処理中...</span>
              <span v-else>購入する</span>
            </button>
          </form>
          
          <div class="payment-info">
            <p>決済処理は<strong>Stripe</strong>により安全に行われます。</p>
            <div class="payment-methods">
              <img src="/paymentMethod/visa.png" alt="Visa" class="payment-icon">
              <img src="/paymentMethod/mastercard.png" alt="Mastercard" class="payment-icon">
              <img src="/paymentMethod/amex.png" alt="American Express" class="payment-icon">
              <img src="/paymentMethod/jcb.png" alt="JCB" class="payment-icon">
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.content-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 0;
  width: 100%;
}

.back-link {
  margin-bottom: 20px;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  color: #41b883;
  text-decoration: none;
  font-weight: 500;
}

.checkout-cancelled {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-size: 0.9rem;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h1 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--color-heading);
  line-height: 1.3;
}

.content-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.publish-date {
  color: #666;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #555;
}

.featured-image {
  width: 100%;
  height: 350px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 30px;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.content-description,
.content-preview {
  margin-bottom: 30px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--color-heading);
  position: relative;
  padding-left: 15px;
}

h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: #41b883;
  border-radius: 2px;
}

p {
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 15px;
}

.preview-content {
  position: relative;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  max-height: 200px;
  overflow: hidden;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 20%, rgba(255,255,255,0.9) 80%, rgba(255,255,255,1) 100%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 20px;
}

.overlay-text {
  background-color: #41b883;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.price-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 25px;
  position: sticky;
  top: 20px;
}

.price {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2D3E50;
  margin: 15px 0;
  text-align: center;
}

.price-description {
  text-align: center;
  margin-bottom: 25px;
  font-size: 0.9rem;
  color: #666;
}

.checkout-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 0.95rem;
}

.required {
  color: #e74c3c;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-help {
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.purchase-button {
  width: 100%;
  background-color: #41b883;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.purchase-button:hover:not(:disabled) {
  background-color: #389f70;
}

.purchase-button:disabled {
  background-color: #a0d8c1;
  cursor: not-allowed;
}

.payment-info {
  margin-top: 25px;
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.payment-info p {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 10px;
}

.payment-methods {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.payment-icon {
  height: 32px;
}

.payment-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .content-body {
    grid-template-columns: 1fr;
  }
  
  .featured-image {
    height: 250px;
  }
  
  .price-card {
    position: static;
    margin-bottom: 30px;
  }
}
</style>