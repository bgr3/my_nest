import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { PostORM } from './posts-orm-entity';

@Entity()
export class PostLikesInfoORM {
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

  @ManyToOne(() => PostORM, (post) => post.likesInfo, { onDelete: 'CASCADE' })
  post: PostORM;
  @Column({ type: 'uuid' })
  postId: string;
}
