export class ContentItem {
  constructor(
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