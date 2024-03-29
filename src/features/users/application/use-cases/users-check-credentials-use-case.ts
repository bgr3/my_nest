import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../users-service';
import { UserDocument } from '../../domain/users-entity';
import { UsersSQLRepository } from '../../infrastructure/users-sql-repository';
import { UserSQL } from '../../domain/users-sql-entity';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class UsersCheckCredentialsCommand {
  constructor(
    public loginOrEmail: string,
    public password: string,
  ) {}
}

@CommandHandler(UsersCheckCredentialsCommand)
export class UsersCheckCredentialsUseCase
  implements ICommandHandler<UsersCheckCredentialsCommand>
{
  constructor(
    //protected usersRepository: UsersRepository,
    protected usersRepository: UsersSQLRepository,
    protected usersService: UsersService,
  ) {}

  async execute(
    command: UsersCheckCredentialsCommand,
  ): Promise<UserSQL /*UserDocument*/ | null> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.loginOrEmail,
    );

    if (!user) return null;

    const passwordSalt = await this.usersService.getSalt(user.password);
    const passwordHash = await this.usersService.generateHash(
      command.password,
      passwordSalt,
    );

    if (passwordHash !== user.password) {
      return null;
    }

    return user;
  }
}
