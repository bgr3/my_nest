import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersService } from '../../features/users/application/users-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    console.log(this.userService.findUserDbByID);

    console.log(request.headers.authorization);

    return false;
  }
}
