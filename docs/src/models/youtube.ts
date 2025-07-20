export interface MediaContent {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  views: number
  publishedAt: string
  source: 'youtube' | 'X' | 'other'
}
