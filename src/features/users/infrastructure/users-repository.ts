import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../domain/users-entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async testAllData(): Promise<void> {
    await this.UserModel.deleteMany({});
    //console.log('users delete: ', result.deletedCount)
  }

  async save(user: UserDocument): Promise<void> {
    await user.save();
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    const dbResult = await this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return dbResult;
  }

  async findUserDbByID(id: string): Promise<UserDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      const user = await this.UserModel.findOne({
        _id: new Types.ObjectId(id),
      });
      return user;
    }

    return null;
  }

  async findUserByConfirmationCode(code: string): Promise<UserDocument | null> {
    const dbResult = await this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });

    return dbResult;
  }

  // async createUser (newUser: UserType): Promise<string | null> {

  //     const result = await this.userModel.insertMany([newUser]);
  //     if (result[0]._id) {
  //         return result[0]._id.toString()
  //     } else {
  //         return null
  //     }
  // }

  // async updateConfirmation(userId: Types.ObjectId): Promise<boolean> {
  //   const result = await this.UserModel.updateOne(
  //     { _id: userId },
  //     { $set: { 'emailConfirmation.isConfirmed': true } },
  //   );

  //   if (result.matchedCount) return true;

  //   return false;
  // }

  // async resendConfirmationCode(
  //   userId: Types.ObjectId,
  //   code: string,
  // ): Promise<boolean> {
  //   const result = await this.UserModel.updateOne(
  //     { _id: userId },
  //     { $set: { 'emailConfirmation.confirmationCode': code } },
  //   );

  //   if (result.matchedCount) return true;

  //   return false;
  // }

  // async updateConfirmationCode(
  //   email: string,
  //   code: string,
  //   expirationDate: object,
  // ): Promise<boolean> {
  //   const result = await this.UserModel.updateOne(
  //     { email: email },
  //     { $set: { 'emailConfirmation.confirmationCode': code } },
  //     { $set: { 'emailConfirmation.expirationDate': expirationDate } },
  //   );

  //   if (result.matchedCount) return true;

  //   return false;
  // }

  async updatePassword(
    userId: Types.ObjectId,
    password: string,
  ): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id: userId },
      { $set: { password: password } },
    );

    if (result.matchedCount) return true;

    return false;
  }

  async deleteUser(id: string): Promise<boolean> {
    if (Types.ObjectId.isValid(id)) {
      const result = await this.UserModel.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (result.deletedCount) {
        return true;
      }
    }
    return false;
  }

  // async createTokens(
  //   userId: Types.ObjectId,
  //   tokens: Tokens[],
  // ): Promise<boolean> {
  //   const result = await this.UserModel.updateOne(
  //     { _id: userId },
  //     { $set: { JWTTokens: tokens } },
  //   );

  //   if (!result.matchedCount) return false;

  //   return true;
  // }

  // async updateTokens(
  //   userId: Types.ObjectId,
  //   oldTokens: Tokens,
  //   newTokens: Tokens,
  // ): Promise<boolean> {
  //   const resultPull = await this.UserModel.updateOne(
  //     { _id: userId },
  //     { $pull: { JWTTokens: oldTokens } },
  //   );
  //   const resultPush = await this.UserModel.updateOne(
  //     { _id: userId },
  //     { $push: { JWTTokens: newTokens } },
  //   );

  //   if (!resultPull.matchedCount || !resultPush) return false;

  //   return true;
  // }

  // async deleteTokens(userId: Types.ObjectId, tokens: Tokens): Promise<boolean> {
  //   const result = await this.UserModel.updateOne(
  //     { _id: userId },
  //     { $pull: { JWTTokens: tokens } },
  //   );

  //   if (result.matchedCount) return true;

  //   return false;
  // }
}
