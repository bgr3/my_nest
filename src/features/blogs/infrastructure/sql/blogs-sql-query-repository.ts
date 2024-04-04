import { BlogOutput } from '../../api/dto/output/blog-output-dto';
import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { BlogQueryFilter } from '../../api/dto/input/blogs-input-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogRawDb } from '../dto/blog-repository-dto';

export class BlogsSQLQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findBlogs(filter: BlogQueryFilter): Promise<Paginator<BlogOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const preQuery = `
      SELECT count ("Id")
        FROM public."Blogs" b
        WHERE
        b."Name" ILIKE $1;
    `;

    const preDbResult = await this.dataSource.query(preQuery, [
      `%${filter.searchNameTerm}%`,
    ]);

    const dbCount = Number(preDbResult[0].count);

    const sortBy = filter.sortBy[0].toUpperCase() + filter.sortBy.slice(1);

    const query = `
    SELECT b.*
      FROM public."Blogs" b
      WHERE
        b."Name" ILIKE $1
      ORDER BY "${sortBy}" ${filter.sortDirection}
      LIMIT $2 OFFSET $3;
    `;

    const dbResult = await this.dataSource.query(query, [
      `%${filter.searchNameTerm}%`,
      //filter.sortBy[0].toUpperCase() + filter.sortBy.slice(1),
      filter.pageSize,
      skip,
    ]);

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: BlogRawDb) => blogMapper(p)),
    };

    return paginator;
  }

  async findBlogByID(id: string): Promise<BlogOutput | null> {
    const query = `
      SELECT b.*
      FROM public."Blogs" b
      WHERE
        b."Id" = $1;
    `;

    let blogsDb;
    try {
      blogsDb = await this.dataSource.query(query, [id]);
    } catch (err) {
      console.log(err);
      return null;
    }

    if (blogsDb[0]) {
      return blogMapper(blogsDb[0]);
    }
    return null;
  }
}

const blogMapper = (blog: BlogRawDb): BlogOutput => {
  return {
    id: blog.Id.toString(),
    name: blog.Name,
    description: blog.Description,
    websiteUrl: blog.WebsiteUrl,
    createdAt: blog.CreatedAt,
    isMembership: blog.IsMembership,
  };
};
