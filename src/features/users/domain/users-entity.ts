import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument, Model } from 'mongoose';
import { add } from 'date-fns/add';
import { MeType } from '../../auth/api/dto/output/auth-output-dto';

export type UserDocument = HydratedDocument<User>;
export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;

export type UserModelType = Model<UserDocument> & typeof statics;

@Schema({ _id: false })
class EmailConfirmation {
  @Prop()
  confirmationCode: string;

  @Prop({
    type: Object,
  })
  expirationDate: object;

  @Prop()
  isConfirmed: boolean;

  @Prop({
    type: Object,
  })
  nextSend: object;
}

const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

// @Schema({_id: false})
// class JWTTokens {
//     @Prop({required: true})
//     accessToken: string

//     @Prop({required: true})
//     refreshToken: String
// }

// const JWTTokensSchema = SchemaFactory.createForClass(JWTTokens)

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ type: EmailConfirmationSchema, ref: 'EmailConfirmation' })
  emailConfirmation: EmailConfirmation;

  // @Prop({default: [], type: [{type: JWTTokensSchema, ref: 'JWTTokens'}]})
  // JWTTokens: [JWTTokens];

  updateCodeForRecoveryPassword(
    code: string,
    expirationDate: object) {
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = expirationDate;
  };

  updatePassword(
    password: string
  ){
    this.password = password;
  };

  updateConfirmation(){
    if (this.emailConfirmation.isConfirmed) return false;

    this.emailConfirmation.isConfirmed = true

    return true;
  };

  resendConfirmationCode(
    code: string
  ){
    this.emailConfirmation.confirmationCode = code;
  };

  getMe(
    id: string,
  ){
    const me = new MeType(this.email, this.login, id.toString())

    return me;
  };

  static createUser(
    login: string,
    email: string,
    passwordHash: string,
    isSuperAdmin: boolean = false,
  ): User {
    const user = new this();

    user.login = login;
    user.email = email;
    user.password = passwordHash;
    user.createdAt = new Date().toISOString();
    user.emailConfirmation = new EmailConfirmation();
    user.emailConfirmation.confirmationCode = randomUUID();
    user.emailConfirmation.expirationDate = add(new Date(), { minutes: 5 });
    user.emailConfirmation.isConfirmed = isSuperAdmin;
    user.emailConfirmation.nextSend = add(new Date(), { seconds: 0 });

    return user;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  updateCodeForRecoveryPassword: User.prototype.updateCodeForRecoveryPassword,
  updatePassword: User.prototype.updatePassword,
  updateConfirmation: User.prototype.updateConfirmation,
  resendConfirmationCode: User.prototype.resendConfirmationCode,
  getMe: User.prototype.getMe,
};

const statics = {
  createUser: User.createUser,
};

UserSchema.statics = statics;

///
// const smartUserModel = this.UserAccountModel.makeInstance({
//   login,
//   email,
//   passwordHash,
//   passwordSalt,
// });

// const user = await this.authUsersRepository.save(smartUserModel);

// const userCreatedEvent = new UserCreatedEvent(
//   email,
//   user.emailConfirmation.confirmationCode,
// );

// this.eventBus.publish(userCreatedEvent);