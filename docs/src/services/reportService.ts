import {
  type OrderStatus,
  Order,
  type IOrderResponse,
  type IOrderItemRequest,
  OrderItem,
} from '../models/order'

export function useReportService() {
  const reportEndpoint = new URL(import.meta.env.VITE_REPORT_DIR)
  
  async function getYoutubeVideoReport() {
    try {
      const endpoint = new URL(reportEndpoint.toString() + '/current_youtube_video_trend.json')
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const jsonData = await response.json()
      return jsonData
    } catch (error) {
      console.error('レポートデータの読み込みに失敗しました:', error)
      return { contents: [] }
    }
  }

  async function getYoutubeVideoReportWithMetadata() {
    try {
      const endpoint = new URL(reportEndpoint.toString() + '/current_youtube_video_trend.json'+`?v=${Date.now()}`)
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const jsonData = await response.json()
      const lastModified = response.headers.get('Last-Modified')
      
      return {
        data: jsonData,
        lastModified: lastModified ? new Date(lastModified) : null
      }
    } catch (error) {
      console.error('レポートデータの読み込みに失敗しました:', error)
      return { 
        data: { contents: [] },
        lastModified: null
      }
    }
  }


  async function getXTrendWithMetadata() {
    try {
      const endpoint = new URL(reportEndpoint.toString() + '/current_trend24_item_trend.json'+`?v=${Date.now()}`)
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const jsonData = await response.json()
      const lastModified = response.headers.get('Last-Modified')
      
      return {
        data: jsonData,
        lastModified: lastModified ? new Date(lastModified) : null
      }
    } catch (error) {
      console.error('レポートデータの読み込みに失敗しました:', error)
      return { 
        data: { contents: [] },
        lastModified: null
      }
    }
  }

  return {
    getYoutubeVideoReport,
    getYoutubeVideoReportWithMetadata,
    getXTrendWithMetadata,
  }
}
