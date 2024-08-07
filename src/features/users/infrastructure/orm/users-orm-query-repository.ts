import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { UserQueryFilter } from '../../api/dto/input/users-input-dto';
import {
  UserBloggerOutput,
  UserOutput,
} from '../../api/dto/output/user-output-dto';
import { UserORM } from '../../domain/entities/users-orm-entity';

@Injectable()
export class UsersORMQueryRepository {
  constructor(
    @InjectRepository(UserORM)
    private readonly usersRepository: Repository<UserORM>,
  ) {}
  async findUsers(filter: UserQueryFilter): Promise<Paginator<UserOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const banStatus =
      filter.banStatus === 'banned'
        ? 'ban.isBanned = true'
        : filter.banStatus === 'notBanned'
          ? 'ban.isBanned = false'
          : 'ban.isBanned IN (true, false)';

    // const dbCount = await this.usersRepository
    //   .createQueryBuilder('u')
    //   .select()
    //   .where('u.login ilike :login', {
    //     login: `%${filter.searchLoginTerm}%`,
    //   })
    //   .orWhere('u.email ilike :email', {
    //     email: `%${filter.searchEmailTerm}%`,
    //   })
    //   .orderBy(
    //     `u.${filter.sortBy}`,
    //     filter.sortDirection == 'asc' ? 'ASC' : 'DESC',
    //   )
    //   .getCount();

    const dbResult = await this.usersRepository
      .createQueryBuilder('u')
      .select()
      .leftJoinAndSelect('u.banInfo', 'ban')
      .where(
        `(u.login ilike :login OR u.email ilike :email) AND ${banStatus}`,
        {
          login: `%${filter.searchLoginTerm}%`,
          email: `%${filter.searchEmailTerm}%`,
        },
      )
      // .andWhere('u.email ilike :email', {
      //   email: `%${filter.searchEmailTerm}%`,
      // })
      // .andWhere(banStatus)
      .orderBy(
        `u.${filter.sortBy}`,
        filter.sortDirection == 'asc' ? 'ASC' : 'DESC',
      )
      .skip(skip) //use with joins
      .take(filter.pageSize) //use with joins
      // .offset(skip)            //use with regular query
      // .limit(filter.pageSize)  //use with regular query
      .getManyAndCount();

    const dbCount = dbResult[1];

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult[0].map((p: UserORM) => userMapper(p)),
    };

    return paginator;
  }

  async findBlogBannedUsers(
    filter: Omit<UserQueryFilter, 'banReason'>,
    blogId: string,
  ): Promise<Paginator<UserBloggerOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    let dbResult;

    try {
      dbResult = await this.usersRepository
        .createQueryBuilder('u')
        .select()
        .leftJoinAndSelect('u.banInfo', 'ban')
        .leftJoinAndSelect(
          'u.blogBanInfo',
          'blogBan',
          'blogBan.isBanned = true AND blogBan.blogId = :blogId',
          { blogId: blogId },
        )
        .leftJoinAndSelect('blogBan.blog', 'blog')
        .where(`blogBan.isBanned = true AND blogBan.blogId = :blogId`, {
          login: `%${filter.searchLoginTerm}%`,
          email: `%${filter.searchEmailTerm}%`,
        })
        .orderBy(
          `u.${filter.sortBy}`,
          filter.sortDirection == 'asc' ? 'ASC' : 'DESC',
        )
        .skip(skip)
        .take(filter.pageSize)
        .getManyAndCount();
    } catch (err) {
      console.log(err);
      dbResult = [];
    }

    const dbCount = dbResult[1];

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult[0].map((p: UserORM) => userBloggerMapper(p, blogId)),
    };

    return paginator;
  }

  async findUserByID(id: string): Promise<UserOutput | null> {
    let user;

    try {
      user = await this.usersRepository
        .createQueryBuilder('u')
        .select()
        .leftJoinAndSelect('u.banInfo', 'ban')
        .leftJoinAndSelect('u.blogBanInfo', 'blogBan')
        .leftJoinAndSelect('blogBan.blog', 'blog')
        .where(`u.id = :id`, {
          id: id,
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    // try {
    //   user = await this.usersRepository.findOne({
    //     where: { id: id },
    //   });
    // } catch (err) {
    //   console.log(err);

    //   return null;
    // }
    if (user) {
      return userMapper(user);
    }
    return null;
  }
}

const userMapper = (user: UserORM): UserOutput => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
    banInfo: {
      banDate: user.banInfo.banDate ? user.banInfo.banDate.toISOString() : null,
      banReason: user.banInfo.banReason,
      isBanned: user.banInfo.isBanned,
    },
  };
};

const userBloggerMapper = (
  user: UserORM,
  blogId: string,
): UserBloggerOutput => {
  const banInfo = user.blogBanInfo.find((i) => i.blog.id === blogId);
  return {
    id: user.id,
    login: user.login,
    banInfo: {
      banDate: banInfo!.banDate ? banInfo!.banDate.toISOString() : null,
      banReason: banInfo!.banReason,
      isBanned: banInfo!.isBanned,
    },
  };
};
