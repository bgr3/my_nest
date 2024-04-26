import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns/add';

@Injectable()
export class AuthService {
  constructor(protected jwtService: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async generateTokens(userId: string, deviceId: string) {
    const accessTokenExpirationTimeSeconds = 10000;
    const refreshTokenExpirationTimeSeconds = 20000;
    const issuedAt = new Date();
    const expireAt = add(new Date(), {
      seconds: refreshTokenExpirationTimeSeconds,
    });

    const accessTokenPayload = { userId: userId };
    const refreshTokenPayload = { deviceId: deviceId };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: accessTokenExpirationTimeSeconds,
    });

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: refreshTokenExpirationTimeSeconds,
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
