import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostLikesInfoSQL, PostSQL } from '../domain/posts-sql-entity';
import { PostRawDb } from './dto/post-repository-dto';

export class PostsSQLRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async testAllData(): Promise<void> {
    const query = `
      TRUNCATE public."Posts" CASCADE;
    `;
    await this.dataSource.query(query);
  }

  async save(post: PostSQL): Promise<string | null> {
    if (post.newPost) {
      const postQuery = `
        INSERT INTO public."Posts"(
          "Title", "ShortDescription", "Content", "BlogId", "BlogName", "CreatedAt")
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING "Id";
      `;

      let postIdDb;

      try {
        postIdDb = await this.dataSource.query(postQuery, [
          post.title,
          post.shortDescription,
          post.content,
          post.blogId,
          post.blogName,
          post.createdAt,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }

      const postId = postIdDb[0].Id;

      return postId;
    }

    const postQuery = `
      UPDATE public."Posts"
        SET  "Title"= $1, "ShortDescription"= $2, "Content"= $3, "BlogId"= $4, "BlogName"= $5, "CreatedAt"= $6
        WHERE "Id" = $7;
    `;

    try {
      await this.dataSource.query(postQuery, [
        post.title,
        post.shortDescription,
        post.content,
        post.blogId,
        post.blogName,
        post.createdAt,
        post.id,
      ]);
    } catch (err) {
      console.log(err);

      return null;
    }

    const likesInfoDeleteQuery = `
      DELETE FROM public."PostsLikesInfo"
        WHERE "PostId" = $1;
    `;

    try {
      await this.dataSource.query(likesInfoDeleteQuery, [post.id]);
    } catch (err) {
      console.log(err);

      return null;
    }

    let likesInfoUpdateQuery = `
    INSERT INTO public."PostsLikesInfo"(
      "UserId", "Login", "AddedAt", "LikeStatus", "PostId")
        VALUES 
    `;
    post.likesInfo.map(async (i) => {
      likesInfoUpdateQuery += `('${i.userId}','${i.login}','${i.addedAt}','${i.likeStatus}','${post.id}'),`;
    });

    likesInfoUpdateQuery = likesInfoUpdateQuery.slice(0, -1);
    likesInfoUpdateQuery += `;`;

    try {
      await this.dataSource.query(likesInfoUpdateQuery);
    } catch (err) {
      console.log(err);

      return null;
    }

    return null;
  }

  async getPostById(id: string): Promise<PostSQL | null> {
    const query = `
      SELECT p.*, JSON_AGG(pl.*) as "LikesInfo"
      FROM public."Posts" p
      LEFT JOIN public."PostsLikesInfo" pl
      ON p."Id" = pl."PostId"
      WHERE
        p."Id" = '${id}'
      GROUP BY "Id";
    `;

    let postDbArr;

    try {
      postDbArr = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!postDbArr[0]) return null;
    const postDb: PostRawDb = postDbArr[0];
    if (!postDb.LikesInfo[0]) postDb.LikesInfo.splice(0, 1);

    const post = PostSQL.createSmartPost(postDb);

    return post;
  }

  async deletePost(id: string): Promise<boolean> {
    const query = `
    DELETE FROM public."Posts" CASCADE
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
