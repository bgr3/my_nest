import { Injectable } from '@nestjs/common';
import { CommentOutput } from '../../api/dto/output/comments-output-dto';
import { QueryFilter } from '../../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentForPostORM } from '../../domain/comments-orm-entity';

@Injectable()
export class CommentsORMQueryRepository {
  constructor(
    @InjectRepository(CommentForPostORM)
    private readonly commentsRepository: Repository<CommentForPostORM>,
  ) {}

  async findComments(
    postId: string | null,
    filter: QueryFilter,
    userId: string = '',
  ): Promise<Paginator<CommentOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';

    let dbResult;
    try {
      dbResult = await this.commentsRepository
        .createQueryBuilder('c')
        .select()
        .leftJoinAndSelect('c.likesInfo', 'l')
        .leftJoinAndSelect('c.commentatorInfo', 'i')
        .where(postId ? 'c.postId = :postId' : '', {
          postId: postId,
        })
        .orderBy(filter.sortBy, sortDirection)
        .skip(skip)
        .take(filter.pageSize)
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
      items: dbResult.map((c: CommentForPostORM) => {
        if (!c.likesInfo[0]) c.likesInfo.splice(0, 1);
        return commentMapper(c, userId);
      }),
    };

    return paginator;
  }

  async findCommentByID(
    id: string,
    userId: string = '',
  ): Promise<CommentOutput | null> {
    let comment;
    try {
      comment = await this.commentsRepository
        .createQueryBuilder('c')
        .select()
        .leftJoinAndSelect('c.likesInfo', 'l')
        .leftJoinAndSelect('c.commentatorInfo', 'i')
        .where('c.id = :id', {
          id: id,
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!comment) return null;

    return commentMapper(comment, userId);
  }
}

const commentMapper = (
  comment: CommentForPostORM,
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
    id: comment.id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
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
