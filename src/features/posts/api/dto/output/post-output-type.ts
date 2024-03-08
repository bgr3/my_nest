import { LikeStatusType } from '../../../../../infrastructure/dto/input/input-dto';

export class PostOutput {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string | null,
    public createdAt: string,
    public extendedLikesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
      newestLikes: LikesInfoOutput[];
    },
  ) {}
}

export class LikesInfoOutput {
  constructor(
    public userId: string,
    public login: string,
    public addedAt: string,
  ) {}
}

export class LikesInfo {
  constructor(
    public userId: string,
    public login: string,
    public addedAt: string,
    public likeStatus: LikeStatusType,
  ) {}
}
