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
        {
          id:1,
          title:"#1 原点に立ち戻る",
          previewContent:"進むべき方向性がわからなくなったときに、原点に戻って考えるという手法がとられることがある。例えば、野球において投手が何を投げればわからなくなったときは、外角低めのストレートを投げることを戦後初の三冠王である野村克也さんが語っていた。",
          imageUrl:"/thumbnail/001.jpg",
          price:220,
          category:"技術書",
          tags:["初投稿"],
          publishDate:new Date(2025, 3, 4),
          isFeatured:false,
          noteUrl:"https://note.com/kenjinishizaki/n/n168c8e816312"
        } as ContentItem,
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