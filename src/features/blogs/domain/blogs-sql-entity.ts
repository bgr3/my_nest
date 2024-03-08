import { BlogPostType, BlogPutType } from '../api/dto/input/blogs-input-dto';
import { BlogRawDb } from '../infrastructure/dto/blog-repository-dto';

export class BlogSQL {
  id: string = '';

  name: string;

  description: string;

  websiteUrl: string;

  createdAt: string;

  isMembership: boolean;

  newBlog: boolean = false;

  updateBlog(inputModel: BlogPutType) {
    this.name = inputModel.name;
    this.description = inputModel.description;
    this.websiteUrl = inputModel.websiteUrl;
  }

  static createSmartBlog(blogDb: BlogRawDb): BlogSQL {
    const blog = new this();

    blog.id = blogDb.Id.toString();
    blog.name = blogDb.Name;
    blog.description = blogDb.Description;
    blog.websiteUrl = blogDb.WebsiteUrl;
    blog.createdAt = blogDb.CreatedAt;
    blog.isMembership = blogDb.IsMembership;

    return blog;
  }

  static createBlog(inputModel: BlogPostType): BlogSQL {
    const blog = new this();

    blog.name = inputModel.name;
    blog.description = inputModel.description;
    blog.websiteUrl = inputModel.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;
    blog.newBlog = true;

    return blog;
  }
}
