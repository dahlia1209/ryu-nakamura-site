
export class YouTubeVideoData {
  constructor(
    public partitionKey: string,
    public categoryId: string,
    public channelId: string,
    public channelTitle: string,
    public description: string,
    public id: string,
    public liveBroadcastContent: string,
    public publishedAt: Date,
    public rank: number,
    public tags: string[]=[],
    public thumbnailUrl: string,
    public title: string,
    public url: string,
    public viewCount: number,
    public defaultLanguage?: string,
    public defaultAudioLanguage?: string,
    public likeCount?: number,
    public favoriteCount?: number,
    public commentCount?: number,
  ) {
  }

  static fromData(data: any): YouTubeVideoData {
    return new YouTubeVideoData(
      data.PartitionKey,
      data.category_id,
      data.channel_id,
      data.channel_title,
      data.description,
      data.id,
      data.live_broadcast_content,
      new Date(data.published_at),
      data.rank,
      data.tags,
      data.thumbnail_url,
      data.title,
      data.url,
      data.view_count,
      data.default_language,
      data.default_audio_language,
      data.like_count,
      data.favorite_count,
      data.comment_count,
    );
  }

  toYoutubeContent(){
    return{
      id:this.id,
      title:this.title,
      description:this.description,
      url:this.url,
      thumbnail:this.thumbnailUrl,
      publishedAt:this.publishedAt,
      views:this.viewCount
    } as YoutubeContent
  }
}

export interface YoutubeContent {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  views: number
  publishedAt: Date
}

export type TrendCategory = 
  | 'longest_trending'  
  | 'max_tweets'      
  | 'new_trends'        
  | 'popular_active';   


export class XTrendData {
  constructor(
      public PartitionKey: string,
      public id: string,
      public category: TrendCategory,
      public trend: string,
      public rank: number,
      public url: string,
      public info: string,
      public scrapedAt: Date
  ){}

  static fromData(data: any): XTrendData {
    return new XTrendData(
      data.PartitionKey,
      data.id,
      data.category,
      data.trend,
      data.rank,
      data.url,
      data.info,
      new Date(data.scraped_at),
    );
  }

  toXContent (){
    return{
      id:this.id,
      category:this.category,
      trend:this.trend,
      rank:this.rank,
      url:this.url,
      info:this.info
    } as XContent
  }
}

export type CategoryType ='longest_trending'|'max_tweets'|'new_trends'|'popular_active'

export interface XContent {
  id: string
  category:CategoryType
  trend: string
  rank:number
  url: string
  info: string
}

export type MediaType='youtube' | 'X' 

export class NewsContents<T extends MediaType>{
  constructor(
    public mediaType: T,
    public mediaLogoSrc:string,
    public contents: T extends 'youtube' ? YoutubeContent[] 
                   : T extends 'X' ? XContent[]
                   : never[],
    public lastUpdated?:Date,
  ){}
}

export interface XCategories{
  name:'longest_trending'|'max_tweets'|'new_trends'|'popular_active',
  displayName:string,
  items:XContent[],
}
