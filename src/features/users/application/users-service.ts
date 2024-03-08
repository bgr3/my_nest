import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersSQLRepository } from '../infrastructure/users-sql-repository';
import { UserSQL } from '../domain/users-sql-entity';
//import { UsersRepository } from '../infrastructure/users-repository';
//import { UserDocument } from '../domain/users-entity';

@Injectable()
export class UsersService {
  constructor(
    //protected usersRepository: UsersRepository
    protected usersRepository: UsersSQLRepository,
  ) {}

  async findUserDbByID(id: string): Promise<UserSQL /*UserDocument*/ | null> {
    const user = await this.usersRepository.findUserDbByID(id);

    return user;
  }

  async generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async getSalt(password: string) {
    const salt = password.match(/\$..\$..\$.{22}/g);

    if (salt) {
      return salt[0];
    }
    return '';
  }
}
