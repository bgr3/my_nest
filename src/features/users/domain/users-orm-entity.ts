import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { MeType } from '../../auth/api/dto/output/auth-output-dto';
import { EmailConfirmation } from './email-confirmation-orm-entity';

@Entity()
export class UserORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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

  updateCodeForRecoveryPassword(code: string, expirationDate: object) {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = expirationDate;
  }

  updatePassword(password: string) {
    this.password = password;
  }

  updateConfirmation() {
    if (this.emailConfirmation.isConfirmed) return false;

    this.emailConfirmation.isConfirmed = true;

    return true;
  }

  resendConfirmationCode(code: string) {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = add(new Date(), { minutes: 5 });
    this.emailConfirmation.nextSend = add(new Date(), { seconds: 0 });
  }

  getMe(id: string) {
    const me = new MeType(this.email, this.login, id.toString());

    return me;
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

    return user;
  }
}
