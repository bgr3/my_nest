import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../../email-manager/application/email-manager';
import { UsersORMRepository } from '../../../users/infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../../users/infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../../users/infrastructure/users-repository';

export class AuthChangePasswordEmailCommand {
  constructor(public id: string) {}
}

@CommandHandler(AuthChangePasswordEmailCommand)
export class AuthChangePasswordEmailUseCase
  implements ICommandHandler<AuthChangePasswordEmailCommand>
{
  constructor(
    //protected usersRepository: UsersRepository,
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: AuthChangePasswordEmailCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserDbByID(command.id);

    if (!user) return false;

    console.log(user.emailConfirmation.confirmationCode);

    await this.emailManager.sendRecoveryPasswordEmail(
      user.emailConfirmation.confirmationCode,
      user.email,
    );

    return true;
  }
}
