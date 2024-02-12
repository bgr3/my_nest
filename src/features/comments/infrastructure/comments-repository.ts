import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  CommentForPost,
  CommentDocument,
  CommentModelType,
} from '../domain/comments-entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentForPost.name) private CommentModel: CommentModelType,
  ) {}
  async testAllData(): Promise<void> {
    const result = await this.CommentModel.deleteMany({});
    //console.log('comments delete: ', result.deletedCount)
  }

  async save(comment: CommentDocument): Promise<void> {
    await comment.save();
  }

  async getCommentById(id: string): Promise<CommentDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      const comment = await this.CommentModel.findOne({
        _id: new Types.ObjectId(id),
      });
      return comment;
    }

    return null;
  }

  // async createComment (newComment: CommentsCollection): Promise<string | null> {
  //     const result = await this.CommentModel.insertMany([newComment]);

  //     if (result[0]._id){
  //         return result[0]._id.toString()
  //     } else {
  //         return null
  //     }

  // }

  // async updateComment (id: string, updateComment: CommentPutType): Promise<boolean> {
  //     if (Types.ObjectId.isValid(id)) {
  //         const result = await this.CommentModel.updateOne({_id: new Types.ObjectId(id)}, { $set: updateComment})

  //         if (result.matchedCount) {
  //             return true
  //         }

  //     }

  //     return false
  // }

  // async myLikeStatus(
  //   commentId: string,
  //   userId: string,
  // ): Promise<string | null> {
  //   if (Types.ObjectId.isValid(commentId)) {
  //     const comment = await this.CommentModel.findOne({
  //       _id: new Types.ObjectId(commentId),
  //     }).lean();

  //     if (!comment) return null;

  //     let myStatus = 'null';

  //     if (comment.likesInfo.likes.includes(userId)) {
  //       myStatus = 'Like';
  //     } else if (comment.likesInfo.dislikes.includes(userId)) {
  //       myStatus = 'Dislike';
  //     } else {
  //       myStatus = 'None';
  //     }

  //     return myStatus;
  //   }

  //   return null;
  // }

  async setLikeStatus(
    commentId: string,
    userId: string,
    oldStatus: string,
    newStatus: string,
  ): Promise<boolean> {
    const filter = (status: string, userId: string) => {
      if (status === 'Like') {
        return { 'likesInfo.likes': userId };
      } else if (status === 'Dislike') {
        return { 'likesInfo.dislikes': userId };
      } else {
        return {};
      }
    };

    const oldStatusFilter = filter(oldStatus, userId);
    const newStatusFilter = filter(newStatus, userId);

    if (Types.ObjectId.isValid(commentId)) {
      const resultPull = await this.CommentModel.updateOne(
        { _id: commentId },
        { $pull: oldStatusFilter },
      );
      const resultPush = await this.CommentModel.updateOne(
        { _id: commentId },
        { $push: newStatusFilter },
      );

      if (!resultPush) return false;

      return true;
    }

    return false;
  }

  async deleteComment(id: string): Promise<boolean> {
    if (Types.ObjectId.isValid(id)) {
      const result = await this.CommentModel.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (result.deletedCount) {
        return true;
      }
    }

    return false;
  }
}
