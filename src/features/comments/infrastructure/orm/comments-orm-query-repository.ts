import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryFilter } from '../../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../../infrastructure/dto/output/output-dto';
import {
  BloggerAllCommentsOutput,
  CommentOutput,
} from '../../api/dto/output/comments-output-dto';
import { CommentLikesInfoORM } from '../../domain/comments-likes-info-orm-entity';
import { CommentForPostORM } from '../../domain/comments-orm-entity';

@Injectable()
export class CommentsORMQueryRepository {
  constructor(
    @InjectRepository(CommentForPostORM)
    private readonly commentsRepository: Repository<CommentForPostORM>,
    @InjectRepository(CommentLikesInfoORM)
    private readonly commentsLikesInfoRepository: Repository<CommentLikesInfoORM>,
  ) {}

  async findComments(
    postId: string | null,
    filter: QueryFilter,
    userId: string = '',
  ): Promise<Paginator<CommentOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';
    const sortBy = `c.${filter.sortBy}`;

    let subQuery;

    try {
      subQuery = await this.commentsLikesInfoRepository
        .createQueryBuilder('likes')
        .select('likes.id', 'id')
        .leftJoin('likes.owner', 'likeOwner')
        .leftJoin('likeOwner.banInfo', 'likeOwnerBan')
        .where('likeOwnerBan.isBanned = false')
        .getRawMany();
    } catch (err) {
      console.log(err);
      subQuery = [];
    }

    subQuery = subQuery.map((i) => "'" + i.id + "'");

    let dbResult;
    try {
      dbResult = await this.commentsRepository
        .createQueryBuilder('c')
        .select()
        .leftJoinAndSelect(
          'c.likesInfo',
          'likes',
          subQuery.length > 0 ? `likes.id IN (${subQuery})` : 'true = false',
        )
        .leftJoinAndSelect('likes.owner', 'likeOwner')
        .leftJoinAndSelect('likeOwner.banInfo', 'likeOwnerBan')
        .leftJoinAndSelect('c.commentatorInfo', 'commentator')
        .leftJoinAndSelect('commentator.banInfo', 'ban')
        .where(
          `ban.isBanned = false ${postId ? 'AND c.postId = :postId' : ''}`, // AND likeOwnerBan.isBanned = false
          {
            postId: postId,
          },
        )
        .orderBy(sortBy, sortDirection)
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
      items: dbResult[0].map((c: CommentForPostORM) =>
        commentMapper(c, userId),
      ),
    };

    return paginator;
  }

  async findAllCommentsForBlogger(
    filter: QueryFilter,
    userId: string,
  ): Promise<Paginator<BloggerAllCommentsOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';
    const sortBy = `c.${filter.sortBy}`;

    let subQuery;

    try {
      subQuery = await this.commentsLikesInfoRepository
        .createQueryBuilder('likes')
        .select('likes.id', 'id')
        .leftJoin('likes.owner', 'likeOwner')
        .leftJoin('likeOwner.banInfo', 'likeOwnerBan')
        .where('likeOwnerBan.isBanned = false')
        .getRawMany();
    } catch (err) {
      console.log(err);
      subQuery = [];
    }

    subQuery = subQuery.map((i) => "'" + i.id + "'");

    let dbResult;
    try {
      dbResult = await this.commentsRepository
        .createQueryBuilder('c')
        .select()
        .leftJoinAndSelect(
          'c.likesInfo',
          'likes',
          subQuery.length > 0 ? `likes.id IN (${subQuery})` : 'true = false',
        )
        .leftJoinAndSelect('likes.owner', 'likeOwner')
        .leftJoinAndSelect('likeOwner.banInfo', 'likeOwnerBan')
        .leftJoinAndSelect('c.commentatorInfo', 'commentator')
        .leftJoinAndSelect('commentator.banInfo', 'ban')
        .leftJoinAndSelect('c.post', 'post')
        .leftJoinAndSelect('post.blog', 'blog')
        .leftJoinAndSelect('blog.blogOwnerInfo', 'blogOwner')
        .where(`ban.isBanned = false`)
        .andWhere('blogOwner.id = :userId', { userId: userId })
        .orderBy(sortBy, sortDirection)
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
      items: dbResult[0].map((c: CommentForPostORM) =>
        commentBloggerMapper(c, ''),
      ),
    };

    return paginator;
  }

  async findCommentByID(
    id: string,
    userId: string = '',
  ): Promise<CommentOutput | null> {
    let subQuery;

    try {
      subQuery = await this.commentsLikesInfoRepository
        .createQueryBuilder('likes')
        .select('likes.id', 'id')
        .leftJoin('likes.owner', 'likeOwner')
        .leftJoin('likeOwner.banInfo', 'likeOwnerBan')
        .where('likeOwnerBan.isBanned = false')
        .getRawMany();
    } catch (err) {
      console.log(err);
      subQuery = [];
    }

    subQuery = subQuery.map((i) => "'" + i.id + "'");

    let comment: CommentForPostORM | null;
    try {
      comment = await this.commentsRepository
        .createQueryBuilder('c')
        .select()
        .leftJoinAndSelect(
          'c.likesInfo',
          'likes',
          subQuery.length > 0 ? `likes.id IN (${subQuery})` : 'true = false',
        )
        .leftJoinAndSelect('likes.owner', 'likeOwner')
        .leftJoinAndSelect('likeOwner.banInfo', 'likeOwnerBan')
        .leftJoinAndSelect('c.commentatorInfo', 'commentator')
        .leftJoinAndSelect('commentator.banInfo', 'ban')
        .where('ban.isBanned = false AND c.id = :id', {
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
  const myStatusInfo = comment.likesInfo.find((i) => i.owner.id === userId);
  const myStatus = myStatusInfo ? myStatusInfo.likeStatus : 'None';

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
      userId: comment.commentatorInfo.id,
      userLogin: comment.commentatorInfo.login,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    },
  };
};

const commentBloggerMapper = (
  comment: CommentForPostORM,
  userId: string,
): BloggerAllCommentsOutput => {
  const myStatusInfo = comment.likesInfo.find((i) => i.owner.id === userId);
  const myStatus = myStatusInfo ? myStatusInfo.likeStatus : 'None';

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
      userId: comment.commentatorInfo.id,
      userLogin: comment.commentatorInfo.login,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    },
    postInfo: {
      id: comment.post.id,
      title: comment.post.title,
      blogId: comment.post.blog.id,
      blogName: comment.post.blog.name,
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
