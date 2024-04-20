import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { add } from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';

import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class UsersUpdateCodeForRecoveryPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(UsersUpdateCodeForRecoveryPasswordCommand)
export class UsersUpdateCodeForRecoveryPasswordUseCase
  implements ICommandHandler<UsersUpdateCodeForRecoveryPasswordCommand>
{
  constructor(
    //protected usersRepository: UsersRepository
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
  ) {}

  async execute(
    command: UsersUpdateCodeForRecoveryPasswordCommand,
  ): Promise<string | null> {
    const code = uuidv4();
    const expirationDate = add(new Date(), {
      minutes: 5,
    });
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.email,
    );

    if (user) {
      user.updateCodeForRecoveryPassword(code, expirationDate);
      await this.usersRepository.save(user);
      return user.id /*_id*/
        .toString();
    }

    return null;
  }
}
