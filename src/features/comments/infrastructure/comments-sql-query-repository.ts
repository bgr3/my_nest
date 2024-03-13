import { Injectable } from '@nestjs/common';
import { CommentOutput } from '../api/dto/output/comments-output-dto';
import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentsRawDb } from './dto/comments-repository-dto';
import { CommentLikesInfoSQL } from '../domain/comments-sql-entity';

@Injectable()
export class CommentsSQLQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findComments(
    postId: string | null = null,
    filter: QueryFilter,
    userId: string = '',
  ): Promise<Paginator<CommentOutput>> {
    const find: any = {};

    if (postId) {
      find.postId = postId;
    }

    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const preQuery = `
      SELECT count ("Id")
        FROM public."Comments"
    `;

    const preDbResult = await this.dataSource.query(preQuery);

    const dbCount = Number(preDbResult[0].count);

    const sortBy = filter.sortBy[0].toUpperCase() + filter.sortBy.slice(1);

    const query = `
    SELECT c.*
      FROM public."Comments" c
      ORDER BY "${sortBy}" ${filter.sortDirection}
      LIMIT $1 OFFSET $2;
    `;

    const dbResult: [CommentsRawDb] = await this.dataSource.query(query, [
      filter.pageSize,
      skip,
    ]);

    for (let i = 0; i < dbResult.length; i++) {
      const comment = dbResult[i];
      comment.likesInfo = [];
      const queryLikesInfo = `
      SELECT l.*
      FROM public."CommentsLikesInfo" l
      WHERE
        l."CommentId" = '${comment.Id}'
    `;

      let commentLikesInfoDb;

      try {
        commentLikesInfoDb = await this.dataSource.query(queryLikesInfo);
      } catch (err) {
        console.log(err);

        commentLikesInfoDb = {
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

      commentLikesInfoDb.forEach((likesinfo) =>
        comment.likesInfo.push(CommentLikesInfoSQL.likesInfoMapper(likesinfo)),
      );
    }

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: CommentsRawDb) => commentMapper(p, userId)),
    };

    return paginator;
  }

  async findCommentByID(
    id: string,
    userId: string = '',
  ): Promise<CommentOutput | null> {
    const query = `
      SELECT c.*
      FROM public."Comments" c
      WHERE
        c."Id" = $1;
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
    comment.likesInfo = [];

    const queryLikesInfo = `
      SELECT l.*
      FROM public."CommentsLikesInfo" l
      WHERE
        l."CommentId" = '${id}'
    `;

    let commentLikesInfoDb;

    try {
      commentLikesInfoDb = await this.dataSource.query(queryLikesInfo);
    } catch (err) {
      console.log(err);

      return null;
    }

    commentLikesInfoDb.forEach((i) =>
      comment.likesInfo.push(CommentLikesInfoSQL.likesInfoMapper(i)),
    );

    return commentMapper(commentDb[0], userId);
  }
}

const commentMapper = (
  comment: CommentsRawDb,
  userId: string,
): CommentOutput => {
  const myStatusInfo = comment.likesInfo.find((i) => i.userId === userId);
  const myStatus = myStatusInfo ? myStatusInfo.likeStatus : 'None';

  // const lastLikes = comment.likesInfo
  //   .filter((i) => i.likeStatus === 'Like')
  //   .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));

  const likesCount = comment.likesInfo.filter(
    (i) => i.likeStatus === 'Like',
  ).length;

  const dislikesCount = comment.likesInfo.filter(
    (i) => i.likeStatus === 'Dislike',
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
