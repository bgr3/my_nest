import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MeType } from '../../api/dto/output/auth-output-dto';
import { UsersORMRepository } from '../../../users/infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../../users/infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../../users/infrastructure/users-repository';

export class AuthGetMeByIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(AuthGetMeByIdCommand)
export class AuthGetMeByIdUseCase
  implements ICommandHandler<AuthGetMeByIdCommand>
{
  constructor(
    //protected usersRepository: UsersRepository
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
  ) {}

  async execute(command: AuthGetMeByIdCommand): Promise<MeType | null> {
    //const userId = await this.jwtService.verifyAsync(accessToken);

    const user = await this.usersRepository.findUserDbByID(command.userId);

    if (!user) return null;

    const me = user.getMe(command.userId);

    return me;
  }
}
