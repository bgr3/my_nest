import { IsEnum } from "class-validator";

enum likeStatus {'Like', 'Dislike', 'None'}

export type LikeStatusType = 'Like' | 'Dislike' | 'None'


export class LikeStatus {
  @IsEnum(likeStatus)
  likeStatus: LikeStatusType;
}

export class Filter {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
}