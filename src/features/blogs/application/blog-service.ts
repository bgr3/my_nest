import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blogs-entity';
import { BlogsRepository } from '../infrastructure/blogs-repository';
import { BlogPostType, BlogPutType } from '../api/dto/input/blogs-input-dto';
import { validateOrReject } from 'class-validator';

const validateOrRejectModel = async (model: any, ctor: { new (): any }) => {
  if (model instanceof ctor === false) {
    throw new Error('incorrect input data');
  }

  try {
    await validateOrReject(model);
  } catch (err) {
    throw new Error(err); //for what?
  }
};

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    protected blogsRepository: BlogsRepository,
  ) {}
  async testAllData(): Promise<void> {
    return this.blogsRepository.testAllData();
  }

  async createBlog(dto: BlogPostType): Promise<string | null> {
    validateOrRejectModel(dto, BlogPostType);
    const newBlog = Blog.createBlog(dto);
    const newBlogModel = new this.BlogModel(newBlog);

    await this.blogsRepository.save(newBlogModel);

    return newBlogModel._id.toString();
  }

  async updateBlog(id: string, dto: BlogPutType): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogById(id);

    if (blog) {
      blog.updateBlog(dto);
      this.blogsRepository.save(blog);
      return true;
    }

    return false;
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(id);
  }
}
