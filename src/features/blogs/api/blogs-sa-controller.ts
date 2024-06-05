import {
  Controller,
  Get,
  HttpException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { PostsORMQueryRepository } from '../../posts/infrastructure/orm/posts-orm-query-repository';
import { BlogsBindBlogCommand } from '../application/use-cases/blogs-bind-blog-use-case';
import { BlogsORMQueryRepository } from '../infrastructure/orm/blogs-orm-query-repository';
import { BlogQueryFilter } from './dto/input/blogs-input-dto';
import { BlogOutput } from './dto/output/blog-output-dto';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class BlogsSAController {
  constructor(
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
    protected postsQueryRepository: PostsORMQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getBlog(
    @Query() query: BlogQueryFilter,
  ): Promise<Paginator<BlogOutput>> {
    const foundBlogs = await this.blogsQueryRepository.findBlogs(
      query,
      '',
      true,
    );

    return foundBlogs;
  }

  @Put(':blogId/bind-with-user/:userId')
  async bindBlog(
    @Param('blogId') blogId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new BlogsBindBlogCommand(blogId, userId),
    );

    if (!result) {
      throw new HttpException('BAD_REQUEST', HTTP_STATUSES.BAD_REQUEST_400);
    }

    return;
  }
}
