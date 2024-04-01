import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserPost } from '../../api/dto/input/users-input-dto';
import { UsersService } from '../users-service';
import bcrypt from 'bcrypt';
import { UsersORMRepository } from '../../infrastructure/orm/users-orm-repository';
import { UserORM } from '../../domain/users-orm-entity';
// import { UserSQL } from '../../domain/users-sql-entity';
// import { UsersSQLRepository } from '../../infrastructure/sql/users-sql-repository';
// import { InjectModel } from '@nestjs/mongoose';
// import { User, UserModelType } from '../../domain/users-entity';
// import { UsersRepository } from '../../infrastructure/users-repository';

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
    //@InjectModel(User.name) private UserModel: UserModelType,
    // protected usersRepository: UsersRepository,
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
    protected usersService: UsersService,
  ) {}

  async execute(command: UsersCreateUserCommand): Promise<string | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.usersService.generateHash(
      command.dto.password,
      passwordSalt,
    );

    const newUser = UserORM /*UserSQL*/ /*User*/.createUser(
      command.dto.login,
      command.dto.email,
      passwordHash,
      command.isSuperAdmin,
    );

    //const newUserModel = new this.UserModel(newUser);

    const result = await this.usersRepository.save(newUser /*newUserModel*/);

    return result /*newUserModel._id.toString()*/;
  }
}
