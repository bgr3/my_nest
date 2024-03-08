import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogSQL } from '../domain/blogs-sql-entity';

export class BlogsSQLRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async testAllData(): Promise<void> {
    const query = `
    TRUNCATE public."Blogs";
    `;
    await this.dataSource.query(query);
  }

  async save(blog: BlogSQL): Promise<string | null> {
    if (blog.newBlog) {
      const blogQuery = `
        INSERT INTO public."Blogs"(
          "Name", "Description", "WebsiteUrl", "CreatedAt", "IsMembership")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING "Id";
      `;

      let blogIdDb;

      try {
        blogIdDb = await this.dataSource.query(blogQuery, [
          blog.name,
          blog.description,
          blog.websiteUrl,
          blog.createdAt,
          blog.isMembership,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }

      const blogId = blogIdDb[0].Id;

      return blogId;
    }

    const blogQuery = `
      UPDATE public."Blogs"
        SET "Name"= $1, "Description"= $2, "WebsiteUrl"= $3, "CreatedAt"= $4, "IsMembership"= $5
        WHERE "Id" = $6;
    `;

    try {
      await this.dataSource.query(blogQuery, [
        blog.name,
        blog.description,
        blog.websiteUrl,
        blog.createdAt,
        blog.isMembership,
        blog.id,
      ]);
    } catch (err) {
      console.log(err);

      return null;
    }

    return null;
  }

  async getBlogById(id: string): Promise<BlogSQL | null> {
    const query = `
    SELECT b.*
    FROM public."Blogs" b
    WHERE
      b."Id" = '${id}'
    `;

    let blogDb;

    try {
      blogDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!blogDb[0]) return null;

    const blog = BlogSQL.createSmartBlog(blogDb[0]);

    return blog;
  }

  async getAllBlogs(): Promise<BlogSQL[] | []> {
    const query = `
    SELECT b.*
    FROM public."Blogs" b
    `;

    let blogDbArr;

    try {
      blogDbArr = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return [];
    }

    const blogs = blogDbArr.map((i) => BlogSQL.createSmartBlog(i));

    return blogs;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const query = `
    DELETE FROM public."Blogs"
	    WHERE "Id" = $1;
    `;

    let result;

    try {
      result = await this.dataSource.query(query, [id]);
    } catch (err) {
      return false;
    }

    if (result[1] === 0) return false;

    return true;
  }
}
