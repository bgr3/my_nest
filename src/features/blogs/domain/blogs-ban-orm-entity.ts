import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { BlogORM } from './blogs-orm-entity';

@Entity()
export class BlogBanORM {
  @Column({ type: 'boolean' })
  isBanned: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  banDate: Date | null;

  @OneToOne(() => BlogORM, (blogORM) => blogORM.banInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: BlogORM;
  @PrimaryColumn('uuid')
  blogId: string;

  updateBan(isBanned: boolean): void {
    if (isBanned) {
      this.isBanned = isBanned;
      this.banDate = new Date();
    } else {
      this.isBanned = isBanned;
      this.banDate = null;
    }
  }

  static createBan(): BlogBanORM {
    const ban = new this();

    ban.isBanned = false;

    return ban;
  }
}
