import { defineConfig, PageData, loadEnv } from 'vitepress'
import { load } from '../src/data/contents.data'

export default defineConfig({
  title: 'Ryu Nakamura',
  description: '個人開発アプリとデジタルコンテンツを提供。Vue.js/TypeScript製のWebアプリケーション、ブロックチェーンシミュレーター、技術記事を公開。中村システムエンジニアリング事業所。',
  head: [
    ['link', { rel: 'icon', href: '/home.svg' }],
    ['meta', { property: 'og:title', content: 'Webサイト・デジタルコンテンツ制作 | Ryu Nakamura' }],
    ['meta',{property: 'og:description',content:'個人開発アプリとデジタルコンテンツを提供。Vue.js/TypeScript製のWebアプリケーション、ブロックチェーンシミュレーター、技術記事を公開。中村システムエンジニアリング事業所。',},],
    ['meta',{property: 'og:image',content: 'https://nakamurast20250505.blob.core.windows.net/root/content-image/ogp-logo.png',},],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://www.ryu-nakamura.com' }],
    ['meta', { property: 'twitter:card', content: 'summary' }],
    ['meta',{ property: 'twitter:title', content: 'Webサイト・デジタルコンテンツ制作 | Ryu Nakamura' }],
    ['meta',{property: 'twitter:description',content:'個人開発アプリとデジタルコンテンツを提供。Vue.js/TypeScript製のWebアプリケーション、ブロックチェーンシミュレーター、技術記事を公開。中村システムエンジニアリング事業所。',},],
    ['meta',{property: 'twitter:image',content: 'https://nakamurast20250505.blob.core.windows.net/root/content-image/ogp-logo.png',},],
    ['meta', { property: 'twitter:site', content: '@RyuNakamura' }],
    ['meta', { property: 'twitter:creator', content: '@RyuNakamura' }],
  ],

  async transformPageData(pageData, { siteConfig }) {
    //サブ関数
    const updateContentsMeta = async (pageData: PageData) => {
      if (pageData.relativePath.startsWith('contents/')) {
        pageData.frontmatter.head ??= []
        const filename = pageData.relativePath.split('/')[1]
        const titleNo = filename.split('.')[0]
        const data = await load()
        const content=data.contents.filter((x) => x.title_no.toString() == titleNo)[0]
        pageData.title = content.title
        pageData.description = content.meta_description ??content.preview_text 
        pageData.frontmatter.head.push(['meta', { property: 'og:title', content: `${content.title} | Ryu Nakamura` }])
        pageData.frontmatter.head.push(['meta',{property: 'og:description',content:content.meta_description}])
        pageData.frontmatter.head.push(['meta',{property: 'og:image',content: content.image_url}])
        pageData.frontmatter.head.push(['meta',{ property: 'twitter:title', content: `${content.title} | Ryu Nakamura` }])
        pageData.frontmatter.head.push(['meta',{property: 'twitter:description',content:content.meta_description}])
        pageData.frontmatter.head.push(['meta',{property: 'twitter:image',content:content.image_url}])
      }
    }


    const updateHeader = (pageData: PageData) => {
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push([
        'script',
        {
          async: '',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-63Z9Z6L98S',
        },
      ])
      pageData.frontmatter.head.push([
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-63Z9Z6L98S');`,
      ])
      
    }

    //メイン処理
    await updateContentsMeta(pageData)
    if (process.env.NODE_ENV == 'production') updateHeader(pageData)
    return pageData
  },
  vite: {
    define: (() => {
      const env = loadEnv(process.env.NODE_ENV ?? 'development', `${process.cwd()}/docs`, 'VITE_')
      const defineEnv = {}

      Object.keys(env).forEach((key) => {
        defineEnv[`import.meta.env.${key}`] = JSON.stringify(env[key])
      })

      return defineEnv
    })(),
    
  },
})
