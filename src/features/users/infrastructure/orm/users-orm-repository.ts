import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserORM } from '../../domain/users-orm-entity';
import { Repository } from 'typeorm';

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
    const user = await this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return user;
  }

  async findUserDbByID(id: string): Promise<UserORM | null> {
    let user;

    try {
      user = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      return null;
    }

    return user;
  }

  async findUserByConfirmationCode(code: string): Promise<UserORM | null> {
    const user = await this.usersRepository.findOne({
      where: {
        emailConfirmation: {
          confirmationCode: code,
        },
      },
    });

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
