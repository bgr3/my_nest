import { Injectable } from "@nestjs/common"
import { UserDb, UserFilterType, UserPaginatorType } from "../api/dto/middle/user-middle-dto"
import { User, UserDocument } from "../domain/users-entity"
import { Model } from "mongoose"
import { ObjectId } from "mongodb";
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
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
    async findUsers (filter: UserFilterType = userFilter): Promise<UserPaginatorType> {
        const skip = (filter.pageNumber - 1) * filter.pageSize
        const regexLogin = new RegExp(filter.searchLoginTerm, 'i')
        const regexEmail = new RegExp(filter.searchEmailTerm, 'i')
        const dbCount = await this.userModel.countDocuments({$or: [{login: RegExp(regexLogin)}, {email: RegExp(regexEmail)}]})
        const dbResult = await this.userModel.find({$or: [{login: RegExp(regexLogin)}, {email: RegExp(regexEmail)}]}).sort({[filter.sortBy]: (filter.sortDirection == 'asc' ? 1 : -1)}).skip(skip).limit(filter.pageSize).lean()
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
        if (ObjectId.isValid(id)) {
            const user = await this.userModel.findOne({_id: new ObjectId(id) }).lean();

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