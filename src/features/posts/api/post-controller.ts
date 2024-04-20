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
import { CommandBus } from '@nestjs/cqrs';

import {
  LikeStatus,
  QueryFilter,
} from '../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { CommentPostType } from '../../comments/api/dto/input/comments-input-dto';
import { CommentOutput } from '../../comments/api/dto/output/comments-output-dto';
import { CommentsCreateCommentCommand } from '../../comments/application/use-cases/comments-create-comment-use-case';
import { CommentsORMQueryRepository } from '../../comments/infrastructure/orm/comments-orm-query-repository';
import { PostsCreatePostCommand } from '../application/use-cases/posts-create-post-use-case';
import { PostsDeletePostCommand } from '../application/use-cases/posts-delete-post-use-case';
import { PostsLikeStatusCommand } from '../application/use-cases/posts-like-status-use-case';
import { PostsUpdatePostCommand } from '../application/use-cases/posts-update-post-use-case';
// import { PostsSQLQueryRepository } from '../infrastructure/sql/posts-sql-query-repository';
// import { CommentsSQLQueryRepository } from '../../comments/infrastructure/sql/comments-sql-query-repository';
import { PostsORMQueryRepository } from '../infrastructure/orm/posts-orm-query-repository';
import { PostPostType, PostPutType } from './dto/input/post-input-dto';
import { PostOutput } from './dto/output/post-output-type';
// import { CommentsQueryRepository } from '../../comments/infrastructure/comments-query-repository';
// import { PostsQueryRepository } from '../infrastructure/posts-query-repository';

@Controller('posts')
export class PostsController {
  constructor(
    // private readonly commentsQueryRepository: CommentsQueryRepository,
    // protected commentsQueryRepository: CommentsSQLQueryRepository,
    protected commentsQueryRepository: CommentsORMQueryRepository,
    // private readonly postsQueryRepository: PostsQueryRepository,
    // protected postsQueryRepository: PostsSQLQueryRepository,
    protected postsQueryRepository: PostsORMQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async likeStatus(
    @Body() dto: LikeStatus,
    @Req() req,
    @Param('id') id: string,
  ): Promise<void> {
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
  ): Promise<CommentOutput | null> {
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
  async getPosts(
    @Req() req,
    @Query() query: QueryFilter,
  ): Promise<Paginator<PostOutput>> {
    const userId = req.user;

    return this.postsQueryRepository.findPosts(null, query, userId);
  }

  @Get(':postId')
  async getPost(
    @Param('postId') postId: string,
    @Req() req,
  ): Promise<PostOutput> {
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
  ): Promise<Paginator<CommentOutput>> {
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
  async updatePost(
    @Param('postId') postId: string,
    @Body() dto: PostPutType,
  ): Promise<void> {
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
  async deletePost(@Param('postId') postId: string): Promise<void> {
    const foundPost = await this.commandBus.execute(
      new PostsDeletePostCommand(postId),
    );

    if (!foundPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}
