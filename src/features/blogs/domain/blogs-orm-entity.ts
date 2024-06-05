import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PostORM } from '../../posts/domain/posts-orm-entity';
import { UserORM } from '../../users/domain/users-orm-entity';
import { BlogPostType, BlogPutType } from '../api/dto/input/blogs-input-dto';

@Entity()
export class BlogORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ collation: 'C' })
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: string;

  @Column({ type: 'boolean' })
  isMembership: boolean;

  @OneToMany(() => PostORM, (post) => post.blog)
  post: PostORM;

  @ManyToOne(() => UserORM, (user) => user.blog, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  blogOwnerInfo: UserORM;
  @Column()
  blogOwnerInfoId: string;

  updateBlog(inputModel: BlogPutType): void {
    this.name = inputModel.name;
    this.description = inputModel.description;
    this.websiteUrl = inputModel.websiteUrl;
  }

  bindBloger(user: UserORM): void {
    this.blogOwnerInfo = user;
  }

  static createBlog(inputModel: BlogPostType, user: UserORM): BlogORM {
    const blog = new this();

    blog.name = inputModel.name;
    blog.description = inputModel.description;
    blog.websiteUrl = inputModel.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;
    blog.blogOwnerInfo = user;

    return blog;
  }
}
