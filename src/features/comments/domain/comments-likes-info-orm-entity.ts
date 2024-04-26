import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { CommentForPostORM } from './comments-orm-entity';

@Entity()
export class CommentLikesInfoORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'uuid' })
  commentId: string;
}
