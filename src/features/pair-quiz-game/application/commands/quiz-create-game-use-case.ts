import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UsersORMRepository } from '../../../users/infrastructure/orm/users-orm-repository';
import { GameORM } from '../../domain/game-orm-entity';
import { GameORMRepository } from '../../infrastructure/game-orm-repository';
import { QuestionORMRepository } from '../../infrastructure/question-orm-repository';

export class QuizCreateGameCommand {
  constructor(public userId: string) {}
}

@CommandHandler(QuizCreateGameCommand)
export class QuizCreateGameUseCase
  implements ICommandHandler<QuizCreateGameCommand>
{
  constructor(
    private readonly gameRepository: GameORMRepository,
    private readonly userRepository: UsersORMRepository,
    private readonly questionsRepository: QuestionORMRepository,
  ) {}

  async execute(command: QuizCreateGameCommand): Promise<string | null> {
    const user = await this.userRepository.findUserDbByID(command.userId);

    if (!user) return null;

    let game: GameORM;

    const pendingGame = await this.gameRepository.getPendingGame();

    if (pendingGame) {
      game = pendingGame;
      pendingGame.addSecondPlayer(user);

      const randomQuestions =
        await this.questionsRepository.getFivePublishedRandomQuestions();

      pendingGame.addQuestions(randomQuestions);
    } else {
      game = GameORM.createGame(user);
    }

    const result = await this.gameRepository.save(game);

    return result;
  }
}
