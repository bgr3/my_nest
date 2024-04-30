import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type CommentDocument = HydratedDocument<CommentForPost>;

export type CommentModelType = Model<CommentDocument> & typeof statics;

@Schema()
class CommentatorInfo {
  @Prop()
  userId: string;

  @Prop()
  userLogin: string;
}

const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema()
class LikesInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  likeStatus: string;
}

const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema()
export class CommentForPost {
  @Prop({ required: true })
  content: string;

  @Prop({ type: CommentatorInfoSchema, ref: 'CommentatorInfo' })
  commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ default: [], type: [{ type: LikesInfoSchema, ref: 'LikesInfo' }] })
  likesInfo: [LikesInfo];

  @Prop({ required: true })
  postId: string;

  updateComment(content: string): void {
    this.content = content;
  }

  setLikeStatus(userId: string, login: string, likeStatus: string): void {
    const like = this.likesInfo.find((i) => i.userId === userId);

    if (like) {
      like.likeStatus = likeStatus;
    } else {
      const likesInfo = new LikesInfo();
      likesInfo.addedAt = new Date().toISOString();
      likesInfo.likeStatus = likeStatus;
      likesInfo.login = login;
      likesInfo.userId = userId;
      this.likesInfo.push(likesInfo);
    }
  }

  static createComment(
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
  ): CommentForPost {
    const comment = new this();

    comment.content = content;
    comment.commentatorInfo = new CommentatorInfo();
    comment.commentatorInfo.userId = userId;
    comment.commentatorInfo.userLogin = userLogin;
    comment.createdAt = new Date().toISOString();
    comment.postId = postId;

    return comment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(CommentForPost);

CommentSchema.methods = {
  updateComment: CommentForPost.prototype.updateComment,
  setLikeStatus: CommentForPost.prototype.setLikeStatus,
};

const statics = {
  createComment: CommentForPost.createComment,
};

CommentSchema.statics = statics;
