import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PostORM } from '../../posts/domain/posts-orm-entity';
import { UserBlogBanORM } from '../../users/domain/entities/users-blog-ban-orm-entity';
import { UserORM } from '../../users/domain/entities/users-orm-entity';
import { BlogPostType, BlogPutType } from '../api/dto/input/blogs-input-dto';
import { BlogBanORM } from './blogs-ban-orm-entity';

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

  @OneToOne(() => BlogBanORM, (blogBanORM) => blogBanORM.blog, {
    eager: true,
    cascade: true,
  })
  banInfo: BlogBanORM;

  @OneToMany(() => UserBlogBanORM, (blogBan) => blogBan.blog)
  blogBan: UserBlogBanORM[];

  updateBlog(inputModel: BlogPutType): void {
    this.name = inputModel.name;
    this.description = inputModel.description;
    this.websiteUrl = inputModel.websiteUrl;
  }

  bindBloger(user: UserORM): void {
    this.blogOwnerInfo = user;
  }

  banUnban(isBanned: boolean): void {
    this.banInfo.updateBan(isBanned);
  }

  static createBlog(inputModel: BlogPostType, user: UserORM): BlogORM {
    const blog = new this();

    blog.name = inputModel.name;
    blog.description = inputModel.description;
    blog.websiteUrl = inputModel.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;
    blog.blogOwnerInfo = user;
    blog.banInfo = BlogBanORM.createBan();

    return blog;
  }
}
