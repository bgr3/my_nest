import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthSQLRepository } from '../../infrastructure/auth-sql-repository';
// import { AuthRepository } from '../../infrastructure/auth-repository';

export class AuthDeleteAuthSessionsExcludeCurentCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(AuthDeleteAuthSessionsExcludeCurentCommand)
export class AuthDeleteAuthSessionsExcludeCurentUseCase
  implements ICommandHandler<AuthDeleteAuthSessionsExcludeCurentCommand>
{
  constructor(
    //protected authRepository: AuthRepository,
    protected authRepository: AuthSQLRepository,
  ) {}

  async execute(
    command: AuthDeleteAuthSessionsExcludeCurentCommand,
  ): Promise<boolean> {
    const userSessions = await this.authRepository.findAuthSessionByDeviceId(
      command.deviceId,
    );

    if (!userSessions) return false;

    const result = await this.authRepository.deleteAuthSessionsByUserId(
      userSessions.userId,
      command.deviceId,
    );

    if (!result) return false;

    return true;
  }
}
