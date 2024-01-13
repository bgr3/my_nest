import { Injectable } from "@nestjs/common"
import { UserDb, UserFilterType, UserPaginatorType } from "../api/dto/middle/user-middle-dto"
import { User, UserDocument, UserModelType } from "../domain/users-entity"
import { Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose"
import { UserOutput } from "../api/dto/output/user-output-dto"

export const userFilter = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchLoginTerm: '',
    searchEmailTerm: '',
  }

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType){}
    async findUsers (filter: UserFilterType = userFilter): Promise<UserPaginatorType> {

        const skip = (filter.pageNumber - 1) * filter.pageSize
        const regexLogin = new RegExp(filter.searchLoginTerm, 'i')
        const regexEmail = new RegExp(filter.searchEmailTerm, 'i')
        const dbCount = await this.UserModel.countDocuments({$or: [{login: RegExp(regexLogin)}, {email: RegExp(regexEmail)}]})
        const dbResult = await this.UserModel.find({$or: [{login: RegExp(regexLogin)}, {email: RegExp(regexEmail)}]}).sort({[filter.sortBy]: (filter.sortDirection == 'asc' ? 1 : -1)}).skip(skip).limit(filter.pageSize).lean()
        debugger

        const paginator = {
            pagesCount: Math.ceil(dbCount / filter.pageSize),
            page: filter.pageNumber,
            pageSize: filter.pageSize,
            totalCount: dbCount,
            items: dbResult.map((p: any /*UserDb*/) => userMapper(p))
        }

        return paginator
    }
    
    async findUserByID (id: string): Promise<UserOutput | null> {
        if (Types.ObjectId.isValid(id)) {
            const user = await this.UserModel.findOne({_id: new Types.ObjectId(id) }).lean();

            if (user) {
                return userMapper(user)                
            }
            return null
        }

        return null
    }
}

const userMapper = (user: UserDocument): UserOutput => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: 	user.createdAt,
        
    }
}