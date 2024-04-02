import { Injectable } from '@nestjs/common';
import { UserOutput } from '../../api/dto/output/user-output-dto';
import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { UserQueryFilter } from '../../api/dto/input/users-input-dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserORM } from '../../domain/users-orm-entity';

@Injectable()
export class UsersORMQueryRepository {
  constructor(
    @InjectRepository(UserORM)
    private readonly usersRepository: Repository<UserORM>,
  ) {}
  async findUsers(filter: UserQueryFilter): Promise<Paginator<UserOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const dbCount = await this.usersRepository.count({
      where: [
        { login: Like(`%${filter.searchLoginTerm}%`) },
        { email: Like(`%${filter.searchEmailTerm}%`) },
      ],
      skip: skip,
      take: filter.pageSize,
    });

    console.log(filter);

    const dbResult = await this.usersRepository
      .createQueryBuilder('u')
      .select()
      .where('u.login like :login', {
        login: `%${filter.searchLoginTerm}%`,
      })
      .andWhere('u.email like :email', {
        email: `%${filter.searchEmailTerm}%`,
      })
      .orderBy(
        `u.${filter.sortBy}`,
        filter.sortDirection == 'asc' ? 'ASC' : 'DESC',
      )
      .skip(skip)
      .take(filter.pageSize)
      .getMany();

    console.log(filter);

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: UserORM) => userMapper(p)),
    };

    return paginator;
  }

  async findUserByID(id: string): Promise<UserOutput | null> {
    let userDb;

    try {
      userDb = await this.usersRepository.findOne({
        where: { id: id },
      });
    } catch (err) {
      return null;
    }

    if (userDb) {
      return userMapper(userDb);
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
