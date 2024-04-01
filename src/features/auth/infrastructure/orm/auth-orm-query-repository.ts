import { AuthTypeOutput } from '../../api/dto/output/auth-output-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthORM } from '../../domain/auth-orm-entity';

export class AuthORMQueryRepository {
  constructor(
    @InjectRepository(AuthORM)
    private readonly authRepository: Repository<AuthORM>,
  ) {}

  async findAuthSessionsByUserId(
    userId: string,
  ): Promise<AuthTypeOutput[] | null> {
    let session;

    try {
      session = await this.authRepository.find({
        where: { userId: userId },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    return session.map((i) => authMapper(i));
  }
}

const authMapper = (session: AuthORM): AuthTypeOutput => {
  return {
    ip: session.deviceIP,
    title: session.deviceName,
    lastActiveDate: session.issuedAt.toISOString(),
    deviceId: session.deviceId,
  };
};
