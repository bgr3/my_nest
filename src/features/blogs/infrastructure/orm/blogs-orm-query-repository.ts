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
    isPublic: boolean = true,
  ): Promise<Paginator<BlogOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    let queryBuilder;
    let dbResult;
    try {
      queryBuilder = await this.blogsRepository
        .createQueryBuilder('b')
        .select()
        .leftJoinAndSelect('b.blogOwnerInfo', 'o')
        .leftJoinAndSelect('b.banInfo', 'blogBan')
        .where('b.name ilike :name', {
          name: `%${filter.searchNameTerm}%`,
        });

      if (userId) {
        queryBuilder.andWhere('o.id = :userId', { userId: userId });
      }

      if (isPublic) {
        queryBuilder.andWhere('blogBan.isBanned = false');
      }

      dbResult = await queryBuilder
        .orderBy(
          `b.${filter.sortBy}`,
          filter.sortDirection == 'asc' ? 'ASC' : 'DESC',
        )
        .offset(skip)
        .limit(filter.pageSize)
        .getManyAndCount();
    } catch (err) {
      console.log(err);
      dbResult = [[], 0];
    }

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

  async findBlogByID(
    id: string,
    isPublic: boolean = true,
  ): Promise<BlogOutput | null> {
    let blog;
    let queryBuilder;
    try {
      queryBuilder = await this.blogsRepository
        .createQueryBuilder('b')
        .select()
        .leftJoinAndSelect('b.blogOwnerInfo', 'o')
        .leftJoinAndSelect('b.banInfo', 'blogBan')
        .where('b.id = :id', { id: id });

      if (isPublic) {
        queryBuilder.andWhere('blogBan.isBanned = false');
      }

      blog = await queryBuilder.getOne();
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
    banInfo: {
      banDate: blog.banInfo.banDate
        ? blog.banInfo.banDate?.toISOString()
        : null,
      isBanned: blog.banInfo.isBanned,
    },
  };
};
