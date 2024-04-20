import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryFilter } from '../../../../infrastructure/dto/input/input-dto';
import {
  LikesInfoOutput,
  Paginator,
} from '../../../../infrastructure/dto/output/output-dto';
import { PostOutput } from '../../api/dto/output/post-output-type';
import { PostLikesInfoORM } from '../../domain/posts-likesinfo-orm-entity';
import { PostORM } from '../../domain/posts-orm-entity';

export class PostsORMQueryRepository {
  constructor(
    @InjectRepository(PostORM)
    private readonly postsRepository: Repository<PostORM>,
  ) {}

  async findPosts(
    blogId: string | null,
    filter: QueryFilter,
    userId: string = '',
  ): Promise<Paginator<PostOutput>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const sortBy =
      filter.sortBy == 'blogName' ? 'b.name' : `p.${filter.sortBy}`;

    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';

    let dbResult;
    try {
      dbResult = await this.postsRepository
        .createQueryBuilder('p')
        .select()
        .leftJoinAndSelect('p.likesInfo', 'l')
        .leftJoinAndSelect('p.blog', 'b')
        .where(blogId ? 'p.blogId = :blogId' : '', {
          blogId: blogId,
        })
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
      items: dbResult[0].map((p: PostORM) => postMapper(p, userId)),
    };

    return paginator;
  }

  async findPostByID(
    id: string,
    userId: string = '',
  ): Promise<PostOutput | null> {
    let post;

    try {
      post = await this.postsRepository
        .createQueryBuilder('p')
        .select()
        .leftJoinAndSelect('p.likesInfo', 'l')
        .leftJoinAndSelect('p.blog', 'b')
        .where('p.id = :id', {
          id: id,
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!post) return null;

    return postMapper(post, userId);
  }
}

const postMapper = (post: PostORM, userId: string): PostOutput => {
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
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blog.name,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus ? myStatus.likeStatus : 'None',
      newestLikes: lastLikes.slice(0, 3).map((i) => likesMapper(i)),
    },
  };
};

const likesMapper = (like: PostLikesInfoORM): LikesInfoOutput => {
  return {
    userId: like.userId,
    login: like.login,
    addedAt: like.addedAt,
  };
};
