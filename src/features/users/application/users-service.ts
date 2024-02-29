import { Injectable } from '@nestjs/common';
import { UserDocument } from '../domain/users-entity';
import bcrypt from 'bcrypt';

import { UsersRepository } from '../infrastructure/users-repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async findUserDbByID(id: string): Promise<UserDocument | null> {
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
