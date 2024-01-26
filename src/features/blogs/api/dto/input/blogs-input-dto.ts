// export class BlogPostType {
//     constructor(
//         public name: string,
//         public description: string,
//         public websiteUrl: string){}
// }

import { Length, Matches } from 'class-validator';

export class BlogPostType {
  @Length(1, 15)
  name: string;

  @Length(1, 500)
  description: string;

  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  websiteUrl: string;
}

export class PostForBlogPostType {
  blogId: string;
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
  ) {}
}

export class BlogPutType {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}
