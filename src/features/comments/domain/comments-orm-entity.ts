import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentatorInfo } from './comments-commentator-info-entity';
import { CommentLikesInfoORM } from './comments-likes-info-orm-entity';
import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';

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
      // onDelete: 'CASCADE',
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

  updateComment(content: string) {
    this.content = content;
  }

  setLikeStatus(userId: string, login: string, likeStatus: LikeStatusType) {
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
  ) {
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