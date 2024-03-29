import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Tokens } from '../../api/dto/output/auth-output-dto';
import { AuthService } from '../auth-service';
import { v4 as uuidv4 } from 'uuid';
import { AuthSQLRepository } from '../../infrastructure/auth-sql-repository';
import { AuthSQL } from '../../domain/auth-sql-entity';
//import { InjectModel } from '@nestjs/mongoose';
//import { AuthRepository } from '../../infrastructure/auth-repository';
// import { Auth, AuthModelType } from '../../domain/auth-entity';

export class AuthCreateAuthSessionCommand {
  constructor(
    public userId: string,
    public deviceIP: string,
    public deviceName: string,
  ) {}
}

@CommandHandler(AuthCreateAuthSessionCommand)
export class AuthCreateAuthSessionUseCase
  implements ICommandHandler<AuthCreateAuthSessionCommand>
{
  constructor(
    //@InjectModel(Auth.name) private AuthModel: AuthModelType,
    //protected authRepository: AuthRepository,
    protected authRepository: AuthSQLRepository,
    protected authService: AuthService,
  ) {}

  async execute(command: AuthCreateAuthSessionCommand): Promise<Tokens> {
    const deviceId = uuidv4();

    const tokens = await this.authService.generateTokens(
      command.userId,
      deviceId,
    );

    const authSession = AuthSQL /*Auth*/.createAuth(
      command.userId,
      command.deviceIP,
      deviceId,
      command.deviceName,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.issuedAt,
      tokens.expireAt,
    );

    //const newAuthModel = new this.AuthModel(authSession);

    await this.authRepository.save(authSession /*newAuthModel*/);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
