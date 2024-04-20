import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthTypeOutput } from '../../api/dto/output/auth-output-dto';
import { Auth, AuthDocument } from '../../domain/auth-entity';

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectModel(Auth.name) private AuthModel: Model<AuthDocument>) {}

  async findAuthSessionsByUserId(
    userId: string,
  ): Promise<AuthTypeOutput[] | null> {
    const session = await this.AuthModel.find({ userId: userId }).lean();
    return session.map((i) => authMapper(i));
  }
}

const authMapper = (session: AuthDocument): AuthTypeOutput => {
  return {
    ip: session.deviceIP,
    title: session.deviceName,
    lastActiveDate: session.issuedAt.toISOString(),
    deviceId: session.deviceId,
  };
};
