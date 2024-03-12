import { LikesInfo } from '../../../infrastructure/dto/output/output-dto';
import {
  CommentsLikesInfoRawDb,
  CommentsRawDb,
} from '../infrastructure/dto/comments-repository-dto';

class CommentatorInfo {
  userId: string;

  userLogin: string;
}

export class CommentLikesInfoSQL {
  userId: string;

  login: string;

  addedAt: string;

  likeStatus: string;

  static likesInfoMapper(likesInfoDb: CommentsLikesInfoRawDb): LikesInfo {
    return {
      userId: likesInfoDb.UserId,
      login: likesInfoDb.Login,
      addedAt: likesInfoDb.AddedAt,
      likeStatus: likesInfoDb.LikeStatus,
    };
  }
}

export class CommentForPostSQL {
  id: string = '';

  content: string;

  commentatorInfo: CommentatorInfo;

  createdAt: string;

  likesInfo: CommentLikesInfoSQL[] = [];

  postId: string;

  newComment: boolean = false;

  updateComment(content: string) {
    this.content = content;
  }

  setLikeStatus(userId: string, login: string, likeStatus: string) {
    const like = this.likesInfo.find((i) => i.userId === userId);

    if (like) {
      like.likeStatus = likeStatus;
    } else {
      const likesInfo = new CommentLikesInfoSQL();
      likesInfo.addedAt = new Date().toISOString();
      likesInfo.likeStatus = likeStatus;
      likesInfo.login = login;
      likesInfo.userId = userId;
      this.likesInfo.push(likesInfo);
    }
  }

  static createSmartComment(commentDb: CommentsRawDb): CommentForPostSQL {
    const comment = new this();

    comment.id = commentDb.Id.toString();
    comment.content = commentDb.Content;
    comment.commentatorInfo = new CommentatorInfo();
    comment.commentatorInfo.userId = commentDb.UserId;
    comment.commentatorInfo.userLogin = commentDb.UserLogin;
    comment.createdAt = commentDb.CreatedAt;

    return comment;
  }

  static createComment(
    content: string,
    postId: string,
    userId: string,
    userLogin: string,
  ) {
    const comment = new this();

    comment.content = content;
    comment.commentatorInfo = new CommentatorInfo();
    comment.commentatorInfo.userId = userId;
    comment.commentatorInfo.userLogin = userLogin;
    comment.createdAt = new Date().toISOString();
    comment.postId = postId;
    comment.newComment = true;

    return comment;
  }
}
