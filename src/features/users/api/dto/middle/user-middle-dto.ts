import { ObjectId } from "mongoose";
import { Tokens } from "src/features/auth/api/dto/middle/auth-middle-dto";
import { UserOutput } from "../output/user-output-dto";

// export class UserType {
//     constructor(
//         public login: string,
//         public email: string,
//         public password: string,
//         public createdAt: string,
//         public emailConfirmation : {
//             confirmationCode: string,
//             expirationDate: object,
//             isConfirmed: boolean,
//             nextSend: object
//         },
//         public JWTTokens: Tokens[]){}
// }

export class UserDb{
    constructor(
        public _id: ObjectId, 
        public login: string,
        public email: string,
        public password: string,
        public createdAt: string,
        public emailConfirmation : {
            confirmationCode: string,
            expirationDate: object,
            isConfirmed: boolean,
            nextSend: object
        },
        public JWTTokens: Tokens[]){}
}

export class UserFilterType {
    constructor(public pageNumber: number,
                public pageSize: number,
                public sortBy: string,
                public sortDirection: string,
                public searchLoginTerm: string,
                public searchEmailTerm: string){}
}

export class UserPaginatorType {
    constructor(public pagesCount: number,
                public page: number,
                public pageSize: number,
                public totalCount: number,
                public items: UserOutput[]){}
}