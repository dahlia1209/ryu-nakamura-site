import { type WorkItem } from '../models/work'

export const workData = [
        {
          id: 1,
          title: 'Web麻雀',
          description: '個人開発したWebベースの麻雀ゲームです。基本的な麻雀操作（打牌、副露、アガリなど）を実装しています。',
          imageUrl: '/contents/1431764.jpg',
          techStack: ['Vue.js', 'TypeScript','Python'],
          projectUrl: 'https://webmajiang.ryu-nakamura.com/',
          githubUrl: 'https://github.com/dahlia1209/WebMajiang-client'
        } as WorkItem,
      ]