import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserBanDTO } from '../../api/dto/input/users-input-dto';
import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class UsersBanUnbanCommand {
  constructor(
    public userId: string,
    public dto: UserBanDTO,
  ) {}
}

@CommandHandler(UsersBanUnbanCommand)
export class UsersBanUnbanUseCase
  implements ICommandHandler<UsersBanUnbanCommand>
{
  constructor(protected usersRepository: UsersORMRepository) {}

  async execute(command: UsersBanUnbanCommand): Promise<string | null> {
    const user = await this.usersRepository.findUserDbByID(command.userId);

    if (!user) return null;

    user.banUnban(command.dto.isBanned, command.dto.banReason);

    const result = await this.usersRepository.save(user);

    return result;
  }
}
