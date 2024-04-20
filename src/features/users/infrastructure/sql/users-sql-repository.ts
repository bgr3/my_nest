import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { UserSQL } from '../../domain/users-sql-entity';

@Injectable()
export class UsersSQLRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async testAllData(): Promise<void> {
    const query = `
    TRUNCATE public."Users" CASCADE;
    `;
    await this.dataSource.query(query);
  }

  async save(user: UserSQL): Promise<string | null> {
    if (user.newUser) {
      const userQuery = `
      INSERT INTO public."Users"(
        "Login", "Email", "Password", "CreatedAt")
        VALUES ($1, $2, $3, $4)
        RETURNING "Id";
      `;

      let userIdDb;

      try {
        userIdDb = await this.dataSource.query(userQuery, [
          user.login,
          user.email,
          user.password,
          user.createdAt,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }

      const userId = userIdDb[0].Id;

      const emailConfirmQuery = `
        INSERT INTO public."UsersEmailConfirmation"(
          "UserId", "ConfirmationCode", "ExpirationDate", "IsConfirmed", "NextSend")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING true;
      `;

      try {
        await this.dataSource.query(emailConfirmQuery, [
          userId,
          user.emailConfirmation.confirmationCode,
          user.emailConfirmation.expirationDate,
          user.emailConfirmation.isConfirmed,
          user.emailConfirmation.nextSend,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }

      return userId;
    }

    const userQuery = `
      UPDATE public."Users"
        SET "Login"=$1, "Email"=$2, "Password"=$3, "CreatedAt"=$4
        WHERE "Id" = $5;
    `;

    try {
      await this.dataSource.query(userQuery, [
        user.login,
        user.email,
        user.password,
        user.createdAt,
        user.id,
      ]);
    } catch (err) {
      console.log(err);

      return null;
    }

    const emailConfirmQuery = `
      UPDATE public."UsersEmailConfirmation"
        SET "ConfirmationCode"=$1, "ExpirationDate"=$2, "IsConfirmed"=$3, "NextSend"=$4
        WHERE "UserId" = $5
        RETURNING true;
    `;

    try {
      await this.dataSource.query(emailConfirmQuery, [
        user.emailConfirmation.confirmationCode,
        user.emailConfirmation.expirationDate,
        user.emailConfirmation.isConfirmed,
        user.emailConfirmation.nextSend,
        user.id,
      ]);
    } catch (err) {
      console.log(err);

      return null;
    }

    return null;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserSQL | null> {
    const query = `
    SELECT u.*, c.* 
    FROM public."Users" u
    LEFT JOIN public."UsersEmailConfirmation" c
    ON u."Id" = c."UserId"
    WHERE
      u."Login" like $1 OR
        u."Email" like $1
    `;

    let userDb;

    try {
      userDb = await this.dataSource.query(query, [loginOrEmail]);
    } catch (err) {
      return null;
    }

    if (!userDb[0]) return null;

    const user = UserSQL.createSmartUser(userDb[0]);

    return user;
  }

  async findUserDbByID(id: string): Promise<UserSQL | null> {
    const query = `
    SELECT u.*, c.* 
    FROM public."Users" u
    LEFT JOIN public."UsersEmailConfirmation" c
    ON u."Id" = c."UserId"
    WHERE
      u."Id" = '${id}'
    `;

    let userDb;

    try {
      userDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!userDb[0]) return null;

    const user = UserSQL.createSmartUser(userDb[0]);

    return user;
  }

  async findUserByConfirmationCode(code: string): Promise<UserSQL | null> {
    const query = `
    SELECT u.*, c.* 
    FROM public."Users" u
    LEFT JOIN public."UsersEmailConfirmation" c
    ON u."Id" = c."UserId"
    WHERE
      c."ConfirmationCode" = '${code}'
    `;

    let userDb;

    try {
      userDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!userDb[0]) return null;

    const user = UserSQL.createSmartUser(userDb[0]);

    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const query = `
    DELETE FROM public."Users" CASCADE
	    WHERE "Id" = $1;
    `;

    let result;

    try {
      result = await this.dataSource.query(query, [id]);
    } catch (err) {
      return false;
    }

    if (result[1] === 0) return false;

    return true;
  }
}
