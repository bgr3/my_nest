import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthSQLRepository } from '../../infrastructure/auth-sql-repository';
// import { AuthRepository } from '../../infrastructure/auth-repository';

export class AuthTestAllDataCommand {
  constructor() {}
}

@CommandHandler(AuthTestAllDataCommand)
export class AuthTestAllDataUseCase
  implements ICommandHandler<AuthTestAllDataCommand>
{
  constructor(
    //protected authRepository: AuthRepository,
    protected authRepository: AuthSQLRepository,
  ) {}

  async execute(): Promise<void> {
    return this.authRepository.testAllData();
  }
}
