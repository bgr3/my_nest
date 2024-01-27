import { Injectable } from '@nestjs/common';
import { CommentForPost, CommentModelType } from '../domain/comments-entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsRepository } from '../infrastructure/comments-reppository';
import {
  CommentPostType,
  CommentPutType,
} from '../api/dto/input/comments-input-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query-repository';
import { PostsRepository } from '../../posts/infrastructure/posts-repository';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users-service';
import { LikeStatus } from '../../../infrastructure/dto/input/input-dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(CommentForPost.name) private CommentModel: CommentModelType,
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected jwtService: JwtService,
    protected usersService: UsersService,
  ) {}

  async testAllData(): Promise<void> {
    return await this.commentsRepository.testAllData();
  }

  async createComment(
    dto: CommentPostType,
    accessToken: string, 
    postId: string,
  ): Promise<string | null> {
    const userId = await this.jwtService.verifyAsync(accessToken);
    const user = await this.usersService.findUserDbByID(userId);

    if (!user) return null;

    const post = await this.postsQueryRepository.findPostByID(postId);

    if (post) {
      const newComment = CommentForPost.createComment(
        dto.content,
        post.id,
        user._id.toString(),
        user.login
      );

      const newCommentModel = new this.CommentModel(newComment);

      await this.commentsRepository.save(newCommentModel);

      return newCommentModel._id.toString();
    }

    return null;
  }

  async updateComment(id: string, dto: CommentPutType): Promise<boolean> {
    const comment = await this.commentsRepository.getCommentById(id);

    if (!comment) return false;

    comment.updateComment(dto.content);

    this.commentsRepository.save(comment);

    return true;
  }

  async likeStatus (commentId: string, accessToken: string, dto: LikeStatus): Promise <boolean> {
    const userId = await this.jwtService.verifyAsync(accessToken);
    const user = await this.usersService.findUserDbByID(userId);

    if (!user) return false;

    const login = user.login;
    const likeStatus = dto.likeStatus;

    const comment = await this.postsRepository.getPostById(commentId);
    
    if (!comment) return false;

    comment.setLikeStatus(userId, login, likeStatus);
    await this.postsRepository.save(comment);

    return true;
}

  async deleteComment(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteComment(id);
  }
}
