import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import bcrypt from 'bcrypt';

import { UserPost } from '../../api/dto/input/users-input-dto';
import { UserORM } from '../../domain/users-orm-entity';
import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
import { UsersService } from '../users-service';

export class UsersCreateUserCommand {
  constructor(
    public dto: UserPost,
    public isSuperAdmin: boolean = false,
  ) {}
}

@CommandHandler(UsersCreateUserCommand)
export class UsersCreateUserUseCase
  implements ICommandHandler<UsersCreateUserCommand>
{
  constructor(
    protected usersRepository: UsersORMRepository,
    protected usersService: UsersService,
  ) {}

  async execute(command: UsersCreateUserCommand): Promise<string | null> {
    const passwordSalt = await bcrypt.genSalt(10);

    const passwordHash = await this.usersService.generateHash(
      command.dto.password,
      passwordSalt,
    );

    const newUser = UserORM.createUser(
      command.dto.login,
      command.dto.email,
      passwordHash,
      command.isSuperAdmin,
    );

    const result = await this.usersRepository.save(newUser);

    return result;
  }
}
