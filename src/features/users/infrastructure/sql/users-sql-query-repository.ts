import { Injectable } from '@nestjs/common';
import { UserOutput } from '../../api/dto/output/user-output-dto';
import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { UserQueryFilter } from '../../api/dto/input/users-input-dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserRawDb } from '../dto/users-repository-dto';

@Injectable()
export class UsersSQLQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async findUsers(filter: UserQueryFilter): Promise<Paginator<UserOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const preQuery = `
      SELECT "Id", "Login", "Email", "Password", "CreatedAt"
        FROM public."Users" u
        WHERE
        u."Login" ILIKE $1 OR
          u."Email" ILIKE $2;
    `;

    const preDbResult = await this.dataSource.query(preQuery, [
      `%${filter.searchLoginTerm}%`,
      `%${filter.searchEmailTerm}%`,
    ]);
    const sortBy = filter.sortBy[0].toUpperCase() + filter.sortBy.slice(1);
    const query = `
    SELECT u.*, c.* 
      FROM public."Users" u
      LEFT JOIN public."UsersEmailConfirmation" c
      ON u."Id" = c."UserId"
      WHERE
        u."Login" ILIKE $1 OR
          u."Email" ILIKE $2
      ORDER BY "${sortBy}" ${filter.sortDirection}
      LIMIT $3 OFFSET $4;
    `;

    const dbResult = await this.dataSource.query(query, [
      `%${filter.searchLoginTerm}%`,
      `%${filter.searchEmailTerm}%`,
      filter.pageSize,
      skip,
    ]);

    const dbCount = preDbResult.length;

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: UserRawDb /*UserDb*/) => userMapper(p)),
    };

    return paginator;
  }

  async findUserByID(id: string): Promise<UserOutput | null> {
    const query = `
      SELECT u.*, c.* 
      FROM public."Users" u
      LEFT JOIN public."UsersEmailConfirmation" c
      ON u."Id" = c."UserId"
      WHERE
        u."Id" = $1;
    `;

    let usersDb;

    try {
      usersDb = await this.dataSource.query(query, [id]);
    } catch (err) {
      console.log(err);
      return null;
    }

    if (usersDb[0]) {
      return userMapper(usersDb[0]);
    }
    return null;
  }
}

const userMapper = (user: UserRawDb): UserOutput => {
  return {
    id: user.Id,
    login: user.Login,
    email: user.Email,
    createdAt: user.CreatedAt,
  };
};
