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
  PostForBlogPutType,
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
// import { PostsSQLQueryRepository } from '../../posts/infrastructure/sql/posts-sql-query-repository';
import { PostsUpdatePostCommand } from '../../posts/application/use-cases/posts-update-post-use-case';
import { PostsDeletePostCommand } from '../../posts/application/use-cases/posts-delete-post-use-case';
import { BlogsORMQueryRepository } from '../infrastructure/orm/blogs-orm-query-repository';
import { PostsORMQueryRepository } from '../../posts/infrastructure/orm/posts-orm-query-repository';
// import { BlogsSQLQueryRepository } from '../infrastructure/sql/blogs-sql-query-repository';
// import { BlogsQueryRepository } from '../infrastructure/blogs-query-repository';
// import { PostsQueryRepository } from '../../posts/infrastructure/posts-query-repository';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class BlogsSAController {
  constructor(
    // private readonly blogsQueryRepository: BlogsQueryRepository,
    // private readonly blogsQueryRepository: BlogsSQLQueryRepository,
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
    //private readonly postsQueryRepository: PostsQueryRepository,
    // protected postsQueryRepository: PostsSQLQueryRepository,
    protected postsQueryRepository: PostsORMQueryRepository,
    //private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async createBlog(
    @Body(new CustomValidationPipe()) dto: BlogPostType,
  ): Promise<BlogOutput | null> {
    const result = await this.commandBus.execute(
      new BlogsCreateBlogCommand(dto),
    );

    if (!result) {
      throw new HttpException('BAD_REQUEST', HTTP_STATUSES.BAD_REQUEST_400);
    }

    const newBlog = await this.blogsQueryRepository.findBlogByID(result!);

    return newBlog;
  }

  @Post(':id/posts')
  async createPostforBlog(
    @Param('id') id: string,
    @Body() dto: PostForBlogPostType,
  ) {
    dto.blogId = id;

    const result = await this.commandBus.execute(
      new PostsCreatePostCommand(dto),
    );

    if (!result) {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    }

    const newPost = await this.postsQueryRepository.findPostByID(result);

    return newPost;
  }

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

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const userId = req.user;

    const posts = await this.postsQueryRepository.findPosts(id, query, userId);

    return posts;
  }

  @Put(':id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updateBlog(@Param('id') id: string, @Body() dto: BlogPutType) {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);

    if (!foundBlog) throw new NotFoundException();

    const updatedBlog = await this.commandBus.execute(
      new BlogsUpdateBlogCommand(id, dto),
    );

    if (!updatedBlog) throw new BadRequestException();

    return;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updatePostForBlog(
    @Param('postId') postId: string,
    @Param('blogId') blogId: string,
    @Body() dto: PostForBlogPutType,
  ) {
    dto.blogId = blogId;

    const updatedPost = await this.commandBus.execute(
      new PostsUpdatePostCommand(postId, dto),
    );

    if (!updatedPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @Delete(':id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteBlog(@Param('id') id: string) {
    const foundBlog = await this.commandBus.execute(
      new BlogsDeleteBlogCommand(id),
    );

    if (foundBlog) {
      return;
    } else {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    }
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deletePost(
    @Param('postId') postId: string,
    @Param('blogId') blogId: string,
  ) {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(blogId);

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const foundPost = await this.commandBus.execute(
      new PostsDeletePostCommand(postId),
    );

    if (!foundPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}
