import { PostOutput } from '../api/dto/output/post-output-type';
import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import {
  LikesInfoOutput,
  Paginator,
} from '../../../infrastructure/dto/output/output-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostLikesInfoRawDb, PostRawDb } from './dto/post-repository-dto';

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
    SELECT p.*, JSON_AGG(pl.*) as "LikesInfo"
      FROM public."Posts" p
      LEFT JOIN public."PostsLikesInfo" pl
      ON p."Id" = pl."PostId"
      WHERE "BlogId" like $1
      GROUP BY "Id"
      ORDER BY "${sortBy}" ${filter.sortDirection}
      LIMIT $2 OFFSET $3;
    `;

    const dbResult: [PostRawDb] = await this.dataSource.query(query, [
      blogId,
      filter.pageSize,
      skip,
    ]);

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: PostRawDb) => {
        if (!p.LikesInfo[0]) p.LikesInfo.splice(0, 1);
        return postMapper(p, userId);
      }),
    };

    return paginator;
  }

  async findPostByID(
    id: string,
    userId: string = '',
  ): Promise<PostOutput | null> {
    const query = `
      SELECT p.*, JSON_AGG(pl.*) as "LikesInfo"
      FROM public."Posts" p
      LEFT JOIN public."PostsLikesInfo" pl
      ON p."Id" = pl."PostId"
      WHERE p."Id" = $1
      GROUP BY "Id";
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

    if (!post.LikesInfo[0]) post.LikesInfo.splice(0, 1);

    return postMapper(post, userId);
  }
}

const postMapper = (post: PostRawDb, userId: string): PostOutput => {
  const myStatus = post.LikesInfo.find((i) => i.UserId === userId);

  const lastLikes = post.LikesInfo.filter((i) => i.LikeStatus === 'Like').sort(
    (a, b) => (a.AddedAt < b.AddedAt ? 1 : -1),
  );

  const likesCount = post.LikesInfo.filter(
    (i) => i.LikeStatus === 'Like',
  ).length;

  const dislikesCount = post.LikesInfo.filter(
    (i) => i.LikeStatus === 'Dislike',
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
      myStatus: myStatus ? myStatus.LikeStatus : 'None',
      newestLikes: lastLikes.slice(0, 3).map((i) => likesMapper(i)),
    },
  };
};

const likesMapper = (like: PostLikesInfoRawDb): LikesInfoOutput => {
  return {
    userId: like.UserId,
    login: like.Login,
    addedAt: like.AddedAt,
  };
};
