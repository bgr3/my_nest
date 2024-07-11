import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { PostORM } from '../../posts/domain/posts-orm-entity';
import { UserORM } from '../../users/domain/entities/users-orm-entity';
import { CommentLikesInfoORM } from './comments-likes-info-orm-entity';

@Entity()
export class CommentForPostORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => UserORM, (user) => user.comment, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  commentatorInfo: UserORM;
  @Column()
  commentatorInfoId: string;

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

  @ManyToOne(() => PostORM, (post) => post.comments, {
    // eager: true,
    // cascade: true,
    onDelete: 'CASCADE',
  })
  post: PostORM;
  @Column()
  postId: string;

  updateComment(content: string): void {
    this.content = content;
  }

  setLikeStatus(user: UserORM, likeStatus: LikeStatusType): void {
    const like = this.likesInfo.find((i) => i.owner.id === user.id);

    if (like) {
      like.likeStatus = likeStatus;
    } else {
      const likesInfo = new CommentLikesInfoORM();
      likesInfo.addedAt = new Date().toISOString();
      likesInfo.likeStatus = likeStatus;
      likesInfo.owner = user;
      this.likesInfo.push(likesInfo);
    }
  }

  static createComment(
    content: string,
    post: PostORM,
    user: UserORM,
  ): CommentForPostORM {
    const comment = new this();

    comment.content = content;
    comment.commentatorInfo = user;
    comment.createdAt = new Date().toISOString();
    comment.post = post;

    return comment;
  }
}
