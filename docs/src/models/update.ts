export type UpdateType = 'article' | 'app' | 'notice'

export class UpdateItem {
  constructor(
    public date: string,
    public type: UpdateType,
    public title: string,
    public description: string,
    public link?: string,
  ) {}
}
