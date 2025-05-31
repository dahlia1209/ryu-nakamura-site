import { defineLoader } from 'vitepress'
import {PreviewContent} from '../models/content'

export interface Data {
  contents: PreviewContent[]
}

declare const data: Data
export { data }

export async function  load(): Promise<Data> {
    try {
      const response = await fetch('https://nakamurast20250505.blob.core.windows.net/root/process/contents_list.json')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contents: PreviewContent[] = await response.json()
      const sortedContents = contents.sort((a, b) => b.title_no-a.title_no)
      
      return { contents: sortedContents }
      
    } catch (error) {
      console.error('コンテンツデータの読み込みに失敗しました:', error)
      return { contents: [] }
    }
  }

export default defineLoader({
  watch: ['https://nakamurast20250505.blob.core.windows.net/root/process/contents_list.json'],
  load
})