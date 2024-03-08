import { LikeStatusType } from '../../../../infrastructure/dto/input/input-dto';
import { LikesInfo } from '../../api/dto/output/post-output-type';

export class PostRawDb {
  constructor(
    public Id: string,
    public Title: string,
    public ShortDescription: string,
    public Content: string,
    public BlogId: string,
    public BlogName: string,
    public CreatedAt: string,
  ) {}

  likesInfo: LikesInfo[];
}

export class PostLikesInfoRawDb {
  constructor(
    public PostId: string,
    public UserId: string,
    public Login: string,
    public AddedAt: string,
    public LikeStatus: LikeStatusType,
  ) {}
}
