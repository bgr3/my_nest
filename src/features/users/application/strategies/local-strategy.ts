import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserORM } from '../../domain/entities/users-orm-entity';
import { UsersCheckCredentialsCommand } from '../use-cases/users-check-credentials-use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user: UserORM | null = await this.commandBus.execute(
      new UsersCheckCredentialsCommand(loginOrEmail, password),
    );

    if (!user) throw new UnauthorizedException();
    if (user.banInfo.isBanned) throw new UnauthorizedException();

    return user;
  }
}
