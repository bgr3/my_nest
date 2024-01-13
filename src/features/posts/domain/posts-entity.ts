import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Model } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof statics;

@Schema()
class LikesInfo {
    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    login: string;

    @Prop({required: true})
    addedAt: string;

    @Prop({required: true})
    likeStatus: string;

}

const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo)

@Schema()
export class Post {
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    shortDescription: string;

    @Prop({required: true})
    content: string;

    @Prop({required: true})
    blogId: string;

    @Prop({required: true})
    blogName: string;

    @Prop({required: true})
    createdAt: string;

    @Prop({default: [], type: LikesInfoSchema})
    likesInfo: [LikesInfo];

    updatePost(title: string, shortDescription: string, content: string, blogId: string, blogName: string){
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
    }

    static createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string): Post {
        const post = new this();

        post.title = title;
        post.shortDescription = shortDescription;
        post.content = content;
        post.blogId = blogId; 
        post.blogName = blogName;
        post.createdAt = new Date().toISOString();

        return post
    }
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.methods = {
    updatePost: Post.prototype.updatePost,
}

const statics = {
    createPost: Post.createPost,
}

PostSchema.statics = statics;



