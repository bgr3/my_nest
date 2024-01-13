import { Types } from "mongoose";
import { CommentOutput } from "../output/comments-output-dto";

export class CommentsCollection {
    constructor(
        public postId: string,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string
        },
        public createdAt: string,
        public likesInfo: {
            likes: string[],
            dislikes: string[]
        }){}
}

export class CommentDb extends CommentsCollection {
    constructor(
        public _id: Types.ObjectId,
        postId: string,
        content: string,
        commentatorInfo: {
            userId: string,
            userLogin: string
        },
        createdAt: string,
        likesInfo: {
            likes: string[],
            dislikes: string[]
        }){
            super(postId, content, commentatorInfo, createdAt, likesInfo)
        }
}

export class CommentsFilter {
    constructor(
        public pageNumber: number,
        public pageSize: number,
        public sortBy: string,
        public sortDirection: string,){}
}

export class CommentPaginatorType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentOutput[]){}
}

export class CommentLikeStatus {
    constructor(
        public likeStatus: string
    ){}
}