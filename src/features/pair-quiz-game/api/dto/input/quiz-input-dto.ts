import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { QueryFilter } from '../../../../../infrastructure/dto/input/input-dto';

export class QuizPostQuestionDTO {
  @Length(10, 500)
  body: string;

  correctAnswers: string[];
}

export class QuizPublishDTO {
  @IsBoolean()
  published: boolean;
}

export class QuizAnswerDTO {
  @IsString()
  answer: string;
}

export class QuizQuestionsQueryFilter extends QueryFilter {
  @IsOptional()
  @IsString()
  bodySearchTerm: string = '';

  @IsOptional()
  @IsString()
  publishedStatus: PublishedStatuses = 'all';
}

export class QuizGamesQueryFilter extends QueryFilter {
  @IsOptional()
  @IsString()
  sortBy: string = 'pairCreatedDate';
}

export type PublishedStatuses = 'all' | 'published' | 'notPublished';

export class QuizParamUUIDDTO {
  @IsUUID()
  id: string;
}

export class QuizTopGamesQueryFilter {
  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  pageNumber: number = 1;

  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  pageSize: number = 10;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDirection = 'desc';

  @IsOptional()
  @Transform((value: TransformFnParams) => {
    if (typeof value.value === typeof String()) {
      return [value.value];
    }

    return value.value;
  })
  sort: string[] = ['avgScores desc', 'sumScore desc'];
}
