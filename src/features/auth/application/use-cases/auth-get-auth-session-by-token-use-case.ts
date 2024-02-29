import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../infrastructure/auth-repository';
import { AuthQueryRepository } from '../../infrastructure/auth-query-repository';
import { AuthTypeOutput } from '../../api/dto/output/auth-output-dto';

export class AuthGetAuthSessionsByTokenCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(AuthGetAuthSessionsByTokenCommand)
export class AuthGetAuthSessionsByTokenUseCase
implements ICommandHandler<AuthGetAuthSessionsByTokenCommand>
{
  constructor(
    protected authRepository: AuthRepository,
    protected authQueryRepository: AuthQueryRepository,
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
