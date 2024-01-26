import { Injectable } from '@nestjs/common';
import {
  BlogFilter,
  BlogPaginatorType,
} from '../api/dto/middle/blogs-middle-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blogs-entity';
import { Types } from 'mongoose';
import { BlogOutput } from '../api/dto/output/blog-output-dto';

export const blogFilter = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  searchNameTerm: '',
};

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async findBlogs(filter: BlogFilter = blogFilter): Promise<BlogPaginatorType> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const regex = new RegExp(filter.searchNameTerm, 'i');
    const dbCount = await this.BlogModel.countDocuments({
      name: RegExp(regex),
    });
    const dbResult = await this.BlogModel.find({ name: RegExp(regex) })
      .sort({ [filter.sortBy]: filter.sortDirection == 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(filter.pageSize);
    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: BlogDocument) => blogMapper(p)),
    };

    return paginator;
  }

  async findBlogByID(id: string): Promise<BlogOutput | null> {
    if (Types.ObjectId.isValid(id)) {
      const blog = await this.BlogModel.findOne({
        _id: new Types.ObjectId(id),
      });

      if (blog) {
        return blogMapper(blog);
      }
      return blog;
    }

    return null;
  }
}

const blogMapper = (blog: BlogDocument): BlogOutput => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
