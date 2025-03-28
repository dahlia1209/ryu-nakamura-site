<script setup lang="ts">
import UnderConstructionView from '@/components/UnderConstruction.vue'
</script>

<template>
  <div class="column-view">
    <UnderConstructionView pageName="サービス" />
  </div>
</template>

<style scoped>
.column-view {
  width: 100%;
}
</style>
<!-- <script setup lang="ts">
import { ref } from 'vue';
import HomeHeadline from '../components/HomeHeadline.vue';
import ServiceItem from '../components/ServiceItem.vue';
import { Headline } from '@/models/page';
import { Service } from '@/models/service';

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
</script>

<template>
  <div class="service-view">
    <HomeHeadline :headline="new Headline('services', 'サービス一覧')" />
    
    <div class="service-description">
      個人事業主として提供しているサービスの一覧です。
      各サービスの詳細については、サービスカードをクリックして詳細ページをご確認ください。
      平日は本業があるため、スポットでの対応（週20時間程度）が可能です。
    </div>
    
    <div class="services-grid">
      <RouterLink 
        v-for="service in services" 
        :key="service.id"
        :to="`/service/${service.id}`" 
        class="service-link"
      >
        <ServiceItem :service="service" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.service-view {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.service-description {
  margin: 20px 0 30px;
  line-height: 1.6;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.service-link {
  text-decoration: none;
  color: inherit;
  height: 100%;
  display: block;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style> -->