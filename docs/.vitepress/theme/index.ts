
// You can directly import Vue files in the theme entry
// VitePress is pre-configured with @vitejs/plugin-vue.
// import '../../src/assets/main.css'
import './custom.css'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { createPinia } from 'pinia'
import Layout from './LayoutView.vue'
import {contentsData} from '../../src/data/contents.ts'
import {workData} from '../../src/data/workItems.ts'
import {useContentStore} from '../../src/stores/content'
import {useContactStore} from '../../src/stores/contact.ts'

export default {
  Layout,
  enhanceApp({ app,router,siteData }) {
    const pinia = createPinia()
    app.use(pinia)
    const contentStore=useContentStore()
    contentStore.updateContents(contentsData)
    contentStore.updateWorkItems(workData)
    
  }
} satisfies Theme