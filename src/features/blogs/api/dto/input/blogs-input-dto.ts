import { Matches, MaxLength } from 'class-validator';

export class BlogPostType {
  @MaxLength(15)
  name: string;

  @MaxLength(500)
  description: string;

  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  websiteUrl: string;
}

export class PostForBlogPostType {
  @MaxLength(30)
  title: string;

  @MaxLength(100)
  shortDescription: string;

  @MaxLength(1000)
  content: string;

  blogId: string;
}

export class BlogPutType {
  @MaxLength(15)
  name: string;

  @MaxLength(500)
  description: string;

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