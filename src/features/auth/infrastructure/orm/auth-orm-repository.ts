import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthORM } from '../../domain/auth-orm-entity';

export class AuthORMRepository {
  constructor(
    @InjectRepository(AuthORM)
    private readonly authRepository: Repository<AuthORM>,
  ) {}

  async testAllData(): Promise<void> {
    this.authRepository.delete({});
  }

  async save(auth: AuthORM): Promise<string> {
    const authResult = await this.authRepository.save(auth);

    return authResult.id;
  }

  async findAuthSessionByDeviceId(deviceId: string): Promise<AuthORM | null> {
    let auth;

    try {
      auth = await this.authRepository.findOne({
        where: {
          deviceId: deviceId,
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    return auth;
  }

  async findAuthSessionByAccessToken(
    accessToken: string,
  ): Promise<AuthORM | null> {
    let auth;

    try {
      auth = await this.authRepository
        .createQueryBuilder('auth')
        .leftJoinAndSelect('auth.JWTTokens', 'JWTTokens')
        .where('JWTTokens.accessToken = :accessToken', {
          accessToken: accessToken,
        })
        .getMany();
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!auth[0]) return null;

    return auth[0];
  }

  async findAuthSessionByRefreshToken(
    refreshToken: string,
  ): Promise<AuthORM | null> {
    let auth;

    try {
      auth = await this.authRepository
        .createQueryBuilder('auth')
        .leftJoinAndSelect('auth.JWTTokens', 'JWTTokens')
        .where('JWTTokens.refreshToken = :refreshToken', {
          refreshToken: refreshToken,
        })
        .getMany();
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!auth[0]) return null;

    return auth[0];
  }

  async deleteAuthSessionsByUserId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    let result;

    try {
      result = await this.authRepository
        .createQueryBuilder()
        .where('userId = :userId', { userId: userId })
        .delete()
        .andWhere('deviceId != :deviceId', { deviceId: deviceId })
        .execute();
    } catch (err) {
      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }

  async deleteAllAuthSessionsByUserId(userId: string): Promise<boolean> {
    let result;

    try {
      result = await this.authRepository
        .createQueryBuilder()
        .where('userId = :userId', { userId: userId })
        .delete()
        .execute();
    } catch (err) {
      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }

  async deleteAuthSessionByDeviceId(deviceId: string): Promise<boolean> {
    let result;

    try {
      result = await this.authRepository
        .createQueryBuilder()
        .delete()
        .where('deviceId = :deviceId', { deviceId: deviceId })
        .execute();
    } catch (err) {
      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }
}
