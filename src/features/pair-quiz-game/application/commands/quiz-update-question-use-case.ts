import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuizPostQuestionDTO } from '../../api/dto/input/quiz-input-dto';
import { QuestionORMRepository } from '../../infrastructure/question-orm-repository';

export class QuizUpdateQuestionCommand {
  constructor(
    public id: string,
    public dto: QuizPostQuestionDTO,
  ) {}
}

@CommandHandler(QuizUpdateQuestionCommand)
export class QuizUpdateQuestionUseCase
  implements ICommandHandler<QuizUpdateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionORMRepository) {}

  async execute(command: QuizUpdateQuestionCommand): Promise<boolean> {
    const question = await this.questionRepository.getQuestionById(command.id);

    if (!question) return false;

    question.updateQuestion(command.dto.body, command.dto.correctAnswers);
    await this.questionRepository.save(question);

    return true;
  }
}
