// export class BlogPostType {
//     constructor(
//         public name: string,
//         public description: string,
//         public websiteUrl: string){}
// }

import { Length } from 'class-validator';

export class BlogPostType {
  @Length(3, 10)
  name: string;

  @Length(3, 10)
  description: string;

  @Length(3, 30)
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
