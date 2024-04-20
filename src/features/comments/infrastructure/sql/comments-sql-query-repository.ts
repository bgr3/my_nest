import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { QueryFilter } from '../../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { CommentOutput } from '../../api/dto/output/comments-output-dto';
import { CommentsRawDb } from '../dto/comments-repository-dto';

@Injectable()
export class CommentsSQLQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findComments(
    postId: string | null,
    filter: QueryFilter,
    userId: string = '',
  ): Promise<Paginator<CommentOutput>> {
    if (!postId) {
      postId = '%%';
    }

    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const preQuery = `
      SELECT count ("Id")
        FROM public."Comments"
        WHERE "PostId" like $1;
    `;

    const preDbResult = await this.dataSource.query(preQuery, [postId]);

    const dbCount = Number(preDbResult[0].count);

    const sortBy = filter.sortBy[0].toUpperCase() + filter.sortBy.slice(1);

    const query = `
    SELECT c.*, JSON_AGG(cl.*) as "LikesInfo"
      FROM public."Comments" c
      LEFT JOIN public."CommentsLikesInfo" cl
      ON c."Id" = cl."CommentId"
      WHERE "PostId" like $1
      GROUP BY "Id"
      ORDER BY "${sortBy}" ${filter.sortDirection}
      LIMIT $2 OFFSET $3;
    `;

    const dbResult: [CommentsRawDb] = await this.dataSource.query(query, [
      postId,
      filter.pageSize,
      skip,
    ]);

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((c: CommentsRawDb) => {
        if (!c.LikesInfo[0]) c.LikesInfo.splice(0, 1);
        return commentMapper(c, userId);
      }),
    };

    return paginator;
  }

  async findCommentByID(
    id: string,
    userId: string = '',
  ): Promise<CommentOutput | null> {
    const query = `
      SELECT c.*, JSON_AGG(cl.*) as "LikesInfo"
      FROM public."Comments" c
      LEFT JOIN public."CommentsLikesInfo" cl
      ON c."Id" = cl."CommentId"
      WHERE
        c."Id" = $1
        GROUP BY "Id";
    `;

    let commentDb;
    try {
      commentDb = await this.dataSource.query(query, [id]);
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!commentDb[0]) return null;

    const comment: CommentsRawDb = commentDb[0];

    if (!comment.LikesInfo[0]) comment.LikesInfo.splice(0, 1);

    return commentMapper(comment, userId);
  }
}

const commentMapper = (
  comment: CommentsRawDb,
  userId: string,
): CommentOutput => {
  const myStatusInfo = comment.LikesInfo.find((i) => i.UserId === userId);
  const myStatus = myStatusInfo ? myStatusInfo.LikeStatus : 'None';

  // const lastLikes = comment.likesInfo
  //   .filter((i) => i.likeStatus === 'Like')
  //   .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));

  const likesCount = comment.LikesInfo.filter(
    (i) => i.LikeStatus === 'Like',
  ).length;

  const dislikesCount = comment.LikesInfo.filter(
    (i) => i.LikeStatus === 'Dislike',
  ).length;

  return {
    id: comment.Id.toString(),
    content: comment.Content,
    commentatorInfo: {
      userId: comment.UserId,
      userLogin: comment.UserLogin,
    },
    createdAt: comment.CreatedAt,
    likesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    },
  };
};

// const likesMapper = (like: LikesInfo): LikesInfoOutput => {
//   return {
//     userId: like.userId,
//     login: like.login,
//     addedAt: like.addedAt,
//   };
// };
