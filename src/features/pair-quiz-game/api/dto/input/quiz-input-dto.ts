import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

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

export type PublishedStatuses = 'all' | 'published' | 'notPublished';
