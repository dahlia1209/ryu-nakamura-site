export class Headline {
  constructor(
    public id: string,
    public display: string,
    public link?:string,
  ) {
    if (this.link==undefined) this.link=`#${this.id}`
  }
}
