import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthORMRepository } from '../../infrastructure/orm/auth-orm-repository';
// import { AuthSQLRepository } from '../../infrastructure/sql/auth-sql-repository';
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
    // protected authRepository: AuthSQLRepository,
    protected authRepository: AuthORMRepository,
  ) {}

  async execute(): Promise<void> {
    return this.authRepository.testAllData();
  }
}
