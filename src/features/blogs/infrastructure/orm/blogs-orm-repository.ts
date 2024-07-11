import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogORM } from '../../domain/blogs-orm-entity';

export class BlogsORMRepository {
  constructor(
    @InjectRepository(BlogORM)
    private readonly blogsRepository: Repository<BlogORM>,
  ) {}

  async testAllData(): Promise<void> {
    await this.blogsRepository.delete({});
  }

  async save(blog: BlogORM): Promise<string | null> {
    const blogResult = await this.blogsRepository.save(blog);

    return blogResult.id;
  }

  async getBlogById(id: string): Promise<BlogORM | null> {
    let blog;

    try {
      blog = await this.blogsRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    return blog;
  }

  async getAllBlogs(): Promise<BlogORM[] | []> {
    const blogs = await this.blogsRepository.find();

    return blogs;
  }

  async deleteBlog(id: string): Promise<boolean> {
    let result;

    try {
      result = await this.blogsRepository.delete(id);
    } catch (err) {
      console.log(err);

      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }
}
