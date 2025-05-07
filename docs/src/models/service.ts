export class Service {
    constructor(
      public id: number,
      public title: string,
      public description: string,
      public shortDescription: string,
      public imageUrl: string,
      public features: string[],
      public price?: string,
      public deliveryTime?: string,
      public detailSections?: {title: string, content: string}[]
    ) {}
  }