import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users-repository';
import { add } from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';

export class UsersUpdateCodeForRecoveryPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(UsersUpdateCodeForRecoveryPasswordCommand)
export class UsersUpdateCodeForRecoveryPasswordUseCase
implements ICommandHandler<UsersUpdateCodeForRecoveryPasswordCommand>
{
  constructor(protected usersRepository: UsersRepository) {}

  async execute(
    command: UsersUpdateCodeForRecoveryPasswordCommand,
  ): Promise<string | null> {
    const code = uuidv4();
    const expirationDate = add(new Date(), {
      minutes: 5,
    });
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.email,
    );

    if (user) {
      user.updateCodeForRecoveryPassword(code, expirationDate);
      await this.usersRepository.save(user);
      return user._id.toString();
    }

    return null;
  }
}
