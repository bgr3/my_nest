import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogPostType, BlogPutType } from '../api/dto/input/blogs-input-dto';

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & typeof statics;

@Schema()
export class Blog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  isMembership: boolean;

  updateBlog(inputModel: BlogPutType) {
    this.name = inputModel.name;
    this.description = inputModel.description;
    this.websiteUrl = inputModel.websiteUrl;
  }

  static createBlog(inputModel: BlogPostType) {
    const blog = new this();

    blog.name = inputModel.name;
    blog.description = inputModel.description;
    blog.websiteUrl = inputModel.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;

    return blog;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
};

const statics = {
  createBlog: Blog.createBlog,
};

BlogSchema.statics = statics;
