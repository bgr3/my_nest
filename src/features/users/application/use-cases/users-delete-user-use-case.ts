import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class UsersDeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(UsersDeleteUserCommand)
export class UsersDeleteUserUseCase
  implements ICommandHandler<UsersDeleteUserCommand>
{
  constructor(
    //protected usersRepository: UsersRepository
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
  ) {}

  async execute(command: UsersDeleteUserCommand): Promise<boolean> {
    return this.usersRepository.deleteUser(command.id);
  }
}
