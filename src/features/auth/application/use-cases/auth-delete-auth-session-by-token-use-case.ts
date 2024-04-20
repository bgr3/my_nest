import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AuthORMRepository } from '../../infrastructure/orm/auth-orm-repository';
//import { AuthRepository } from '../../infrastructure/auth-repository';
// import { AuthSQLRepository } from '../../infrastructure/sql/auth-sql-repository';

export class AuthDeleteAuthSessionByTokenCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(AuthDeleteAuthSessionByTokenCommand)
export class AuthDeleteAuthSessionByTokenUseCase
  implements ICommandHandler<AuthDeleteAuthSessionByTokenCommand>
{
  constructor(
    //protected authRepository: AuthRepository,
    // protected authRepository: AuthSQLRepository,
    protected authRepository: AuthORMRepository,
  ) {}

  async execute(
    command: AuthDeleteAuthSessionByTokenCommand,
  ): Promise<boolean> {
    const result = await this.authRepository.deleteAuthSessionByDeviceId(
      command.deviceId,
    );

    if (!result) return false;

    return true;
  }
}
