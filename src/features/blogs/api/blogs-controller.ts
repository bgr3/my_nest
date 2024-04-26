import {
  Controller,
  Get,
  HttpException,
  Param,
  Query,
  Req,
} from '@nestjs/common';

import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { PostOutput } from '../../posts/api/dto/output/post-output-type';
import { PostsORMQueryRepository } from '../../posts/infrastructure/orm/posts-orm-query-repository';
// import { PostsSQLQueryRepository } from '../../posts/infrastructure/sql/posts-sql-query-repository';
import { BlogsORMQueryRepository } from '../infrastructure/orm/blogs-orm-query-repository';
import { BlogQueryFilter } from './dto/input/blogs-input-dto';
import { BlogOutput } from './dto/output/blog-output-dto';
// import { BlogsSQLQueryRepository } from '../infrastructure/sql/blogs-sql-query-repository';
// import { BlogsQueryRepository } from '../infrastructure/blogs-query-repository';
// import { PostsQueryRepository } from '../../posts/infrastructure/posts-query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    // private readonly blogsQueryRepository: BlogsQueryRepository,
    // private readonly blogsQueryRepository: BlogsSQLQueryRepository,
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
    //private readonly postsQueryRepository: PostsQueryRepository,
    // protected postsQueryRepository: PostsSQLQueryRepository,
    protected postsQueryRepository: PostsORMQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query() query: BlogQueryFilter,
  ): Promise<Paginator<BlogOutput>> {
    const result = await this.blogsQueryRepository.findBlogs(query);
    return result;
  }

  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogOutput> {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);

    if (foundBlog) {
      return foundBlog;
    } else {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    }
  }

  @Get(':id/posts')
  async getPostsforBlog(
    @Param('id') id: string,
    @Query() query: QueryFilter,
    @Req() req,
  ): Promise<Paginator<PostOutput>> {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const userId = req.user;

    const posts = await this.postsQueryRepository.findPosts(id, query, userId);

    return posts;
  }
}
