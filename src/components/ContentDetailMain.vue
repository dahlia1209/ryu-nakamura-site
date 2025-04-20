<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { useAuthStore } from '@/stores/auth';
import { ContentItem } from '@/models/content';

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();
const authStore = useAuthStore();

const localStore=(()=>{
  /*state*/
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const checkoutUrl = ref<string | null>(null);
  const isLoading = ref(true); 
  const isSubscribed=ref(false)

  /*getter*/
  const contentId = computed(()=>parseInt(route.params.id as string));

  const content = computed<ContentItem | undefined>( () => {
    return contentStore.getContentById(contentId.value);
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
  const formattedDate = computed<string>(() => {
    if (!content.value) return '';
    
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(content.value.publishDate);
  });

  /*action*/
  // Handle checkout process
  async function handleCheckout() {
    if (!content.value) return;
    
    try {
      localStore.state.isSubmitting.value = true;
      localStore.state.error.value = null;
      
      // Build success and cancel URLs (use absolute URLs with origin)
      const origin = window.location.origin;
      const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/contents/${content.value.titleNo}?checkout_cancelled=true`;
      
      // Call content store to create checkout session
      const contentItem = contentStore.getContentById(content.value.titleNo)
      const result = await contentStore.checkoutService.createContentCheckout(
        contentItem!,
        successUrl,
        cancelUrl
      );
      
      // If successful, redirect to Stripe checkout
      if (result && result.url) {
        localStore.state.checkoutUrl.value = result.url;
        window.location.href = result.url;
      } else {
        localStore.state.error.value = '決済ページの作成に失敗しました。もう一度お試しください。';
      }
    } catch (err) {
      localStore.state.error.value = err instanceof Error ? err.message : '決済処理中にエラーが発生しました。';
      console.error('Checkout error:', err);
    } finally {
      localStore.state.isSubmitting.value = false;
    }
  };
  async function fetchContent() {
    try {
    localStore.state.isLoading.value = true;
    // APIからコンテンツの詳細を取得
    const response = await contentStore.contentService.getContentByNo(contentId.value);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const contentData = await response.json();
    
    if (contentData.length==1) {
      // ストアのアクションを呼び出して更新
      contentStore.updateContentHtml(contentId.value, contentData[0].content_html);
      localStore.state.isSubscribed.value=true
    }
    console.log("contentData",contentData[0])
  } catch (err) {
    console.error('Error fetching content:', err);
    localStore.state.error.value = err instanceof Error ? err.message : 'コンテンツの取得中にエラーが発生しました。';
  } finally {
    localStore.state.isLoading.value = false;
  }
  }

  //戻り値
return {
  state:{
    isSubmitting,
    error,
    checkoutUrl,
    isLoading,
    isSubscribed
  },
  getters:{
    content,
    formattedPrice,
    contentId,
    formattedDate
  },
  actions:{
    handleCheckout,
    fetchContent
  }
}
})()
</script>

<template>

<div class="content-body" v-html="localStore.getters.content.value!.contentHtml"></div>

<section class="purchase-section">
  <div class="split-block">
    <div class="split-border"></div>
    <div class="split-content">ここから先は</div>
  </div>

  <div class="simplified-checkout">
    <div class="payment-method-section">
      <div class="checkout-price-section">
        <div class="price">{{ localStore.getters.formattedPrice.value }}</div>
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

    <div v-if="localStore.state.error.value" class="error-message">
      {{ localStore.state.error.value }}
    </div>

    <form @submit.prevent="localStore.actions.handleCheckout" class="checkout-form">
      <button type="submit" class="purchase-button" :disabled="localStore.state.isSubmitting.value">
        <span v-if="localStore.state.isSubmitting.value">処理中...</span>
        <span v-else>購入手続きへ進む</span>
      </button>
      <p class="secure-checkout-note">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>安全な決済システムを使用しています</span>
      </p>
    </form>
  </div>
</section>
</template>

