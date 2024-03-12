import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostLikesInfoSQL, PostSQL } from '../domain/posts-sql-entity';

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

    post.likesInfo.map(async (i) => {
      const likesInfoUpdateQuery = `
        INSERT INTO public."PostsLikesInfo"(
          "UserId", "Login", "AddedAt", "LikeStatus", "PostId")
          VALUES ($1, $2, $3, $4, $5);
      `;

      try {
        await this.dataSource.query(likesInfoUpdateQuery, [
          i.userId,
          i.login,
          i.addedAt,
          i.likeStatus,
          post.id,
        ]);
      } catch (err) {
        console.log(err);

        return null;
      }
    });

    return null;
  }

  async getPostById(id: string): Promise<PostSQL | null> {
    const query = `
      SELECT p.*
      FROM public."Posts" p
      WHERE
        p."Id" = '${id}'
    `;

    let postDb;

    try {
      postDb = await this.dataSource.query(query);
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!postDb[0]) return null;

    const post = PostSQL.createSmartPost(postDb[0]);

    const queryLikesInfo = `
      SELECT l.*
      FROM public."PostsLikesInfo" l
      WHERE
        l."PostId" = '${id}'
    `;

    let postLikesInfoDb;

    try {
      postLikesInfoDb = await this.dataSource.query(queryLikesInfo);
    } catch (err) {
      console.log(err);

      return null;
    }

    postLikesInfoDb.forEach((i) =>
      post.likesInfo.push(PostLikesInfoSQL.likesInfoMapper(i)),
    );

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
