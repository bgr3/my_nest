import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuizPublishDTO } from '../../api/dto/input/quiz-input-dto';
import { QuestionORMRepository } from '../../infrastructure/question-orm-repository';

export class QuizPublishUnpublishQuestionCommand {
  constructor(
    public id: string,
    public dto: QuizPublishDTO,
  ) {}
}

@CommandHandler(QuizPublishUnpublishQuestionCommand)
export class QuizPublishUnpublishQuestionUseCase
  implements ICommandHandler<QuizPublishUnpublishQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionORMRepository) {}

  async execute(
    command: QuizPublishUnpublishQuestionCommand,
  ): Promise<boolean> {
    const question = await this.questionRepository.getQuestionById(command.id);

    if (!question) return false;

    question.publishUnpublishQuestion(command.dto.published);
    await this.questionRepository.save(question);

    return true;
  }
}
