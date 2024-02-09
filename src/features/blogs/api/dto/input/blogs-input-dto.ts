import { Length, Matches } from 'class-validator';


export class BlogPostType {
  @Length(1, 15)
  name: string;

  @Length(1, 500)
  description: string;

  @Length(1, 100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  websiteUrl: string;
}

export class PostForBlogPostType {
  @Length(1, 30)
  title: string;

  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  blogId: string;
}

export class BlogPutType {
  @Length(1, 15)
  name: string;

  @Length(1, 500)
  description: string;

  @Length(1, 100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  websiteUrl: string;
}

export class BlogFilter {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  searchNameTerm: string;
}