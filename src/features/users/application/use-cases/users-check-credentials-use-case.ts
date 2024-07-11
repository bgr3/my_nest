import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserORM } from '../../domain/entities/users-orm-entity';
import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
import { UsersService } from '../users-service';
// import { UserSQL } from '../../domain/users-sql-entity';
// import { UserDocument } from '../../domain/users-entity';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
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
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
    protected usersService: UsersService,
  ) {}

  async execute(
    command: UsersCheckCredentialsCommand,
  ): Promise<UserORM /*UserSQL*/ /*UserDocument*/ | null> {
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
