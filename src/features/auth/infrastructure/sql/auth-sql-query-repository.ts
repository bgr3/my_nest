import { AuthTypeOutput } from '../../api/dto/output/auth-output-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthRawDb } from '../dto/auth-repository-dto';

export class AuthSQLQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAuthSessionsByUserId(
    userId: string,
  ): Promise<AuthTypeOutput[] | null> {
    const query = `
    SELECT * 
    FROM public."Auth" a
    WHERE
      a."UserId" = '${userId}'
    `;

    let session;

    try {
      session = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    return session.map((i) => authMapper(i));
  }
}

const authMapper = (session: AuthRawDb): AuthTypeOutput => {
  return {
    ip: session.DeviceIP,
    title: session.DeviceName,
    lastActiveDate: session.IssuedAt.toISOString(),
    deviceId: session.DeviceId,
  };
};
