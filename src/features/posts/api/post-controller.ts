import {
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
import { PostPostType, PostPutType } from './dto/input/post-input-dto';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { CommentPostType } from '../../comments/api/dto/input/comments-input-dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments-query-repository';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import {
  LikeStatus,
  QueryFilter,
} from '../../../infrastructure/dto/input/input-dto';
import { PostOutput } from './dto/output/post-output-type';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsCreateCommentCommand } from '../../comments/application/use-cases/comments-create-comment-use-case';
import { PostsCreatePostCommand } from '../application/use-cases/posts-create-post-use-case';
import { PostsUpdatePostCommand } from '../application/use-cases/posts-update-post-use-case';
import { PostsLikeStatusCommand } from '../application/use-cases/posts-like-status-use-case';
import { PostsDeletePostCommand } from '../application/use-cases/posts-delete-post-use-case';
import { PostsSQLQueryRepository } from '../infrastructure/posts-sql-query-repository';
// import { PostsQueryRepository } from '../infrastructure/posts-query-repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    // private readonly postsQueryRepository: PostsQueryRepository,
    protected postsQueryRepository: PostsSQLQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async likeStatus(
    @Body() dto: LikeStatus,
    @Req() req,
    @Param('id') id: string,
  ) {
    const userId = req.user;
    const result = await this.commandBus.execute(
      new PostsLikeStatusCommand(id, userId, dto),
    );

    if (!result) throw new NotFoundException();

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() dto: PostPostType): Promise<PostOutput | null> {
    const result = await this.commandBus.execute(
      new PostsCreatePostCommand(dto),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newPost = await this.postsQueryRepository.findPostByID(result);

    return newPost;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() dto: CommentPostType,
    @Req() req,
  ) {
    const userId = req.user;
    const result = await this.commandBus.execute(
      new CommentsCreateCommentCommand(dto, userId, postId),
    );
    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newPost = await this.commentsQueryRepository.findCommentByID(result);

    return newPost;
  }

  @Get()
  async getPosts(@Req() req, @Query() query: QueryFilter) {
    const userId = req.user;

    return await this.postsQueryRepository.findPosts(null, query, userId);
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: string, @Req() req) {
    const userId = req.user;

    const foundPost = await this.postsQueryRepository.findPostByID(
      postId,
      userId,
    );

    if (!foundPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return foundPost;
  }

  @Get(':postId/comments')
  async getCommentsForPost(
    @Param('postId') postId: string,
    @Query() query: QueryFilter,
    @Req() req,
  ) {
    const post = await this.postsQueryRepository.findPostByID(postId);

    const userId = req.user;

    const foundcomments = await this.commentsQueryRepository.findComments(
      postId,
      query,
      userId,
    );

    if (!post)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return foundcomments;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':postId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updatePost(@Param('postId') postId: string, @Body() dto: PostPutType) {
    const updatedPost = await this.commandBus.execute(
      new PostsUpdatePostCommand(postId, dto),
    );

    if (!updatedPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':postId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deletePost(@Param('postId') postId: string) {
    const foundPost = await this.commandBus.execute(
      new PostsDeletePostCommand(postId),
    );

    if (!foundPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}
