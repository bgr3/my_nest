import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthTypeOutput } from '../../api/dto/output/auth-output-dto';
import { AuthSQLRepository } from '../../infrastructure/auth-sql-repository';
import { AuthSQLQueryRepository } from '../../infrastructure/auth-sql-query-repository';
//import { AuthQueryRepository } from '../../infrastructure/auth-query-repository';
// import { AuthRepository } from '../../infrastructure/auth-repository';

export class AuthGetAuthSessionsByTokenCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(AuthGetAuthSessionsByTokenCommand)
export class AuthGetAuthSessionsByTokenUseCase
  implements ICommandHandler<AuthGetAuthSessionsByTokenCommand>
{
  constructor(
    //protected authRepository: AuthRepository,
    protected authRepository: AuthSQLRepository,
    //protected authQueryRepository: AuthQueryRepository,
    protected authQueryRepository: AuthSQLQueryRepository,
  ) {}

  async execute(
    command: AuthGetAuthSessionsByTokenCommand,
  ): Promise<AuthTypeOutput[] | null> {
    const userSession = await this.authRepository.findAuthSessionByDeviceId(
      command.deviceId,
    );

    if (!userSession) return null;

    return await this.authQueryRepository.findAuthSessionsByUserId(
      userSession.userId,
    );
  }
}
