<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Service } from '@/models/service';

// Same services array as in ServiceView.vue
// In a real application, you would likely fetch this from an API or use Pinia store
const services = ref<Service[]>([
  {
    id: 1,
    title: "Webアプリケーション開発",
    shortDescription: "Vue.js, React, TypeScriptを使用したモダンなWebアプリケーション開発",
    description: "最新のフロントエンドテクノロジーを活用したWebアプリケーションの開発サービスです。Vue.js、React、TypeScriptなどを使用し、レスポンシブでパフォーマンスの高いウェブサイトやWebアプリを構築します。",
    imageUrl: "/webapp.jpg",
    features: [
      "SPAやPWAの開発",
      "レスポンシブデザインの実装",
      "既存Webサイトのモダン化",
      "パフォーマンス最適化",
      "フロントエンドとバックエンドの連携"
    ],
    price: "要相談（プロジェクト規模により異なります）",
    deliveryTime: "2週間〜2ヶ月（要件により異なります）",
    detailSections: [
      {
        title: "サービス詳細",
        content: "最新のWebテクノロジーを活用した高品質なウェブアプリケーション開発を提供します。Vue.js、React、TypeScriptなどのモダンなフレームワークを使用し、スケーラブルでメンテナンス性の高いアプリケーションを構築します。"
      },
      {
        title: "対応範囲",
        content: "要件定義から設計、開発、テスト、デプロイまでの一連のプロセスをサポートします。フロントエンド開発を中心に、必要に応じてバックエンド開発（Node.js、Python等）も対応可能です。"
      }
    ]
  },
  {
    id: 2,
    title: "Azureクラウドコンサルティング",
    shortDescription: "Azureクラウドサービスの設計、構築、最適化サポート",
    description: "Microsoft Azureを活用したクラウドインフラの設計、構築、最適化をサポートします。コスト削減と効率化を実現するAzureリソース管理のベストプラクティスを提案します。",
    imageUrl: "/azure.jpg",
    features: [
      "Azureリソースの設計と構築",
      "既存システムのクラウド移行",
      "コスト最適化分析",
      "セキュリティ強化対策",
      "運用自動化の提案と実装"
    ],
    price: "初回コンサルティング：50,000円〜",
    deliveryTime: "コンサルティング：1週間〜、実装：要件による",
    detailSections: [
      {
        title: "サービス詳細",
        content: "Microsoft Azureの効果的な活用方法を提案し、クラウドインフラの設計から実装までをサポートします。リソース管理の最適化、コスト削減策の提案、セキュリティ強化など、企業のクラウド戦略をトータルでサポートします。"
      },
      {
        title: "対応範囲",
        content: "クラウドインフラの設計・構築、既存システムのクラウド移行計画、コスト分析とコスト最適化、セキュリティ評価と強化、運用自動化の提案と実装などに対応します。"
      }
    ]
  },
  {
    id: 3,
    title: "技術コードレビュー",
    shortDescription: "ベストプラクティスに基づくコードレビューとリファクタリング",
    description: "既存のコードベースを詳細に分析し、品質向上のための改善点を提案します。パフォーマンス、セキュリティ、メンテナンス性の観点からコードを評価します。",
    imageUrl: "/code-review.jpg",
    features: [
      "コード品質の評価",
      "セキュリティ脆弱性のチェック",
      "パフォーマンス最適化の提案",
      "コーディング規約の策定サポート",
      "リファクタリングの実施"
    ],
    price: "30,000円〜（コードベースの規模による）",
    deliveryTime: "1週間〜2週間",
    detailSections: [
      {
        title: "サービス詳細",
        content: "既存のコードベースを専門的な視点で評価し、改善点を詳細にレポートします。単なる問題点の指摘だけでなく、具体的な解決策や改善方法も併せて提案します。必要に応じて、実際のリファクタリング作業も承ります。"
      },
      {
        title: "対応言語・フレームワーク",
        content: "JavaScript/TypeScript、Vue.js、React、Node.js、Python、C#などの言語やフレームワークに対応しています。特にフロントエンド開発とクラウドアプリケーション開発に関する知見が豊富です。"
      }
    ]
  }
]);

const route = useRoute();
const router = useRouter();

// Find the service based on route param
const service = computed(() => {
  const serviceId = parseInt(route.params.id as string);
  return services.value.find(s => s.id === serviceId);
});

// Form data
const formData = ref({
  name: '',
  email: '',
  company: '',
  message: '',
  serviceId: 0,
  serviceTitle: ''
});

// Form submission state
const formSubmitted = ref(false);
const isSubmitting = ref(false);

// Set service ID when component mounts
onMounted(() => {
  if (service.value) {
    formData.value.serviceId = service.value.id;
    formData.value.serviceTitle = service.value.title;
  } else {
    // Redirect back to services if service not found
    router.push('/service');
  }
});

// Form submission handler
const submitForm = () => {
  isSubmitting.value = true;
  
  // Simulate API call
  setTimeout(() => {
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData.value);
    
    // Reset form and show success message
    formSubmitted.value = true;
    isSubmitting.value = false;
    
    // Reset form data
    formData.value = {
      name: '',
      email: '',
      company: '',
      message: '',
      serviceId: service.value?.id || 0,
      serviceTitle: service.value?.title || ''
    };
  }, 1000);
};
</script>

<template>
  <div v-if="service" class="service-detail">
    <div class="back-link">
      <RouterLink to="/service">&larr; サービス一覧に戻る</RouterLink>
    </div>
    
    <div class="service-header">
      <h1>{{ service.title }}</h1>
      <div class="service-image">
        <img :src="service.imageUrl" :alt="service.title">
      </div>
    </div>
    
    <div class="service-content">
      <section class="description-section">
        <h2>サービス概要</h2>
        <p>{{ service.description }}</p>
      </section>
      
      <section class="features-section">
        <h2>主な特徴</h2>
        <ul>
          <li v-for="(feature, index) in service.features" :key="index">
            {{ feature }}
          </li>
        </ul>
      </section>
      
      <section v-for="(section, index) in service.detailSections" :key="index" class="detail-section">
        <h2>{{ section.title }}</h2>
        <p>{{ section.content }}</p>
      </section>
      
      <section class="pricing-section">
        <div class="pricing-grid">
          <div class="pricing-item">
            <h3>料金目安</h3>
            <p>{{ service.price }}</p>
          </div>
          
          <div class="pricing-item">
            <h3>納期目安</h3>
            <p>{{ service.deliveryTime }}</p>
          </div>
        </div>
        <p class="pricing-note">※具体的な料金・納期は、お客様の要件やプロジェクトの規模により異なります。詳細はお問い合わせフォームよりご相談ください。</p>
      </section>
      
      <section class="application-section">
        <h2>お問い合わせ・お申し込み</h2>
        
        <div v-if="formSubmitted" class="success-message">
          <h3>お問い合わせありがとうございます！</h3>
          <p>内容を確認次第、折り返しご連絡いたします。通常2営業日以内にご返信いたします。</p>
          <button @click="formSubmitted = false" class="reset-button">新しいお問い合わせをする</button>
        </div>
        
        <form v-else @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">お名前 <span class="required">*</span></label>
            <input 
              id="name" 
              v-model="formData.name" 
              type="text" 
              required
              placeholder="山田 太郎"
            >
          </div>
          
          <div class="form-group">
            <label for="email">メールアドレス <span class="required">*</span></label>
            <input 
              id="email" 
              v-model="formData.email" 
              type="email" 
              required
              placeholder="example@email.com"
            >
          </div>
          
          <div class="form-group">
            <label for="company">会社名</label>
            <input 
              id="company" 
              v-model="formData.company" 
              type="text"
              placeholder="株式会社〇〇"
            >
          </div>
          
          <div class="form-group">
            <label for="message">お問い合わせ内容 <span class="required">*</span></label>
            <textarea 
              id="message" 
              v-model="formData.message" 
              required
              rows="5"
              placeholder="ご質問・ご要望などをご記入ください"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-button" 
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '送信中...' : 'お問い合わせを送信する' }}
            </button>
          </div>
          
          <div class="privacy-notice">
            <p>※ご記入いただいた個人情報は、お問い合わせへの対応と関連するサービスのご提案のみに使用します。</p>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.service-detail {
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

.service-header {
  margin-bottom: 30px;
}

.service-header h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--color-heading);
}

.service-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.service-content section {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.service-content h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--color-heading);
  position: relative;
  padding-left: 15px;
}

.service-content h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: #41b883;
  border-radius: 2px;
}

.service-content p {
  line-height: 1.7;
  color: var(--color-text);
}

.features-section ul {
  padding-left: 20px;
}

.features-section li {
  margin-bottom: 10px;
  position: relative;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 15px;
}

.pricing-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pricing-item h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--color-heading);
}

.pricing-note {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.application-section {
  border-bottom: none !important;
}

.contact-form {
  background-color: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  margin-top: 15px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.required {
  color: #e74c3c;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-actions {
  margin-top: 25px;
}

.submit-button {
  background-color: #41b883;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #389f70;
}

.submit-button:disabled {
  background-color: #a0d8c1;
  cursor: not-allowed;
}

.privacy-notice {
  margin-top: 20px;
  font-size: 0.85rem;
  color: #666;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.success-message h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.reset-button {
  background-color: #41b883;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #389f70;
}

@media (max-width: 768px) {
  .service-image {
    height: 200px;
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-form {
    padding: 15px;
  }
}
</style>