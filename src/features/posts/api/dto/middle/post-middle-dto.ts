import { Types } from "mongoose";
import { PostOutput } from "../output/post-output-type";

export class PostDb {
    constructor(
        public _id: Types.ObjectId,
        public title:	string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public  blogName: string | null,
        public createdAt: string,
        public likesInfo: LikesInfo[]){}
}

export class PostFilterType {
    constructor(
        public pageNumber: number,
        public pageSize: number,
        public sortBy: string,
        public sortDirection: string){}
}

export class PostPaginatorType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostOutput[]){}
}

export class LikesInfo {
    constructor(
        public userId: string,
        public login: string,
        public addedAt: string,
        public likeStatus: string
    ){}
}