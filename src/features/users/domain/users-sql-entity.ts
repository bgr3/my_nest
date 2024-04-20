import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';

import { MeType } from '../../auth/api/dto/output/auth-output-dto';
import { UserRawDb } from '../infrastructure/dto/users-repository-dto';

class EmailConfirmation {
  confirmationCode: string;
  expirationDate: object;
  isConfirmed: boolean;
  nextSend: object;
}

export class UserSQL {
  id: string = '';
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
  newUser: boolean = false;

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

  static createSmartUser(userDb: UserRawDb): UserSQL {
    const user = new this();

    user.id = userDb.Id.toString();
    user.login = userDb.Login;
    user.email = userDb.Email;
    user.password = userDb.Password;
    user.createdAt = userDb.CreatedAt;
    user.emailConfirmation = new EmailConfirmation();
    user.emailConfirmation.confirmationCode = userDb.ConfirmationCode;
    user.emailConfirmation.expirationDate = userDb.ExpirationDate;
    user.emailConfirmation.isConfirmed = userDb.IsConfirmed;
    user.emailConfirmation.nextSend = userDb.NextSend;

    return user;
  }

  static createUser(
    login: string,
    email: string,
    passwordHash: string,
    isSuperAdmin: boolean = false,
  ): UserSQL {
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
    user.newUser = true;

    return user;
  }
}
