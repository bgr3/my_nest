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

    const preDbResult = await this.usersRepository.findAndCount({
      where: [
        { login: Like(`%${filter.searchLoginTerm}%`) },
        { email: Like(`%${filter.searchEmailTerm}%`) },
      ],
      skip: skip,
      take: filter.pageSize,
      order: { createdAt: 'DESC' },
    });

    const dbResult = await this.usersRepository.find({
      where: [
        { login: Like(`%${filter.searchLoginTerm}%`) },
        { email: Like(`%${filter.searchEmailTerm}%`) },
      ],
    });

    const dbCount = preDbResult[1];

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
