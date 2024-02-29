import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users-repository';
import { UserPost } from '../../api/dto/input/users-input-dto';
import { UsersService } from '../users-service';
import bcrypt from 'bcrypt';
import { User, UserModelType } from '../../domain/users-entity';
import { InjectModel } from '@nestjs/mongoose';

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
    @InjectModel(User.name) private UserModel: UserModelType,
    protected usersRepository: UsersRepository,
    protected usersService: UsersService,
  ) {}

  async execute(command: UsersCreateUserCommand): Promise<string | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.usersService.generateHash(
      command.dto.password,
      passwordSalt,
    );

    const newUser = User.createUser(
      command.dto.login,
      command.dto.email,
      passwordHash,
      command.isSuperAdmin,
    );

    const newUserModel = new this.UserModel(newUser);

    await this.usersRepository.save(newUserModel);

    return newUserModel._id.toString();
  }
}
