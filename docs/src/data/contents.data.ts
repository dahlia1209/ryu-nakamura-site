import { defineLoader,loadEnv } from 'vitepress'
import {PreviewContent} from '../models/content'

export interface Data {
  contents: PreviewContent[]
}

declare const data: Data
export { data }

export async function  load(): Promise<Data> {
    try {
      const env = loadEnv(process.env.NODE_ENV ?? "development", `${process.cwd()}/docs`, 'VITE_')
      const response = await fetch(env["VITE_CONTENT_LIST_FILEPATH"])
      
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
  load
})