import { LikeStatusType } from '../input/input-dto';

export class Paginator<T> {
  public pagesCount: number;
  public page: number;
  public pageSize: number;
  public totalCount: number;
  public items: T[];
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
