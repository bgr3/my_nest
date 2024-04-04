import { BlogOutput } from '../../api/dto/output/blog-output-dto';
import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { BlogQueryFilter } from '../../api/dto/input/blogs-input-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogORM } from '../../domain/blogs-orm-entity';

export class BlogsORMQueryRepository {
  constructor(
    @InjectRepository(BlogORM)
    private readonly blogsRepository: Repository<BlogORM>,
  ) {}

  async findBlogs(filter: BlogQueryFilter): Promise<Paginator<BlogOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const dbResult = await this.blogsRepository
      .createQueryBuilder('b')
      .select()
      .where('b.name ilike :name', {
        name: `%${filter.searchNameTerm}%`,
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
      items: dbResult[0].map((p: BlogORM) => blogMapper(p)),
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
