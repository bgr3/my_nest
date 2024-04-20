import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';

export class UsersTestAllDataCommand {}

@CommandHandler(UsersTestAllDataCommand)
export class UsersTestAllDataUseCase
  implements ICommandHandler<UsersTestAllDataCommand>
{
  constructor(
    //protected usersRepository: UsersSRepository
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
  ) {}

  async execute(): Promise<void> {
    return await this.usersRepository.testAllData();
  }
}
