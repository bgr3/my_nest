import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;
export type AuthModelType = Model<AuthDocument> & typeof statics;

@Schema({ _id: false })
class JWTTokens {
  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;
}

const JWTTokensSchema = SchemaFactory.createForClass(JWTTokens);

@Schema()
export class Auth {
  @Prop({ required: true })
  issuedAt: Date;

  @Prop({ required: true })
  expiredAt: Date;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  deviceIP: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: JWTTokensSchema, ref: 'JWTTokens' })
  JWTTokens: JWTTokens;

  updateAuthSession(
    accessToken: string,
    refreshToken: string,
    issuedAt: Date,
    expiredAt: Date,
    ) {
      this.issuedAt = issuedAt;
      this.expiredAt = expiredAt;
      this.JWTTokens.accessToken = accessToken;
      this.JWTTokens.refreshToken = refreshToken;
  };

  static createAuth(
    userId: string,
    deviceIP: string,
    deviceId,
    deviceName: string,
    accessToken: string,
    refreshToken: string,
    issuedAt: Date,
    expiredAt: Date,
  ): Auth {
    const auth = new this();

    auth.issuedAt = issuedAt;
    auth.expiredAt = expiredAt;
    auth.deviceId = deviceId;
    auth.deviceIP = deviceIP;
    auth.deviceName = deviceName;
    auth.userId = userId;
    auth.JWTTokens = new JWTTokens();
    auth.JWTTokens.accessToken = accessToken;
    auth.JWTTokens.refreshToken = refreshToken;

    return auth;
  }
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.methods = {
  updateAuthSession: Auth.prototype.updateAuthSession,
};

const statics = {
  createAuth: Auth.createAuth,
};

AuthSchema.statics = statics;
