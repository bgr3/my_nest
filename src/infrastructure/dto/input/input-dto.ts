import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

enum likeStatus {
  'Like',
  'Dislike',
  'None',
}

export type LikeStatusType = 'Like' | 'Dislike' | 'None';

export class LikeStatus {
  @IsEnum(likeStatus)
  likeStatus: LikeStatusType;
}

export class QueryFilter {
  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  pageNumber: number = 1;

  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDirection = 'desc';
}
