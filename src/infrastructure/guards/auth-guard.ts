import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { AuthORMRepository } from '../../features/auth/infrastructure/orm/auth-orm-repository';
// import { AuthSQLRepository } from '../../features/auth/infrastructure/sql/auth-sql-repository';
// import { AuthRepository } from '../../features/auth/infrastructure/auth-repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    //protected authRepository: AuthRepository,
    // protected authRepository: AuthSQLRepository,
    protected authRepository: AuthORMRepository,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log(token);

    if (!token) throw new UnauthorizedException();

    return true;
  }
}
