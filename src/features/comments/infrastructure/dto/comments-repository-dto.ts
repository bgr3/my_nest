import { LikeStatusType } from '../../../../infrastructure/dto/input/input-dto';
import { LikesInfo } from '../../../../infrastructure/dto/output/output-dto';

export class CommentsRawDb {
  constructor(
    public Id: string,
    public Content: string,
    public UserId: string,
    public UserLogin: string,
    public PostId: string,
    public CreatedAt: string,
  ) {}

  likesInfo: LikesInfo[];
}

export class CommentsLikesInfoRawDb {
  constructor(
    public PostId: string,
    public UserId: string,
    public Login: string,
    public AddedAt: string,
    public LikeStatus: LikeStatusType,
  ) {}
}
