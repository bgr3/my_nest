import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
//import { UsersRepository } from '../../infrastructure/users-repository';
import { UsersSQLRepository } from '../../infrastructure/users-sql-repository';

export class UsersTestAllDataCommand {}

@CommandHandler(UsersTestAllDataCommand)
export class UsersTestAllDataUseCase
  implements ICommandHandler<UsersTestAllDataCommand>
{
  constructor(
    //protected usersRepository: UsersSRepository
    protected usersRepository: UsersSQLRepository,
  ) {}

  async execute(): Promise<void> {
    return this.usersRepository.testAllData();
  }
}
