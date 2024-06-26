import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthORMRepository } from '../../features/auth/infrastructure/orm/auth-orm-repository';
import { HTTP_STATUSES } from '../../settings/http-statuses';
// import { AuthSQLRepository } from '../../features/auth/infrastructure/sql/auth-sql-repository';
// import { AuthRepository } from '../../features/auth/infrastructure/auth-repository';

@Injectable()
export class AuthorizationSecurityMiddleware implements NestMiddleware {
  constructor(
    //protected authRepository: AuthRepository,
    // protected authRepository: AuthSQLRepository,
    protected authRepository: AuthORMRepository,
  ) {}
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
