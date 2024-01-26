import { Injectable } from '@nestjs/common';
import { Post, PostDocument, PostModelType } from '../domain/posts-entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikesInfo,
  PostFilterType,
  PostPaginatorType,
} from '../api/dto/middle/post-middle-dto';
import {
  LikesInfoOutput,
  PostOutput,
} from '../api/dto/output/post-output-type';
import { Types } from 'mongoose';

export const postFilter = {
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findPosts(
    blogId: string | null = null,
    filter: PostFilterType = postFilter,
    userId: string = '',
  ): Promise<PostPaginatorType> {
    const find: any = {};

    if (blogId) {
      find.blogId = blogId;
    }

    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const dbCount = await this.PostModel.countDocuments(find);
    const dbResult = await this.PostModel.find(find)
      .sort({ [filter.sortBy]: filter.sortDirection == 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(filter.pageSize);

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult.map((p: PostDocument) => postMapper(p, userId)),
    };

    return paginator;
  }

  async findPostByID(
    id: string,
    userId: string = '',
  ): Promise<PostOutput | null> {
    if (Types.ObjectId.isValid(id)) {
      const post = await this.PostModel.findOne({
        _id: new Types.ObjectId(id),
      });

      if (post) {
        return postMapper(post, userId);
      }

      return post;
    }

    return null;
  }
}

const postMapper = (post: PostDocument, userId: string): PostOutput => {
  const myStatus = post.likesInfo.find((i) => i.userId === userId);
  const lastLikes = post.likesInfo
    .filter((i) => i.likeStatus === 'Like')
    .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
  const likesCount = post.likesInfo.filter(
    (i) => i.likeStatus === 'Like',
  ).length;
  const dislikesCount = post.likesInfo.filter(
    (i) => i.likeStatus === 'Dislike',
  ).length;

  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus ? myStatus.likeStatus : 'None',
      newestLikes: lastLikes.slice(0, 3).map((i) => likesMapper(i)),
    },
  };
};

const likesMapper = (like: LikesInfo): LikesInfoOutput => {
  return {
    userId: like.userId,
    login: like.login,
    addedAt: like.addedAt,
  };
};
