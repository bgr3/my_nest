import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { CommentatorInfo } from './comments-commentator-info-orm-entity';
import { CommentLikesInfoORM } from './comments-likes-info-orm-entity';

@Entity()
export class CommentForPostORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @OneToOne(
    () => CommentatorInfo,
    (commentatorInfo) => commentatorInfo.comment,
    {
      eager: true,
      cascade: true,
    },
  )
  commentatorInfo: CommentatorInfo;

  @Column()
  createdAt: string;

  @OneToMany(
    () => CommentLikesInfoORM,
    (commentLikesInfoORM) => commentLikesInfoORM.comment,
    {
      eager: true,
      cascade: true,
    },
  )
  likesInfo: CommentLikesInfoORM[];

  @Column()
  postId: string;

  updateComment(content: string): void {
    this.content = content;
  }

  setLikeStatus(
    userId: string,
    login: string,
    likeStatus: LikeStatusType,
  ): void {
    const like = this.likesInfo.find((i) => i.userId === userId);

    if (like) {
      like.likeStatus = likeStatus;
    } else {
      const likesInfo = new CommentLikesInfoORM();
      likesInfo.addedAt = new Date().toISOString();
      likesInfo.likeStatus = likeStatus;
      likesInfo.login = login;
      likesInfo.userId = userId;
      this.likesInfo.push(likesInfo);
    }
  }

  static createComment(
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
  ): CommentForPostORM {
    const comment = new this();

    comment.content = content;
    comment.commentatorInfo = new CommentatorInfo();
    comment.commentatorInfo.userId = userId;
    comment.commentatorInfo.userLogin = userLogin;
    comment.createdAt = new Date().toISOString();
    comment.postId = postId;

    return comment;
  }
}
