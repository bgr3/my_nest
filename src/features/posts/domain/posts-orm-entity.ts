import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { BlogORM } from '../../blogs/domain/blogs-orm-entity';
import { UserORM } from '../../users/domain/users-orm-entity';
import { PostLikesInfoORM } from './posts-likesinfo-orm-entity';

@Entity()
export class PostORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @ManyToOne(() => BlogORM, (blog) => blog.post, {
    onDelete: 'CASCADE',
  })
  // @JoinColumn()
  blog: BlogORM;
  @Column({ type: 'uuid' })
  blogId: string;

  // @Column()
  // blogName: string;

  @Column()
  createdAt: string;

  @OneToMany(
    () => PostLikesInfoORM,
    (postLikesInfoORM) => postLikesInfoORM.post,
    {
      eager: true,
      cascade: true,
    },
  )
  likesInfo: PostLikesInfoORM[];

  updatePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    // blogName: string,
  ): void {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    // this.blogName = blogName;
    return;
  }

  setLikeStatus(user: UserORM, likeStatus: LikeStatusType): void {
    const like = this.likesInfo.find((i) => i.owner.id === user.id);

    if (like) {
      like.likeStatus = likeStatus;
    } else {
      const likesInfo = new PostLikesInfoORM();
      likesInfo.addedAt = new Date().toISOString();
      likesInfo.likeStatus = likeStatus;
      likesInfo.owner = user;
      this.likesInfo.push(likesInfo);
    }

    return;
  }

  static createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    // blogName: string,
  ): PostORM {
    const post = new this();

    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    // post.blogName = blogName;
    post.createdAt = new Date().toISOString();

    return post;
  }
}
