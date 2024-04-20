import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { Types } from 'mongoose';
import { DataSource } from 'typeorm';

import { Blog, BlogDocument, BlogModelType } from '../../domain/blogs-entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async testAllData(): Promise<void> {
    await this.BlogModel.deleteMany({});
    //console.log('blogs delete: ', result.deletedCount)
  }

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
  }

  async getBlogById(id: string): Promise<BlogDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      const blog = await this.BlogModel.findOne({
        _id: new Types.ObjectId(id),
      });
      return blog;
    }

    return null;
  }

  async getAllBlogs(): Promise<BlogDocument[] | []> {
    const blogs = await this.BlogModel.find();
    return blogs;
  }

  // async createBlog (newBlog: BlogType): Promise<string | null> {
  //     const result = await this.blogModel.insertMany([newBlog]);
  //     //console.log(result.insertedId)
  //     if (result[0]._id) {
  //         return result[0]._id.toString()
  //     } else {
  //         return null
  //     }
  // }

  // async updateBlog (id: string, updateBlog: BlogPutType): Promise<Boolean> {
  //     if (ObjectId.isValid(id)) {
  //         const result = await this.blogModel.updateOne({_id: new ObjectId(id)}, { $set: updateBlog});

  //         if (result.matchedCount) {
  //             return true
  //         }
  //     }

  //     return false
  // }

  async deleteBlog(id: string): Promise<boolean> {
    if (Types.ObjectId.isValid(id)) {
      const result = await this.BlogModel.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (result.deletedCount) {
        return true;
      }
    }
    return false;
  }
}
