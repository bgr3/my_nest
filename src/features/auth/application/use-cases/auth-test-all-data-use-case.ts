import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../infrastructure/auth-repository';

export class AuthTestAllDataCommand {
  constructor() {}
}

@CommandHandler(AuthTestAllDataCommand)
export class AuthTestAllDataUseCase
implements ICommandHandler<AuthTestAllDataCommand>
{
  constructor(protected authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.testAllData();
  }
}
