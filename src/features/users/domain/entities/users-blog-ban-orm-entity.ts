import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BlogORM } from '../../../blogs/domain/blogs-orm-entity';
import { UserORM } from './users-orm-entity';

@Entity()
export class UserBlogBanORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserORM, (userORM) => userORM.blogBanInfo, {
    onDelete: 'CASCADE',
  })
  user: UserORM;
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => BlogORM, (blog) => blog.blogBan, {
    // eager: true, //получается циклическая зависимость
    cascade: true,
    onDelete: 'CASCADE',
  })
  blog: BlogORM;
  @Column({ type: 'uuid' })
  blogId: string;

  @Column({ type: 'boolean' })
  isBanned: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  banDate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  banReason: string | null;

  updateBan(isBanned: boolean, banReason: string): void {
    if (isBanned) {
      this.isBanned = isBanned;
      this.banReason = banReason;
      this.banDate = new Date();
    } else {
      this.isBanned = isBanned;
      this.banReason = null;
      this.banDate = null;
    }
  }

  static createBan(blog: BlogORM): UserBlogBanORM {
    const ban = new this();

    ban.isBanned = false;
    ban.blog = blog;

    return ban;
  }
}
