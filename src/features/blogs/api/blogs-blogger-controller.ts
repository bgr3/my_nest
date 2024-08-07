import path, { dirname } from 'node:path';

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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';

import { readTextFileAsync } from '../../../base/utils/fs-utils';
import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { CustomValidationPipe } from '../../../infrastructure/pipes/auth-email-confirm-validation-pipe';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { BloggerAllCommentsOutput } from '../../comments/api/dto/output/comments-output-dto';
import { CommentsORMQueryRepository } from '../../comments/infrastructure/orm/comments-orm-query-repository';
import { PostOutput } from '../../posts/api/dto/output/post-output-type';
import { PostsCreatePostCommand } from '../../posts/application/use-cases/posts-create-post-use-case';
import { PostsDeletePostCommand } from '../../posts/application/use-cases/posts-delete-post-use-case';
import { PostsUpdatePostCommand } from '../../posts/application/use-cases/posts-update-post-use-case';
import { PostsORMQueryRepository } from '../../posts/infrastructure/orm/posts-orm-query-repository';
import { BlogsService } from '../application/blog-service';
import { BlogsCreateBlogCommand } from '../application/use-cases/blogs-create-blog-use-case';
import { BlogsDeleteBlogCommand } from '../application/use-cases/blogs-delete-blog-use-case';
import { BlogsUpdateBlogCommand } from '../application/use-cases/blogs-update-blog-use-case';
import { BlogsUploadBackgroundWallpaperCommand } from '../application/use-cases/blogs-upload-background-wallpaper-use-case';
import { BlogsORMQueryRepository } from '../infrastructure/orm/blogs-orm-query-repository';
import {
  BlogPostType,
  BlogPutType,
  BlogQueryFilter,
  PostForBlogPostType,
  PostForBlogPutType,
} from './dto/input/blogs-input-dto';
import { BlogOutput } from './dto/output/blog-output-dto';

// @UseGuards(JwtAuthGuard)
@Controller('blogger/blogs')
export class BlogsBloggerController {
  constructor(
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
    private readonly postsQueryRepository: PostsORMQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsORMQueryRepository,
    private readonly blogsService: BlogsService,
  ) {}

  @Get('images/wallpaper')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadBackgroundWallpaperForBlog(): Promise<any> {
    console.log('!!!!!!!!dirName');

    console.log(__dirname);
    console.log(dirname(require.main!.filename));

    path.basename;

    const dirPath = path.join(
      'base',
      'views',
      'wallpapers',
      'change-page.html',
    );

    const htmlContent = await readTextFileAsync(dirPath);
    return htmlContent;
  }

  @Post('images/wallpaper')
  @UseInterceptors(FileInterceptor('wallpaper'))
  async changeBackgroundWallpaperForBlog(
    @UploadedFile() wallpaper: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    console.log('wallpaper: ');

    console.log(wallpaper);

    const userId = '1'; //from request token

    await this.commandBus.execute(
      new BlogsUploadBackgroundWallpaperCommand(
        userId,
        wallpaper.originalname,
        wallpaper.buffer,
      ),
    );

    return 'wallpaper changed';
  }

  @Get('comments')
  async getAllComments(
    @Query() query: BlogQueryFilter,
    @Req() req,
  ): Promise<Paginator<BloggerAllCommentsOutput>> {
    const userId = req.user;

    const result = await this.commentsQueryRepository.findAllCommentsForBlogger(
      query,
      userId,
    );
    return result;
  }

  @Put(':id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: BlogPutType,
  ): Promise<void> {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);

    if (!foundBlog) throw new NotFoundException();

    const updatedBlog = await this.commandBus.execute(
      new BlogsUpdateBlogCommand(id, dto),
    );

    if (!updatedBlog) throw new BadRequestException();

    return;
  }

  @Delete(':id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    const foundBlog = await this.commandBus.execute(
      new BlogsDeleteBlogCommand(id),
    );

    if (foundBlog) {
      return;
    } else {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    }
  }

  @Post()
  async createBlog(
    @Body(new CustomValidationPipe()) dto: BlogPostType,
    @Req() req,
  ): Promise<BlogOutput | null> {
    const userId = req.user;

    const result = await this.commandBus.execute(
      new BlogsCreateBlogCommand(dto, userId),
    );

    if (!result) {
      throw new HttpException('BAD_REQUEST', HTTP_STATUSES.BAD_REQUEST_400);
    }

    const newBlog = await this.blogsQueryRepository.findBlogByID(result!);

    return newBlog;
  }

  @Get()
  async getBlogs(
    @Query() query: BlogQueryFilter,
    @Req() req,
  ): Promise<Paginator<BlogOutput>> {
    const userId = req.user;

    const result = await this.blogsQueryRepository.findBlogs(query, userId);
    return result;
  }

  @Post(':id/posts')
  async createPostforBlog(
    @Param('id') id: string,
    @Body() dto: PostForBlogPostType,
  ): Promise<PostOutput | null> {
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

  @Get(':id/posts')
  async getPostsforBlog(
    @Param('id') id: string,
    @Query() query: QueryFilter,
    @Req() req,
  ): Promise<Paginator<PostOutput>> {
    const userId = req.user;

    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const posts = await this.postsQueryRepository.findPosts(id, query, userId);

    return posts;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updatePostForBlog(
    @Param('postId') postId: string,
    @Param('blogId') blogId: string,
    @Body() dto: PostForBlogPutType,
  ): Promise<void> {
    dto.blogId = blogId;

    const updatedPost = await this.commandBus.execute(
      new PostsUpdatePostCommand(postId, dto),
    );

    if (!updatedPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deletePost(
    @Param('postId') postId: string,
    @Param('blogId') blogId: string,
  ): Promise<void> {
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
