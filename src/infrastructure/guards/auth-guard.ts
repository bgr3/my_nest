import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthRepository } from '../../features/auth/infrastructure/auth-repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authRepository: AuthRepository) {}

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
