import { defineConfig,PageData } from 'vitepress'
import {load} from '../src/data/contents.data'

export default defineConfig({
  title: "Ryu Nakamura",
  description: "Ryu's web site",
  head: [
    ['link', { rel: 'icon', href: '/home.svg' }],
  ],
  
  async transformPageData(pageData, { siteConfig }) {
    //サブ関数
    const updateContentsTitle=async (pageData:PageData)=>{
      if (pageData.relativePath.startsWith('contents/')) {
        const filename = pageData.relativePath.split('/')[1]; 
        const titleNo = filename.split('.')[0]; 
        const data=await load()
        pageData.title = data.contents.filter(x=>x.title_no.toString()==titleNo)[0].title;
      }
    }

    const updateHeader=(pageData:PageData)=>{
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push([
        'script',
        {
          async: '',
          src:'https://www.googletagmanager.com/gtag/js?id=G-63Z9Z6L98S'
        }
      ])
      pageData.frontmatter.head.push([
        'script',
        {
       },
        `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-63Z9Z6L98S');`
      ])
      }

    //メイン処理
    await updateContentsTitle(pageData)
    if(process.env.NODE_ENV=='production')updateHeader(pageData)
    return pageData
  },
  
})
