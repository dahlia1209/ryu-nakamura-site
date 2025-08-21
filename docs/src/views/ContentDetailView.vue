<script setup lang="ts">
import { ref, computed, onMounted, watch, useTemplateRef, watchEffect } from 'vue';
import { useContentStore } from '../stores/content';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import { useOrderStore } from '../stores/order';
import { Content, PreviewContent } from '../models/content';
import { OrderItem } from '../models/order';
import { useRouter, useRoute } from 'vitepress'
import { data } from '../data/contents.data'

const route = useRoute()
const router = useRouter()

import LoadingSpinner from '../components/LoadingSpinner.vue';


const contentStore = useContentStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const orderStore = useOrderStore();
const target = useTemplateRef('target-to-scroll')

const localStore = (() => {
  /*state*/
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const checkoutUrl = ref<string | null>(null);
  const isLoading = ref(true);
  const isSubscribed = ref(false)
  const isAuthenticated = ref(authStore.isAuthenticated)
  const activeTab = ref('text')

  /*getter*/
  const contentTitleNo = computed(() => parseInt(route.data.relativePath.split('/')[1].split('.')[0]));

  const content = computed<PreviewContent | undefined>(() => {
    return data.contents.filter(x => x.title_no == contentTitleNo.value)[0];
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
    }).format(new Date(content.value.publish_date));
  });

  /*action*/

  async function fetchOrders() {
    try {
      isLoading.value = true;
      // APIからコンテンツの詳細を取得
      if (!userStore.user) throw new Error("ログインされていません。")
      if (!content.value) throw new Error("コンテンツが取得できません")
      const orders = await orderStore.service.getPurchasedOrders(authStore.getAccessToken, userStore.user.id, content.value.id);

      if (orders.length == 1) {
        content.value.preview_html = orders[0].content.contentHtml
        content.value.preview_speech_url = orders[0].content.fullSpeechUrl
        isSubscribed.value = true
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      error.value = err instanceof Error ? err.message : '注文情報取得中にエラーが発生しました。';
    } finally {
      isLoading.value = false;
    }
  }

  function getOrderItem(userId: string, contentId: string) {
    return new OrderItem(
      userId,
      contentId
    )
  }

  async function purchaseOrder() {
    try {
      if (!userStore.user) throw new Error("ログイン（アカウント登録）してからご購入ください。")
      if (!content.value) throw new Error("コンテンツが取得できません")
      const orderItem = getOrderItem(userStore.user.id, content.value.id)
      const successUrl = `${import.meta.env.VITE_FRONT_URL}${route.path}?purchased=completed`
      const cancelUrl = `${import.meta.env.VITE_FRONT_URL}${route.path}`
      const checkoutUrl = await orderStore.service.purchaseOrder(authStore.getAccessToken, orderItem, successUrl, cancelUrl);
      window.location.href = checkoutUrl

    } catch (err) {
      console.error('Error fetching content:', err);
      error.value = err instanceof Error ? err.message : '注文情報取得中にエラーが発生しました。';
    } finally {

    }
  }

  function scrollToTarget() {
    if (target.value == null) return
    target.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  function shareToX(){
    const text = `${route.data.title} | Ryu Nakamura`;
    const url=`${import.meta.env.VITE_FRONT_URL}${route.path}`
    const intent = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}%0A&url=${encodeURIComponent(url)}`;
    window.open(intent, '_blank', 'width=600,height=400');
  }

  //戻り値
  return {
    state: {
      isSubmitting,
      error,
      checkoutUrl,
      isLoading,
      isSubscribed,
      isAuthenticated,
      activeTab
    },
    getters: {
      content,
      formattedPrice,
      contentId: contentTitleNo,
      formattedDate
    },
    actions: {
      purchaseOrder,
      scrollToTarget,
      fetchOrders,
      shareToX,
    }
  }
})()

onMounted(async () => {
  if (userStore.user) await localStore.actions.fetchOrders()
  localStore.state.isLoading.value = false
})

watch(() => userStore.user, async (newX) => {
  if (userStore.user) await localStore.actions.fetchOrders()
})


</script>

<template>
  <div class="content-detail">

    <div class="back-link">
      <!-- <RouterLink to="/contents">&larr; コンテンツ一覧に戻る</RouterLink> -->

      <!-- <div v-if="localStore.state.urlParams.value.get('checkout_cancelled')" class="checkout-cancelled">
        お支払いがキャンセルされました。再度お試しください。
      </div> -->
    </div>

    <div class="content-header">
      <div class="featured-image">
        <img :src="localStore.getters.content.value!.image_url" :alt="localStore.getters.content.value!.title">
      </div>
      <h1>{{ localStore.getters.content.value!.title }}</h1>
      <div class="content-meta">
        <div class="publish-date">公開日: {{ localStore.getters.formattedDate.value }}</div>
        <div v-if="[
          !localStore.state.isLoading.value,
          !localStore.state.isSubscribed.value
        ].every(x => x == true)" class="price-display" @click="localStore.actions.scrollToTarget()">
          <span class="price-badge">{{ localStore.getters.formattedPrice.value }}</span>
        </div>
        <span v-else-if="[
          !localStore.state.isLoading.value,
          localStore.state.isSubscribed.value
        ].every(x => x == true)" class="subscribed-badge">購入済み</span>
      </div>
      <div class="content-meta">
        <button class="x-logo-button" @click="localStore.actions.shareToX()">
          <img src="../assets/logo/x-logo.png" class="x-logo" alt="x">
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="localStore.state.isLoading.value" />

    <div v-else class="content-body">
      <div class="content-tabs">
        <div class="tab-buttons">
          <button class="tab-button" :class="{ active: localStore.state.activeTab.value === 'text' }"
            @click="localStore.state.activeTab.value = 'text'">
            テキスト
          </button>
          <button class="tab-button" :class="{ active: localStore.state.activeTab.value === 'audio' }"
            @click="localStore.state.activeTab.value = 'audio'">
            音声（プレビュー）
          </button>
          <!-- <button 
            class="tab-button"
            :class="{ active: localStore.state.activeTab.value === 'video' }"
            @click="localStore.state.activeTab.value = 'video'"
          >
            動画
          </button> -->
        </div>
        <div class="tab-content">
          <div v-if="localStore.state.activeTab.value === 'text'" class="tab-panel"
            v-html="localStore.getters.content.value!.preview_html"></div>
          <div v-if="localStore.state.activeTab.value === 'audio'" class="tab-panel">
            <div class="audio-content">
              <audio controls>
                <source :src="localStore.getters.content.value?.preview_speech_url ?? '#'" type="audio/mpeg">
                お使いのブラウザは音声の再生に対応していません。
              </audio>
              <div class="audio-credit">
                音声合成: VOICEVOX:ずんだもん
              </div>
            </div>
          </div>
          <!-- <div v-if="localStore.state.activeTab.value === 'video'" class="tab-panel">
            <div class="video-content">
              <p>動画コンテンツが利用可能です。</p>
              <video controls>
                <source :src="localStore.getters.content.value?.preview_moovie_url ?? '#'" type="video/mp4">
                お使いのブラウザは動画の再生に対応していません。
              </video>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <section v-if="[
      !localStore.state.isLoading.value,
      !localStore.state.isSubscribed.value
    ].every(x => x == true)" class="purchase-section">
      <div class="split-block">
        <div class="split-border"></div>
        <div class="split-content">ここから先は</div>
      </div>
      <div class="remaining_text_length">残り {{ localStore.getters.content.value!.remaining_text_length }} 字</div>

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
              <img src="/src/assets/paymentMethod/visa.png" alt="Visa" class="payment-icon">
              <img src="/src/assets/paymentMethod/mastercard.png" alt="Mastercard" class="payment-icon">
              <img src="/src/assets/paymentMethod/amex.png" alt="American Express" class="payment-icon">
              <img src="/src/assets/paymentMethod/jcb.png" alt="JCB" class="payment-icon">
            </div>
          </div>
        </div>

        <div v-if="localStore.state.error.value" class="error-message">
          {{ localStore.state.error.value }}
        </div>

        <form @submit.prevent="localStore.actions.purchaseOrder" class="checkout-form" ref="target-to-scroll">
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
  </div>

</template>

<style scoped>
.content-detail {
  max-width: 620px;
  margin: 0 auto;
  padding: 0px 20px;
  margin-bottom: 30px;
}


.error-container {
  text-align: center;
  padding: 50px 0;
}

.back-button {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #41b883;
  color: white;
  border-radius: 4px;
  text-decoration: none;
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
}


.content-description,
.content-preview {
  margin-bottom: 30px;
}

:deep(h2) {
  font-size: 1.8rem;
  margin: 1.5rem 0 1rem;
  color: #2D3E50;
  line-height: 1.4;
  padding-top: 10px;
}

:deep(p) {
  margin-bottom: 20px;
  text-align: justify;
  font-size: 1.1em;
  line-height: 1.8;

}

/* .content-body h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: #41b883;
  border-radius: 2px;
} */

p {
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 15px;
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

.subscribed-badge {
  padding: 4px 15px;
  transition: all 0.3s;
  color: green;
  ;
  font-weight: 600;
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

.split-content {
  font-weight: 700;
  text-align: center;
  position: relative;
  z-index: 1;
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
  z-index: 0;
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


/* 注意喚起CSS */
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

.note-warning {
  display: flex;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-left: 5px solid #e0a800;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  align-items: flex-start;
}

.warning-icon {
  font-size: 24px;
  margin-right: 15px;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 600;
  color: #856404;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.warning-content p {
  margin-bottom: 8px;
  color: #5c4a03;
}

.note-link {
  display: inline-block;
  background-color: #06C755;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  margin-top: 8px;
  transition: background-color 0.3s;
}

.note-link:hover {
  background-color: #05a649;
}

@media (max-width: 480px) {
  .note-warning {
    flex-direction: column;
  }

  .warning-icon {
    margin-bottom: 10px;
  }
}

.remaining_text_length {
  text-align: center;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.content-tabs {
  width: 100%;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #333;
  background-color: #f5f5f5;
}

.tab-button.active {
  color: #2D3E50;
  border-bottom-color: #2D3E50;
  font-weight: 600;
}

.tab-content {
  width: 100%;
}

.tab-panel {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.audio-content,
.video-content {
  text-align: center;
  padding: 40px 20px;
}

.audio-content p,
.video-content p {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #666;
}

.audio-content audio,
.video-content video {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.audio-credit {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

@media (max-width: 768px) {
  .tab-button {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .audio-content,
  .video-content {
    padding: 30px 15px;
  }
}

.x-logo-button{
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
}

.x-logo-button:hover{
  opacity: 0.7;
}

.x-logo{
  width: 40px;
}
</style>