import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & typeof statics;


@Schema()
export class Blog {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    websiteUrl: string;

    @Prop({required: true})
    createdAt: string;

    @Prop({required: true})
    isMembership: boolean;

    updateBlog(name: string, description: string, websiteUrl: string){
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }

    static createBlog(name: string, description: string, websiteUrl: string) {
        const blog = new this();

        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;
        blog.createdAt = new Date().toISOString();
        blog.isMembership = false;

        return blog
    }
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

BlogSchema.methods = {
    updateBlog: Blog.prototype.updateBlog,
}

const statics = {
    createBlog: Blog.createBlog,
}

BlogSchema.statics = statics;