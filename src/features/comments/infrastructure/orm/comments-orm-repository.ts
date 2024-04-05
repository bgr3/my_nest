import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentForPostORM } from '../../domain/comments-orm-entity';

@Injectable()
export class CommentsORMRepository {
  constructor(
    @InjectRepository(CommentForPostORM)
    private readonly commentsRepository: Repository<CommentForPostORM>,
  ) {}

  async testAllData(): Promise<void> {
    this.commentsRepository.delete({});
  }

  async save(comment: CommentForPostORM): Promise<string | null> {
    const commentResult = await this.commentsRepository.save(comment);

    return commentResult.id;
  }

  async getCommentById(id: string): Promise<CommentForPostORM | null> {
    let comment;

    try {
      comment = await this.commentsRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    let result;

    try {
      result = await this.commentsRepository.delete(id);
    } catch (err) {
      console.log(err);

      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }
}
