import { IsBoolean, Length } from 'class-validator';

export class QuizPostQuestionDTO {
  @Length(10, 500)
  body: string;

  correctAnswers: string[];
}

export class QuizPublishDTO {
  @IsBoolean()
  published: boolean;
}
