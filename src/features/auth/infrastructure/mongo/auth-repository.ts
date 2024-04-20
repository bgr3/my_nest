import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Auth, AuthDocument } from '../../domain/auth-entity';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private AuthModel: Model<AuthDocument>) {}

  async testAllData(): Promise<void> {
    await this.AuthModel.deleteMany({});
    //console.log('users delete: ', result.deletedCount)
  }

  async save(auth: AuthDocument): Promise<void> {
    await auth.save();
  }

  async findAuthSessionByDeviceId(
    deviceId: string,
  ): Promise<AuthDocument | null> {
    const session = await this.AuthModel.findOne({ deviceId: deviceId });
    return session;
  }

  async findAuthSessionByAccessToken(
    accessToken: string,
  ): Promise<AuthDocument | null> {
    const session = await this.AuthModel.findOne({
      'JWTTokens.accessToken': accessToken,
    });
    return session;
  }

  async findAuthSessionByRefreshToken(
    refreshToken: string,
  ): Promise<AuthDocument | null> {
    const session = await this.AuthModel.findOne({
      'JWTTokens.refreshToken': refreshToken,
    });
    return session;
  }

  async deleteAuthSessionsByUserId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await this.AuthModel.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    });

    if (!result) return false;

    return true;
  }

  async deleteAuthSessionByDeviceId(deviceId: string): Promise<boolean> {
    const result = await this.AuthModel.deleteOne({ deviceId: deviceId });

    if (!result.deletedCount) return false;

    return true;
  }
}
