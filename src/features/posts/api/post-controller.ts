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
import { PostsService } from '../application/post-service';
import { PostsQueryRepository } from '../infrastructure/posts-query-repository';
import { PostLikeStatus, PostPostType, PostPutType } from './dto/input/post-input-dto';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { CommentPostType } from '../../comments/api/dto/input/comments-input-dto';
import { CommentsService } from '../../comments/application/comment-service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments-query-repository';
import { postCheckQuery } from '../application/post-check-query';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async likeStatus(@Body() dto: PostLikeStatus, @Req() req: Request, @Param('id') id: string) {
    const token = req.headers.authorization!;
    const result = await this.postsService.likeStatus(id, token, dto);

    if (!result) throw new NotFoundException();

    return ;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() dto: PostPostType) {
    const result = await this.postsService.createPost(dto);

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
    @Req() req: Request,
  ) {
    const accessToken = req.headers.authorization!
    const result = await this.commentsService.createComment(
      dto,
      accessToken, 
      postId,
    );
    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newPost = await this.commentsQueryRepository.findCommentByID(result);

    return newPost;
  }

  @Get()
  async getPosts(@Query() query, @Req() req: Request) {
    const queryFilter = postCheckQuery(query);

    const accessToken = req.headers.authorization ? req.headers.authorization : '';

    const userId = await this.jwtService.verifyAsync(accessToken);

    return await this.postsQueryRepository.findPosts(null, queryFilter, userId);
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: string, @Req() req: Request) {
  
    const accessToken = req.headers.authorization ? req.headers.authorization : '';

    const userId = await await this.jwtService.verifyAsync(accessToken);


    const foundPost = await this.postsQueryRepository.findPostByID(
      postId,
      userId,
    );
    console.log(foundPost);

    if (!foundPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return foundPost;
  }

  @Get(':postId/comments')
  async getCommentsForPost(@Param('postId') postId: string, @Query() query, @Req() req: Request) {
    const queryFilter = postCheckQuery(query);
    const post = await this.postsQueryRepository.findPostByID(postId);

    const accessToken = req.headers.authorization ? req.headers.authorization : '';

    const userId = await this.jwtService.verifyAsync(accessToken);

    const foundcomments = await this.commentsQueryRepository.findComments(
      postId,
      queryFilter,
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
    const updatedPost = await this.postsService.updatePost(postId, dto);

    if (!updatedPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':postId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deletePost(@Param('postId') postId: string) {
    const foundPost = await this.postsService.deletePost(postId);

    if (!foundPost)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}