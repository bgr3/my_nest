import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { BlogQueryFilter } from '../../api/dto/input/blogs-input-dto';
import { BlogOutput, BlogSAOutput } from '../../api/dto/output/blog-output-dto';
import { BlogORM } from '../../domain/blogs-orm-entity';

export class BlogsORMQueryRepository {
  constructor(
    @InjectRepository(BlogORM)
    private readonly blogsRepository: Repository<BlogORM>,
  ) {}

  async findBlogs(
    filter: BlogQueryFilter,
    userId: string = '',
    superAdmin: boolean = false,
  ): Promise<Paginator<BlogOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const searcFilter =
      'b.name ilike :name' + (userId ? ' AND o.id = :userId' : '');

    const dbResult = await this.blogsRepository
      .createQueryBuilder('b')
      .select()
      .leftJoinAndSelect('b.blogOwnerInfo', 'o')
      .where(searcFilter, {
        name: `%${filter.searchNameTerm}%`,
        userId: userId,
      })
      .orderBy(
        `b.${filter.sortBy}`,
        filter.sortDirection == 'asc' ? 'ASC' : 'DESC',
      )
      .offset(skip)
      .limit(filter.pageSize)
      .getManyAndCount();

    const dbCount = dbResult[1];

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult[0].map((b: BlogORM) =>
        superAdmin ? blogSuperAdminMapper(b) : blogMapper(b),
      ),
    };

    return paginator;
  }

  async findBlogByID(id: string): Promise<BlogOutput | null> {
    let blog;
    try {
      blog = await this.blogsRepository.findOne({
        where: { id: id },
      });
    } catch (err) {
      console.log(err);
      return null;
    }

    if (blog) {
      return blogMapper(blog);
    }
    return null;
  }
}

const blogMapper = (blog: BlogORM): BlogOutput => {
  return {
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};

const blogSuperAdminMapper = (blog: BlogORM): BlogSAOutput => {
  return {
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
    blogOwnerInfo: {
      userId: blog.blogOwnerInfo.id,
      userLogin: blog.blogOwnerInfo.login,
    },
  };
};
