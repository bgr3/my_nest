import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthSQLRepository } from '../../features/auth/infrastructure/auth-sql-repository';
// import { AuthRepository } from '../../features/auth/infrastructure/auth-repository';

@Injectable()
export class UserIdentificationMiddleware implements NestMiddleware {
  constructor(
    private readonly commandBus: CommandBus,
    protected jwtService: JwtService,
    //protected authRepository: AuthRepository,
    protected authRepository: AuthSQLRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(' ');
    const refreshToken = req.cookies.refreshToken;
    let userId = '';

    if (!accessToken && !refreshToken) {
      next();
      return;
    }

    if (accessToken) {
      if (accessToken[0] === 'Bearer') {
        const accessSession =
          await this.authRepository.findAuthSessionByAccessToken(
            accessToken[1],
          );

        if (!accessSession) throw new UnauthorizedException();

        try {
          const userIdVerification = await this.jwtService.verifyAsync(
            accessToken[1],
          );
          userId = userIdVerification.userId;
        } catch (err) {}
      }
    } else if (refreshToken) {
      const accessSession =
        await this.authRepository.findAuthSessionByRefreshToken(refreshToken);

      if (!accessSession) throw new UnauthorizedException();
      accessSession.userId;

      try {
        const userIdVerification =
          await this.jwtService.verifyAsync(refreshToken);
        userIdVerification.deviceId;
        userId = accessSession.userId;
      } catch (err) {}
    }

    req.user = userId;

    next();
  }
}
