import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Tokens } from '../../api/dto/output/auth-output-dto';
import { AuthService } from '../auth-service';
import { UsersSQLRepository } from '../../../users/infrastructure/users-sql-repository';
import { AuthSQLRepository } from '../../infrastructure/auth-sql-repository';
// import { AuthRepository } from '../../infrastructure/auth-repository';
//import { UsersRepository } from '../../../users/infrastructure/users-repository';

export class AuthUpdateTokensCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(AuthUpdateTokensCommand)
export class AuthUpdateTokensUseCase
  implements ICommandHandler<AuthUpdateTokensCommand>
{
  constructor(
    //protected authRepository: AuthRepository,
    protected authRepository: AuthSQLRepository,
    protected authService: AuthService,
    //protected usersRepository: UsersRepository,
    protected usersRepository: UsersSQLRepository,
  ) {}

  async execute(command: AuthUpdateTokensCommand): Promise<Tokens | null> {
    const session = await this.authRepository.findAuthSessionByDeviceId(
      command.deviceId,
    );

    if (!session) return null;

    const user = await this.usersRepository.findUserDbByID(session.userId);

    if (!user) return null;

    const tokens = await this.authService.generateTokens(
      user.id /*_id*/
        .toString(),
      session.deviceId,
    );

    await session.updateAuthSession(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.issuedAt,
      tokens.expireAt,
    );

    await this.authRepository.save(session);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
