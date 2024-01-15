import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import mongoose, { HydratedDocument, Model } from "mongoose";
import { add } from 'date-fns/add';

export type UserDocument = HydratedDocument<User>;
export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;

export type UserModelType = Model<UserDocument> & typeof statics;

@Schema({_id: false})
class EmailConfirmation {

    @Prop()
    confirmationCode: string;

    @Prop({
        type: Object
    })
    expirationDate: object;

    @Prop()
    isConfirmed: boolean;

    @Prop({
        type: Object
    })
    nextSend: object;
}

class EmailConfirmationModel {
    constructor (
        public confirmationCode: string,
        public expirationDate: object,
        public isConfirmed: boolean,
        public nextSend: object,
    ){}
}

const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation)

@Schema({_id: false})
class JWTTokens {
    @Prop({required: true})
    accessToken: string

    @Prop({required: true})
    refreshToken: String
}

const JWTTokensSchema = SchemaFactory.createForClass(JWTTokens)

@Schema()
export class User {
    @Prop({required: true})
    login: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    password: string;
    
    @Prop({required: true})
    createdAt: string;

    @Prop({type: EmailConfirmationSchema, ref: 'EmailConfirmation'})
    emailConfirmation : EmailConfirmation;

    @Prop({default: []})
    JWTTokens: [JWTTokens];

    updateUser(login: string){
        this.login = login;
    }

    static createUser(login: string, email: string, passwordHash: string, isSuperAdmin: boolean = false): User {
        const user = new this();
        
        user.login = login;
        user.email = email;
        user.password = passwordHash;
        user.createdAt = new Date().toISOString();
        user.emailConfirmation = new EmailConfirmation()
        user.emailConfirmation.confirmationCode = randomUUID();
        user.emailConfirmation.expirationDate = add(new Date(), {minutes: 5});
        user.emailConfirmation.isConfirmed = isSuperAdmin;
        user.emailConfirmation.nextSend = add(new Date(), {seconds: 0});

        return user;
    }
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.methods = {
    updateUser: User.prototype.updateUser,
}

const statics = {
    createUser: User.createUser,
}

UserSchema.statics = statics;