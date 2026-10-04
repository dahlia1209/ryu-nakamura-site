import { type WorkItem } from '../models/work'

export const workData = [
        {
          id: 4,
          title: 'レッツ麻雀',
          description: 'CPU対局に対応したiOS向け麻雀アプリです。ルール・持ち時間・見た目まで細部にわたってカスタマイズでき、初心者向けのアシスト機能も搭載しています。',
          imageUrl: '/lets_majiang_icon.jpg',
          techStack: ['Swift', 'SwiftUI'],
          projectUrl: 'https://apps.apple.com/jp/app/%E3%83%AC%E3%83%83%E3%83%84%E9%BA%BB%E9%9B%80/id6801843977',
        } as WorkItem,
        {
          id: 1,
          title: 'Web麻雀',
          description: '個人開発したWebベースの麻雀ゲームです。基本的な麻雀操作（打牌、副露、アガリなど）を実装しています。',
          imageUrl: 'https://nakamurast20250505.blob.core.windows.net/root/content-image/1001.webp',
          techStack: ['Vue.js', 'TypeScript','Python'],
          projectUrl: 'https://webmajiang.ryu-nakamura.com/',
          githubUrl: 'https://github.com/dahlia1209/WebMajiang-client'
        } as WorkItem,
        {
          id: 2,
          title: 'ビットコインマイニングシミュレーター',
          description: 'ブロックチェーンのマイニングプロセスを体験できるシミュレーターです。',
          imageUrl: '/bitcoin_mining.jpg',
          techStack: ['Vue.js', 'TypeScript'],
          projectUrl: '/blockchain_simulator',
        } as WorkItem,
        {
          id: 3,
          title: 'ブロックチェーンエクスプローラー',
          description: '本サイトオリジナルブロックチェーンの最新ブロック情報を表示。ブロックハッシュ、トランザクション詳細、マイニング状況をリアルタイムで確認できます。',
          imageUrl: '/bitcoin.jpg',
          techStack: ['Vue.js', 'TypeScript'],
          projectUrl: '/blockchain',
        } as WorkItem,
      ]