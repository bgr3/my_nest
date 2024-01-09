import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../domain/users-entity";
import { Model } from "mongoose";
import  bcrypt  from 'bcrypt'
import { add } from 'date-fns/add'
import { v4 as uuidv4 } from 'uuid'
import { UsersRepository } from "../infrastructure/users-repository";
import { UserPostType } from "../api/dto/input/user-input-dto";
import { UserDb, UserType } from "../api/dto/middle/user-middle-dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        protected usersRepository: UsersRepository
    ){}
    async testAllData (): Promise<void> {
        return this.usersRepository.testAllData()
    }

    async findUserDbByID (id: string): Promise<UserDocument|null> {
        let user = await this.usersRepository.findUserDbByID(id)

        return user
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDocument | null> {
        const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
        
        if (!user) return null
        
        const passwordSalt = await this._getSalt(user.password)
        const passwordHash = await this._generateHash(password, passwordSalt)
        
        if (passwordHash !== user.password) {
            return null
        }

        return user
    }

    async createUser (dto: UserPostType, isSuperAdmin: boolean = false): Promise<string | null> {     
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(dto.password, passwordSalt) 

        const newUser = new UserType(
            dto.login,
            dto.email,
            passwordHash,            
            new Date().toISOString(),
            {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 5
                }),
                isConfirmed: isSuperAdmin,
                nextSend: add(new Date(), {
                    seconds: 0
                }),
            },
            [])

        const newUserModel = new this.userModel(newUser)

        await this.usersRepository.save(newUserModel)
        
        return newUserModel._id.toString()
    }

    async updateCodeForRecoveryPassword (email: string): Promise<string | null> {
        const code = uuidv4()
        const expirationDate = add(new Date(), {
            minutes: 5
        })
        const result = await this.usersRepository.updateConfirmationCode(email, code, expirationDate)
        const user = await this.usersRepository.findUserByLoginOrEmail(email)

        if (user){
            if(result) return user._id.toString()
        }   

        return null
    }

    async changePassword(code: string, password: string): Promise<boolean> {
        let user = await this.usersRepository.findUserByConfirmationCode(code)
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        let result = await this.usersRepository.updatePassword(user!._id, passwordHash)

        return result
    }

    async deleteUser (id: string): Promise<Boolean> {
        return this.usersRepository.deleteUser(id)
    }

    async _generateHash (password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)

        return hash
    }

    async _getSalt (password: string) {
        const salt = password.match(/\$..\$..\$.{22}/g)
        
        if (salt) {
            return salt[0]
        }
        return ''
    }

}


