import { LikeStatusType } from '../../../infrastructure/dto/input/input-dto';
import { LikesInfo } from '../../../infrastructure/dto/output/output-dto';

import { PostRawDb } from '../infrastructure/dto/post-repository-dto';

export class PostLikesInfoSQL {
  userId: string;

  login: string;

  addedAt: string;

  likeStatus: LikeStatusType;
}

export class PostSQL {
  id: string = '';

  title: string;

  shortDescription: string;

  content: string;

  blogId: string;

  blogName: string;

  createdAt: string;

  likesInfo: PostLikesInfoSQL[] = [];

  newPost: boolean = false;

  updatePost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
  }

  setLikeStatus(userId: string, login: string, likeStatus: LikeStatusType) {
    const like = this.likesInfo.find((i) => i.userId === userId);

    if (like) {
      like.likeStatus = likeStatus;
    } else {
      const likesInfo = new PostLikesInfoSQL();
      likesInfo.addedAt = new Date().toISOString();
      likesInfo.likeStatus = likeStatus;
      likesInfo.login = login;
      likesInfo.userId = userId;
      this.likesInfo.push(likesInfo);
    }
  }

  static createSmartPost(postDb: PostRawDb): PostSQL {
    const post = new this();

    post.id = postDb.Id.toString();
    post.title = postDb.Title;
    post.shortDescription = postDb.ShortDescription;
    post.content = postDb.Content;
    post.blogId = postDb.BlogId;
    post.blogName = postDb.BlogName;
    post.createdAt = postDb.CreatedAt;
    postDb.LikesInfo.map((i) => {
      const likesInfoItem = {
        userId: i.UserId,

        login: i.Login,

        addedAt: i.AddedAt,

        likeStatus: i.LikeStatus,
      };
      post.likesInfo.push(likesInfoItem);
    });

    return post;
  }

  static createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): PostSQL {
    const post = new this();

    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    post.blogName = blogName;
    post.createdAt = new Date().toISOString();
    post.newPost = true;

    return post;
  }
}
