import { defineConfig,PageData } from 'vitepress'
import {contentsData} from '../src/data/contents.ts'

export default defineConfig({
  title: "Ryu Nakamura",
  description: "Ryu's web site",
  head: [['link', { rel: 'icon', href: '/home.svg' }]],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  transformPageData(pageData, { siteConfig }) {
    //サブ関数
    const updateContentsTitle=(pageData:PageData)=>{
      if (pageData.relativePath.startsWith('contents/')) {
        const filename = pageData.relativePath.split('/')[1]; 
        const titleNo = filename.split('.')[0]; 
        pageData.title = contentsData.filter(x=>x.titleNo.toString()==titleNo)[0].title;
      }
    }

    const updateParams=(pageData:PageData)=>{
      pageData.params={
        contentsData
      }
    }

    //メイン処理
    updateContentsTitle(pageData)
    updateParams(pageData)
    return pageData
  },
  vite:{
    server:{
      headers:{
        "x-test":"true",
      },
      
    }
  }
})
