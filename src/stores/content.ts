import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Content,WorkItem } from '@/models/content'
import { useContentService } from '@/services/contentService'

export const useContentStore = defineStore('contact', {
    state: () => ({
      contentService:useContentService(),
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
          id:'769eb42a-710c-4faa-98cb-78d21713b8ee',
          titleNo:1,
          title:"#1 原点に立ち戻る",
          contentText:"進むべき方向性がわからなくなったときに、原点に戻って考えるという手法がとられることがある。例えば、野球において投手が何を投げればわからなくなったときは、外角低めのストレートを投げることを戦後初の三冠王である野村克也さんが語っていた。",
          contentHtml:"<h2>はじめに-外角低めストレート</h1><p>進むべき方向性がわからなくなったときに、原点に戻って考えるという手法がとられることがある。例えば、野球において投手が何を投げればわからなくなったときは、外角低めのストレートを投げることを戦後初の三冠王である野村克也さんが語っていた。なぜ外角低めのストレートが原点なのかは不明だが、困ったら原点に戻るという考え方には私もならいたい。</p><p>私は今後どうやって生きていくかということに最近関心を持ち始めている。それは誰もが関心あることだと思うが、私の場合きっかけは今の生活を今後も続けられるのか想像できないからであった。私は大卒以降ITエンジニアのサラリーマンとして収入を得て日々暮らしている。サラリーマンの生活は始めた当初は業務に慣れなかったこともあり社会の厳しさを痛感していたが、30歳になるころには慣れてきて、今後について考える時間も生まれてきた。そこで考えたことはこれからは会社に頼らず自分自身の力で稼ぐ必要があるということであった。</p></div>",
          imageUrl:"/thumbnail/0001.jpg",
          price:220,
          category:"article",
          tags:["初投稿"],
          publishDate:new Date(2025, 3, 4),
          noteUrl:"https://note.com/kenjinishizaki/n/n168c8e816312"
        } as Content,
      ]
    }),
    getters: {
      getContentByTitleNo:(state)=>{
        return (id:number) =>state.contentItems.find(item => item.titleNo === id)
      },

      getContentByCategory :(state)=> {
        return (category: string) => state.contentItems.filter(item => item.category === category)
      },

    },
    actions: {
      fakeAction() {},
      updateContentHtml(contentTitleNo: number, newContentHtml: string) {
        const contentIndex = this.contentItems.findIndex(item => item.titleNo === contentTitleNo);
        if (contentIndex !== -1) {
          // contentItemsの特定のアイテムのcontentHtmlを更新
          this.contentItems[contentIndex].contentHtml = newContentHtml;
        }
      },
    },
})