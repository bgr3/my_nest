import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AuthSQL } from '../../domain/auth-sql-entity';

export class AuthSQLRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async testAllData(): Promise<void> {
    const query = `
    TRUNCATE public."Auth";
    `;
    await this.dataSource.query(query);
  }

  async save(auth: AuthSQL): Promise<string | null> {
    if (auth.newAuth) {
      const authQuery = `
      INSERT INTO public."Auth"(
        "IssuedAt", "ExpiredAt", "DeviceId", "DeviceIP", "DeviceName", "UserId", "AccessToken", "RefreshToken")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING "Id";
      `;

      let authIdDb;

      try {
        authIdDb = await this.dataSource.query(authQuery, [
          auth.issuedAt,
          auth.expiredAt,
          auth.deviceId,
          auth.deviceIP,
          auth.deviceName,
          auth.userId,
          auth.JWTTokens.accessToken,
          auth.JWTTokens.refreshToken,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }

      const authId = authIdDb[0].Id;

      return authId;
    }

    const authQuery = `
      UPDATE public."Auth"
        SET "IssuedAt"=$1, "ExpiredAt"=$2, "DeviceId"=$3, "DeviceIP"=$4, "DeviceName"=$5, "UserId"=$6, "AccessToken"=$7, "RefreshToken"=$8
        WHERE "Id" = $9;
    `;

    try {
      await this.dataSource.query(authQuery, [
        auth.issuedAt,
        auth.expiredAt,
        auth.deviceId,
        auth.deviceIP,
        auth.deviceName,
        auth.userId,
        auth.JWTTokens.accessToken,
        auth.JWTTokens.refreshToken,
        auth.id,
      ]);
    } catch (err) {
      console.log(err);

      return null;
    }

    return null;
  }

  async findAuthSessionByDeviceId(deviceId: string): Promise<AuthSQL | null> {
    const query = `
    SELECT * 
    FROM public."Auth" a
    WHERE
      a."DeviceId" = '${deviceId}'
    `;

    let authDb;

    try {
      authDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!authDb[0]) return null;

    const auth = AuthSQL.createSmartAuth(authDb[0]);

    return auth;
  }

  async findAuthSessionByAccessToken(
    accessToken: string,
  ): Promise<AuthSQL | null> {
    const query = `
    SELECT * 
    FROM public."Auth" a
    WHERE
      a."AccessToken" = '${accessToken}'
    `;

    let authDb;

    try {
      authDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!authDb[0]) return null;

    const auth = AuthSQL.createSmartAuth(authDb[0]);

    return auth;
  }

  async findAuthSessionByRefreshToken(
    refreshToken: string,
  ): Promise<AuthSQL | null> {
    const query = `
    SELECT * 
    FROM public."Auth" a
    WHERE
      a."RefreshToken" = '${refreshToken}'
    `;

    let authDb;

    try {
      authDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!authDb[0]) return null;

    const auth = AuthSQL.createSmartAuth(authDb[0]);

    return auth;
  }

  async deleteAuthSessionsByUserId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const query = `
    DELETE FROM public."Auth"
	    WHERE "UserId" = $1 AND "DeviceId" != $2;
    `;

    let result;

    try {
      result = await this.dataSource.query(query, [userId, deviceId]);
    } catch (err) {
      return false;
    }

    if (result[1] === 0) return false;

    return true;
  }

  async deleteAuthSessionByDeviceId(deviceId: string): Promise<boolean> {
    const query = `
    DELETE FROM public."Auth"
	    WHERE "DeviceId" = $1;
    `;

    let result;

    try {
      result = await this.dataSource.query(query, [deviceId]);
    } catch (err) {
      return false;
    }

    if (result[1] === 0) return false;

    return true;
  }
}
