import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { UserORM } from './users-orm-entity';

@Entity()
export class UserBanORM {
  @Column({ type: 'boolean' })
  isBanned: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  banDate: Date | null;

  @Column({ type: 'varchar', nullable: true })
  banReason: string | null;

  @OneToOne(() => UserORM, (userORM) => userORM.banInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserORM;
  @PrimaryColumn('uuid')
  userId: string;

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

  static createBan(): UserBanORM {
    const ban = new this();

    ban.isBanned = false;

    return ban;
  }
}
