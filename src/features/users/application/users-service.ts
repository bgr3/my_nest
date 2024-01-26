import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users-entity';
import bcrypt from 'bcrypt';
import { add } from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../infrastructure/users-repository';
import { UserPostType } from '../api/dto/input/users-input-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    protected usersRepository: UsersRepository,
  ) {}
  async testAllData(): Promise<void> {
    return this.usersRepository.testAllData();
  }

  async findUserDbByID(id: string): Promise<UserDocument | null> {
    const user = await this.usersRepository.findUserDbByID(id);

    return user;
  }

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const passwordSalt = await this._getSalt(user.password);
    const passwordHash = await this._generateHash(password, passwordSalt);

    if (passwordHash !== user.password) {
      return null;
    }

    return user;
  }

  async createUser(
    dto: UserPostType,
    isSuperAdmin: boolean = false,
  ): Promise<string | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(dto.password, passwordSalt);

    const newUser = User.createUser(
      dto.login,
      dto.email,
      passwordHash,
      isSuperAdmin,
    );

    const newUserModel = new this.UserModel(newUser);

    await this.usersRepository.save(newUserModel);

    return newUserModel._id.toString();
  }

  async updateCodeForRecoveryPassword(email: string): Promise<string | null> {
    const code = uuidv4();
    const expirationDate = add(new Date(), {
      minutes: 5,
    });
    const user = await this.usersRepository.findUserByLoginOrEmail(email);

    if (user) {
      user.updateCodeForRecoveryPassword(
        code,
        expirationDate)
      await this.usersRepository.save(user)
      return user._id.toString();
    }

    return null;
  }

  async changePassword(code: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    if (user) {
      user.updatePassword(passwordHash);
      await this.usersRepository.save(user)
    }

    return true;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(id);
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async _getSalt(password: string) {
    const salt = password.match(/\$..\$..\$.{22}/g);

    if (salt) {
      return salt[0];
    }
    return '';
  }
}
