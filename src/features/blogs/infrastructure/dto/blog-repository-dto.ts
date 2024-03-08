export class BlogRawDb {
  constructor(
    public Id: string,
    public Name: string,
    public Description: string,
    public WebsiteUrl: string,
    public CreatedAt: string,
    public IsMembership: boolean,
  ) {}
}
