import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserORM } from '../domain/users-orm-entity';
import { UsersORMRepository } from '../infrastructure/orm/users-orm-repository';
// import { UserSQL } from '../domain/users-sql-entity';
// import { UsersSQLRepository } from '../infrastructure/sql/users-sql-repository';
//import { UsersRepository } from '../infrastructure/users-repository';
//import { UserDocument } from '../domain/users-entity';

@Injectable()
export class UsersService {
  constructor(
    //protected usersRepository: UsersRepository
    // protected usersRepository: UsersSQLRepository,
    protected usersRepository: UsersORMRepository,
  ) {}

  async findUserDbByID(
    id: string,
  ): Promise<UserORM /*UserSQL*/ /*UserDocument*/ | null> {
    const user = await this.usersRepository.findUserDbByID(id);

    return user;
  }

  async generateHash(password: string, salt: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async getSalt(password: string): Promise<string> {
    const salt = password.match(/\$..\$..\$.{22}/g);

    if (salt) {
      return salt[0];
    }
    return '';
  }
}
