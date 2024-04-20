import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AuthORMRepository } from '../../infrastructure/orm/auth-orm-repository';
// import { AuthSQLRepository } from '../../infrastructure/sql/auth-sql-repository';
// import { AuthRepository } from '../../infrastructure/auth-repository';

export class AuthDeleteSpecifiedAuthSessionByDeviceIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(AuthDeleteSpecifiedAuthSessionByDeviceIdCommand)
export class AuthDeleteSpecifiedAuthSessionByDeviceIdUseCase
  implements ICommandHandler<AuthDeleteSpecifiedAuthSessionByDeviceIdCommand>
{
  constructor(
    //protected authRepository: AuthRepository,
    // protected authRepository: AuthSQLRepository,
    protected authRepository: AuthORMRepository,
  ) {}

  async execute(
    command: AuthDeleteSpecifiedAuthSessionByDeviceIdCommand,
  ): Promise<boolean> {
    const result = await this.authRepository.deleteAuthSessionByDeviceId(
      command.deviceId,
    );

    if (!result) return false;

    return true;
  }
}
