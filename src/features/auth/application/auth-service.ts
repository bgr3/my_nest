import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { add } from 'date-fns/add';

@Injectable()
export class AuthService {
  constructor(protected jwtService: JwtService) {}

  async generateTokens(userId: string, deviceId: string) {
    const expirationTimeSeconds = 20;
    const issuedAt = new Date();
    const expireAt = add(new Date(), {
      seconds: expirationTimeSeconds,
    });

    const accessTokenPayload = { userId: userId };
    const refreshTokenPayload = { deviceId: deviceId };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: 10,
    });

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: expirationTimeSeconds,
    });
    this.jwtService.decode;

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      issuedAt: issuedAt,
      expireAt: expireAt,
    };
  }
}
