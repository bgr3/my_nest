import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MeType } from '../../auth/api/dto/output/auth-output-dto';
import { BlogORM } from '../../blogs/domain/blogs-orm-entity';
import { CommentLikesInfoORM } from '../../comments/domain/comments-likes-info-orm-entity';
import { CommentForPostORM } from '../../comments/domain/comments-orm-entity';
import { PlayerProgressORM } from '../../pair-quiz-game/domain/player-progress-orm-entity';
import { StatisticORM } from '../../pair-quiz-game/domain/statistic-orm-entity';
import { PostLikesInfoORM } from '../../posts/domain/posts-likesinfo-orm-entity';
import { EmailConfirmation } from './email-confirmation-orm-entity';
import { UserBanORM } from './users-ban-orm-entity';

@Entity()
export class UserORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ collation: 'C' })
  login: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  createdAt: string;

  @OneToOne(
    () => EmailConfirmation,
    (emailConfirmation) => emailConfirmation.user,
    {
      eager: true,
      cascade: true,
      // onDelete: 'CASCADE',
    },
  )
  // @JoinColumn()
  emailConfirmation: EmailConfirmation;

  @OneToMany(() => PlayerProgressORM, (playerProgress) => playerProgress.player)
  playerProgressId: PlayerProgressORM;

  @OneToMany(() => BlogORM, (blog) => blog.blogOwnerInfo)
  blog: BlogORM;

  @OneToMany(() => CommentForPostORM, (comment) => comment.commentatorInfo)
  comment: CommentForPostORM;

  @OneToMany(() => CommentLikesInfoORM, (likesInfo) => likesInfo.owner)
  commentLikes: CommentLikesInfoORM;

  @OneToMany(() => PostLikesInfoORM, (likesInfo) => likesInfo.owner)
  postLikes: PostLikesInfoORM;

  @OneToOne(() => StatisticORM, (statistic) => statistic.player)
  statisticId: StatisticORM;

  @OneToOne(() => UserBanORM, (userBanORM) => userBanORM.user, {
    eager: true,
    cascade: true,
  })
  banInfo: UserBanORM;

  updateCodeForRecoveryPassword(code: string, expirationDate: object): void {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = expirationDate;
  }

  updatePassword(password: string): void {
    this.password = password;
  }

  updateConfirmation(): boolean {
    if (this.emailConfirmation.isConfirmed) return false;

    this.emailConfirmation.isConfirmed = true;

    return true;
  }

  resendConfirmationCode(code: string): void {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = add(new Date(), { minutes: 5 });
    this.emailConfirmation.nextSend = add(new Date(), { seconds: 0 });
  }

  getMe(id: string): MeType {
    const me = new MeType(this.email, this.login, id.toString());

    return me;
  }

  banUnban(isBanned: boolean, banReason: string): void {
    this.banInfo.updateBan(isBanned, banReason);
  }

  static createUser(
    login: string,
    email: string,
    passwordHash: string,
    isSuperAdmin: boolean = false,
  ): UserORM {
    const user = new this();

    user.login = login;
    user.email = email;
    user.password = passwordHash;
    user.createdAt = new Date().toISOString();
    user.emailConfirmation = new EmailConfirmation();
    user.emailConfirmation.confirmationCode = randomUUID();
    user.emailConfirmation.expirationDate = add(new Date(), { minutes: 5 });
    user.emailConfirmation.isConfirmed = isSuperAdmin;
    user.emailConfirmation.nextSend = add(new Date(), { seconds: 0 });
    user.banInfo = UserBanORM.createBan();

    return user;
  }
}
