import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { UserORM } from '../../users/domain/users-orm-entity';
import { PostORM } from './posts-orm-entity';

@Entity()
export class PostLikesInfoORM {
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

  @ManyToOne(() => PostORM, (post) => post.likesInfo, { onDelete: 'CASCADE' })
  post: PostORM;
  @Column({ type: 'uuid' })
  postId: string;
}
