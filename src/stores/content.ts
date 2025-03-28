import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ContentItem,WorkItem } from '@/models/content'
import { useCheckoutService } from '@/services/checkoutService'

export const useContentStore = defineStore('contact', {
    state: () => ({
      service:useCheckoutService(),
      workItems:[
        {
          id: 1,
          title: 'Web麻雀',
          description: '個人開発したWebベースの麻雀ゲームです。基本的な麻雀操作（打牌、副露、アガリなど）を実装しています。',
          imageUrl: '/1431764.jpg', 
          techStack: ['Vue.js', 'TypeScript','Python'],
          projectUrl: 'https://webmajiang.ryu-nakamura.com/',
          githubUrl: 'https://github.com/dahlia1209/WebMajiang-client'
        } as WorkItem,
      ],
      contentItems:[
        new ContentItem(
          1,
          "Vue.js 3 マスターガイド",
          "Vue.js 3の基礎から応用までを網羅した完全ガイド。コンポジションAPIや最新のベストプラクティスを解説します。",
          "Vueの基本的な概念と、Vue.js 3で導入されたコンポジションAPIについて学びます。このガイドでは、実際のプロジェクトで役立つテクニックを紹介...",
          "/vue-master-guide.jpg",
          3800,
          "技術書",
          ["Vue.js", "JavaScript", "フロントエンド"],
          new Date(2025, 2, 15),
          true
        ),
        new ContentItem(
          2,
          "Azure DevOps 実践入門",
          "AzureとDevOpsを組み合わせた開発フローを解説。CI/CDパイプラインの構築から運用まで網羅します。",
          "クラウド開発においてAzure DevOpsを活用する方法について解説します。バージョン管理、ビルドパイプライン、リリース管理などの基本をカバーし...",
          "/azure-devops-guide.jpg",
          4200,
          "技術書",
          ["Azure", "DevOps", "CI/CD", "クラウド"],
          new Date(2025, 1, 20)
        ),
        new ContentItem(
          3,
          "TypeScriptプロジェクトの始め方",
          "TypeScriptを使った実践的なプロジェクトの始め方と進め方を解説します。型システムの活用法からツールチェーンの設定まで。",
          "JavaScriptプロジェクトからTypeScriptへの移行方法や、新規TypeScriptプロジェクトの立ち上げ方について解説します。型定義の書き方や...",
          "/typescript-guide.jpg",
          2800,
          "技術書",
          ["TypeScript", "JavaScript", "プログラミング"],
          new Date(2025, 2, 5)
        ),
        new ContentItem(
          4,
          "フロントエンド開発トレンド2025",
          "2025年のフロントエンド開発における最新技術トレンドと採用すべき技術スタックを解説します。",
          "Webフロントエンド開発は日々進化しています。このレポートでは、2025年に注目すべき技術トレンドとフレームワークについて詳しく分析し...",
          "/frontend-trends.jpg",
          1500,
          "レポート",
          ["フロントエンド", "トレンド", "技術動向"],
          new Date(2025, 3, 10),
          true
        ),
        new ContentItem(
          5,
          "効率的なコードレビュー手法",
          "チーム開発における効率的なコードレビュー手法と、レビュープロセスの改善方法について解説します。",
          "コードレビューはソフトウェア品質を保つ重要な工程です。本ガイドでは、チームの生産性を落とさずに効果的なコードレビューを行うための手法を...",
          "/code-review-guide.jpg",
          2200,
          "ガイド",
          ["コードレビュー", "チーム開発", "プロジェクト管理"],
          new Date(2025, 2, 25)
        )
      ]
    }),
    getters: {
      getContentById:(state)=>{
        return (id:number) =>state.contentItems.find(item => item.id === id)
      },
      
      getFeaturedContent :(state)=>{
        return state.contentItems.filter(item => item.isFeatured)
      },

      
      getContentBySlug :(state)=> {
        return (slug: string) => state.contentItems.find(item => item.slug === slug)
      },
      
      getContentByCategory :(state)=> {
        return (category: string) => state.contentItems.filter(item => item.category === category)
      }
    },
    actions: {
      fakeAction() {}
    },
})