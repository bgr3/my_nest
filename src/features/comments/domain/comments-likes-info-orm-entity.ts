import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { UserORM } from '../../users/domain/users-orm-entity';
import { CommentForPostORM } from './comments-orm-entity';

@Entity()
export class CommentLikesInfoORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserORM, (user) => user.commentLikes, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  owner: UserORM;
  @Column()
  ownerId: string;

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
