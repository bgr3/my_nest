import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { AuthORMRepository } from '../../../auth/infrastructure/orm/auth-orm-repository';
// import { AuthSQLRepository } from '../../../auth/infrastructure/sql/auth-sql-repository';
// import { AuthRepository } from '../../../auth/infrastructure/auth-repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    //protected authRepository: AuthRepository,
    // protected authRepository: AuthSQLRepository,
    protected authRepository: AuthORMRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userId = payload.userId;
    const deviceId = payload.deviceId;

    const session =
      await this.authRepository.findAuthSessionByDeviceId(deviceId);

    if (deviceId && !session) throw new UnauthorizedException();

    return userId || deviceId;
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies.refreshToken;
    }
    return null;
  }
}
