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
import { BlogsService } from '../application/blog-service';
import { BlogsQueryRepository } from '../infrastructure/blogs-query-repository';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query-repository';
import { PostsService } from '../../posts/application/post-service';
import { blogCheckQuery } from '../application/blog-check-query';
import { JwtService } from '@nestjs/jwt';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { CustomValidationPipe } from '../../../infrastructure/pipes/auth-email-confirm-validation-pipe';
import { BlogOutput } from './dto/output/blog-output-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body(new CustomValidationPipe) dto: BlogPostType): Promise<BlogOutput | null> {
    const result = await this.blogsService.createBlog(dto);

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

    const result = await this.postsService.createPost(dto);

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

    const accessToken = req.payload;
    const userId = await this.jwtService.verifyAsync(accessToken);

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

    const updatedBlog = await this.blogsService.updateBlog(id, dto);

    if (!updatedBlog) throw new BadRequestException();

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteBlog(@Param('id') id: string) {
    const foundBlog = await this.blogsService.deleteBlog(id);

    if (foundBlog) {
      return;
    } else {
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    }
  }
}
