import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Content,WorkItem } from '../models/content'
import { useReportService } from '../services/reportService'
import { data} from '../data/contents.data'

export const useContentStore = defineStore('content', {
    state: () => ({
      reportService:useReportService(),
      workItems:[] as WorkItem[],
      contentItems:[] as Content[],
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
      updateContentHtml(contentTitleNo: number, newContentHtml: string) {
        const contentIndex = this.contentItems.findIndex(item => item.titleNo === contentTitleNo);
        if (contentIndex !== -1) {
          // contentItemsの特定のアイテムのcontentHtmlを更新
          this.contentItems[contentIndex].contentHtml = newContentHtml;
        }
      },
      updateContents(contents:Content[]) {
        this.contentItems=contents
      },
      updateWorkItems(workItems:WorkItem[]) {
        this.workItems=workItems
      },
      setContentsFromPreview(){
        this.contentItems=data.contents.map(x=>x.toContent())
      }
    },
})