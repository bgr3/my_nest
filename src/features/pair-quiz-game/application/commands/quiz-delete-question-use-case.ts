import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuestionORMRepository } from '../../infrastructure/question-orm-repository';

export class QuizDeleteQuestionCommand {
  constructor(public id: string) {}
}

@CommandHandler(QuizDeleteQuestionCommand)
export class QuizDeleteQuestionUseCase
  implements ICommandHandler<QuizDeleteQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionORMRepository) {}

  async execute(command: QuizDeleteQuestionCommand): Promise<boolean> {
    return this.questionRepository.deleteQuestion(command.id);
  }
}
