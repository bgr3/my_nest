import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { CommentForPostORM } from './comments-orm-entity';

@Entity()
export class CommentatorInfo {
  @Column()
  userId: string;

  @Column()
  userLogin: string;

  @OneToOne(() => CommentForPostORM, (comment) => comment.commentatorInfo, {
    onDelete: 'CASCADE',
  })
  comment: CommentForPostORM;
  @PrimaryColumn({ type: 'uuid' })
  commentId: string;
}