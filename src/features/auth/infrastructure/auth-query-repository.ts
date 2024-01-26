import { Injectable } from '@nestjs/common';
import { AuthDocument } from '../domain/auth-entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/domain/users-entity';
import { AuthTypeOutput } from '../api/dto/output/auth-output-dto';

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectModel(User.name) private AuthModel: Model<AuthDocument>) {}

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
