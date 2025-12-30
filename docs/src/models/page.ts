

export class Headline {
  constructor(
    public id: string,
    public display: string,
    public headtag?:"h1"|"h2"
  ) {
    if (this.headtag == null)this.headtag="h2"
  }
}
