import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserORM } from '../../domain/entities/users-orm-entity';

@Injectable()
export class UsersORMRepository {
  constructor(
    @InjectRepository(UserORM)
    private readonly usersRepository: Repository<UserORM>,
  ) {}

  async testAllData(): Promise<void> {
    await this.usersRepository.delete({});
  }

  async save(user: UserORM): Promise<string> {
    const userResult = await this.usersRepository.save(user);

    return userResult.id;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserORM | null> {
    let user;
    // = await this.usersRepository.findOne({
    //   where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    // });

    try {
      user = await this.usersRepository
        .createQueryBuilder('u')
        .select()
        .leftJoinAndSelect('u.banInfo', 'ban')
        .leftJoinAndSelect('u.blogBanInfo', 'blogBan')
        .leftJoinAndSelect('blogBan.blog', 'blog')
        .where(`u.login = :loginOrEmail OR u.email = :loginOrEmail`, {
          loginOrEmail: loginOrEmail,
        })
        .getOne();
    } catch (err) {
      console.log(err);

      return null;
    }

    return user;
  }

  async findUserDbByID(id: string): Promise<UserORM | null> {
    let user;

    try {
      // user = await this.usersRepository.findOne({
      //   where: {
      //     id: id,
      //   },
      // });

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
      return null;
    }

    return user;
  }

  async findUserByConfirmationCode(code: string): Promise<UserORM | null> {
    let user;
    //  = await this.usersRepository.findOne({
    //   where: {
    //     emailConfirmation: {
    //       confirmationCode: code,
    //     },
    //   },
    // });

    try {
      user = await this.usersRepository
        .createQueryBuilder('u')
        .select()
        .leftJoinAndSelect('u.banInfo', 'ban')
        .leftJoinAndSelect('u.blogBanInfo', 'blogBan')
        .leftJoinAndSelect('blogBan.blog', 'blog')
        .where(`u.emailConfirmation = :code`, {
          code: code,
        })
        .getOne();
    } catch (err) {
      console.log(err);

      return null;
    }

    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    let result;

    try {
      result = await this.usersRepository.delete(id);
    } catch (err) {
      console.log(err);

      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }
}
