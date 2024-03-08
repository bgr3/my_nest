import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersSQLRepository } from '../../infrastructure/users-sql-repository';
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
    protected usersRepository: UsersSQLRepository,
  ) {}

  async execute(command: UsersDeleteUserCommand): Promise<boolean> {
    return this.usersRepository.deleteUser(command.id);
  }
}
