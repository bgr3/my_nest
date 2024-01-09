import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

class EmailConfirmation {

    @Prop({required: true})
    confirmationCode: string;

    @Prop({
        required: true,
        type: Object
    })
    expirationDate: object;

    @Prop({required: true})
    isConfirmed: boolean;

    @Prop({
        required: true,
        type: Object
    })
    nextSend: object;
}

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

    @Prop({required: true})
    emailConfirmation : EmailConfirmation;

    @Prop({default: []})
    JWTTokens: [JWTTokens];
}

export const UserSchema = SchemaFactory.createForClass(User)



class JWTTokens {
    @Prop()
    accessToken: string

    @Prop()
    refreshToken: String
}