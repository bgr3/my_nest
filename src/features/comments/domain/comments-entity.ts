import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

export type CommentDocument = HydratedDocument<CommentForPost>;

export type CommentModelType = Model<CommentDocument> & typeof statics;

@Schema()
class CommentatorInfo {
    @Prop({required: true})
    userId: string;
    
    @Prop({required: true})
    userLogin: string;
}

const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo)

@Schema()
class LikesInfo {
    @Prop({default: []})
    likes: [string];

    @Prop({default: []})
    dislikes: [string];
}

const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo)

@Schema()
export class CommentForPost {
    @Prop({required: true})
    content: string;

    @Prop({required: true})
    commentatorInfo: CommentatorInfo;

    @Prop({required: true})
    createdAt: string;

    @Prop({required: true})
    likesInfo: LikesInfo;

    @Prop({required: true})
    postId: string

    updateComment(content: string){
        this.content = content;
    }

    static createComment(content: string,  postId: string, userId: string, userLogin: string) {
        const comment = new this();

        comment.content = content;
        comment.commentatorInfo.userId = userId;
        comment.commentatorInfo.userLogin = userLogin;
        comment.createdAt = new Date().toISOString();
        comment.postId = postId;

        return comment
    }
}

export const CommentSchema = SchemaFactory.createForClass(CommentForPost)

CommentSchema.methods = {
    updateUser: CommentForPost.prototype.updateComment,
}

const statics = {
    createComment: CommentForPost.createComment,
}

CommentSchema.statics = statics;