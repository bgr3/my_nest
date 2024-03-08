import { AuthRawDb } from '../infrastructure/dto/auth-repository-dto';

class JWTTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthSQL {
  id: string = '';
  issuedAt: Date;
  expiredAt: Date;
  deviceId: string;
  deviceIP: string;
  deviceName: string;
  userId: string;
  JWTTokens: JWTTokens;
  newAuth: boolean = false;

  updateAuthSession(
    accessToken: string,
    refreshToken: string,
    issuedAt: Date,
    expiredAt: Date,
  ) {
    this.issuedAt = issuedAt;
    this.expiredAt = expiredAt;
    this.JWTTokens.accessToken = accessToken;
    this.JWTTokens.refreshToken = refreshToken;
  }

  static createAuth(
    userId: string,
    deviceIP: string,
    deviceId: string,
    deviceName: string,
    accessToken: string,
    refreshToken: string,
    issuedAt: Date,
    expiredAt: Date,
  ): AuthSQL {
    const auth = new this();

    auth.issuedAt = issuedAt;
    auth.expiredAt = expiredAt;
    auth.deviceId = deviceId;
    auth.deviceIP = deviceIP;
    auth.deviceName = deviceName;
    auth.userId = userId;
    auth.JWTTokens = new JWTTokens();
    auth.JWTTokens.accessToken = accessToken;
    auth.JWTTokens.refreshToken = refreshToken;
    auth.newAuth = true;

    return auth;
  }

  static createSmartAuth(authDb: AuthRawDb): AuthSQL {
    const auth = new this();

    auth.id = authDb.Id.toString();
    auth.issuedAt = authDb.IssuedAt;
    auth.expiredAt = authDb.ExpiredAt;
    auth.deviceId = authDb.DeviceId;
    auth.deviceIP = authDb.DeviceIP;
    auth.deviceName = authDb.DeviceName;
    auth.userId = authDb.UserId;
    auth.JWTTokens = new JWTTokens();
    auth.JWTTokens.accessToken = authDb.AccessToken;
    auth.JWTTokens.refreshToken = authDb.RefreshToken;

    return auth;
  }
}
