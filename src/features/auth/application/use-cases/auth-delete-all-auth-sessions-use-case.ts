import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AuthORMRepository } from '../../infrastructure/orm/auth-orm-repository';

export class AuthDeleteAllAuthSessionsCommand {
  constructor(public userId: string) {}
}

@CommandHandler(AuthDeleteAllAuthSessionsCommand)
export class AuthDeleteAllAuthSessionsUseCase
  implements ICommandHandler<AuthDeleteAllAuthSessionsCommand>
{
  constructor(protected authRepository: AuthORMRepository) {}

  async execute(command: AuthDeleteAllAuthSessionsCommand): Promise<boolean> {
    const result = await this.authRepository.deleteAllAuthSessionsByUserId(
      command.userId,
    );

    if (!result) return false;

    return true;
  }
}
