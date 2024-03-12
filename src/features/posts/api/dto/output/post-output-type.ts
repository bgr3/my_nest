import { LikesInfoOutput } from '../../../../../infrastructure/dto/output/output-dto';

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
