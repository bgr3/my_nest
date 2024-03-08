import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  BlogPostType,
  BlogPutType,
  BlogQueryFilter,
  PostForBlogPostType,
} from './dto/input/blogs-input-dto';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { CustomValidationPipe } from '../../../infrastructure/pipes/auth-email-confirm-validation-pipe';
import { BlogOutput } from './dto/output/blog-output-dto';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsCreateBlogCommand } from '../application/use-cases/blogs-create-blog-use-case';
import { BlogsUpdateBlogCommand } from '../application/use-cases/blogs-update-blog-use-case';
import { BlogsDeleteBlogCommand } from '../application/use-cases/blogs-delete-blog-use-case';
import { PostsCreatePostCommand } from '../../posts/application/use-cases/posts-create-post-use-case';
import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import { BlogsSQLQueryRepository } from '../infrastructure/blogs-sql-query-repository';
import { PostsSQLQueryRepository } from '../../posts/infrastructure/posts-sql-query-repository';
// import { BlogsQueryRepository } from '../infrastructure/blogs-query-repository';
// import { PostsQueryRepository } from '../../posts/infrastructure/posts-query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    // private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsQueryRepository: BlogsSQLQueryRepository,
    //private readonly postsQueryRepository: PostsQueryRepository,
    protected postsQueryRepository: PostsSQLQueryRepository,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogQueryFilter) {
    return await this.blogsQueryRepository.findBlogs(query);
  }

  @Get(':id')
  async getBlog(@Param('id') id: string) {
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
  ) {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);

    const userId = req.user;

    const posts = await this.postsQueryRepository.findPosts(id, query, userId);

    if (!foundBlog) {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    } else {
      return posts;
    }
  }
}
