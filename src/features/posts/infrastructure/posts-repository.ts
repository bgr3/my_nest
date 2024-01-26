import { Injectable } from '@nestjs/common';
import { Post, PostDocument, PostModelType } from '../domain/posts-entity';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async testAllData(): Promise<void> {
    const result = await this.PostModel.deleteMany({});
    //console.log('post delete: ', result.deletedCount)
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      const post = await this.PostModel.findOne({
        _id: new Types.ObjectId(id),
      });
      return post;
    }

    return null;
  }

  // async createPost (newPost: PostType): Promise<string | null> {
  //     const result = await this.PostModel.insertMany([newPost]);
  //     //console.log(result.insertedId)

  //     if (result[0]._id){
  //         return result[0]._id.toString()
  //     } else {
  //         return null
  //     }

  // }

  // async updatePost (id: string, updatePost: PostPutServiceType): Promise<boolean> {
  //     if (ObjectId.isValid(id)) {
  //         const result = await PostModel.updateOne({_id: new ObjectId(id)}, { $set: updatePost})

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
  //     const post = await this.PostModel.findOne({
  //       _id: new Types.ObjectId(commentId),
  //     });
  //     if (!post) return null;

  //     for (const elem of post.likesInfo) {
  //       if (elem.userId === userId) {
  //         return elem.likeStatus;
  //       }
  //     }
  //   }

  //   return null;
  // }

  // async setLikeStatus(
  //   commentId: string,
  //   userId: string,
  //   login: string,
  //   likeStatus: string,
  // ): Promise<boolean> {
  //   if (Types.ObjectId.isValid(commentId)) {
  //     const post = await this.PostModel.findOne({
  //       _id: new Types.ObjectId(commentId),
  //     });

  //     if (!post) return false;

  //     const oldLikeStatus = post.likesInfo.find((i) => i.userId === userId);

  //     const filter = (likeStatus: string) => {
  //       return {
  //         likesInfo: {
  //           userId: userId,
  //           login: login,
  //           addedAt: oldLikeStatus
  //             ? oldLikeStatus.addedAt
  //             : new Date().toISOString(),
  //           likeStatus: likeStatus,
  //         },
  //       };
  //     };

  //     const resultPull = await this.PostModel.updateOne(
  //       { _id: commentId },
  //       { $pull: filter(oldLikeStatus?.likeStatus || 'None') },
  //     );
  //     const resultPush = await this.PostModel.updateOne(
  //       { _id: commentId },
  //       { $push: filter(likeStatus) },
  //     );

  //     if (!resultPush) return false;

  //     return true;
  //   }

  //   return false;
  // }

  async deletePost(id: string): Promise<boolean> {
    if (Types.ObjectId.isValid(id)) {
      const result = await this.PostModel.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (result.deletedCount) {
        return true;
      }
    }

    return false;
  }
}
