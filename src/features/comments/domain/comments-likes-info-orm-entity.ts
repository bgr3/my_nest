import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { CommentForPostORM } from './comments-orm-entity';

@Entity()
export class CommentLikesInfoORM {
  @Column()
  userId: string;

  @Column()
  login: string;

  @Column()
  addedAt: string;

  @Column()
  likeStatus: LikeStatusType;

  @ManyToOne(() => CommentForPostORM, (comment) => comment.likesInfo, {
    onDelete: 'CASCADE',
  })
  comment: CommentForPostORM;
  @PrimaryColumn({ type: 'uuid' })
  commentId: string;
}
