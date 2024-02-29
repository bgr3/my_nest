import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users-repository';

export class AuthConfirmEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(AuthConfirmEmailCommand)
export class AuthConfirmEmailUseCase
implements ICommandHandler<AuthConfirmEmailCommand>
{
  constructor(protected usersRepository: UsersRepository) {}

  async execute(command: AuthConfirmEmailCommand): Promise<boolean> {
    const user = await this.usersRepository.findUserByConfirmationCode(
      command.code,
    );

    if (!user) return false;

    const result = await user.updateConfirmation();

    if (!result) return false;

    await this.usersRepository.save(user);

    return true;
  }
}
