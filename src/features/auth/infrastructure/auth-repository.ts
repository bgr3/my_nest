import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Auth, AuthDocument } from '../domain/auth-entity';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private AuthModel: Model<AuthDocument>) {}

  async testAllData(): Promise<void> {
    const result = await this.AuthModel.deleteMany({});
    //console.log('users delete: ', result.deletedCount)
  }

  async save(auth: AuthDocument): Promise<void> {
    await auth.save();
  }

  // async createAuthSession (auth: AuthType): Promise<string | null> {
  //     const result = await this.AuthModel.insertMany([auth]);
  //     //console.log(result.insertedId)
  //     if (result[0]._id) {
  //         return result[0]._id.toString()
  //     } else {
  //         return null
  //     }
  // }

  // async updateAuthSession (deviceId: string, putAuth: AuthPutType): Promise<boolean> {
  //     const result = await this.AuthModel.updateOne({deviceId: deviceId}, { $set: putAuth})

  //     if (result.matchedCount) {
  //         return true
  //     }

  //     return false
  // }

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
      'tokens.accessToken': accessToken,
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
