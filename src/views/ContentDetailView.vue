<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { ContentItem } from '@/models/content';

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();

// Form data
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
    router.push('/contents');
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
  if (!content.value) return;
  
  try {
    isSubmitting.value = true;
    error.value = null;
    
    // Build success and cancel URLs (use absolute URLs with origin)
    const origin = window.location.origin;
    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/contents/${content.value.id}?checkout_cancelled=true`;
    
    // Call content store to create checkout session
    const contentItem = contentStore.getContentById(content.value.id)
    const result = await contentStore.service.createContentCheckout(
      contentItem!,
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
      <RouterLink to="/contents">&larr; コンテンツ一覧に戻る</RouterLink>

      <div v-if="route.query.checkout_cancelled" class="checkout-cancelled">
        お支払いがキャンセルされました。再度お試しください。
      </div>
    </div>

    <!-- 注意喚起メッセージ -->
    <!-- <div class="test-environment-warning">
      <div class="warning-icon">⚠️</div>
      <div class="warning-content">
        <h3>テスト環境のお知らせ - 購入しないでください</h3>
        <p>これはテスト環境です。このコンテンツは実際には存在せず、<strong>購入しても実際のコンテンツは提供されません</strong>。</p>
        <p>決済機能はテスト用に設定されていますが、<strong>実際の決済が行われる可能性があります</strong>ので購入操作は行わないでください。</p>
      </div>
    </div> -->

    <div class="content-header">
      <div class="featured-image">
        <img :src="content.imageUrl" :alt="content.title">
      </div>
      <h1>{{ content.title }}</h1>
      <div class="content-meta">
        <div class="publish-date">公開日: {{ formattedDate }}</div>
        <div class="price-display" @click="null">
          <span class="price-badge">{{ formattedPrice }}</span>
        </div>
      </div>


    </div>

    <div class="content-body">

      <p>{{ content.previewContent }}</p>


      <section class="purchase-section">
        <!-- <div class="price-card"> -->
          <div class="split-block">
            <div class="split-border"></div>
            <div class="split-content">ここから先は</div>
          </div>
          
          <div class="simplified-checkout">
            
            <div class="payment-method-section">
              
              <div class="checkout-price-section">
                <div class="price">{{ formattedPrice }}</div>
              </div>
              <h3>お支払い方法</h3>
              <div class="payment-option selected">
                <div class="payment-option-radio">
                  <div class="radio-inner"></div>
                </div>
                <span>クレジットカード決済</span>
                <div class="payment-cards">
                  <img src="/paymentMethod/visa.png" alt="Visa" class="payment-icon">
                  <img src="/paymentMethod/mastercard.png" alt="Mastercard" class="payment-icon">
                  <img src="/paymentMethod/amex.png" alt="American Express" class="payment-icon">
                  <img src="/paymentMethod/jcb.png" alt="JCB" class="payment-icon">
                </div>
              </div>
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleCheckout" class="checkout-form">
              <button 
                type="submit" 
                class="purchase-button" 
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">処理中...</span>
                <span v-else>購入手続きへ進む</span>
              </button>
              <p class="secure-checkout-note">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>安全な決済システムを使用しています</span>
              </p>
            </form>
          </div>
        <!-- </div> -->
      </section>
    </div>
  </div>
</template>

<style scoped>
.content-detail {
  max-width: 620px;
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

/* テスト環境の警告スタイル */
.test-environment-warning {
  display: flex;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-left: 5px solid #dc3545;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 25px;
  align-items: flex-start;
}

.warning-icon {
  font-size: 24px;
  margin-right: 15px;
  flex-shrink: 0;
  margin-top: 3px;
}

.warning-content h3 {
  margin: 0 0 10px 0;
  color: #721c24;
  font-size: 1.1rem;
  font-weight: 600;
}

.warning-content p {
  margin: 5px 0;
  color: #721c24;
}

.warning-content strong {
  font-weight: 700;
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
  background-color: white;
  padding: 5px 10px;
  border-radius: 4px;
  color: black;
  border-color: black;
}

.featured-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-body {
  display: flex;
  flex-direction: column;
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
  border-radius: 8px;
  padding: 25px;
  position: sticky;
  top: 20px;
  position: relative;
}

/* テストバッジ */
.test-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
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

.price-display {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}


.price-badge {
  background-color: white;
  padding: 4px 15px;
  border-radius: 5px;
  border: 1px solid #2D3E50;
  transition: all 0.3s;
  color: black;
  font-weight: 500;
}

.price-display:hover .price-badge {
  background-color: #f8f8f8;
  border-color: #000;
  opacity: 0.7;
}

.price-hint {
  color: #666;
  font-size: 0.85rem;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.price-display:hover .price-hint {
  opacity: 1;
}

.simplified-checkout {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.checkout-price-section {
  text-align: center;
  padding-bottom: 15px;
  /* border-bottom: 1px solid #eee; */
}

.payment-method-section h3 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: #333;
  padding-left: 0;
}

.payment-method-section h3::before {
  display: none;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.payment-option.selected {
  border-color: #2D3E50;
  background-color: #f9f9f9;
}

.payment-option-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #2D3E50;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #2D3E50;
}

.secure-checkout-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 15px;
  color: #666;
  font-size: 0.85rem;
}

.split-block {
            position: relative;
            width: 100%;
            background-color: white;
        }

.split-content{
  font-weight: 700; 
  text-align: center;
  position: relative;
  z-index: 2;
  background-color: white;
  width: fit-content;
  margin: 0 auto; 
}

.split-border {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            border-top: 1px dashed #666;
            z-index: 1;
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