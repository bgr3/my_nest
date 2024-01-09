import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "../domain/users-entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { UserDb, UserType } from "../api/dto/middle/user-middle-dto";
import { Tokens } from "src/features/auth/api/dto/middle/auth-middle-dto";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
    
    async testAllData (): Promise<void> {
        const result = await this.userModel.deleteMany({})
        //console.log('users delete: ', result.deletedCount)
    }

    async save (user: UserDocument): Promise<void> {
        await user.save()
        
    }

    async findUserByLoginOrEmail (loginOrEmail: string): Promise<UserDocument | null> {
        const dbResult = await this.userModel.findOne({$or : [{login: loginOrEmail}, {email: loginOrEmail}]})
        
        return dbResult
    }

    async findUserDbByID (id: string): Promise<UserDocument | null> {
        if (ObjectId.isValid(id)) {
            const user = await this.userModel.findOne({_id: new ObjectId(id)});
            return user           
        }

        return null
    }

    async findUserByConfirmationCode (code: string): Promise<UserDocument | null> {
        const dbResult = await this.userModel.findOne({'emailConfirmation.confirmationCode': code})
        
        return dbResult
    }

    async createUser (newUser: UserType): Promise<string | null> {

        const result = await this.userModel.insertMany([newUser]);
        if (result[0]._id) {
            return result[0]._id.toString()
        } else {
            return null
        }
    }

    async updateConfirmation (userId: ObjectId): Promise<boolean> {
        const result = await this.userModel.updateOne({_id: userId}, { $set: {'emailConfirmation.isConfirmed': true}})

        if (result.matchedCount) return true

        return false
    }

    async resendConfirmationCode (userId: ObjectId, code: string): Promise<boolean> {
        const result = await this.userModel.updateOne({_id: userId}, { $set: {'emailConfirmation.confirmationCode': code}})

        if (result.matchedCount) return true


        return false
    }

    async updateConfirmationCode (email: string, code: string, expirationDate: object): Promise<boolean> {
        const result = await this.userModel.updateOne({email: email}, { $set: {'emailConfirmation.confirmationCode': code}}, {$set: {'emailConfirmation.expirationDate': expirationDate}})

        if (result.matchedCount) return true

        return false
    }

    async updatePassword (userId: ObjectId, password: string): Promise<boolean> {
        const result = await this.userModel.updateOne({_id: userId}, { $set: {'password': password}})

        if (result.matchedCount) return true

        return false
    }

    async deleteUser (id: string): Promise<Boolean> {
        if (ObjectId.isValid(id)) {

            const result = await this.userModel.deleteOne({_id: new ObjectId(id)})
            
            if (result.deletedCount) {
                return true
            }
        }
        return false
    }

    async createTokens (userId: ObjectId, tokens: Tokens[]): Promise<boolean> {
        
        const result = await this.userModel.updateOne({_id: userId}, { $set: {'JWTTokens': tokens}})

        if (!result.matchedCount) return false

        return true
    }

    async updateTokens (userId: ObjectId, oldTokens: Tokens, newTokens: Tokens): Promise<boolean> {
        const resultPull = await this.userModel.updateOne({_id: userId}, {$pull: {'JWTTokens': oldTokens}})
        const resultPush = await this.userModel.updateOne({_id: userId}, {$push: {'JWTTokens': newTokens}})

        if (!resultPull.matchedCount || !resultPush) return false

        return true
    }

    async deleteTokens (userId: ObjectId, tokens: Tokens): Promise<boolean> {
        const result = await this.userModel.updateOne({_id: userId}, { $pull: {'JWTTokens': tokens}})

        if (result.matchedCount) return true

        return false
    }

}