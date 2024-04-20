import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { BlogQueryFilter } from '../../api/dto/input/blogs-input-dto';
import { BlogOutput } from '../../api/dto/output/blog-output-dto';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blogs-entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async findBlogs(filter: BlogQueryFilter): Promise<Paginator<BlogOutput>> {
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
