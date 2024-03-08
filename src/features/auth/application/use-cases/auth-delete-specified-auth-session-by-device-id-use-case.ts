import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthSQLRepository } from '../../infrastructure/auth-sql-repository';
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
    protected authRepository: AuthSQLRepository,
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
