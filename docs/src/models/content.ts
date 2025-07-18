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
    )
  }
}