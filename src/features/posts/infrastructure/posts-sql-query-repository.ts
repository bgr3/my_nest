import { PostOutput } from '../api/dto/output/post-output-type';
import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import {
  LikesInfo,
  LikesInfoOutput,
  Paginator,
} from '../../../infrastructure/dto/output/output-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostRawDb } from './dto/post-repository-dto';
import { PostLikesInfoSQL } from '../domain/posts-sql-entity';

export class PostsSQLQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findPosts(
    blogId: string | null,
    filter: QueryFilter,
    userId: string = '',
  ): Promise<Paginator<PostOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    if (!blogId) {
      blogId = '%%';
    }

    const preQuery = `
      SELECT count ("Id")
        FROM public."Posts"
        WHERE "BlogId" like $1;
    `;

    const preDbResult = await this.dataSource.query(preQuery, [blogId]);

    const dbCount = Number(preDbResult[0].count);

    const sortBy = filter.sortBy[0].toUpperCase() + filter.sortBy.slice(1);

    const query = `
    SELECT p.*
      FROM public."Posts" p
      WHERE "BlogId" like $1
      ORDER BY "${sortBy}" ${filter.sortDirection}
      LIMIT $2 OFFSET $3;
    `;

    const dbResult: [PostRawDb] = await this.dataSource.query(query, [
      blogId,
      filter.pageSize,
      skip,
    ]);

    for (let i = 0; i < dbResult.length; i++) {
      const post = dbResult[i];
      post.likesInfo = [];
      const queryLikesInfo = `
      SELECT l.*
      FROM public."PostsLikesInfo" l
      WHERE
        l."PostId" = '${post.Id}'
    `;

      let postLikesInfoDb;

      try {
        postLikesInfoDb = await this.dataSource.query(queryLikesInfo);
      } catch (err) {
        console.log(err);

        postLikesInfoDb = {
          Id: '',
          Title: '',
          ShortDescription: '',
          Content: '',
          BlogId: '',
          BlogName: '',
          CreatedAt: '',
          likesInfo: [],
        };
      }

      postLikesInfoDb.forEach((likesinfo) =>
        post.likesInfo.push(PostLikesInfoSQL.likesInfoMapper(likesinfo)),
      );
    }

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: PostRawDb) => postMapper(p, userId)),
    };

    return paginator;
  }

  async findPostByID(
    id: string,
    userId: string = '',
  ): Promise<PostOutput | null> {
    const query = `
      SELECT p.*
      FROM public."Posts" p
      WHERE
        p."Id" = $1;
    `;

    let postsDb;
    try {
      postsDb = await this.dataSource.query(query, [id]);
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!postsDb[0]) return null;

    const post: PostRawDb = postsDb[0];
    post.likesInfo = [];

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

    return postMapper(postsDb[0], userId);
  }
}

const postMapper = (post: PostRawDb, userId: string): PostOutput => {
  const myStatus = post.likesInfo.find((i) => i.userId === userId);

  const lastLikes = post.likesInfo
    .filter((i) => i.likeStatus === 'Like')
    .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));

  const likesCount = post.likesInfo.filter(
    (i) => i.likeStatus === 'Like',
  ).length;

  const dislikesCount = post.likesInfo.filter(
    (i) => i.likeStatus === 'Dislike',
  ).length;

  return {
    id: post.Id.toString(),
    title: post.Title,
    shortDescription: post.ShortDescription,
    content: post.Content,
    blogId: post.BlogId,
    blogName: post.BlogName,
    createdAt: post.CreatedAt,
    extendedLikesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus ? myStatus.likeStatus : 'None',
      newestLikes: lastLikes.slice(0, 3).map((i) => likesMapper(i)),
    },
  };
};

const likesMapper = (like: LikesInfo): LikesInfoOutput => {
  return {
    userId: like.userId,
    login: like.login,
    addedAt: like.addedAt,
  };
};
