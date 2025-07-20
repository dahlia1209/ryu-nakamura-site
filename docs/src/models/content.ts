export class Content {
  constructor(
    public id:string,
    public titleNo: number,
    public title: string, 
    public contentText: string,
    public contentHtml: string,
    public imageUrl: string,
    public price: number,
    public category: string,
    public tags: string[],
    public publishDate: Date,
    public previewTextLength: number =100,
    public noteUrl?: string,
    public previewSpeechUrl?: string,
    public previewMoovieUrl?: string,
    public fullSpeechUrl?: string,
  ) {
  }

  static fromIContentResponse(response:IContentResponse){
    return new Content(
      response.id,
      response.title_no,
      response.title,
      response.content_text,
      response.content_html,
      response.image_url,
      response.price,
      response.category,
      response.tags,
      new Date(response.publish_date) ,
      response.preview_text_length,
      response.note_url,
      response.preview_speech_url,
      response.preview_moovie_url,
      response.full_speech_url,
    )
  }
}

export interface IContentResponse {
    id:string
    title_no: number
    title: string
    content_text: string
    content_html: string
    image_url: string
    price: number
    category: string
    tags: string[]
    publish_date: string;
    preview_text_length: number
    note_url?: string
    preview_speech_url?: string
    preview_moovie_url?: string
    full_speech_url?: string
}


export class ContentPurchase {
  constructor(
    public contentId: number,
    public customerEmail: string,
    public customerName?: string,
  ) {}
}

// Interface for checkout session status response
export class CheckoutSessionStatus {
  constructor(
    public id: number,
    public status: string,
    public payment_status: string,
    public customer_email: string,
    public amount_total: number,
  ) {}
}

export class WorkItem {
  constructor(
      public id: number,
      public title: string,
      public description: string,
      public imageUrl: string,
      public techStack: string[],
      public projectUrl?: string,
      public githubUrl?: string,
  ){}
}

export class PreviewContent {
  constructor(
    public id:string,
    public title_no: number,
    public title: string, 
    public preview_text: string,
    public preview_html: string,
    public image_url: string,
    public price: number,
    public category: string,
    public tags: string[],
    public publish_date: string,
    public remaining_text_length: number =100,
    public note_url?: string,
    public preview_speech_url?: string,
    public preview_moovie_url?: string,
    public full_speech_url?: string,
  ) {
  }

  toContent(){
    return new Content(
      this.id,
      this.title_no,
      this.title,
      this.preview_text,
      this.preview_html,
      this.image_url,
      this.price,
      this.category,
      this.tags,
      new Date(this.publish_date),
      0,
      this.note_url,
      this.preview_speech_url,
      this.preview_moovie_url,
      this.full_speech_url,
    )
  }
}