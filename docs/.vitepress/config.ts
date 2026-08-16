import { defineConfig, PageData, loadEnv } from 'vitepress'
import { load } from '../src/data/contents.data'

const DEFAULT_OG_IMAGE = 'https://nakamurast20250505.blob.core.windows.net/root/content-image/ogp-logo.png'
const HOME_OG_TITLE = 'Webサイト・デジタルコンテンツ制作 | Ryu Nakamura'
const HOME_OG_DESCRIPTION = '個人開発アプリとデジタルコンテンツを提供。Vue.js/TypeScript製のWebアプリケーション、ブロックチェーンシミュレーター、技術記事を公開。RyuTech。'

export default defineConfig({
  title: 'Ryu Nakamura',
  description: HOME_OG_DESCRIPTION,
  head: [
    ['link', { rel: 'icon', href: '/home.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'twitter:card', content: 'summary' }],
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


    const updatePageUrl = (pageData: PageData) => {
      const BASE_URL = 'https://www.ryu-nakamura.com'
      const path = pageData.relativePath.replace(/\.md$/, '').replace(/^index$/, '')
      const pageUrl = `${BASE_URL}/${path}`
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push(['link', { rel: 'canonical', href: pageUrl }])
      pageData.frontmatter.head.push(['meta', { property: 'og:url', content: pageUrl }])
    }

    // contents/配下は updateContentsMeta が個別にog:title等を設定するため対象外
    const updateGenericMeta = (pageData: PageData) => {
      if (pageData.relativePath.startsWith('contents/')) return
      const isHome = pageData.relativePath === 'index.md'
      const ogTitle = isHome ? HOME_OG_TITLE : `${pageData.title} | Ryu Nakamura`
      const ogDescription = isHome ? HOME_OG_DESCRIPTION : pageData.description
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push(['meta', { property: 'og:title', content: ogTitle }])
      pageData.frontmatter.head.push(['meta', { property: 'og:description', content: ogDescription }])
      pageData.frontmatter.head.push(['meta', { property: 'og:image', content: DEFAULT_OG_IMAGE }])
      pageData.frontmatter.head.push(['meta', { property: 'twitter:title', content: ogTitle }])
      pageData.frontmatter.head.push(['meta', { property: 'twitter:description', content: ogDescription }])
      pageData.frontmatter.head.push(['meta', { property: 'twitter:image', content: DEFAULT_OG_IMAGE }])
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
    updateGenericMeta(pageData)
    updatePageUrl(pageData)
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
