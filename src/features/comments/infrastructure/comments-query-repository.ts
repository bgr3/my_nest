import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  CommentPaginatorType,
  CommentsFilter,
} from '../api/dto/middle/comments-middle-dto';
import {
  CommentDocument,
  CommentModelType,
  CommentForPost,
} from '../domain/comments-entity';
import { CommentOutput } from '../api/dto/output/comments-output-dto';

export const commentFilter = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentForPost.name) private CommentModel: CommentModelType,
  ) {}
  async findComments(
    postId: string | null = null,
    filter: CommentsFilter = commentFilter,
    userId: string = '',
  ): Promise<CommentPaginatorType> {
    const find: any = {};

    if (postId) {
      find.postId = postId;
    }

    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const dbCount = await this.CommentModel.countDocuments(find);
    const dbResult = await this.CommentModel.find(find)
      .sort({ [filter.sortBy]: filter.sortDirection == 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(filter.pageSize);

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: CommentDocument) => commentMapper(p, userId)),
    };

    return paginator;
  }

  async findCommentByID(
    id: string,
    userId: string = '',
  ): Promise<CommentOutput | null> {
    if (Types.ObjectId.isValid(id)) {
      const comment = await this.CommentModel.findOne({
        _id: new Types.ObjectId(id),
      });

      if (comment) {
        return commentMapper(comment, userId);
      }

      return comment;
    }

    return null;
  }
}

const commentMapper = (
  comment: CommentDocument,
  userId: string,
): CommentOutput => {
  const myStatusInfo = comment.likesInfo.find((i) => i.userId === userId);
  const myStatus = myStatusInfo ? myStatusInfo.likeStatus : 'None';

  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesInfo.filter((i) => i.likeStatus === 'Like').length,
      dislikesCount: comment.likesInfo.filter((i) => i.likeStatus === 'Dislike').length,
      myStatus: myStatus,
    },
  };
};
