import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuizPostQuestionDTO } from '../../api/dto/input/quiz-input-dto';
import { QuestionORM } from '../../domain/posts-orm-entity';
import { QuestionORMRepository } from '../../infrastructure/question-orm-repository';

export class QuizCreateQuestionCommand {
  constructor(public dto: QuizPostQuestionDTO) {}
}

@CommandHandler(QuizCreateQuestionCommand)
export class QuizCreateQuestionUseCase
  implements ICommandHandler<QuizCreateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionORMRepository) {}

  async execute(command: QuizCreateQuestionCommand): Promise<string | null> {
    const newQusestion = QuestionORM.createQuestion(
      command.dto.body,
      command.dto.correctAnswers,
    );

    const result = await this.questionRepository.save(newQusestion);

    return result;
  }
}
