import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { EmailManager } from '../../../email-manager/application/email-manager';
import { UsersORMRepository } from '../../../users/infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../../users/infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../../users/infrastructure/users-repository';

export class AuthResendEmailCommand {
  constructor(public email: string) {}
}

@CommandHandler(AuthResendEmailCommand)
export class AuthResendEmailUseCase
  implements ICommandHandler<AuthResendEmailCommand>
{
  constructor(
    // protected usersRepository: UsersRepository,
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: AuthResendEmailCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.email,
    );

    if (!user) return false;

    const code = uuidv4();

    await user.resendConfirmationCode(code);
    await this.usersRepository.save(user);
    await this.emailManager.sendRegistrationEmail(code, user.email);

    return true;
  }
}
