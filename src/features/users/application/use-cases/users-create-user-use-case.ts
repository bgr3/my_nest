import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import bcrypt from 'bcrypt';

import { UserPost } from '../../api/dto/input/users-input-dto';
import { UserORM } from '../../domain/entities/users-orm-entity';
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
    protected eventBus: EventBus,
    protected publisher: EventPublisher,
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

    //способ 1 {
    this.publisher.mergeObjectContext(newUser);

    newUser.commit();

    //}

    //способ 2 {

    newUser.getUncommittedEvents().forEach((i) => {
      this.eventBus.publish(i);
    });

    //}

    return result;
  }
}
