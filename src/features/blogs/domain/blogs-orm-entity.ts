import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogPostType, BlogPutType } from '../api/dto/input/blogs-input-dto';
import { PostORM } from '../../posts/domain/posts-orm-entity';

@Entity()
export class BlogORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: string;

  @Column({ type: 'boolean' })
  isMembership: boolean;

  @OneToOne(() => PostORM, (post) => post.blog)
  post: PostORM;

  updateBlog(inputModel: BlogPutType) {
    this.name = inputModel.name;
    this.description = inputModel.description;
    this.websiteUrl = inputModel.websiteUrl;
  }

  static createBlog(inputModel: BlogPostType): BlogORM {
    const blog = new this();

    blog.name = inputModel.name;
    blog.description = inputModel.description;
    blog.websiteUrl = inputModel.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;

    return blog;
  }
}
