import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { GameORMRepository } from '../../infrastructure/game-orm-repository';
import { QuestionORMRepository } from '../../infrastructure/question-orm-repository';

export class QuizTestAllDataCommand {
  constructor() {}
}

@CommandHandler(QuizTestAllDataCommand)
export class QuizTestAllDataUseCase
  implements ICommandHandler<QuizTestAllDataCommand>
{
  constructor(
    private readonly questionRepository: QuestionORMRepository,
    private readonly gameRepository: GameORMRepository,
  ) {}

  async execute(): Promise<void> {
    await this.questionRepository.testAllData();
    await this.gameRepository.testAllData();
    return;
  }
}
