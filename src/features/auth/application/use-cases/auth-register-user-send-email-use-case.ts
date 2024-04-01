import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../../email-manager/application/email-manager';
import { UsersORMRepository } from '../../../users/infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../../users/infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../../users/infrastructure/users-repository';

export class AuthRegisterUserSendEmailCommand {
  constructor(public id: string) {}
}

@CommandHandler(AuthRegisterUserSendEmailCommand)
export class AuthRegisterUserSendEmailUseCase
  implements ICommandHandler<AuthRegisterUserSendEmailCommand>
{
  constructor(
    //protected usersRepository: UsersRepository,
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: AuthRegisterUserSendEmailCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserDbByID(command.id);

    if (!user) return false;

    await this.emailManager.sendRegistrationEmail(
      user.emailConfirmation.confirmationCode,
      user.email,
    );

    return true;
  }
}
