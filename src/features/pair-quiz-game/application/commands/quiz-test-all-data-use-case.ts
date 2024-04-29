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
    private readonly gameRepository: GameORMRepository,
    private readonly questionRepository: QuestionORMRepository,
  ) {}

  async execute(): Promise<void> {
    await this.gameRepository.testAllData();
    await this.questionRepository.testAllData();
    return;
  }
}
