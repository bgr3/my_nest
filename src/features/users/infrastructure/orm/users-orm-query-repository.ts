import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { UserQueryFilter } from '../../api/dto/input/users-input-dto';
import { UserOutput } from '../../api/dto/output/user-output-dto';
import { UserORM } from '../../domain/users-orm-entity';

@Injectable()
export class UsersORMQueryRepository {
  constructor(
    @InjectRepository(UserORM)
    private readonly usersRepository: Repository<UserORM>,
  ) {}
  async findUsers(filter: UserQueryFilter): Promise<Paginator<UserOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

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

    // console.log(filter);

    const dbResult = await this.usersRepository
      .createQueryBuilder('u')
      .select()
      .where('u.login ilike :login', {
        login: `%${filter.searchLoginTerm}%`,
      })
      .orWhere('u.email ilike :email', {
        email: `%${filter.searchEmailTerm}%`,
      })
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

  async findUserByID(id: string): Promise<UserOutput | null> {
    let user;

    try {
      user = await this.usersRepository.findOne({
        where: { id: id },
      });
    } catch (err) {
      return null;
    }

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
  };
};
