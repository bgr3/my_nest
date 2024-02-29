import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUSES } from '../../settings/http-statuses';
import { AuthRepository } from '../../features/auth/infrastructure/auth-repository';

@Injectable()
export class AuthorizationSecurityMiddleware implements NestMiddleware {
  constructor(protected authRepository: AuthRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const deviceId = req.params[0];
    const auth = await this.authRepository.findAuthSessionByDeviceId(deviceId);
    const userId = req.user;

    if (auth && userId) {
      if (auth.userId === userId) {
        next();
        return;
      } else {
        throw new HttpException('', HTTP_STATUSES.FORBIDDEN_403);
      }
    }

    next();
  }
}
