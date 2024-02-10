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
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  BlogPostType,
  BlogPutType,
  PostForBlogPostType,
} from './dto/input/blogs-input-dto';
import { BlogsQueryRepository } from '../infrastructure/blogs-query-repository';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query-repository';
import { blogCheckQuery } from '../application/blog-check-query';
import { JwtService } from '@nestjs/jwt';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { CustomValidationPipe } from '../../../infrastructure/pipes/auth-email-confirm-validation-pipe';
import { BlogOutput } from './dto/output/blog-output-dto';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsCreateBlogCommand } from '../application/use-cases/blogs-create-blog-use-case';
import { BlogsUpdateBlogCommand } from '../application/use-cases/blogs-update-blog-use-case';
import { BlogsDeleteBlogCommand } from '../application/use-cases/blogs-delete-blog-use-case copy';
import { PostsCreatePostCommand } from '../../posts/application/use-cases/posts-create-post-use-case';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body(new CustomValidationPipe) dto: BlogPostType): Promise<BlogOutput | null> {
    const result = await this.commandBus.execute(new BlogsCreateBlogCommand(dto));

    if (!result) {
      throw new HttpException('BAD_REQUEST', HTTP_STATUSES.BAD_REQUEST_400);
    }

    const newBlog = await this.blogsQueryRepository.findBlogByID(result!);

    return newBlog;
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  async createPostforBlog(
    @Param('id') id: string,
    @Body() dto: PostForBlogPostType,
  ) {
    dto.blogId = id;

    const result = await this.commandBus.execute(new PostsCreatePostCommand(dto));

    if (!result) {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    }

    const newPost = await this.postsQueryRepository.findPostByID(result);

    return newPost;
  }

  @Get()
  async getBlogs(@Query() query) {
    const queryFilter = blogCheckQuery(query);

    return await this.blogsQueryRepository.findBlogs(queryFilter);
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
  async getPostsforBlog(@Param('id') id: string, @Query() query, @Req() req) {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);
    const queryFilter = blogCheckQuery(query);

    const userId = req.user

    const posts = await this.postsQueryRepository.findPosts(
      id,
      queryFilter, userId,
    );

    if (!foundBlog) {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    } else {
      return posts;
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updateBlog(@Param('id') id: string, @Body() dto: BlogPutType) {
    const foundBlog = await this.blogsQueryRepository.findBlogByID(id);

    if (!foundBlog) throw new NotFoundException();

    const updatedBlog = await this.commandBus.execute(new BlogsUpdateBlogCommand(id, dto));

    if (!updatedBlog) throw new BadRequestException();

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteBlog(@Param('id') id: string) {
    const foundBlog = await this.commandBus.execute(new BlogsDeleteBlogCommand(id));

    if (foundBlog) {
      return;
    } else {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    }
  }
}
