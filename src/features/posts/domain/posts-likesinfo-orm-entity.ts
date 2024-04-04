import { Entity, Column, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { PostORM } from './posts-orm-entity';

@Entity()
export class PostLikesInfoORM {
  @Column()
  userId: string;

  @Column()
  login: string;

  @Column()
  addedAt: string;

  @Column()
  likeStatus: LikeStatusType;

  @ManyToOne(() => PostORM, (post) => post.likesInfo, { onDelete: 'CASCADE' })
  post: PostORM;
  @PrimaryColumn({ type: 'uuid' })
  postId: string;
}
