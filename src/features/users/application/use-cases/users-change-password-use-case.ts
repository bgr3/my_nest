import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';
import { UsersService } from '../users-service';
import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../../infrastructure/users-repository';

export class UsersChangePasswordCommand {
  constructor(
    public code: string,
    public password: string,
  ) {}
}

@CommandHandler(UsersChangePasswordCommand)
export class UsersChangePasswordUseCase
  implements ICommandHandler<UsersChangePasswordCommand>
{
  constructor(
    //protected usersRepository: UsersRepository,
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
    protected usersService: UsersService,
  ) {}

  async execute(command: UsersChangePasswordCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserByConfirmationCode(
      command.code,
    );
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.usersService.generateHash(
      command.password,
      passwordSalt,
    );

    if (user) {
      user.updatePassword(passwordHash);
      await this.usersRepository.save(user);
    }

    return true;
  }
}
